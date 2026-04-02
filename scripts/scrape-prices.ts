#!/usr/bin/env tsx
/**
 * scripts/scrape-prices.ts
 *
 * Nightly price updater — designed to run in GitHub Actions.
 *
 * What it does:
 *  1. Loads all active components from Supabase
 *  2. For each component, searches Digitec.ch for the best matching product
 *  3. Fetches the live CHF price via the Digitec GraphQL API
 *  4. Updates `price_ch` and `updated_at` in the components table
 *
 * Usage:
 *   npx tsx scripts/scrape-prices.ts [--dry-run] [--limit=50] [--type=GPU]
 *
 * Env vars required (same as .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { getDigitecPrice } from '../src/lib/scraper/digitec-api';

// ── Config ────────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = parseInt(args.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? '0', 10) || 500;
const TYPE_FILTER = args.find((a) => a.startsWith('--type='))?.split('=')[1];

// Delay between requests (ms) to avoid rate limiting
const INTER_REQUEST_DELAY = 1000;

// Max price delta before flagging as suspicious (e.g. 80% drop suggests wrong product)
const MAX_PRICE_DROP_RATIO = 0.2;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Component {
  id: string;
  name: string;
  brand: string;
  type: string;
  price_ch: number | null;
}

interface UpdateResult {
  id: string;
  name: string;
  oldPrice: number | null;
  newPrice: number | null;
  status: 'updated' | 'skipped' | 'error' | 'suspicious';
  reason?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a search query from component brand + name, trimmed for better results */
function buildSearchQuery(component: Component): string {
  const rawName = component.name
    .replace(/\([^)]+\)/g, '') // remove (2024), (DDR5), etc.
    .trim();

  // Avoid double brand: if name already starts with the brand, skip prepending it
  const brandLower = component.brand.toLowerCase();
  const nameLower = rawName.toLowerCase();
  const name = nameLower.startsWith(brandLower) ? rawName : `${component.brand} ${rawName}`;

  return name.trim().slice(0, 100);
}

/** Check if a price change looks suspicious (e.g. wrong product matched) */
function isSuspiciousPrice(oldPrice: number | null, newPrice: number): boolean {
  if (!oldPrice) return false;
  const ratio = newPrice / oldPrice;
  return ratio < MAX_PRICE_DROP_RATIO || ratio > 5; // >5× or <20% of original
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Digitec price scraper — ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`   Limit: ${LIMIT} | Type filter: ${TYPE_FILTER ?? 'all'}\n`);

  // 1. Load components
  let query = supabase
    .from('components')
    .select('id, name, brand, type, price_ch')
    .eq('active', true)
    .eq('available_ch', true)
    .order('popularity_score', { ascending: false })
    .limit(LIMIT);

  if (TYPE_FILTER) {
    query = query.eq('type', TYPE_FILTER);
  }

  const { data: components, error } = await query;
  if (error) {
    console.error('Failed to load components:', error);
    process.exit(1);
  }

  console.log(`Loaded ${components.length} components to process.\n`);

  const results: UpdateResult[] = [];
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // 2. Process each component
  for (let i = 0; i < components.length; i++) {
    const comp = components[i] as Component;
    const progress = `[${i + 1}/${components.length}]`;

    try {
      const searchQuery = buildSearchQuery(comp);
      process.stdout.write(`${progress} ${comp.name.slice(0, 50).padEnd(50)} ... `);

      const result = await getDigitecPrice(searchQuery);

      if (!result || result.priceCHF === null) {
        process.stdout.write('⚠️  no price found\n');
        results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice: null, status: 'skipped', reason: 'no match' });
        skippedCount++;
      } else {
        const newPrice = result.priceCHF;

        // Sanity check
        if (isSuspiciousPrice(comp.price_ch, newPrice)) {
          process.stdout.write(`🔴 suspicious (${comp.price_ch} → ${newPrice})\n`);
          results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice, status: 'suspicious', reason: 'price change too large' });
          skippedCount++;
        } else {
          const delta = comp.price_ch ? (newPrice - comp.price_ch).toFixed(0) : '(new)';
          const arrow = !comp.price_ch ? '' : newPrice < comp.price_ch ? '↓' : newPrice > comp.price_ch ? '↑' : '=';
          process.stdout.write(`✅ CHF ${newPrice} ${arrow} ${delta}\n`);

          if (!DRY_RUN) {
            const { error: updateErr } = await supabase
              .from('components')
              .update({ price_ch: newPrice, updated_at: new Date().toISOString() })
              .eq('id', comp.id);

            if (updateErr) {
              console.error(`   ❌ DB update failed:`, updateErr.message);
              errorCount++;
              results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice, status: 'error', reason: updateErr.message });
            } else {
              updatedCount++;
              results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice, status: 'updated' });
            }
          } else {
            updatedCount++;
            results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice, status: 'updated' });
          }
        }
      }
    } catch (err) {
      process.stdout.write(`❌ error\n`);
      console.error(`   ${err}`);
      errorCount++;
      results.push({ id: comp.id, name: comp.name, oldPrice: comp.price_ch, newPrice: null, status: 'error', reason: String(err) });
    }

    // Rate limiting
    if (i < components.length - 1) {
      await sleep(INTER_REQUEST_DELAY);
    }
  }

  // 3. Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✅ Updated : ${updatedCount}`);
  console.log(`⚠️  Skipped : ${skippedCount}`);
  console.log(`❌ Errors  : ${errorCount}`);
  console.log(`${'─'.repeat(60)}\n`);

  // Log suspicious prices for manual review
  const suspicious = results.filter((r) => r.status === 'suspicious');
  if (suspicious.length > 0) {
    console.log('⚠️  Suspicious prices (review manually):');
    for (const s of suspicious) {
      console.log(`   ${s.name}: CHF ${s.oldPrice} → CHF ${s.newPrice}`);
    }
    console.log();
  }

  if (errorCount > 0) process.exit(1);
}

main();
