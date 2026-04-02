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
 */
export async function searchGalaxusProductId(query: string): Promise<number | null> {
  const { load } = await import('cheerio');
  const searchUrl = `${GALAXUS_BASE}/fr/search?q=${encodeURIComponent(query)}`;

  let html: string;
  try {
    const res = await fetch(searchUrl, { headers: BROWSER_HEADERS, redirect: 'follow' });
    if (!res.ok) {
      console.warn(`[galaxus] Search HTTP ${res.status} for query: ${query}`);
      return null;
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[galaxus] Search fetch failed for "${query}":`, err);
    return null;
  }

  const $ = load(html);
  const productLinks: string[] = [];
  $('a[href*="/fr/s1/product/"], a[href*="/fr/s2/product/"]').each((_i, el) => {
    const href = $(el).attr('href');
    if (href) productLinks.push(href);
  });

  if (productLinks.length === 0) return null;

  return extractProductIdFromUrl(productLinks[0]);
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
