/* ── Encode helper ── */

function enc(name: string): string {
  return encodeURIComponent(name).replace(/%20/g, "+");
}

/* ── Swiss stores only ── */

interface StoreConfig {
  id: string;
  label: string;
  buildSearchUrl: (query: string) => string;
}

const STORES: StoreConfig[] = [
  { id: "digitec",      label: "Digitec",       buildSearchUrl: (q) => `https://www.digitec.ch/fr/s1/search?q=${enc(q)}` },
  { id: "galaxus",      label: "Galaxus",        buildSearchUrl: (q) => `https://www.galaxus.ch/fr/s1/search?q=${enc(q)}` },
  { id: "interdiscount",label: "Interdiscount",  buildSearchUrl: (q) => `https://www.interdiscount.ch/fr/search?q=${enc(q)}` },
  { id: "brack",        label: "Brack.ch",       buildSearchUrl: (q) => `https://www.brack.ch/search?q=${enc(q)}` },
];

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

export function buildSearchUrl(storeId: string, productName: string): string {
  const store = STORES.find((s) => s.id === storeId);
  if (!store) return `https://www.digitec.ch/fr/s1/search?q=${enc(productName)}`;
  return store.buildSearchUrl(productName);
}

export function buildToppreiseUrl(name: string): string {
  return `https://www.toppreise.ch/search.php?q=${enc(name)}`;
}

/** Simulated CHF prices for display (sorted ascending) */
export function getSimulatedPrices(baseCHF: number): { storeId: string; label: string; price: number }[] {
  return STORES.map((store, i) => {
    const variance = ((baseCHF * (i + 7)) % 25) - 8;
    return { storeId: store.id, label: store.label, price: Math.round(baseCHF + variance) };
  }).sort((a, b) => a.price - b.price);
}

/** All store ids */
export function getAllStoreIds(): string[] {
  return STORES.map((s) => s.id);
}
