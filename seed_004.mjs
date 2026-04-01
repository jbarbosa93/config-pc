import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://gxremrjbwtnmiiiujjem.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const sql = readFileSync('/Users/joaobarbosa/Dev/pc-advisor/supabase/migrations/004_seed_peripherals_and_more.sql', 'utf-8');

// Extract all VALUES blocks from INSERT statements
const insertBlocks = sql.split(/INSERT INTO components[^V]+VALUES\s*/i);
insertBlocks.shift(); // remove text before first INSERT

const columns = ['type', 'name', 'brand', 'description', 'specs', 'price_ch', 'price_fr', 'socket', 'chipset', 'form_factor', 'tdp', 'release_year', 'manufacturer_url', 'popularity_score', 'available_ch', 'active'];

const allRows = [];

for (const block of insertBlocks) {
  // Get everything before ON CONFLICT
  const valuesText = block.split(/ON\s+CONFLICT/i)[0].trim();

  // Parse individual row tuples - match balanced parentheses containing the values
  // Each row starts with ('TYPE', and ends with true/false)
  const rowRegex = /\(\s*'([^']*?)'\s*,\s*'((?:[^'\\]|''|\\.)*)'\s*,\s*'((?:[^'\\]|''|\\.)*)'\s*,\s*'((?:[^'\\]|''|\\.)*)'\s*,\s*'(\{[^']*\})'\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(NULL|'[^']*')\s*,\s*(NULL|'[^']*')\s*,\s*(NULL|'[^']*')\s*,\s*(NULL|\d+)\s*,\s*(NULL|\d+)\s*,\s*(NULL|'[^']*')\s*,\s*(\d+)\s*,\s*(true|false)\s*,\s*(true|false)\s*\)/gi;

  let match;
  while ((match = rowRegex.exec(valuesText)) !== null) {
    const parseVal = (v, isNum = false, isBool = false) => {
      if (v === 'NULL' || v === null) return null;
      if (isBool) return v === 'true';
      if (isNum) return v === 'NULL' ? null : Number(v);
      // Remove surrounding quotes
      if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
      return v;
    };

    const row = {
      type: match[1],
      name: match[2].replace(/''/g, "'"),
      brand: match[3].replace(/''/g, "'"),
      description: match[4].replace(/''/g, "'"),
      specs: JSON.parse(match[5]),
      price_ch: Number(match[6]),
      price_fr: Number(match[7]),
      socket: parseVal(match[8]),
      chipset: parseVal(match[9]),
      form_factor: parseVal(match[10]),
      tdp: parseVal(match[11], true),
      release_year: parseVal(match[12], true),
      manufacturer_url: parseVal(match[13]),
      popularity_score: Number(match[14]),
      available_ch: match[15] === 'true',
      active: match[16] === 'true',
    };
    allRows.push(row);
  }
}

console.log(`Parsed ${allRows.length} rows from SQL file`);

// Upsert in batches of 50
let successCount = 0;
let errorCount = 0;
const batchSize = 50;

for (let i = 0; i < allRows.length; i += batchSize) {
  const batch = allRows.slice(i, i + batchSize);
  const { data, error } = await supabase
    .from('components')
    .upsert(batch, { onConflict: 'name' })
    .select('name');

  if (error) {
    console.error(`Error upserting batch ${i / batchSize + 1}:`, error.message);
    errorCount += batch.length;
  } else {
    successCount += data.length;
    console.log(`Batch ${Math.floor(i / batchSize) + 1}: upserted ${data.length} rows`);
  }
}

console.log(`\nDone! Successfully upserted: ${successCount}, Errors: ${errorCount}, Total parsed: ${allRows.length}`);
