-- Migration 005: Create orders table for Stripe payment persistence

CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email    TEXT,
  amount_total      INTEGER,        -- amount in smallest currency unit (e.g. centimes)
  currency          TEXT DEFAULT 'chf',
  status            TEXT NOT NULL DEFAULT 'completed',
  items             JSONB,          -- Stripe line_items snapshot
  metadata          JSONB           -- any extra data (assembly option, etc.)
);

-- Allow public read only via service role; clients cannot write directly
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
