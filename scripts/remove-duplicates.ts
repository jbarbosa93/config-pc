#!/usr/bin/env tsx
/**
 * scripts/remove-duplicates.ts
 *
 * Détecte et supprime les doublons dans la table `components`.
 * Deux composants sont considérés comme doublons si :
 *   - Même type
 *   - Même nom de base après normalisation (suppression des suffixes
 *     d'année comme "(2021)", "(2022)", "(2024)", "(refurb)", etc.)
 *
 * Pour chaque groupe de doublons :
 *   - Garde le composant avec le plus d'infos complètes (specs, images, prix)
 *   - Si égalité, garde le plus récent (created_at desc)
 *   - Transfère les images et prix manquants vers le composant gardé
 *   - Supprime les autres
 *
 * Usage :
 *   npx tsx scripts/remove-duplicates.ts            # dry-run
 *   npx tsx scripts/remove-duplicates.ts --execute  # supprime réellement
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ── Load .env.local ────────────────────────────────────────────────────────────

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXECUTE = process.argv.includes('--execute');

// ── Types ──────────────────────────────────────────────────────────────────────

interface Component {
  id: string;
  type: string;
  name: string;
  brand: string | null;
  specs: Record<string, string> | null;
  price_ch: number;
  price_fr: number;
  description: string | null;
  manufacturer_url: string | null;
  socket: string | null;
  chipset: string | null;
  form_factor: string | null;
  tdp: number | null;
  release_year: number | null;
  active: boolean;
  created_at: string;
  component_images?: { id: string; url: string; is_primary: boolean; alt_text: string; order_index: number }[];
}

// ── Normalisation du nom ───────────────────────────────────────────────────────

/**
 * Normalise un nom de composant pour la comparaison des doublons.
 * Supprime :
 *   - Suffixes d'année entre parenthèses : (2021), (2022), (2024)…
 *   - Suffixes courants : (refurb), (oem), (bulk), (box), (tray)…
 *   - Espaces multiples, ponctuation de fin
 *   - Met en minuscules
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    // Remove TRAILING year suffix only: "Samsung 970 Evo 1 TB (2021)" → "samsung 970 evo 1 tb"
    // But NOT mid-name years: "Corsair RM750e (2023) Black" keeps the (2023) intact
    .replace(/\s*\(\d{4}\)\s*$/, '')
    // Remove trailing common suffix words in parentheses
    .replace(/\s*\((refurb|oem|bulk|box|tray|retail|new|used|renewed|recertified|open\s*box)\)\s*$/i, '')
    // Remove trailing punctuation and spaces
    .replace(/[\s,.-]+$/, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Score de complétude ────────────────────────────────────────────────────────

/**
 * Score de complétude d'un composant (plus c'est élevé, plus on le garde).
 */
function completenessScore(c: Component): number {
  let score = 0;
  if (c.specs && Object.keys(c.specs).length > 0) score += Object.keys(c.specs).length * 2;
  if (c.component_images && c.component_images.length > 0) score += c.component_images.length * 5;
  if (c.price_ch > 0) score += 10;
  if (c.price_fr > 0) score += 5;
  if (c.description && c.description.length > 20) score += 8;
  if (c.manufacturer_url) score += 3;
  if (c.socket) score += 2;
  if (c.chipset) score += 2;
  if (c.form_factor) score += 2;
  if (c.tdp) score += 2;
  if (c.release_year) score += 1;
  return score;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍  Fetching all components from DB…`);

  // Fetch all active components with their images
  const { data: components, error } = await supabase
    .from('components')
    .select('*, component_images(*)')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌  DB error:', error.message);
    process.exit(1);
  }

  const all = components as Component[];
  console.log(`   Found ${all.length} active components\n`);

  // ── Group by type + normalized name ───────────────────────────────────────────

  const groups = new Map<string, Component[]>();

  for (const c of all) {
    const key = `${c.type}::${normalizeName(c.name)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  // ── Find duplicate groups ──────────────────────────────────────────────────────

  const duplicateGroups = Array.from(groups.entries()).filter(([, group]) => group.length > 1);

  if (duplicateGroups.length === 0) {
    console.log('✅  No duplicates found.');
    return;
  }

  // ── Summary by type ───────────────────────────────────────────────────────────

  const byType = new Map<string, number>();
  let totalDuplicates = 0;

  for (const [, group] of duplicateGroups) {
    const type = group[0].type;
    byType.set(type, (byType.get(type) ?? 0) + (group.length - 1));
    totalDuplicates += group.length - 1;
  }

  console.log(`📊  Duplicate summary by category:`);
  for (const [type, count] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type.padEnd(20)} ${count} duplicate(s)`);
  }
  console.log(`\n   Total: ${duplicateGroups.length} groups, ${totalDuplicates} components to remove\n`);

  // ── Detail each group ─────────────────────────────────────────────────────────

  console.log(`📋  Duplicate groups:\n`);
  const toDelete: string[] = [];
  const transferOps: { keepId: string; deleteId: string; images: Component['component_images'] }[] = [];

  for (const [key, group] of duplicateGroups) {
    // Sort by completeness (desc), then by created_at (desc)
    const sorted = group.sort((a, b) => {
      const scoreDiff = completenessScore(b) - completenessScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const [keep, ...remove] = sorted;

    const normalizedKey = key.split('::')[1];
    console.log(`  [${group[0].type}] "${normalizedKey}"`);
    console.log(`    ✅ KEEP  : "${keep.name}" (score=${completenessScore(keep)}, images=${keep.component_images?.length ?? 0}, price_ch=${keep.price_ch})`);

    for (const dup of remove) {
      console.log(`    🗑️  DELETE: "${dup.name}" (score=${completenessScore(dup)}, images=${dup.component_images?.length ?? 0}, price_ch=${dup.price_ch})`);
      toDelete.push(dup.id);

      // Transfer images if keeper has none
      if ((keep.component_images?.length ?? 0) === 0 && (dup.component_images?.length ?? 0) > 0) {
        transferOps.push({ keepId: keep.id, deleteId: dup.id, images: dup.component_images });
      }

      // Transfer price if keeper has no price
      if (keep.price_ch === 0 && dup.price_ch > 0) {
        console.log(`    📦 Will transfer price_ch ${dup.price_ch} → keeper`);
      }
    }
    console.log('');
  }

  // ── Summary ───────────────────────────────────────────────────────────────────

  console.log(`\n📈  Result preview:`);
  console.log(`   Components before : ${all.length}`);
  console.log(`   Will delete       : ${toDelete.length}`);
  console.log(`   Will remain       : ${all.length - toDelete.length}`);
  console.log(`   Image transfers   : ${transferOps.length}`);

  if (!EXECUTE) {
    console.log(`\n⚠️   DRY-RUN mode — no changes made.`);
    console.log(`    Run with --execute to apply deletions:\n`);
    console.log(`    npx tsx scripts/remove-duplicates.ts --execute\n`);
    return;
  }

  // ── Execute ───────────────────────────────────────────────────────────────────

  console.log(`\n🚀  Executing…`);

  // 1. Transfer images to keepers
  for (const op of transferOps) {
    console.log(`   Transferring ${op.images?.length} images from ${op.deleteId} → ${op.keepId}`);
    for (const img of op.images ?? []) {
      const { error: imgErr } = await supabase
        .from('component_images')
        .update({ component_id: op.keepId })
        .eq('id', img.id);
      if (imgErr) console.warn(`   ⚠️  Image transfer error: ${imgErr.message}`);
    }
  }

  // 2. Transfer price_ch to keepers where needed
  for (const [, group] of duplicateGroups) {
    const sorted = group.sort((a, b) => completenessScore(b) - completenessScore(a));
    const [keep, ...remove] = sorted;
    if (keep.price_ch === 0) {
      const withPrice = remove.find((r) => r.price_ch > 0);
      if (withPrice) {
        await supabase
          .from('components')
          .update({ price_ch: withPrice.price_ch, price_fr: withPrice.price_fr })
          .eq('id', keep.id);
        console.log(`   💰 Transferred price_ch ${withPrice.price_ch} to "${keep.name}"`);
      }
    }
  }

  // 3. Delete duplicates in batches of 20
  const BATCH = 20;
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += BATCH) {
    const batch = toDelete.slice(i, i + BATCH);
    const { error: delErr } = await supabase
      .from('components')
      .delete()
      .in('id', batch);
    if (delErr) {
      console.error(`   ❌ Delete error: ${delErr.message}`);
    } else {
      deleted += batch.length;
      console.log(`   🗑️  Deleted ${deleted}/${toDelete.length}…`);
    }
  }

  console.log(`\n✅  Done.`);
  console.log(`   Deleted  : ${deleted} components`);
  console.log(`   Remaining: ${all.length - deleted} components`);
}

main().catch((err) => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
