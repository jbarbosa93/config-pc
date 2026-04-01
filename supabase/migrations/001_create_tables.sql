-- ============================================
-- ConfigPC.ch — Product Database Schema
-- ============================================

-- 1. Components table
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('CPU', 'GPU', 'RAM', 'Stockage', 'Carte mère', 'Alimentation', 'Boîtier', 'Refroidissement')),
  name TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  specs JSONB DEFAULT '{}',
  price_ch INTEGER NOT NULL DEFAULT 0,
  price_fr INTEGER NOT NULL DEFAULT 0,
  socket TEXT,
  chipset TEXT,
  form_factor TEXT,
  tdp INTEGER,
  description TEXT DEFAULT '',
  manufacturer_url TEXT DEFAULT '',
  popularity_score INTEGER DEFAULT 0,
  release_year INTEGER,
  available_ch BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_brand ON components(brand);
CREATE INDEX idx_components_socket ON components(socket);
CREATE INDEX idx_components_active ON components(active);
CREATE INDEX idx_components_price_ch ON components(price_ch);

-- 2. Component images table
CREATE TABLE IF NOT EXISTS component_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  alt_text TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_images_component ON component_images(component_id);

-- 3. Component prices per store
CREATE TABLE IF NOT EXISTS component_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  site TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CHF',
  url TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_prices_component ON component_prices(component_id);
CREATE INDEX idx_prices_site ON component_prices(site);
CREATE UNIQUE INDEX idx_prices_component_site ON component_prices(component_id, site);

-- 4. Compatibility rules
CREATE TABLE IF NOT EXISTS compatibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL,
  component_type_a TEXT NOT NULL,
  field_a TEXT NOT NULL,
  component_type_b TEXT NOT NULL,
  field_b TEXT NOT NULL,
  must_match BOOLEAN DEFAULT true,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prices_updated_at
  BEFORE UPDATE ON component_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_rules ENABLE ROW LEVEL SECURITY;

-- Public read access (anonymous users can read active components)
CREATE POLICY "Public read active components"
  ON components FOR SELECT
  USING (active = true);

CREATE POLICY "Public read component images"
  ON component_images FOR SELECT
  USING (true);

CREATE POLICY "Public read component prices"
  ON component_prices FOR SELECT
  USING (true);

CREATE POLICY "Public read compatibility rules"
  ON compatibility_rules FOR SELECT
  USING (true);

-- Service role has full access (used by admin API routes)
-- No INSERT/UPDATE/DELETE policies for anon — admin uses service_role key

-- ============================================
-- Seed compatibility rules
-- ============================================
INSERT INTO compatibility_rules (rule_type, component_type_a, field_a, component_type_b, field_b, must_match, description) VALUES
  ('socket_match', 'CPU', 'socket', 'Carte mère', 'socket', true, 'Le socket CPU doit correspondre au socket de la carte mère'),
  ('socket_match', 'CPU', 'socket', 'Refroidissement', 'socket', true, 'Le ventirad doit supporter le socket du CPU'),
  ('tdp_check', 'CPU', 'tdp', 'Refroidissement', 'tdp', true, 'Le TDP du ventirad doit être >= TDP du CPU'),
  ('form_factor', 'Carte mère', 'form_factor', 'Boîtier', 'form_factor', true, 'Le format carte mère doit entrer dans le boîtier')
ON CONFLICT DO NOTHING;

-- ============================================
-- Storage bucket for images
-- ============================================
-- Run this in Supabase Dashboard > Storage > Create bucket:
-- Bucket name: component-images
-- Public: true
