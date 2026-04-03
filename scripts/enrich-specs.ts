#!/usr/bin/env tsx
/**
 * scripts/enrich-specs.ts
 *
 * Enrichit automatiquement les specs de TOUS les composants en DB
 * qui ont des données manquantes dans la colonne JSONB `specs`.
 *
 * Pour chaque type, interroge Claude API avec le nom du composant
 * et fusionne les specs reçues avec les specs existantes (sans
 * écraser les valeurs déjà présentes).
 *
 * Usage :
 *   npx tsx scripts/enrich-specs.ts
 *   npx tsx scripts/enrich-specs.ts --dry-run
 *   npx tsx scripts/enrich-specs.ts --type=GPU,CPU
 *   npx tsx scripts/enrich-specs.ts --limit=50
 *   npx tsx scripts/enrich-specs.ts --batch-size=10
 *
 * Env vars requises (dans .env.local) :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ── Load .env.local (no dotenv dependency needed) ─────────────────────────────

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

// ── Config ─────────────────────────────────────────────────────────────────────

const SUPABASE_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL    ?? '';
const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY   ?? '';
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY           ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!ANTHROPIC_KEY) {
  console.error('❌  Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// ── CLI args ───────────────────────────────────────────────────────────────────

const args       = process.argv.slice(2);
const DRY_RUN    = args.includes('--dry-run');
const LIMIT      = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]      ?? '0', 10) || 0;
const BATCH_SIZE = parseInt(args.find(a => a.startsWith('--batch-size='))?.split('=')[1] ?? '20', 10) || 20;
const TYPE_ARG   = args.find(a => a.startsWith('--type='))?.split('=')[1];

const MODEL         = 'claude-haiku-4-5-20251001'; // Fast + cheap for data enrichment
const MAX_TOKENS    = 4096;
const BATCH_DELAY   = 500; // ms between batches

// ── Spec definitions per type ──────────────────────────────────────────────────

/**
 * For each component type, the list of spec keys we want populated.
 * Keys must match what the UI's SPEC_TRANSLATIONS map in ConfigResult.tsx expects.
 */
const EXPECTED_SPECS: Record<string, string[]> = {
  GPU: [
    'vram_gb', 'architecture', 'tdp', 'core_clock', 'boost_clock',
    'length_mm', 'memory_type', 'chipset', 'outputs', 'perf_score',
  ],
  CPU: [
    'cores', 'threads', 'base_clock', 'boost_clock', 'tdp',
    'socket', 'architecture', 'l3_cache_mb', 'igpu',
  ],
  RAM: [
    'capacity_gb', 'memory_type', 'speed_mhz', 'cas_latency',
    'voltage', 'modules',
  ],
  'Carte mère': [
    'socket', 'chipset', 'form_factor', 'slots_ram',
    'max_ram_gb', 'pcie_version',
  ],
  Stockage: [
    'capacity_gb', 'drive_type', 'interface',
    'read_speed_mbs', 'write_speed_mbs',
  ],
  Alimentation: [
    'wattage', 'efficiency', 'modulaire', 'form_factor',
  ],
  Refroidissement: [
    'type', 'tdp_max', 'fan_count', 'radiator_size',
    'noise_db', 'rpm_max',
  ],
  'Boîtier': [
    'form_factor', 'max_gpu_length_mm', 'max_cpu_height_mm',
    'drive_bays', 'fan_slots',
  ],
  Moniteur: [
    'resolution', 'refresh_rate_hz', 'panel_type', 'hdr',
    'response_time_ms', 'size_inches', 'connectivity',
  ],
  Souris: [
    'dpi_max', 'buttons', 'wireless', 'weight_g', 'sensor',
  ],
  Clavier: [
    'switch_type', 'layout', 'wireless', 'backlight', 'form_factor',
  ],
  Casque: [
    'connectivity', 'frequency_range', 'impedance',
    'microphone', 'noise_cancelling',
  ],
};

/** Spec keys that also map to dedicated DB columns (updated in parallel). */
const DEDICATED_COLUMNS: Record<string, string[]> = {
  CPU:        ['socket', 'tdp'],
  GPU:        ['tdp', 'chipset'],
  'Carte mère': ['socket', 'chipset', 'form_factor'],
  'Boîtier':  ['form_factor'],
  Alimentation: [], // wattage stays in specs only
  Refroidissement: [],
};

// Execution order as requested
const DEFAULT_ORDER: string[] = [
  'GPU', 'CPU', 'RAM', 'Carte mère', 'Stockage',
  'Alimentation', 'Refroidissement', 'Boîtier',
  'Moniteur', 'Souris', 'Clavier', 'Casque',
];

const TYPES_TO_PROCESS: string[] = TYPE_ARG
  ? TYPE_ARG.split(',').map(t => t.trim())
  : DEFAULT_ORDER;

// ── Types ──────────────────────────────────────────────────────────────────────

interface DBComponent {
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

// ── Stats ──────────────────────────────────────────────────────────────────────

const stats = {
  enriched: 0,
  skipped: 0,
  errors: 0,
  total: 0,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Returns the list of expected spec keys that are currently missing. */
function missingKeys(component: DBComponent, expected: string[]): string[] {
  const existing = component.specs ?? {};

  // Also consider dedicated DB columns as "filled"
  const filled = new Set<string>(Object.keys(existing).filter(k => existing[k] != null && existing[k] !== ''));

  // Map some dedicated column names into spec key equivalents
  if (component.socket)      filled.add('socket');
  if (component.chipset)     filled.add('chipset');
  if (component.form_factor) filled.add('form_factor');
  if (component.tdp)         filled.add('tdp');

  return expected.filter(k => !filled.has(k));
}

function parseJSON(text: string): Record<string, unknown> | null {
  const t = text.trim();
  // Direct parse
  try   { const p = JSON.parse(t); if (p && typeof p === 'object' && !Array.isArray(p)) return p; } catch { /**/ }
  // Extract first { ... } block
  const m = t.match(/\{[\s\S]*\}/);
  if (m) try { const p = JSON.parse(m[0]); if (p && typeof p === 'object') return p; } catch { /**/ }
  return null;
}

/** Build the Claude prompt for a single component. */
function buildPrompt(component: DBComponent, missing: string[]): string {
  return `Tu es une base de données de composants PC. \
Donne-moi les specs techniques de : ${component.name} (${component.type}, marque : ${component.brand ?? 'inconnue'}).

Réponds UNIQUEMENT en JSON avec ces champs : ${missing.join(', ')}

Directives :
- Utilise des valeurs numériques pour les nombres (pas de chaînes comme "65W", juste 65).
- Pour les booléens (wireless, modulaire, hdr, microphone, noise_cancelling, backlight), utilise true/false.
- Pour capacity_gb, vram_gb, etc. : nombre entier en GB/Mo.
- Pour les vitesses (read_speed_mbs, write_speed_mbs, core_clock, boost_clock, base_clock) : nombre en MHz ou MB/s selon le contexte.
- Pour tdp, wattage, tdp_max : entier en watts.
- Pour form_factor : valeur courte comme "ATX", "mATX", "ITX", "SFX", "Full Tower", etc.
- Pour outputs (GPU) : liste comme "3x DisplayPort, 1x HDMI".
- Pour connectivity (Moniteur, Casque) : liste comme "HDMI 2.1, DisplayPort 1.4" ou "USB-C, Jack 3.5mm".
- Pour panel_type : "IPS", "VA", "TN", "OLED".
- Pour memory_type (RAM ou GPU) : "DDR4", "DDR5", "GDDR6X", etc.
- Pour drive_type (Stockage) : "SSD NVMe", "SSD SATA", "HDD".
- Pour switch_type (Clavier) : "Cherry MX Red", "Gateron Brown", etc.
- Pour radiator_size (Refroidissement) : "120mm", "240mm", "360mm" ou null si ventirad air.
- Si tu ne connais pas une valeur, mets null.
- Ne mets AUCUN texte avant ou après le JSON.

Exemple de réponse attendue :
{"cores": 6, "threads": 12, "base_clock": 3700, "boost_clock": 4600, "tdp": 65, "socket": "AM4", "architecture": "Zen 3", "l3_cache_mb": 32, "igpu": null}`;
}

// ── Core logic ─────────────────────────────────────────────────────────────────

async function enrichComponent(component: DBComponent, missing: string[]): Promise<void> {
  const prompt = buildPrompt(component, missing);

  let raw: string;
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: 'Tu es une base de données de composants PC. Réponds UNIQUEMENT avec un JSON valide, sans texte autour.',
      messages: [{ role: 'user', content: prompt }],
    });
    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Unexpected content type');
    raw = block.text;
  } catch (err) {
    console.error(`  ❌  ${component.name} → API error: ${err instanceof Error ? err.message : String(err)}`);
    stats.errors++;
    return;
  }

  const parsed = parseJSON(raw);
  if (!parsed) {
    console.warn(`  ⚠️   ${component.name} → could not parse JSON response`);
    stats.errors++;
    return;
  }

  // Merge: only add keys that were missing (never overwrite existing)
  const existingSpecs: Record<string, unknown> = component.specs ?? {};
  const newSpecs: Record<string, unknown> = { ...existingSpecs };
  const appliedKeys: string[] = [];

  for (const key of missing) {
    if (parsed[key] !== undefined && !(key in existingSpecs && existingSpecs[key] != null)) {
      newSpecs[key] = parsed[key];
      if (parsed[key] != null) appliedKeys.push(`${key}=${JSON.stringify(parsed[key])}`);
    }
  }

  if (appliedKeys.length === 0) {
    console.log(`  ⚪  ${component.name} → no new data from Claude`);
    stats.skipped++;
    return;
  }

  console.log(`  ✅  ${component.name} → ${appliedKeys.join(' | ')}`);

  if (DRY_RUN) {
    stats.enriched++;
    return;
  }

  // Build update payload: always update specs JSONB
  const updatePayload: Record<string, unknown> = { specs: newSpecs };

  // Also mirror into dedicated columns if applicable
  const dedicated = DEDICATED_COLUMNS[component.type] ?? [];
  for (const col of dedicated) {
    if (newSpecs[col] != null && (component as Record<string, unknown>)[col] == null) {
      updatePayload[col] = newSpecs[col];
    }
  }

  // Special: tdp in specs → also update dedicated tdp column
  if (newSpecs.tdp != null && component.tdp == null) {
    updatePayload.tdp = newSpecs.tdp;
  }

  const { error } = await supabase
    .from('components')
    .update(updatePayload)
    .eq('id', component.id);

  if (error) {
    console.error(`  ❌  ${component.name} → DB update failed: ${error.message}`);
    stats.errors++;
    return;
  }

  stats.enriched++;
}

async function processBatch(batch: DBComponent[], expected: string[]): Promise<void> {
  // Process one-by-one within a batch (Claude API called per component)
  for (const component of batch) {
    const missing = missingKeys(component, expected);
    if (missing.length === 0) {
      console.log(`  ⚪  ${component.name} → all specs present, skipping`);
      stats.skipped++;
      continue;
    }
    await enrichComponent(component, missing);
  }
}

async function processType(type: string): Promise<void> {
  const expected = EXPECTED_SPECS[type];
  if (!expected) {
    console.warn(`  ⚠️   No spec definition for type "${type}", skipping.`);
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  Type: ${type}`);
  console.log(`  Expected keys: ${expected.join(', ')}`);
  console.log(`${'─'.repeat(60)}`);

  // Fetch all components of this type
  let query = supabase
    .from('components')
    .select('id, name, brand, type, specs, socket, chipset, form_factor, tdp')
    .eq('type', type)
    .order('popularity_score', { ascending: false });

  if (LIMIT > 0) query = query.limit(LIMIT);

  const { data, error } = await query;

  if (error) {
    console.error(`  ❌  Supabase query failed: ${error.message}`);
    stats.errors++;
    return;
  }

  const all = (data ?? []) as DBComponent[];

  // Filter to those with at least one missing spec
  const toEnrich = all.filter(c => missingKeys(c, expected).length > 0);

  console.log(`  Found ${all.length} total, ${toEnrich.length} need enrichment.`);
  stats.total += toEnrich.length;

  if (toEnrich.length === 0) return;

  const batches = chunk(toEnrich, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const b = batches[i];
    console.log(`\n  Batch ${i + 1}/${batches.length} — ${b.length} composant(s)`);
    await processBatch(b, expected);

    if (i < batches.length - 1) {
      await sleep(BATCH_DELAY);
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║           enrich-specs — ConfigPC.ch                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`  Model:      ${MODEL}`);
  console.log(`  Types:      ${TYPES_TO_PROCESS.join(', ')}`);
  console.log(`  Batch size: ${BATCH_SIZE}`);
  console.log(`  Batch delay:${BATCH_DELAY}ms`);
  console.log(`  Limit:      ${LIMIT || 'none (all)'}`);
  console.log(`  Dry run:    ${DRY_RUN}`);

  for (const type of TYPES_TO_PROCESS) {
    await processType(type);
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log(`║  RÉSUMÉ                                                  ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  Total à enrichir : ${String(stats.total).padEnd(37)}║`);
  console.log(`║  ✅ Enrichis       : ${String(stats.enriched).padEnd(37)}║`);
  console.log(`║  ⚪ Déjà complets  : ${String(stats.skipped).padEnd(37)}║`);
  console.log(`║  ❌ Erreurs        : ${String(stats.errors).padEnd(37)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n  (dry-run — aucune écriture en DB)');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
