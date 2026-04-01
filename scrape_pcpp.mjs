/**
 * Scrape PCPartPicker specs pages and generate Supabase seed data.
 * Uses server-side fetch with JSDOM to parse HTML tables.
 */
import { JSDOM } from 'jsdom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

const USD_TO_CHF = 0.88; // approximate

const CATEGORIES = [
  { url: 'https://pcpartpicker.com/products/cpu/specs/', type: 'CPU', extract: extractCPUs },
  { url: 'https://pcpartpicker.com/products/video-card/specs/', type: 'GPU', extract: extractGPUs },
  { url: 'https://pcpartpicker.com/products/memory/specs/', type: 'RAM', extract: extractRAM },
  { url: 'https://pcpartpicker.com/products/internal-hard-drive/specs/', type: 'Stockage', extract: extractStorage },
  { url: 'https://pcpartpicker.com/products/motherboard/specs/', type: 'Carte mère', extract: extractMobos },
  { url: 'https://pcpartpicker.com/products/power-supply/specs/', type: 'Alimentation', extract: extractPSUs },
  { url: 'https://pcpartpicker.com/products/case/specs/', type: 'Boîtier', extract: extractCases },
  { url: 'https://pcpartpicker.com/products/cpu-cooler/specs/', type: 'Refroidissement', extract: extractCoolers },
  { url: 'https://pcpartpicker.com/products/monitor/specs/', type: 'Moniteur', extract: extractMonitors },
];

async function fetchPage(url) {
  console.log(`  Fetching ${url}...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function getRows(doc) {
  return Array.from(doc.querySelectorAll('tr')).slice(1); // skip header
}

function getName(row) {
  const nameEl = row.querySelectorAll('td')[1]?.querySelector('a');
  return nameEl?.textContent?.trim()?.replace(/\s+\(\d+\)/, '').trim() || '';
}

function getCell(row, idx) {
  const cell = row.querySelectorAll('td')[idx];
  if (!cell) return '';
  // Remove field label prefix
  let text = cell.textContent.trim();
  text = text.replace(/^(Socket.*?CPU|Form Factor|Type|Chipset|Memory|Core Clock|Boost Clock|Microarchitecture|Performance Core Clock|Performance Core Boost Clock|TDP|Integrated Graphics|Speed|Modules|Price.*?GB|Color|First Word Latency|CAS Latency|Capacity|Cache|Interface|Efficiency Rating|Wattage|Length|Modular|Side Panel|Internal.*?Bays|Fan RPM|Noise Level|Radiator Size|Screen Size|Resolution|Refresh Rate|Response Time.*|Panel Type|Aspect Ratio|Memory Max|Memory Slots)/i, '').trim();
  return text;
}

function getPrice(row) {
  const cells = row.querySelectorAll('td');
  for (let i = cells.length - 1; i >= 0; i--) {
    const m = cells[i]?.textContent?.match(/\$([\d,.]+)/);
    if (m) return parseFloat(m[1].replace(',', ''));
  }
  return 0;
}

function toChf(usd) { return Math.round(usd * USD_TO_CHF); }

function extractCPUs(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const cores = getCell(row, 2).replace(/\D/g, '');
    const baseClock = getCell(row, 3);
    const boostClock = getCell(row, 4);
    const arch = getCell(row, 5);
    const tdp = parseInt(getCell(row, 6)) || 65;
    const priceUsd = getPrice(row);

    let socket = 'AM5';
    if (arch.match(/Zen [23+]/)) socket = 'AM4';
    if (name.includes('Intel')) {
      if (name.includes('Ultra')) socket = 'LGA1851';
      else socket = 'LGA1700';
    }
    if (name.includes('Threadripper')) socket = 'sTRX4';

    const brand = name.includes('AMD') ? 'AMD' : 'Intel';
    return {
      type: 'CPU', name, brand,
      description: `${name} - ${cores} cœurs, ${boostClock} boost, architecture ${arch}`,
      specs: { Socket: socket, 'Cœurs': cores, 'Fréquence de base': baseClock, 'Fréquence boost': boostClock, Architecture: arch, TDP: tdp + 'W' },
      price_ch: toChf(priceUsd), price_fr: 0, tdp,
      socket, release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractGPUs(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const chipset = getCell(row, 2);
    const memory = getCell(row, 3);
    const coreClock = getCell(row, 4);
    const boostClock = getCell(row, 5);
    const length = getCell(row, 7);
    const priceUsd = getPrice(row);

    let brand = name.split(' ')[0];
    let gpuBrand = 'NVIDIA';
    if (chipset.includes('Radeon')) gpuBrand = 'AMD';
    if (chipset.includes('Arc')) gpuBrand = 'Intel';

    const tdpMap = { '5090': 575, '5080': 360, '5070 Ti': 300, '5070': 250, '5060 Ti': 180, '5060': 150, '5050': 130,
      '4090': 450, '4080': 320, '4070 Ti': 285, '4070 S': 220, '4070': 200, '4060 Ti': 160, '4060': 115,
      '3060': 170, '3050': 130, '3070': 220,
      '9070 XT': 300, '9070': 250, '9060 XT': 200, '7900 XTX': 355, '7900 XT': 315, '7800 XT': 263, '7700 XT': 245, '7600': 165,
      'B580': 150, 'A750': 225, 'A380': 75 };
    let tdp = 200;
    for (const [k, v] of Object.entries(tdpMap)) { if (chipset.includes(k)) { tdp = v; break; } }

    return {
      type: 'GPU', name: `${brand} ${name !== brand ? '' : ''}${chipset} ${name.replace(brand, '').trim()}`.replace(/\s+/g, ' ').trim(),
      brand,
      description: `${name} - ${chipset}, ${memory} VRAM, ${boostClock} MHz boost`,
      specs: { Chipset: chipset, VRAM: memory, 'Core Clock': coreClock + ' MHz', 'Boost Clock': boostClock + ' MHz', Longueur: length + ' mm' },
      price_ch: toChf(priceUsd), price_fr: 0, tdp,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractRAM(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const speed = getCell(row, 2);
    const modules = getCell(row, 3);
    const cas = getCell(row, 7) || getCell(row, 6);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];
    const isDDR5 = speed.includes('DDR5');

    return {
      type: 'RAM', name, brand,
      description: `${name} - ${speed}, ${modules}, CL${cas}`,
      specs: { Type: isDDR5 ? 'DDR5' : 'DDR4', Fréquence: speed, Modules: modules, 'Latence CL': cas },
      price_ch: toChf(priceUsd), price_fr: 0,
      release_year: isDDR5 ? 2023 : 2021, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractStorage(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const capacity = getCell(row, 2);
    const type = getCell(row, 4);
    const formFactor = getCell(row, 6);
    const iface = getCell(row, 7);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];

    return {
      type: 'Stockage', name: `${name} ${capacity}`, brand,
      description: `${name} ${capacity} - ${formFactor}, ${iface}`,
      specs: { Capacité: capacity, Type: type, 'Form Factor': formFactor, Interface: iface },
      price_ch: toChf(priceUsd), price_fr: 0,
      form_factor: formFactor,
      release_year: 2023, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractMobos(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const socket = getCell(row, 2);
    const formFactor = getCell(row, 3);
    const maxRam = getCell(row, 4);
    const ramSlots = getCell(row, 5);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];

    // Determine chipset from name
    let chipset = '';
    const chipsetMatch = name.match(/(B[5678]\d\d|X[5678]\d\d|Z[5789]\d\d|A[56]\d\d|H[5678]\d\d)/i);
    if (chipsetMatch) chipset = chipsetMatch[1].toUpperCase();

    return {
      type: 'Carte mère', name, brand,
      description: `${name} - Socket ${socket}, ${formFactor}, ${maxRam} RAM max`,
      specs: { Socket: socket, Chipset: chipset, Format: formFactor, 'RAM max': maxRam, 'Slots RAM': ramSlots },
      price_ch: toChf(priceUsd), price_fr: 0,
      socket, chipset, form_factor: formFactor,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractPSUs(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const formFactor = getCell(row, 2);
    const efficiency = getCell(row, 3);
    const wattage = parseInt(getCell(row, 4)) || 750;
    const modular = getCell(row, 6);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];

    return {
      type: 'Alimentation', name, brand,
      description: `${name} - ${wattage}W, ${efficiency}, ${modular}`,
      specs: { Puissance: wattage + 'W', Certification: efficiency, Modularité: modular, Format: formFactor },
      price_ch: toChf(priceUsd), price_fr: 0, tdp: wattage,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractCases(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const type = getCell(row, 2);
    const color = getCell(row, 3);
    const sidePanel = getCell(row, 4);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];

    return {
      type: 'Boîtier', name, brand,
      description: `${name} - ${type}, panneau ${sidePanel}`,
      specs: { Format: type, Couleur: color, 'Panneau latéral': sidePanel },
      price_ch: toChf(priceUsd), price_fr: 0,
      form_factor: type,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractCoolers(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const rpm = getCell(row, 2);
    const noise = getCell(row, 3);
    const radSize = getCell(row, 5);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];
    const isAIO = radSize && radSize.match(/\d+/);

    return {
      type: 'Refroidissement', name, brand,
      description: `${name} - ${isAIO ? 'AIO ' + radSize + 'mm' : 'Aircooler'}, ${noise}`,
      specs: { Type: isAIO ? 'AIO' : 'Aircooler', 'Ventilateur RPM': rpm, 'Niveau sonore': noise, 'Taille radiateur': radSize || 'N/A' },
      price_ch: toChf(priceUsd), price_fr: 0,
      tdp: isAIO ? 350 : 200,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

function extractMonitors(doc) {
  return getRows(doc).map(row => {
    const name = getName(row);
    if (!name) return null;
    const size = getCell(row, 2);
    const resolution = getCell(row, 3);
    const refreshRate = getCell(row, 4);
    const responseTime = getCell(row, 5);
    const panelType = getCell(row, 6);
    const aspectRatio = getCell(row, 7);
    const priceUsd = getPrice(row);
    const brand = name.split(' ')[0];

    return {
      type: 'Moniteur', name, brand,
      description: `${name} - ${size}", ${resolution}, ${refreshRate}, ${panelType}`,
      specs: { Taille: size + '"', Résolution: resolution, 'Taux de rafraîchissement': refreshRate, 'Temps de réponse': responseTime, Dalle: panelType, 'Ratio': aspectRatio },
      price_ch: toChf(priceUsd), price_fr: 0,
      release_year: 2024, popularity_score: Math.min(99, Math.round(70 + Math.random() * 25)),
      available_ch: true, active: true,
    };
  }).filter(Boolean);
}

async function run() {
  let allProducts = [];

  for (const cat of CATEGORIES) {
    try {
      console.log(`\n== ${cat.type} ==`);
      const html = await fetchPage(cat.url);
      const dom = new JSDOM(html);
      const products = cat.extract(dom.window.document);
      console.log(`  Extracted: ${products.length} products`);
      allProducts.push(...products);
    } catch (err) {
      console.error(`  ERROR for ${cat.type}: ${err.message}`);
    }
  }

  console.log(`\n== TOTAL: ${allProducts.length} products ==`);

  // Filter out products with price 0 or that we already have
  const { data: existing } = await supabase.from('components').select('name');
  const existingNames = new Set((existing || []).map(e => e.name.toLowerCase()));

  const newProducts = allProducts.filter(p => {
    if (p.price_ch <= 0) return false;
    if (existingNames.has(p.name.toLowerCase())) return false;
    return true;
  });

  console.log(`New products (not already in DB): ${newProducts.length}`);

  if (newProducts.length === 0) {
    console.log('Nothing new to insert.');
    return;
  }

  // Insert in batches
  let success = 0, errors = 0;
  const BATCH = 20;
  for (let i = 0; i < newProducts.length; i += BATCH) {
    const batch = newProducts.slice(i, i + BATCH);
    const { error } = await supabase.from('components').upsert(batch, { onConflict: 'name' });
    if (error) {
      // Try one by one
      for (const p of batch) {
        const { error: e2 } = await supabase.from('components').upsert([p], { onConflict: 'name' });
        if (e2) { console.error(`  FAILED: ${p.name} - ${e2.message}`); errors++; }
        else success++;
      }
    } else {
      success += batch.length;
      console.log(`Batch ${i}: ${batch.length} OK`);
    }
  }

  console.log(`\nDone! Inserted: ${success}, Errors: ${errors}`);
}

run();
