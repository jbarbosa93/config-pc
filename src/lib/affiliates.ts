/* ── Encode helper ── */

function enc(name: string): string {
  return encodeURIComponent(name).replace(/%20/g, "+");
}

/* ── Store configs by market ── */

interface StoreConfig {
  id: string;
  label: string;
  buildSearchUrl: (query: string) => string;
}

const STORES_CH: StoreConfig[] = [
  { id: "digitec",      label: "Digitec",        buildSearchUrl: (q) => `https://www.digitec.ch/fr/s1/search?q=${enc(q)}` },
  { id: "galaxus",      label: "Galaxus",         buildSearchUrl: (q) => `https://www.galaxus.ch/fr/s1/search?q=${enc(q)}` },
  { id: "interdiscount",label: "Interdiscount",   buildSearchUrl: (q) => `https://www.interdiscount.ch/fr/search?q=${enc(q)}` },
  { id: "brack",        label: "Brack.ch",        buildSearchUrl: (q) => `https://www.brack.ch/search?q=${enc(q)}` },
];

const STORES_FR: StoreConfig[] = [
  { id: "ldlc",         label: "LDLC",            buildSearchUrl: (q) => `https://www.ldlc.com/recherche/${enc(q)}/` },
  { id: "amazon",       label: "Amazon.fr",        buildSearchUrl: (q) => `https://www.amazon.fr/s?k=${enc(q)}` },
  { id: "materiel",     label: "Materiel.net",     buildSearchUrl: (q) => `https://www.materiel.net/recherche/${enc(q)}/` },
  { id: "cdiscount",    label: "Cdiscount",        buildSearchUrl: (q) => `https://www.cdiscount.com/search/10/${enc(q)}.html` },
];

// Legacy alias — CH by default
const STORES = STORES_CH;

/** Get stores for a specific market */
export function getStoresForMarket(market: "ch" | "fr"): { storeId: string; label: string }[] {
  const list = market === "fr" ? STORES_FR : STORES_CH;
  return list.map((s) => ({ storeId: s.id, label: s.label }));
}

/** Currency symbol for market */
export function getCurrencyForMarket(market: "ch" | "fr"): string {
  return market === "fr" ? "EUR" : "CHF";
}

export type StoreId = string;

export interface ProductLink {
  store: string;
  label: string;
  url: string;
  exactMatch?: boolean;
  productPrice?: number;
  inStock?: boolean;
}

export function getStoreLabel(storeId: string): string {
  return STORES.find((s) => s.id === storeId)?.label ?? storeId;
}

export function buildSearchUrl(storeId: string, productName: string, market: "ch" | "fr" = "ch"): string {
  const allStores = market === "fr" ? [...STORES_FR, ...STORES_CH] : [...STORES_CH, ...STORES_FR];
  const store = allStores.find((s) => s.id === storeId);
  if (!store) return `https://www.digitec.ch/fr/s1/search?q=${enc(productName)}`;
  return store.buildSearchUrl(productName);
}

export function buildToppreiseUrl(name: string): string {
  return `https://www.toppreise.ch/chercher?q=${enc(name)}`;
}

/** All store ids */
export function getAllStoreIds(): string[] {
  return STORES.map((s) => s.id);
}
