import type { Market } from "./types";

/* ── Encode helper ── */

function enc(name: string): string {
  return encodeURIComponent(name).replace(/%20/g, "+");
}

/* ── Store configuration ── */

export type StoreId = string;

interface StoreConfig {
  id: string;
  label: string;
  market: "fr" | "ch";
  buildSearchUrl: (query: string) => string;
  affiliateNetwork?: "tradedoubler" | "awin";
}

const STORES: StoreConfig[] = [
  // ── Suisse — sites qui vendent des composants PC ──
  { id: "galaxus", label: "Galaxus", market: "ch", buildSearchUrl: (q) => `https://www.galaxus.ch/search?q=${enc(q)}`, affiliateNetwork: "tradedoubler" },
  { id: "digitec", label: "Digitec", market: "ch", buildSearchUrl: (q) => `https://www.digitec.ch/search?q=${enc(q)}`, affiliateNetwork: "tradedoubler" },
  { id: "brack", label: "Brack.ch", market: "ch", buildSearchUrl: (q) => `https://www.brack.ch/search?q=${enc(q)}`, affiliateNetwork: "tradedoubler" },
  { id: "interdiscount", label: "Interdiscount", market: "ch", buildSearchUrl: (q) => `https://www.interdiscount.ch/fr/search?q=${enc(q)}`, affiliateNetwork: "tradedoubler" },
  { id: "conrad", label: "Conrad", market: "ch", buildSearchUrl: (q) => `https://www.conrad.ch/fr/search?search=${enc(q)}` },
  { id: "mediamarkt", label: "MediaMarkt", market: "ch", buildSearchUrl: (q) => `https://www.mediamarkt.ch/fr/search.html?query=${enc(q)}` },
  { id: "ldlc-ch", label: "LDLC Suisse", market: "ch", buildSearchUrl: (q) => `https://www.ldlc.com/fr-ch/recherche/${q.replace(/\s+/g, "+")}/`, affiliateNetwork: "awin" },
  { id: "amazon-de", label: "Amazon.de", market: "ch", buildSearchUrl: (q) => `https://www.amazon.de/s?k=${enc(q)}` },
  // ── France ──
  { id: "ldlc", label: "LDLC", market: "fr", buildSearchUrl: (q) => `https://www.ldlc.com/recherche/${q.replace(/\s+/g, "+")}/`, affiliateNetwork: "awin" },
  { id: "amazon", label: "Amazon.fr", market: "fr", buildSearchUrl: (q) => `https://www.amazon.fr/s?k=${enc(q)}` },
  { id: "materielnet", label: "Matériel.net", market: "fr", buildSearchUrl: (q) => `https://www.materiel.net/recherche/${q.replace(/\s+/g, "+")}/`, affiliateNetwork: "awin" },
  { id: "cdiscount", label: "Cdiscount", market: "fr", buildSearchUrl: (q) => `https://www.cdiscount.com/search/10/${encodeURIComponent(q)}.html`, affiliateNetwork: "awin" },
  { id: "topachat", label: "TopAchat", market: "fr", buildSearchUrl: (q) => `https://www.topachat.com/pages/recherche.php?mot=${encodeURIComponent(q)}` },
];

/* ── Default visible stores per market (first 4) ── */

const CH_DEFAULT_IDS = ["galaxus", "digitec", "brack", "interdiscount"];
const FR_DEFAULT_IDS = ["ldlc", "amazon", "materielnet", "cdiscount"];

/* ── Public API ── */

export interface ProductLink {
  store: string;
  label: string;
  url: string;
  exactMatch?: boolean;
  affiliateUrl?: string;
  productPrice?: number;
  inStock?: boolean;
}

export function getStoresForMarket(market: Market): StoreConfig[] {
  if (market === "france") return STORES.filter((s) => s.market === "fr");
  if (market === "suisse") return STORES.filter((s) => s.market === "ch");
  return STORES;
}

export function getDefaultStoreIds(market: Market): string[] {
  if (market === "france") return FR_DEFAULT_IDS;
  return CH_DEFAULT_IDS;
}

export function getStoreLabel(storeId: string): string {
  return STORES.find((s) => s.id === storeId)?.label ?? storeId;
}

export function buildSearchUrl(storeId: string, productName: string): string {
  const store = STORES.find((s) => s.id === storeId);
  if (!store) return "#";
  return store.buildSearchUrl(productName);
}

export function buildToppreiseUrl(name: string): string {
  return `https://www.toppreise.ch/browse?q=${enc(name)}`;
}

export function buildIdealoUrl(name: string): string {
  return `https://www.idealo.fr/prix/${enc(name)}`;
}

/** Generate simulated prices for display (sorted ascending) */
export function getSimulatedPrices(baseCHF: number, market: Market): { storeId: string; label: string; price: number }[] {
  const stores = getStoresForMarket(market);
  return stores.map((store, i) => {
    const variance = ((baseCHF * (i + 7)) % 25) - 8;
    return { storeId: store.id, label: store.label, price: Math.round(baseCHF + variance) };
  }).sort((a, b) => a.price - b.price);
}
