#!/usr/bin/env node
/**
 * Script pour remplir la base de données Supabase avec les composants PC et périphériques gaming.
 *
 * Usage: node scripts/seed-database.mjs [--clear]
 *   --clear : Supprime tous les composants existants avant l'insertion
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gxremrjbwtnmiiiujjem.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquant. Configurez .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Charger les données
const dataPath = join(__dirname, '..', 'database_components.json');
const components = JSON.parse(readFileSync(dataPath, 'utf-8'));

const shouldClear = process.argv.includes('--clear');

async function clearDatabase() {
  console.log('🗑️  Suppression des données existantes...');

  // Supprimer les images et prix d'abord (foreign keys)
  const { error: imgErr } = await supabase.from('component_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (imgErr) console.warn('  ⚠️  Erreur suppression images:', imgErr.message);

  const { error: priceErr } = await supabase.from('component_prices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (priceErr) console.warn('  ⚠️  Erreur suppression prix:', priceErr.message);

  const { error: compErr } = await supabase.from('components').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (compErr) console.warn('  ⚠️  Erreur suppression composants:', compErr.message);

  console.log('✅ Base de données vidée.');
}

async function insertComponent(comp) {
  // Extraire image_url et digitec_url avant insertion
  const { image_url, digitec_url, ...componentData } = comp;

  // Insérer le composant
  const { data, error } = await supabase
    .from('components')
    .insert({
      type: componentData.type,
      name: componentData.name,
      brand: componentData.brand,
      specs: componentData.specs || {},
      price_ch: componentData.price_ch || 0,
      price_fr: componentData.price_fr || 0,
      socket: componentData.socket || null,
      chipset: componentData.chipset || null,
      form_factor: componentData.form_factor || null,
      tdp: componentData.tdp || null,
      description: componentData.description || '',
      manufacturer_url: componentData.manufacturer_url || '',
      popularity_score: componentData.popularity_score || 0,
      release_year: componentData.release_year || null,
      available_ch: componentData.available_ch ?? true,
      active: componentData.active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error(`  ❌ Erreur insertion "${comp.name}":`, error.message);
    return null;
  }

  const componentId = data.id;

  // Insérer l'image si disponible
  if (image_url) {
    const { error: imgError } = await supabase
      .from('component_images')
      .insert({
        component_id: componentId,
        url: image_url,
        is_primary: true,
        alt_text: comp.name,
        order_index: 0,
      });

    if (imgError) {
      console.warn(`  ⚠️  Erreur image pour "${comp.name}":`, imgError.message);
    }
  }

  // Insérer le prix Digitec/Galaxus si disponible
  if (digitec_url && comp.price_ch) {
    const { error: priceError } = await supabase
      .from('component_prices')
      .insert({
        component_id: componentId,
        site: 'digitec',
        price: comp.price_ch,
        currency: 'CHF',
        url: digitec_url,
        in_stock: true,
      });

    if (priceError) {
      console.warn(`  ⚠️  Erreur prix pour "${comp.name}":`, priceError.message);
    }
  }

  return data;
}

async function seedDatabase() {
  console.log('🚀 Début du seeding de la base de données config-pc.ch');
  console.log(`📦 ${components.length} composants à insérer\n`);

  if (shouldClear) {
    await clearDatabase();
    console.log('');
  }

  // Grouper par type pour un affichage clair
  const byType = {};
  for (const comp of components) {
    if (!byType[comp.type]) byType[comp.type] = [];
    byType[comp.type].push(comp);
  }

  let success = 0;
  let failed = 0;

  for (const [type, items] of Object.entries(byType)) {
    console.log(`\n📁 ${type} (${items.length} produits)`);

    for (const comp of items) {
      const result = await insertComponent(comp);
      if (result) {
        console.log(`  ✅ ${comp.name} — ${comp.price_ch} CHF`);
        success++;
      } else {
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🏁 Seeding terminé !`);
  console.log(`   ✅ ${success} composants insérés avec succès`);
  if (failed > 0) console.log(`   ❌ ${failed} erreurs`);
  console.log('='.repeat(60));

  // Résumé par catégorie
  console.log('\n📊 Résumé par catégorie :');
  for (const [type, items] of Object.entries(byType)) {
    console.log(`   ${type}: ${items.length} produits`);
  }
}

seedDatabase().catch(console.error);
