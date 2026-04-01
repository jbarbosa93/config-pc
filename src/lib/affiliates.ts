import type { Market } from "./types";

/* ── Store configuration ── */

export type StoreId =
  | "ldlc" | "amazon" | "materielnet" | "cdiscount" | "topachat"
  | "galaxus" | "digitec" | "brack" | "interdiscount";

interface StoreConfig {
  id: StoreId;
  label: string;
  market: "fr" | "ch";
  buildSearchUrl: (query: string) => string;
  // Future: Tradedoubler/Awin affiliate params
  affiliateNetwork?: "tradedoubler" | "awin";
  affiliateId?: string;
}

const STORES: StoreConfig[] = [
  // ── France ──
  {
    id: "ldlc",
    label: "LDLC",
    market: "fr",
    buildSearchUrl: (q) => `https://www.ldlc.com/recherche/${q.replace(/\s+/g, "+")}/`,
    affiliateNetwork: "awin",
  },
  {
    id: "amazon",
    label: "Amazon.fr",
    market: "fr",
    buildSearchUrl: (q) => `https://www.amazon.fr/s?k=${q.replace(/\s+/g, "+")}`,
  },
  {
    id: "materielnet",
    label: "Matériel.net",
    market: "fr",
    buildSearchUrl: (q) => `https://www.materiel.net/recherche/${q.replace(/\s+/g, "+")}/`,
    affiliateNetwork: "awin",
  },
  {
    id: "cdiscount",
    label: "Cdiscount",
    market: "fr",
    buildSearchUrl: (q) => `https://www.cdiscount.com/search/10/${encodeURIComponent(q)}.html`,
    affiliateNetwork: "awin",
  },
  {
    id: "topachat",
    label: "TopAchat",
    market: "fr",
    buildSearchUrl: (q) => `https://www.topachat.com/pages/recherche.php?mot=${encodeURIComponent(q)}`,
  },
  // ── Suisse ──
  {
    id: "galaxus",
    label: "Galaxus",
    market: "ch",
    buildSearchUrl: (q) => `https://www.galaxus.ch/search?q=${q.replace(/\s+/g, "+")}`,
    affiliateNetwork: "tradedoubler",
  },
  {
    id: "digitec",
    label: "Digitec",
    market: "ch",
    buildSearchUrl: (q) => `https://www.digitec.ch/search?q=${q.replace(/\s+/g, "+")}`,
    affiliateNetwork: "tradedoubler",
  },
  {
    id: "brack",
    label: "Brack.ch",
    market: "ch",
    buildSearchUrl: (q) => `https://www.brack.ch/search?q=${q.replace(/\s+/g, "+")}`,
    affiliateNetwork: "tradedoubler",
  },
  {
    id: "interdiscount",
    label: "Interdiscount",
    market: "ch",
    buildSearchUrl: (q) => `https://www.interdiscount.ch/fr/search#q=${q.replace(/\s+/g, "+")}`,
    affiliateNetwork: "tradedoubler",
  },
];

/* ── Public API ── */

export interface ProductLink {
  store: StoreId;
  label: string;
  url: string;
  // Future: populated from feed
  exactMatch?: boolean;
  affiliateUrl?: string;
  productPrice?: number;
  inStock?: boolean;
}

/**
 * Search for a product across stores for the given market.
 * Currently returns search URLs. When Tradedoubler/Awin feeds
 * are integrated, this will return exact product links with
 * affiliate tracking and real prices.
 */
export function searchProduct(name: string, market: Market): ProductLink[] {
  const stores = STORES.filter((s) => {
    if (market === "france") return s.market === "fr";
    if (market === "suisse") return s.market === "ch";
    return true; // "both"
  });

  // TODO: When affiliate feeds are available, search the feed first
  // and only fall back to search URLs if no exact match is found.
  //
  // Example future flow:
  // 1. Search Tradedoubler/Awin product feed by EAN or product name
  // 2. If exact match found → return affiliate deep link + real price
  // 3. If no match → return search URL as fallback

  return stores.map((store) => ({
    store: store.id,
    label: store.label,
    url: store.buildSearchUrl(name),
    exactMatch: false,
  }));
}

/** Get store IDs for a market */
export function getStoreIds(market: Market): StoreId[] {
  return searchProduct("", market).map((p) => p.store);
}

/** Get label for a store */
export function getStoreLabel(storeId: StoreId): string {
  return STORES.find((s) => s.id === storeId)?.label ?? storeId;
}

/** Build a single search URL (backward-compatible helper) */
export function buildSearchUrl(storeId: string, productName: string): string {
  const store = STORES.find((s) => s.id === storeId);
  if (!store) return "#";
  return store.buildSearchUrl(productName);
}
