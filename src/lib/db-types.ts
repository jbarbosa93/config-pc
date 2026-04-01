export interface DBComponent {
  id: string;
  type: string;
  name: string;
  brand: string;
  specs: Record<string, string>;
  price_ch: number;
  price_fr: number;
  socket: string | null;
  chipset: string | null;
  form_factor: string | null;
  tdp: number | null;
  description: string;
  manufacturer_url: string;
  popularity_score: number;
  release_year: number | null;
  available_ch: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBComponentImage {
  id: string;
  component_id: string;
  url: string;
  is_primary: boolean;
  alt_text: string;
  order_index: number;
}

export interface DBComponentPrice {
  id: string;
  component_id: string;
  site: string;
  price: number;
  currency: string;
  url: string;
  in_stock: boolean;
  updated_at: string;
}

export interface DBCompatibilityRule {
  id: string;
  rule_type: string;
  component_type_a: string;
  field_a: string;
  component_type_b: string;
  field_b: string;
  must_match: boolean;
  description: string;
}

export type ComponentType = "CPU" | "GPU" | "RAM" | "Stockage" | "Carte mère" | "Alimentation" | "Boîtier" | "Refroidissement";

export const COMPONENT_TYPES: ComponentType[] = [
  "CPU", "GPU", "RAM", "Stockage", "Carte mère", "Alimentation", "Boîtier", "Refroidissement"
];
