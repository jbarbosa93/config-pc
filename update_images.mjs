import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

// Read data file: each line is "imgId url"
const lines = readFileSync('image_data.txt', 'utf8').trim().split('\n').filter(Boolean);
console.log(`Loaded ${lines.length} image updates`);

let ok = 0, fail = 0;
for (const line of lines) {
  const spaceIdx = line.indexOf(' ');
  const imgId = line.substring(0, spaceIdx);
  const url = line.substring(spaceIdx + 1);

  const { error } = await supabase
    .from('component_images')
    .update({ url })
    .eq('id', imgId);

  if (error) { fail++; console.error(`FAIL ${imgId}: ${error.message}`); }
  else ok++;

  if ((ok + fail) % 20 === 0) console.log(`Progress: ${ok + fail}/${lines.length} OK:${ok} FAIL:${fail}`);
}

console.log(`\nDone! OK: ${ok}, FAIL: ${fail}, Total: ${lines.length}`);
