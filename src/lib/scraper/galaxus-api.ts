/**
 * Galaxus.ch price fetcher
 *
 * Galaxus and Digitec share the same backend and GraphQL schema.
 * This module mirrors digitec-api.ts but targets galaxus.ch, which often
 * shows prices from additional third-party merchants.
 */

import {
  extractProductIdFromUrl,
  fetchDigitecPriceById,
  type DigitecPrice,
} from './digitec-api';

const GALAXUS_BASE = 'https://www.galaxus.ch';

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

export interface GalaxusPrice extends DigitecPrice {
  galaxusUrl: string;
}

/**
 * Search Galaxus.ch for a product and return the first match's product ID.
 * Product IDs are shared between Digitec and Galaxus.
 * Uses the same __NEXT_DATA__ / regex approach as the Digitec scraper.
 */
export async function searchGalaxusProductId(query: string): Promise<number | null> {
  const searchUrl = `${GALAXUS_BASE}/fr/search?q=${encodeURIComponent(query)}`;

  let html: string;
  let httpStatus: number;
  try {
    const res = await fetch(searchUrl, { headers: BROWSER_HEADERS, redirect: 'follow' });
    httpStatus = res.status;
    if (!res.ok) {
      console.warn(`[galaxus] Search HTTP ${res.status} for query: ${query}`);
      return null;
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[galaxus] Search fetch failed for "${query}":`, err);
    return null;
  }

  // ── __NEXT_DATA__ ───────────────────────────────────────────────────────────
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1]);
      const products =
        nextData?.props?.pageProps?.searchResult?.products ??
        nextData?.props?.pageProps?.initialData?.searchResult?.products ??
        nextData?.props?.pageProps?.data?.products ??
        [];
      if (Array.isArray(products) && products.length > 0) {
        const id = products[0]?.productId ?? products[0]?.id;
        if (id) return parseInt(String(id).replace(/\D/g, ''), 10);
      }
    } catch { /* fall through */ }
  }

  // ── Regex fallback ──────────────────────────────────────────────────────────
  for (const m of html.matchAll(/"productId"\s*:\s*(\d{6,})/g)) {
    return parseInt(m[1], 10);
  }
  for (const m of html.matchAll(/\/fr\/s\d\/product\/[a-z0-9-]+-(\d{6,})/gi)) {
    return parseInt(m[1], 10);
  }

  console.warn(`[galaxus] No product data found for query: ${query} (HTTP ${httpStatus})`);
  return null;
}

/**
 * Full pipeline for Galaxus: search by name → get product ID → fetch price.
 * Internally reuses Digitec's `productDetailsLegacy` GraphQL endpoint because
 * the IDs and schema are identical across both platforms.
 */
export async function getGalaxusPrice(
  componentName: string,
  knownId?: number
): Promise<GalaxusPrice | null> {
  const productId = knownId ?? (await searchGalaxusProductId(componentName));
  if (!productId) return null;

  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));

  const result = await fetchDigitecPriceById(productId);
  if (!result) return null;

  return {
    ...result,
    galaxusUrl: `${GALAXUS_BASE}/fr/s1/product/${productId}`,
  };
}
