import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

async function searchGalaxusImage(productName) {
  const q = encodeURIComponent(productName);
  try {
    const res = await fetch(`https://www.galaxus.ch/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `query SEARCH($q: String!) { search(searchTerm: $q, offset: 0, limit: 1) { products { id title imageUrl } } }`,
        variables: { q: productName }
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const product = data?.data?.search?.products?.[0];
    if (product?.imageUrl) return product.imageUrl;
  } catch {}

  // Fallback: fetch search page and extract image
  try {
    const res = await fetch(`https://www.galaxus.ch/fr/s1/search?q=${q}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const match = html.match(/https:\/\/static01\.galaxus\.com\/productimages\/[^"'\s<>]+\.(?:jpg|jpeg|png)[^"'\s<>]*/i);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

async function run() {
  // Get all components with their images
  const { data: components, error } = await supabase
    .from('components')
    .select('id, name, type, component_images(id, url)')
    .eq('active', true)
    .order('popularity_score', { ascending: false })
    .limit(500);

  if (error) { console.error('Error:', error.message); return; }

  // Filter: products whose images are NOT from Galaxus
  const toFix = [];
  for (const c of components) {
    const img = c.component_images?.[0];
    if (img && !img.url.includes('galaxus') && !img.url.includes('static01')) {
      toFix.push({ compId: c.id, imgId: img.id, name: c.name, type: c.type });
    } else if (!img) {
      toFix.push({ compId: c.id, imgId: null, name: c.name, type: c.type });
    }
  }

  console.log(`Products needing real images: ${toFix.length}`);

  let ok = 0, fail = 0;
  for (let i = 0; i < toFix.length; i++) {
    const item = toFix[i];
    const imgUrl = await searchGalaxusImage(item.name);

    if (imgUrl) {
      if (item.imgId) {
        // Update existing image
        const { error: e } = await supabase
          .from('component_images')
          .update({ url: imgUrl })
          .eq('id', item.imgId);
        if (!e) ok++;
        else { fail++; console.error(`  Update fail: ${item.name}`); }
      } else {
        // Insert new image
        const { error: e } = await supabase
          .from('component_images')
          .insert({ component_id: item.compId, url: imgUrl, is_primary: true, alt_text: item.name, order_index: 0 });
        if (!e) ok++;
        else { fail++; console.error(`  Insert fail: ${item.name}`); }
      }
    } else {
      fail++;
    }

    if (i % 10 === 0) console.log(`  Progress: ${i}/${toFix.length} (OK:${ok} FAIL:${fail})`);

    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone! OK: ${ok}, FAIL: ${fail}, Total: ${toFix.length}`);
}

run();
