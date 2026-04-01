export type Usage = "gaming" | "streaming" | "montage" | "bureautique" | "polyvalent";
export type Resolution = "1080p" | "1440p" | "4K";
export type TechLevel = "debutant" | "intermediaire" | "expert";
export type Market = "france" | "suisse" | "both";

export interface ConfigRequest {
  usage: Usage;
  budget: number;
  resolution: Resolution;
  favoriteGames: string;
  techLevel: TechLevel;
  market: Market;
}

export type StockStatus = "in_stock" | "variable" | "check";

export interface ComponentSpecs {
  [key: string]: string;
}

export interface Component {
  type: string;
  name: string;
  reason: string;
  price_fr: number;
  price_ch: number;
  search_terms: string[];
  priority: "essentiel" | "recommande" | "optionnel";
  stock_status?: StockStatus;
  specs?: ComponentSpecs;
}

export interface PCConfig {
  config_name: string;
  total_estimated: number;
  components: Component[];
  compatibility_notes: string;
  upgrade_path: string;
  alternatives: Component[];
  market?: Market;
}

export type AlternativeTier = "budget" | "equilibre" | "performance" | "overkill";

export interface Alternative {
  tier: AlternativeTier;
  name: string;
  reason: string;
  price_fr: number;
  price_ch: number;
  search_terms: string[];
  compatible: boolean;
  compatibility_warning: string;
}

export interface AlternativesRequest {
  component_type: string;
  current_component: Component;
  all_components: Component[];
  usage: string;
  budget: number;
}

export interface AlternativesResponse {
  alternatives: Alternative[];
}
