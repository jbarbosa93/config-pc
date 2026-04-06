// Compatibility checking for manual PC configurator
// Returns status + message for each compatibility check

export type CompatStatus = 'compatible' | 'warning' | 'incompatible';

export interface CompatResult {
  status: CompatStatus;
  message: string;
  noData?: boolean; // true when warning is only due to missing spec data (not actual incompatibility)
}

// DBComponent shape (simplified — matches Supabase components table)
export interface DBComp {
  id: string;
  type: string;
  name: string;
  brand: string;
  price_ch: number;
  price_fr: number;
  socket: string | null;
  chipset: string | null;
  form_factor: string | null;
  tdp: number | null;
  specs: Record<string, unknown> | null;
  description: string;
  popularity_score: number;
}

// CPU ↔ Motherboard: socket must match exactly
export function checkCPUMotherboard(cpu: DBComp, mobo: DBComp): CompatResult {
  if (!cpu.socket || !mobo.socket) return { status: 'warning', message: 'Socket non vérifié — vérifiez la compatibilité manuellement', noData: true };
  if (cpu.socket.toLowerCase() === mobo.socket.toLowerCase()) return { status: 'compatible', message: `Socket ${cpu.socket} compatible` };
  return { status: 'incompatible', message: `Incompatible : CPU socket ${cpu.socket} ≠ carte mère socket ${mobo.socket}` };
}

// ── RAM helpers ──────────────────────────────────────────────────────────────

// DDR5-only chipsets (AM5 platform + Intel Z890/B860)
const DDR5_CHIPSETS = ['B650', 'B650E', 'X670', 'X670E', 'B850', 'X870', 'X870E', 'Z890', 'B860'];
// DDR4-only chipsets (AM4 platform + older Intel)
const DDR4_CHIPSETS = ['B550', 'X570', 'B450', 'X470', 'B350', 'X370', 'A320', 'B365', 'A520', 'X300'];

function getMotherboardDDR(mobo: DBComp): string | null {
  // 1. Board name often contains "DDR4" or "DDR5" explicitly (e.g. "B760 DDR4")
  const name = mobo.name.toUpperCase();
  if (name.includes('DDR5')) return 'DDR5';
  if (name.includes('DDR4')) return 'DDR4';

  // 2. Chipset column (dedicated, reliable)
  const chipset = (mobo.chipset || '').toUpperCase();
  if (DDR5_CHIPSETS.some(c => chipset.includes(c))) return 'DDR5';
  if (DDR4_CHIPSETS.some(c => chipset.includes(c))) return 'DDR4';

  // 3. Socket fallback — AM5 is always DDR5, AM4 always DDR4
  const socket = (mobo.socket || '').toUpperCase();
  if (socket === 'AM5') return 'DDR5';
  if (socket === 'AM4') return 'DDR4';

  return null; // ambiguous (e.g. Z690/Z790 without name hint)
}

function getRAMDDR(ram: DBComp): string | null {
  // 1. ddr_gen in specs — most reliable (e.g. "DDR4", "DDR5")
  const ddrGen = String(ram.specs?.ddr_gen || '').toUpperCase();
  if (ddrGen.startsWith('DDR')) return ddrGen;

  // 2. speed field (e.g. "DDR5-6000")
  const speed = String(ram.specs?.speed || '').toUpperCase();
  if (speed.includes('DDR5')) return 'DDR5';
  if (speed.includes('DDR4')) return 'DDR4';
  if (speed.includes('DDR3')) return 'DDR3';

  // 3. Name fallback
  const name = ram.name.toUpperCase();
  if (name.includes('DDR5')) return 'DDR5';
  if (name.includes('DDR4')) return 'DDR4';
  if (name.includes('DDR3')) return 'DDR3';

  return null;
}

// RAM ↔ Motherboard: DDR generation + frequency check
export function checkRAMMotherboard(ram: DBComp, mobo: DBComp): CompatResult {
  const mbDDR = getMotherboardDDR(mobo);
  const ramDDR = getRAMDDR(ram);

  // Not enough data → no badge
  if (!mbDDR || !ramDDR) {
    return { status: 'warning', message: 'Compatibilité DDR non vérifiable — vérifiez manuellement', noData: true };
  }

  // Incompatible generation
  if (mbDDR !== ramDDR) {
    return {
      status: 'incompatible',
      message: `Cette RAM est ${ramDDR} mais votre carte mère ${mobo.name} nécessite de la ${mbDDR}`,
    };
  }

  // Compatible — optionally check frequency
  const ramFreq = Number(ram.specs?.frequency_mhz || 0);
  const moboMaxFreq = Number(mobo.specs?.memory_max_mhz || mobo.specs?.max_frequency_mhz || 0);
  if (ramFreq && moboMaxFreq && ramFreq > moboMaxFreq) {
    return {
      status: 'warning',
      message: `${ramFreq} MHz — sera bridée à ${moboMaxFreq} MHz par votre carte mère`,
    };
  }

  return {
    status: 'compatible',
    message: `${ramDDR} compatible avec votre carte mère`,
  };
}

// Cooler ↔ CPU: TDP check (socket data not in DB for coolers)
export function checkCoolerCPU(cooler: DBComp, cpu: DBComp): CompatResult {
  // DB has tdp column + specs.tdp_max_w — no socket data for coolers
  const coolerTDP = cooler.tdp || Number(cooler.specs?.tdp_max_w || 0) || null;
  const cpuTDP = cpu.tdp || null;

  if (!coolerTDP || !cpuTDP) {
    return { status: 'warning', message: 'TDP non vérifiable — vérifiez la compatibilité', noData: true };
  }

  if (coolerTDP >= cpuTDP) {
    return { status: 'compatible', message: `${coolerTDP}W suffisant pour votre CPU (${cpuTDP}W TDP)` };
  }
  if (coolerTDP >= Math.round(cpuTDP * 0.85)) {
    return { status: 'warning', message: `Limite — CPU ${cpuTDP}W TDP, ce ventirad supporte ${coolerTDP}W` };
  }
  return { status: 'incompatible', message: `Insuffisant — CPU ${cpuTDP}W TDP mais ventirad max ${coolerTDP}W` };
}

// PSU: calculate required wattage
export function calcRequiredWatts(cpu: DBComp | null, gpu: DBComp | null): number {
  const cpuW = cpu?.tdp || 65;
  const gpuW = gpu?.tdp || 0;
  return Math.ceil((cpuW + gpuW + 80) * 1.2); // +80W system, +20% margin
}

export function checkPSU(psu: DBComp, cpu: DBComp | null, gpu: DBComp | null): CompatResult {
  const psuWatts = psu.tdp || parseInt(String(psu.specs?.['Puissance'] || psu.specs?.['Wattage'] || '0').replace(/\D/g, '')) || 0;
  if (!psuWatts) return { status: 'warning', message: 'Puissance non vérifiable — vérifiez manuellement', noData: true };
  const required = calcRequiredWatts(cpu, gpu);
  if (psuWatts >= required + 100) return { status: 'compatible', message: `${psuWatts}W suffisant (${required}W requis)` };
  if (psuWatts >= required) return { status: 'warning', message: `${psuWatts}W juste suffisant — prévoir plus de marge` };
  return { status: 'incompatible', message: `${psuWatts}W insuffisant — minimum ${required}W requis` };
}

// ── Case helpers ─────────────────────────────────────────────────────────────

/** Normalize mobo form_factor string to one of: ATX | mATX | ITX | E-ATX */
function normalizeMoboFormat(mobo: DBComp): string | null {
  const raw = (mobo.form_factor || String(mobo.specs?.form_factor || '')).toLowerCase().replace(/[-\s]/g, '');
  if (raw.includes('mini') || raw === 'itx') return 'ITX';
  if (raw.includes('micro') || raw === 'matx') return 'mATX';
  if (raw.includes('eatx') || raw.includes('extended')) return 'E-ATX';
  if (raw.includes('atx')) return 'ATX';
  return null;
}

// Case ↔ Motherboard: use DB's supported_mb_formats array when available
export function checkCaseMotherboard(pcCase: DBComp, mobo: DBComp): CompatResult {
  const moboFmt = normalizeMoboFormat(mobo);

  // DB stores supported_mb_formats directly (e.g. ["ATX","mATX","ITX"])
  const supportedFormats = pcCase.specs?.supported_mb_formats;
  if (Array.isArray(supportedFormats) && supportedFormats.length > 0) {
    if (!moboFmt) return { status: 'warning', message: 'Format carte mère non détecté — vérifiez manuellement', noData: true };
    if (supportedFormats.includes(moboFmt)) {
      return { status: 'compatible', message: `${moboFmt} supporté par ce boîtier` };
    }
    return {
      status: 'incompatible',
      message: `Format ${moboFmt} non supporté — ce boîtier accepte : ${supportedFormats.join(', ')}`,
    };
  }

  // Fallback: infer from form_factor string
  if (!pcCase.form_factor || !moboFmt) {
    return { status: 'warning', message: 'Format non vérifiable — vérifiez la compatibilité', noData: true };
  }
  const caseFmt = pcCase.form_factor.toLowerCase();
  const fallbackCompat: Record<string, string[]> = {
    'full': ['ITX', 'mATX', 'ATX', 'E-ATX'],
    'mid':  ['ITX', 'mATX', 'ATX'],
    'mini': ['ITX'],
    'micro': ['ITX', 'mATX'],
  };
  for (const [key, supported] of Object.entries(fallbackCompat)) {
    if (caseFmt.includes(key)) {
      return supported.includes(moboFmt)
        ? { status: 'compatible', message: `${moboFmt} compatible avec ce boîtier` }
        : { status: 'incompatible', message: `Format ${moboFmt} trop grand pour ce boîtier` };
    }
  }
  return { status: 'warning', message: 'Compatibilité format non vérifiable', noData: true };
}
