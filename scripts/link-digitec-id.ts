#!/usr/bin/env tsx
/**
 * scripts/link-digitec-id.ts
 *
 * One-time helper: link a component to its Digitec product ID.
 * Run this whenever you want to track the price of a specific component.
 *
 * Usage:
 *   npx tsx scripts/link-digitec-id.ts <component-name-or-id> <digitec-product-id>
 *
 * Examples:
 *   # Use the numeric product ID from the Digitec URL
 *   # e.g. https://www.digitec.ch/fr/s1/product/msi-geforce-rtx-4060-...-36050671
 *   #                                                                       ^^^^^^^^ this number
 *
 *   npx tsx scripts/link-digitec-id.ts "Corsair RM850e" 36050671
 *   npx tsx scripts/link-digitec-id.ts "RTX 4060" 36050671
 *
 * To list all components without a Digitec ID:
 *   npx tsx scripts/link-digitec-id.ts --list-missing
 *
 * To list all linked components:
 *   npx tsx scripts/link-digitec-id.ts --list
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceKey);

async function main() {
  const args = process.argv.slice(2);

  // ── List commands ──────────────────────────────────────────────────────────

  if (args.includes('--list-missing')) {
    const { data, error } = await sb
      .from('components')
      .select('id, name, brand, type, price_ch')
      .eq('active', true)
      .is('specs->digitec_id', null) // no digitec_id stored yet
      .order('popularity_score', { ascending: false })
      .limit(100);

    if (error) { console.error(error); process.exit(1); }
    console.log(`\n${data?.length ?? 0} components without a Digitec ID:\n`);
    data?.forEach((c) => console.log(`  [${c.type}] ${c.name}  (CHF ${c.price_ch ?? '?'})`));
    console.log(`\nUse: npx tsx scripts/link-digitec-id.ts "<name>" <digitec-id>`);
    return;
  }

  if (args.includes('--list')) {
    const { data, error } = await sb
      .from('components')
      .select('id, name, brand, type, price_ch, specs')
      .eq('active', true)
      .not('specs->digitec_id', 'is', null);

    if (error) { console.error(error); process.exit(1); }
    console.log(`\n${data?.length ?? 0} components with a Digitec ID:\n`);
    data?.forEach((c) => {
      const did = (c.specs as Record<string, unknown>)?.digitec_id;
      console.log(`  [${c.type}] ${c.name}  → digitec_id: ${did}  (CHF ${c.price_ch ?? '?'})`);
    });
    return;
  }

  // ── Link command ───────────────────────────────────────────────────────────

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/link-digitec-id.ts "<component-name-or-id>" <digitec-product-id>');
    console.error('       npx tsx scripts/link-digitec-id.ts --list-missing');
    process.exit(1);
  }

  const nameOrId = args[0];
  const digitecId = parseInt(args[1], 10);
  if (isNaN(digitecId)) {
    console.error('Invalid Digitec product ID — must be a number');
    process.exit(1);
  }

  // Find component by UUID or name search
  let componentId: string | null = null;
  let componentName: string = '';

  const isUuid = /^[0-9a-f-]{36}$/i.test(nameOrId);
  if (isUuid) {
    const { data } = await sb.from('components').select('id, name').eq('id', nameOrId).single();
    if (data) { componentId = data.id; componentName = data.name; }
  } else {
    // Search by name (case-insensitive partial match)
    const { data } = await sb
      .from('components')
      .select('id, name, brand, type')
      .ilike('name', `%${nameOrId}%`)
      .limit(5);

    if (!data || data.length === 0) {
      console.error(`No component found matching: "${nameOrId}"`);
      process.exit(1);
    }
    if (data.length === 1) {
      componentId = data[0].id;
      componentName = data[0].name;
    } else {
      console.log(`Multiple matches — be more specific:\n`);
      data.forEach((c) => console.log(`  ${c.id}  [${c.type}] ${c.name}`));
      console.log(`\nRe-run with the UUID instead of the name.`);
      process.exit(1);
    }
  }

  if (!componentId) {
    console.error(`Component not found: "${nameOrId}"`);
    process.exit(1);
  }

  // Verify the Digitec ID is real (optional check)
  console.log(`Linking "${componentName}" → digitec_id: ${digitecId}`);

  // Fetch current specs and merge
  const { data: comp } = await sb.from('components').select('specs').eq('id', componentId).single();
  const currentSpecs = (comp?.specs as Record<string, unknown>) ?? {};
  const updatedSpecs = { ...currentSpecs, digitec_id: digitecId };

  const { error: updateErr } = await sb
    .from('components')
    .update({ specs: updatedSpecs, updated_at: new Date().toISOString() })
    .eq('id', componentId);

  if (updateErr) {
    console.error('Failed to update:', updateErr.message);
    process.exit(1);
  }

  console.log(`✅ Saved. The nightly scraper will now fetch live CHF prices for "${componentName}".`);
  console.log(`\n   Digitec URL: https://www.digitec.ch/fr/s1/product/-${digitecId}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
