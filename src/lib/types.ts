export type Usage = "gaming" | "streaming" | "montage" | "bureautique" | "polyvalent";
export type Resolution = "1080p" | "1440p" | "4K";
export type TechLevel = "debutant" | "intermediaire" | "expert";
export type Market = "france" | "suisse" | "both";
export type GamingProfile = "competitive" | "aaa" | "streaming_gaming" | "gaming_creation";
export type Frequency = "casual" | "regular" | "intensive";

export interface ExistingPeripherals {
  monitor: boolean;
  keyboard_mouse: boolean;
  headset: boolean;
}

export interface ConfigRequest {
  usage: Usage;
  budget: number;
  resolution: Resolution;
  favoriteGames: string;
  gamingProfile?: GamingProfile;
  frequency?: Frequency;
  existingPeripherals?: ExistingPeripherals;
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
  image_url?: string;
  manufacturer_url?: string;
  full_description?: string;
}

export interface PCConfig {
  config_name: string;
  total_estimated: number;
  components: Component[];
  compatibility_notes: string;
  upgrade_path: string;
  alternatives: Component[];
  /** Pre-computed DB alternatives keyed by component type — used to avoid loading spinner in AlternativesModal */
  preloadedAlternatives?: Record<string, Alternative[]>;
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
