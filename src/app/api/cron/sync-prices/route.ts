import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { fetchDigitecPriceById } from '@/lib/scraper/digitec-api';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const GALAXUS_BASE = 'https://www.galaxus.ch';
const BATCH_LIMIT = 500;
const RATE_LIMIT_MS = 800;

function isAuthorized(req: NextRequest): boolean {
  // Vercel itself calling the cron — always trusted
  if (req.headers.get('x-vercel-cron') === '1') return true;

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;

  const cronHeader = req.headers.get('x-cron-secret');
  if (cronHeader === cronSecret) return true;

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const startTime = Date.now();
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Load up to 500 components that have a digitec_id, ordered by popularity
  console.log('[sync-prices] Fetching components with digitec_id...');
  const { data: components, error: fetchError } = await supabase
    .from('components')
    .select('id, name, specs')
    .not('specs->digitec_id', 'is', null)
    .order('popularity_score', { ascending: false })
    .limit(BATCH_LIMIT);

  if (fetchError) {
    console.error('[sync-prices] Failed to fetch components:', fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const total = components?.length ?? 0;
  console.log(`[sync-prices] Processing ${total} components...`);

  for (const component of components ?? []) {
    processed++;

    const rawDigitecId = component.specs?.digitec_id;
    const digitecId = rawDigitecId != null ? parseInt(String(rawDigitecId), 10) : NaN;

    if (!digitecId || isNaN(digitecId)) {
      console.warn(`[sync-prices] [${processed}/${total}] Component ${component.id} has invalid digitec_id: ${rawDigitecId}`);
      skipped++;
      continue;
    }

    console.log(`[sync-prices] [${processed}/${total}] Fetching price for component ${component.id} (digitec_id=${digitecId})...`);

    try {
      const result = await fetchDigitecPriceById(digitecId);

      if (!result || result.priceCHF == null) {
        console.warn(`[sync-prices] No price returned for digitec_id=${digitecId}, skipping.`);
        skipped++;
      } else {
        const digitecUrl = result.url;
        const galaxusUrl = `${GALAXUS_BASE}/fr/s1/product/${digitecId}`;

        const upserts = [
          {
            component_id: component.id,
            site: 'digitec',
            price: result.priceCHF,
            currency: 'CHF',
            url: digitecUrl,
            in_stock: true,
            updated_at: new Date().toISOString(),
          },
          {
            component_id: component.id,
            site: 'galaxus',
            price: result.priceCHF,
            currency: 'CHF',
            url: galaxusUrl,
            in_stock: true,
            updated_at: new Date().toISOString(),
          },
        ];

        const { error: upsertError } = await supabase
          .from('component_prices')
          .upsert(upserts, { onConflict: 'component_id,site' });

        if (upsertError) {
          console.error(`[sync-prices] Upsert failed for component ${component.id}:`, upsertError.message);
          errors++;
        } else {
          console.log(`[sync-prices] Updated prices for component ${component.id}: CHF ${result.priceCHF}`);
          updated++;
        }
      }
    } catch (err) {
      console.error(`[sync-prices] Unexpected error for component ${component.id}:`, err);
      errors++;
    }

    // Rate limit between requests
    if (processed < total) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  const durationMs = Date.now() - startTime;
  const summary = { processed, updated, skipped, errors, durationMs };
  console.log('[sync-prices] Done.', summary);

  return NextResponse.json(summary);
}
