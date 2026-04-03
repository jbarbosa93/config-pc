-- Run this in Supabase SQL Editor to create the shared_configs table

CREATE TABLE IF NOT EXISTS shared_configs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  config_name TEXT NOT NULL,
  total_estimated NUMERIC,
  config_data JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookup
CREATE INDEX IF NOT EXISTS shared_configs_slug_idx ON shared_configs (slug);

-- Auto-delete configs older than 90 days (optional, via pg_cron or Supabase scheduled function)
-- ALTER TABLE shared_configs ENABLE ROW LEVEL SECURITY;
-- Configs are public read-only (no auth needed to view a shared config)
