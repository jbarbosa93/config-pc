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
 *
 * Strategy (in order):
 *  1. Fetch search page HTML and parse __NEXT_DATA__ (Next.js SSR JSON blob)
 *  2. Regex-scan the HTML for product IDs / URLs (fallback if SSR data absent)
 *
 * NOTE: The search page is blocked on residential/dev IPs (403). GitHub Actions
 * runners (Azure IPs) receive a 200 with the page HTML.
 */
export async function searchDigitecProductId(query: string): Promise<number | null> {
  const searchUrl = `${DIGITEC_BASE}/fr/search?q=${encodeURIComponent(query)}`;

  let html: string;
  let httpStatus: number;
  try {
    const res = await fetch(searchUrl, { headers: BROWSER_HEADERS, redirect: 'follow' });
    httpStatus = res.status;
    if (!res.ok) {
      console.warn(`[digitec] Search HTTP ${res.status} for query: ${query}`);
      return null;
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[digitec] Search fetch failed for "${query}":`, err);
    return null;
  }

  // ── Strategy 1: parse __NEXT_DATA__ (Next.js SSR JSON blob) ────────────────
  // Digitec embeds the full SSR props in a <script id="__NEXT_DATA__"> tag.
  // Product listings are in props.pageProps.searchResult.products[].productId
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1]);
      // Walk the nested structure — exact path may change with Digitec's deploy
      const products =
        nextData?.props?.pageProps?.searchResult?.products ??
        nextData?.props?.pageProps?.initialData?.searchResult?.products ??
        nextData?.props?.pageProps?.data?.products ??
        [];
      if (Array.isArray(products) && products.length > 0) {
        const id = products[0]?.productId ?? products[0]?.id;
        if (id) return parseInt(String(id).replace(/\D/g, ''), 10);
      }
    } catch {
      // JSON parse failed — fall through to regex strategy
    }
  }

  // ── Strategy 2: regex scan for product IDs in inline scripts ───────────────
  // Digitec may embed product IDs as "productId":XXXXXXXX in script tags
  const productIdMatches = html.matchAll(/"productId"\s*:\s*(\d{6,})/g);
  for (const m of productIdMatches) {
    const id = parseInt(m[1], 10);
    if (id > 0) return id;
  }

  // ── Strategy 3: scan for product URLs ──────────────────────────────────────
  const urlMatches = html.matchAll(/\/fr\/s\d\/product\/[a-z0-9-]+-(\d{6,})/gi);
  for (const m of urlMatches) {
    const id = parseInt(m[1], 10);
    if (id > 0) return id;
  }

  console.warn(`[digitec] No product data found in HTML for query: ${query} (HTTP ${httpStatus})`);
  return null;
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
