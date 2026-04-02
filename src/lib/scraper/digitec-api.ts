/**
 * Digitec.ch price fetcher
 *
 * Two-stage approach:
 *  1. Search the Digitec search page to find a product ID (HTML via cheerio, no browser)
 *  2. Fetch the price via the internal GraphQL endpoint `productDetailsLegacy`
 *
 * Designed to run from GitHub Actions (Azure IPs). Local dev machines may get
 * 403 on the search page due to Akamai bot detection, but the GraphQL
 * endpoint is accessible from any IP with the right headers.
 */

const DIGITEC_BASE = 'https://www.digitec.ch';
const GRAPHQL_URL = `${DIGITEC_BASE}/api/graphql`;

const BROWSER_HEADERS: Record<string, string> = {
  'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
  'Accept-Language': 'fr-CH,fr;q=0.9,en;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'Cookie': 'language=fr; platform=web',
};

const API_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json, */*',
  'Accept-Language': 'fr-CH,fr;q=0.9',
  'Origin': DIGITEC_BASE,
  'Referer': `${DIGITEC_BASE}/fr`,
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'Cookie': 'language=fr; platform=web',
};

export interface DigitecPrice {
  productId: number;
  productName: string;
  url: string;
  /** Price in CHF including VAT (cheapest offer) */
  priceCHF: number | null;
}

/**
 * Extracts Digitec product ID from a Digitec URL.
 * URL pattern: /fr/s1/product/[slug]-[id]
 * The numeric suffix is the product ID.
 */
export function extractProductIdFromUrl(url: string): number | null {
  const match = url.match(/-(\d+)(?:[?#]|$)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Search Digitec.ch for a product by name and return the first match's product ID.
 * Parses the search page HTML using cheerio (no headless browser needed).
 * NOTE: May return 403 from residential/dev IPs — designed for GitHub Actions runners.
 */
export async function searchDigitecProductId(query: string): Promise<number | null> {
  const { load } = await import('cheerio');
  const searchUrl = `${DIGITEC_BASE}/fr/search?q=${encodeURIComponent(query)}`;

  let html: string;
  try {
    const res = await fetch(searchUrl, { headers: BROWSER_HEADERS, redirect: 'follow' });
    if (!res.ok) {
      console.warn(`[digitec] Search HTTP ${res.status} for query: ${query}`);
      return null;
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[digitec] Search fetch failed for "${query}":`, err);
    return null;
  }

  const $ = load(html);

  // Try to find a product link in the search results
  // Digitec product URLs end with -XXXXXXX (numeric ID)
  const productLinks: string[] = [];
  $('a[href*="/fr/s1/product/"]').each((_i, el) => {
    const href = $(el).attr('href');
    if (href) productLinks.push(href);
  });

  if (productLinks.length === 0) {
    console.warn(`[digitec] No product links found for query: ${query}`);
    return null;
  }

  // Take the first result and extract ID
  const firstLink = productLinks[0];
  const id = extractProductIdFromUrl(firstLink);
  if (!id) {
    console.warn(`[digitec] Could not extract ID from URL: ${firstLink}`);
    return null;
  }
  return id;
}

/**
 * Fetch price for a known Digitec product ID via the GraphQL API.
 * This endpoint works without bot detection headers.
 */
export async function fetchDigitecPriceById(productId: number): Promise<DigitecPrice | null> {
  const query = `{
    productDetailsLegacy(productId: ${productId}) {
      product { name id }
      offers {
        price { amountInclusive currency }
        hidePrice
        type
      }
    }
  }`;

  let json: Record<string, unknown>;
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({ query }),
    });
    json = await res.json() as Record<string, unknown>;
  } catch (err) {
    console.warn(`[digitec] GraphQL fetch failed for product ${productId}:`, err);
    return null;
  }

  const details = (json as any)?.data?.productDetailsLegacy;
  if (!details) {
    console.warn(`[digitec] No data for product ${productId}:`, JSON.stringify(json).slice(0, 200));
    return null;
  }

  const productName: string = details.product?.name ?? 'Unknown';
  const productSlug: string = (details.product?.id ?? '').replace('PROD_', '');
  const url = `${DIGITEC_BASE}/fr/s1/product/${productSlug}`;

  // Find cheapest non-hidden offer
  const offers: Array<{ price: { amountInclusive: number; currency: string }; hidePrice: boolean; type: string }> =
    details.offers ?? [];

  const validOffers = offers.filter((o) => !o.hidePrice && o.price?.amountInclusive != null);
  if (validOffers.length === 0) {
    return { productId, productName, url, priceCHF: null };
  }

  const cheapest = validOffers.reduce((a, b) =>
    a.price.amountInclusive < b.price.amountInclusive ? a : b
  );

  return {
    productId,
    productName,
    url,
    priceCHF: cheapest.price.amountInclusive,
  };
}

/**
 * Full pipeline: search by name → get product ID → fetch price.
 * @param componentName  e.g. "RTX 4060 Gaming X"
 * @param knownId        If you already know the Digitec product ID, pass it to skip search
 */
export async function getDigitecPrice(
  componentName: string,
  knownId?: number
): Promise<DigitecPrice | null> {
  const productId = knownId ?? (await searchDigitecProductId(componentName));
  if (!productId) return null;

  // Throttle: small delay to be a polite scraper
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));

  return fetchDigitecPriceById(productId);
}
