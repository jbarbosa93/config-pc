import { createClient } from '@supabase/supabase-js';
import { products as p1 } from './seed_mega_part1.mjs';
import { products as p2 } from './seed_mega_part2.mjs';
import { products as p3 } from './seed_mega_part3.mjs';
import { products as p4 } from './seed_mega_part4.mjs';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

// Fix type names to match DB constraint
const TYPE_MAP = {
  'ram': 'RAM',
  'cpu': 'CPU',
  'gpu': 'GPU',
  'stockage': 'Stockage',
  'carte_mere': 'Carte mère',
  'carte_mère': 'Carte mère',
  'carte mere': 'Carte mère',
  'alimentation': 'Alimentation',
  'boitier': 'Boîtier',
  'boîtier': 'Boîtier',
  'refroidissement': 'Refroidissement',
  'moniteur': 'Moniteur',
  'clavier': 'Clavier',
  'souris': 'Souris',
  'casque': 'Casque',
  'chaise_gaming': 'Chaise gaming',
  'chaise gaming': 'Chaise gaming',
  'tapis_de_souris': 'Tapis de souris',
  'tapis de souris': 'Tapis de souris',
};

const allProducts = [...p1, ...p2, ...p3, ...p4].map(p => ({
  ...p,
  type: TYPE_MAP[p.type.toLowerCase()] || TYPE_MAP[p.type] || p.type,
}));
console.log(`Total products to upsert: ${allProducts.length}`);

// Show breakdown by type
const byType = {};
for (const p of allProducts) {
  byType[p.type] = (byType[p.type] || 0) + 1;
}
console.log('Breakdown:', byType);

let success = 0;
let errors = 0;
const BATCH = 20;

for (let i = 0; i < allProducts.length; i += BATCH) {
  const batch = allProducts.slice(i, i + BATCH);
  const { error } = await supabase
    .from('components')
    .upsert(batch, { onConflict: 'name' });
  if (error) {
    console.error(`Batch ${i}: ERROR`, error.message);
    // Try one by one to find the failing ones
    for (const p of batch) {
      const { error: e2 } = await supabase
        .from('components')
        .upsert([p], { onConflict: 'name' });
      if (e2) {
        console.error(`  FAILED: ${p.name} (${p.type}) - ${e2.message}`);
        errors++;
      } else {
        success++;
      }
    }
  } else {
    success += batch.length;
    console.log(`Batch ${i}: ${batch.length} OK`);
  }
}

console.log(`\nDone! Success: ${success}, Errors: ${errors}, Total: ${allProducts.length}`);
