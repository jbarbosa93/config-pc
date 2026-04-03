#!/usr/bin/env tsx
/**
 * auto-link-digitec.ts
 *
 * Auto-links components (Alimentation, Refroidissement, Boîtier) to their
 * Digitec product IDs by searching the Digitec website and verifying the
 * match via name similarity (Jaccard, word-level).
 *
 * NOTE: searchDigitecProductId() is blocked on residential/dev IPs (Akamai
 * bot detection returns 403). Run this script from GitHub Actions or an Azure
 * VM where the search page is accessible. If every search returns null you are
 * likely hitting the bot wall.
 *
 * Usage:
 *   npx tsx scripts/auto-link-digitec.ts [options]
 *
 * Options:
 *   --dry-run        Don't write anything to the database
 *   --limit=N        Process only the first N components
 *   --type=<cat>     Filter to one category (Alimentation | Refroidissement | Boîtier)
 *   --debug          Print similarity scores for every candidate
 */

import { createClient } from '@supabase/supabase-js';
import {
  searchDigitecProductId,
  fetchDigitecPriceById,
} from '../src/lib/scraper/digitec-api';

// ── Env ────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Constants ─────────────────────────────────────────────────────────────────

const SUPPORTED_TYPES = ['Alimentation', 'Refroidissement', 'Boîtier'] as const;
const SIMILARITY_THRESHOLD = 0.4;
const RATE_LIMIT_MS = 1500;

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const isDryRun = args.includes('--dry-run');
const isDebug = args.includes('--debug');

const limitArg = args.find((a) => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

const typeArg = args.find((a) => a.startsWith('--type='));
const filterType = typeArg ? typeArg.split('=')[1] : null;

if (filterType && !SUPPORTED_TYPES.includes(filterType as (typeof SUPPORTED_TYPES)[number])) {
  console.error(
    `Invalid --type value: "${filterType}". Must be one of: ${SUPPORTED_TYPES.join(', ')}`
  );
  process.exit(1);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Component {
  id: string;
  name: string;
  brand: string;
  type: string;
  specs: Record<string, unknown>;
}

interface UnmatchedEntry {
  component: Component;
  reason: string;
  digitecId?: number;
  digitecName?: string;
  similarity?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Tokenise a product name into a lowercase word set, stripping punctuation. */
function wordSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  );
}

/** Jaccard similarity between two word sets. */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = new Set([...a].filter((w) => b.has(w)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

/** Build the Digitec search query for a component. */
function buildQuery(component: Component): string {
  const { brand, name } = component;
  // De-duplicate: don't prepend brand if the name already starts with it
  const nameNorm = name.toLowerCase().trim();
  const brandNorm = brand.toLowerCase().trim();
  if (nameNorm.startsWith(brandNorm)) {
    return name.trim();
  }
  return `${brand.trim()} ${name.trim()}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== auto-link-digitec ===');
  if (isDryRun) console.log('[DRY RUN] No DB writes will be made.');
  if (filterType) console.log(`[FILTER] Type: ${filterType}`);
  if (limit) console.log(`[LIMIT] Processing max ${limit} components.`);
  console.log('');

  // ── 1. Fetch components without a digitec_id ────────────────────────────────

  const targetTypes = filterType ? [filterType] : SUPPORTED_TYPES;

  let query = supabase
    .from('components')
    .select('id, name, brand, type, specs')
    .eq('active', true)
    .in('type', targetTypes)
    .is('specs->digitec_id', null)
    .order('type')
    .order('name');

  if (limit) {
    query = query.limit(limit);
  }

  const { data: components, error } = await query;

  if (error) {
    console.error('Failed to fetch components:', error.message);
    process.exit(1);
  }

  if (!components || components.length === 0) {
    console.log('No components found that need linking. All done!');
    return;
  }

  const total = components.length;
  console.log(`Found ${total} component(s) to process.\n`);

  // ── 2. Process each component ───────────────────────────────────────────────

  let matchedCount = 0;
  let skippedCount = 0;
  const unmatched: UnmatchedEntry[] = [];
  let firstRequest = true;

  for (let i = 0; i < components.length; i++) {
    const comp = components[i] as Component;
    const label = `[${i + 1}/${total}] ${comp.brand} ${comp.name}`;

    // Rate limiting: skip for the very first request
    if (!firstRequest) {
      await sleep(RATE_LIMIT_MS);
    }
    firstRequest = false;

    // ── 2a. Build query and search ────────────────────────────────────────────

    const searchQuery = buildQuery(comp);
    process.stdout.write(`${label} ...`);

    const digitecId = await searchDigitecProductId(searchQuery);

    if (digitecId === null) {
      console.log(' ⚠️  no ID');
      console.warn(
        '  ↳ searchDigitecProductId returned null. If this keeps happening, ' +
          'the search page may be blocked by Akamai bot detection on this IP. ' +
          'Run from GitHub Actions or an Azure VM instead.'
      );
      unmatched.push({ component: comp, reason: 'no_id_from_search' });
      skippedCount++;
      continue;
    }

    console.log(` → ID ${digitecId}`);

    // ── 2b. Fetch Digitec product name to verify match ────────────────────────

    await sleep(400); // small gap between search and price fetch

    const digitecProduct = await fetchDigitecPriceById(digitecId);

    if (!digitecProduct) {
      console.log(`  ↳ ⚠️  Could not fetch product details for ID ${digitecId}`);
      unmatched.push({
        component: comp,
        reason: 'fetch_failed',
        digitecId,
      });
      skippedCount++;
      continue;
    }

    // ── 2c. Compute name similarity ───────────────────────────────────────────

    const ourWords = wordSet(comp.name);
    const theirWords = wordSet(digitecProduct.productName);
    const similarity = jaccardSimilarity(ourWords, theirWords);

    if (isDebug) {
      console.log(
        `  ↳ Digitec: "${digitecProduct.productName}" | similarity: ${similarity.toFixed(3)}`
      );
    }

    if (similarity < SIMILARITY_THRESHOLD) {
      console.log(
        `  ↳ ⚠️  Low similarity (${similarity.toFixed(2)} < ${SIMILARITY_THRESHOLD}) — skipping`
      );
      if (!isDebug) {
        console.log(`     Our name:     "${comp.name}"`);
        console.log(`     Digitec name: "${digitecProduct.productName}"`);
      }
      unmatched.push({
        component: comp,
        reason: 'low_similarity',
        digitecId,
        digitecName: digitecProduct.productName,
        similarity,
      });
      skippedCount++;
      continue;
    }

    // ── 2d. Update DB ─────────────────────────────────────────────────────────

    if (!isDebug) {
      // Always print the match even without --debug
      console.log(
        `  ↳ ✓  "${digitecProduct.productName}" (similarity: ${similarity.toFixed(2)})`
      );
    }

    if (isDryRun) {
      console.log(`  ↳ [DRY RUN] Would set specs.digitec_id = ${digitecId}`);
      matchedCount++;
      continue;
    }

    const updatedSpecs = { ...(comp.specs ?? {}), digitec_id: digitecId };

    const { error: updateError } = await supabase
      .from('components')
      .update({ specs: updatedSpecs })
      .eq('id', comp.id);

    if (updateError) {
      console.error(`  ↳ DB update failed: ${updateError.message}`);
      unmatched.push({
        component: comp,
        reason: 'db_error',
        digitecId,
        digitecName: digitecProduct.productName,
        similarity,
      });
      skippedCount++;
    } else {
      console.log(`  ↳ ✓  Saved digitec_id = ${digitecId}`);
      matchedCount++;
    }
  }

  // ── 3. Summary ──────────────────────────────────────────────────────────────

  console.log('\n=== Summary ===');
  console.log(`  Matched & saved : ${matchedCount}`);
  console.log(`  Skipped         : ${skippedCount}`);
  console.log(`  Total processed : ${total}`);

  if (unmatched.length > 0) {
    console.log('\n=== Unmatched (manual review needed) ===');
    for (const entry of unmatched) {
      const { component, reason, digitecId, digitecName, similarity } = entry;
      const tag = `[${component.type}] ${component.brand} ${component.name} (${component.id})`;
      switch (reason) {
        case 'no_id_from_search':
          console.log(`  ⚠️  ${tag} — no Digitec ID found (search blocked or no result)`);
          break;
        case 'fetch_failed':
          console.log(`  ⚠️  ${tag} — ID ${digitecId} found but product fetch failed`);
          break;
        case 'low_similarity':
          console.log(
            `  ⚠️  ${tag} — ID ${digitecId} "${digitecName}" similarity=${similarity?.toFixed(2)}`
          );
          break;
        case 'db_error':
          console.log(`  ⚠️  ${tag} — ID ${digitecId} matched but DB write failed`);
          break;
        default:
          console.log(`  ⚠️  ${tag} — ${reason}`);
      }
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
