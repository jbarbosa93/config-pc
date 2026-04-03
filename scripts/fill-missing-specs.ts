#!/usr/bin/env tsx
/**
 * scripts/fill-missing-specs.ts
 *
 * Uses Claude API to fill in missing specs for PC components.
 *
 * What it does:
 *  1. Queries components with missing specs (socket, chipset, form_factor, tdp, wattage)
 *  2. Sends batches to Claude claude-sonnet-4-20250514 for inference
 *  3. Updates the DB with the inferred values (only for fields that are currently NULL)
 *
 * Usage:
 *   npx tsx scripts/fill-missing-specs.ts [--dry-run] [--limit=N] [--type=CPU] [--batch-size=N]
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ── Config ────────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const anthropicKey = process.env.ANTHROPIC_API_KEY ?? '';

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!anthropicKey) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = parseInt(args.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? '0', 10) || 0;
const BATCH_SIZE = parseInt(args.find((a) => a.startsWith('--batch-size='))?.split('=')[1] ?? '50', 10) || 50;
const TYPE_ARG = args.find((a) => a.startsWith('--type='))?.split('=')[1];

const DEFAULT_TYPES = ['CPU', 'Carte mère', 'Boîtier', 'Alimentation'];
const TYPES_TO_PROCESS: string[] = TYPE_ARG
  ? TYPE_ARG.split(',').map((t) => t.trim())
  : DEFAULT_TYPES;

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4000;
const BATCH_DELAY_MS = 2000;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Component {
  id: string;
  name: string;
  brand: string | null;
  type: string;
  specs: Record<string, unknown> | null;
  socket: string | null;
  chipset: string | null;
  form_factor: string | null;
  tdp: number | null;
}

interface ClaudeResult {
  id: string;
  socket?: string | null;
  chipset?: string | null;
  form_factor?: string | null;
  tdp?: number | null;
  wattage?: number | null;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

const stats = { updated: 0, noData: 0, errors: 0 };

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function buildUserPrompt(components: Component[]): string {
  const list = components.map((c) => ({
    id: c.id,
    name: c.name,
    brand: c.brand,
    type: c.type,
  }));

  return `Pour chaque composant dans la liste, déduis les specs manquantes.
Réponds avec un tableau JSON dans cet exact format :

[
  {
    "id": "uuid",
    "socket": "AM5 ou LGA1700 ou null si inconnu",
    "chipset": "X670 ou null si N/A ou inconnu",
    "form_factor": "ATX ou mATX ou ITX ou null si inconnu",
    "tdp": 65,
    "wattage": 850
  }
]

Notes importantes :
- Pour les Boîtiers, "form_factor" = les formats de carte mère supportés (ex: "ATX" si compatible ATX/mATX/ITX, "mATX" si max mATX, "ITX" si mini-ITX seulement)
- Pour les Alimentations, "wattage" = puissance en watts (souvent dans le nom, ex: "RM850e" → 850)
- Pour les CPUs, "tdp" = TDP officiel Intel/AMD en watts
- "chipset" = null pour CPU, GPU, Boîtier, Alimentation (N/A)
- Mets null pour les champs vraiment inconnus, pas une valeur inventée
- tdp et wattage doivent être des entiers ou null
- Réponds UNIQUEMENT avec le tableau JSON, sans texte autour

Composants à traiter :
${JSON.stringify(list, null, 2)}`;
}

function buildRetryPrompt(components: Component[]): string {
  const list = components.map((c) => ({
    id: c.id,
    name: c.name,
    brand: c.brand,
    type: c.type,
  }));

  return `Réponds avec un tableau JSON uniquement. Pour chaque composant, donne socket, chipset, form_factor, tdp, wattage (null si inconnu).

${JSON.stringify(list, null, 2)}

Format attendu: [{"id":"...","socket":null,"chipset":null,"form_factor":null,"tdp":null,"wattage":null}]`;
}

function parseClaudeResponse(text: string): ClaudeResult[] | null {
  // Try to extract JSON array from response
  const trimmed = text.trim();

  // Direct parse attempt
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as ClaudeResult[];
  } catch {
    // fall through
  }

  // Try to extract JSON array with regex
  const match = trimmed.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as ClaudeResult[];
    } catch {
      // fall through
    }
  }

  return null;
}

async function callClaude(prompt: string, isRetry = false): Promise<string> {
  const systemPrompt = isRetry
    ? 'Réponds UNIQUEMENT avec un JSON valide, sans texte autour.'
    : 'Tu es un expert hardware PC. Tu connais les specs techniques de tous les composants PC de 2015 à 2025. Réponds UNIQUEMENT avec un JSON valide, sans texte autour.';

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');
  return content.text;
}

async function processBatch(components: Component[]): Promise<void> {
  // Try primary prompt
  let results: ClaudeResult[] | null = null;

  try {
    const responseText = await callClaude(buildUserPrompt(components));
    results = parseClaudeResponse(responseText);

    if (!results) {
      console.warn('  ⚠️  JSON parse failed, retrying with simpler prompt...');
      await sleep(1000);
      const retryText = await callClaude(buildRetryPrompt(components), true);
      results = parseClaudeResponse(retryText);
    }
  } catch (err) {
    console.error(`  ❌ Claude API error: ${err instanceof Error ? err.message : String(err)}`);
    stats.errors += components.length;
    return;
  }

  if (!results) {
    console.warn(`  ⚠️  Could not parse Claude response for batch of ${components.length}`);
    stats.errors += components.length;
    return;
  }

  // Build a map for quick lookup
  const resultsById = new Map<string, ClaudeResult>();
  for (const r of results) {
    if (r.id) resultsById.set(r.id, r);
  }

  // Process each component
  for (const component of components) {
    const result = resultsById.get(component.id);

    if (!result) {
      console.log(`  ⚠️  ${component.name} → no data from Claude`);
      stats.noData++;
      continue;
    }

    // Determine which fields to update (only if currently NULL in DB)
    const updates: Record<string, unknown> = {};
    const updateLog: string[] = [];

    if (result.socket != null && component.socket == null) {
      updates.socket = result.socket;
      updateLog.push(`socket=${result.socket}`);
    }
    if (result.chipset != null && component.chipset == null) {
      updates.chipset = result.chipset;
      updateLog.push(`chipset=${result.chipset}`);
    }
    if (result.form_factor != null && component.form_factor == null) {
      updates.form_factor = result.form_factor;
      updateLog.push(`form_factor=${result.form_factor}`);
    }
    if (result.tdp != null && component.tdp == null) {
      updates.tdp = result.tdp;
      updateLog.push(`tdp=${result.tdp}W`);
    }

    // Handle wattage → merge into specs JSONB
    let specsUpdate: Record<string, unknown> | undefined;
    if (result.wattage != null) {
      const existingWattage =
        component.specs?.wattage ?? component.specs?.puissance;
      if (existingWattage == null) {
        specsUpdate = { ...(component.specs ?? {}), wattage: result.wattage };
        updateLog.push(`wattage=${result.wattage}W`);
      }
    }

    if (updateLog.length === 0) {
      console.log(`  ⚠️  ${component.name} → no data from Claude`);
      stats.noData++;
      continue;
    }

    if (specsUpdate) {
      updates.specs = specsUpdate;
    }

    console.log(`  ✅ ${component.name} → ${updateLog.join(' ')}`);

    if (!DRY_RUN) {
      const { error } = await supabase
        .from('components')
        .update(updates)
        .eq('id', component.id);

      if (error) {
        console.error(`  ❌ DB update failed for ${component.name}: ${error.message}`);
        stats.errors++;
        continue;
      }
    }

    stats.updated++;
  }
}

// ── Query helpers ─────────────────────────────────────────────────────────────

async function fetchMissingComponents(type: string): Promise<Component[]> {
  let query = supabase
    .from('components')
    .select('id, name, brand, type, specs, socket, chipset, form_factor, tdp')
    .eq('type', type);

  // Build OR filter for missing fields per type
  let orFilter: string;
  switch (type) {
    case 'CPU':
      orFilter = 'tdp.is.null,socket.is.null';
      break;
    case 'Carte mère':
      orFilter = 'socket.is.null,form_factor.is.null,chipset.is.null';
      break;
    case 'Boîtier':
      orFilter = 'form_factor.is.null';
      break;
    case 'Alimentation':
      // We'll filter wattage in-memory since it's in JSONB
      orFilter = 'specs.is.null';
      break;
    default:
      orFilter = 'socket.is.null,form_factor.is.null,chipset.is.null,tdp.is.null';
  }

  query = query.or(orFilter);

  if (LIMIT > 0) {
    query = query.limit(LIMIT);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`  ❌ Supabase query failed for ${type}: ${error.message}`);
    return [];
  }

  let components = (data ?? []) as Component[];

  // For Alimentation, also fetch components where specs exist but wattage/puissance are missing
  if (type === 'Alimentation') {
    const { data: data2, error: error2 } = await supabase
      .from('components')
      .select('id, name, brand, type, specs, socket, chipset, form_factor, tdp')
      .eq('type', type)
      .not('specs', 'is', null);

    if (!error2 && data2) {
      const withoutWattage = (data2 as Component[]).filter(
        (c) => c.specs?.wattage == null && c.specs?.puissance == null,
      );
      // Merge deduped
      const existingIds = new Set(components.map((c) => c.id));
      for (const c of withoutWattage) {
        if (!existingIds.has(c.id)) components.push(c);
      }
    }

    if (LIMIT > 0) {
      components = components.slice(0, LIMIT);
    }
  }

  return components;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🔧 fill-missing-specs');
  console.log(`   Model:      ${MODEL}`);
  console.log(`   Types:      ${TYPES_TO_PROCESS.join(', ')}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  console.log(`   Limit:      ${LIMIT || 'none'}`);
  console.log(`   Dry run:    ${DRY_RUN}`);
  console.log('');

  for (const type of TYPES_TO_PROCESS) {
    console.log(`\n── ${type} ──────────────────────────────────────`);

    const components = await fetchMissingComponents(type);

    if (components.length === 0) {
      console.log('  No components with missing specs found.');
      continue;
    }

    console.log(`  Found ${components.length} component(s) with missing specs.`);

    const batches = chunks(components, BATCH_SIZE);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n  Batch ${i + 1}/${batches.length} (${batch.length} components):`);

      await processBatch(batch);

      // Pause between Claude API calls (except after the last batch)
      if (i < batches.length - 1) {
        await sleep(BATCH_DELAY_MS);
      }
    }
  }

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅ Updated:  ${stats.updated}`);
  console.log(`⚠️  No data: ${stats.noData}`);
  console.log(`❌ Errors:   ${stats.errors}`);

  if (DRY_RUN) {
    console.log('\n(dry-run mode — no DB writes were made)');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
