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

// Cooler ↔ CPU: socket + TDP check
export function checkCoolerCPU(cooler: DBComp, cpu: DBComp): CompatResult {
  const coolerSockets = String(cooler.specs?.['Sockets'] || cooler.specs?.['Socket'] || cooler.socket || '').toUpperCase();
  const cpuSocket = (cpu.socket || '').toUpperCase();
  const socketOk = !coolerSockets || !cpuSocket || coolerSockets.includes(cpuSocket);

  if (!socketOk) return { status: 'incompatible', message: `Ce ventirad ne supporte pas le socket ${cpu.socket}` };

  if (cpu.tdp && cooler.tdp) {
    if (cooler.tdp >= cpu.tdp) return { status: 'compatible', message: `TDP OK : ventirad ${cooler.tdp}W ≥ CPU ${cpu.tdp}W` };
    return { status: 'warning', message: `TDP insuffisant : ventirad ${cooler.tdp}W < CPU ${cpu.tdp}W — peut chauffer` };
  }
  return { status: 'warning', message: 'TDP non vérifiable — vérifiez la compatibilité', noData: true };
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

// Case ↔ Motherboard: form factor
const CASE_COMPAT: Record<string, string[]> = {
  'full tower': ['ATX', 'E-ATX', 'mATX', 'Micro-ATX', 'ITX', 'Mini-ITX'],
  'mid tower': ['ATX', 'mATX', 'Micro-ATX', 'ITX', 'Mini-ITX'],
  'mini tower': ['mATX', 'Micro-ATX', 'ITX', 'Mini-ITX'],
  'matx': ['mATX', 'Micro-ATX', 'ITX', 'Mini-ITX'],
  'itx': ['ITX', 'Mini-ITX'],
};

export function checkCaseMotherboard(pcCase: DBComp, mobo: DBComp): CompatResult {
  if (!pcCase.form_factor || !mobo.form_factor) return { status: 'warning', message: 'Format non vérifiable — vérifiez la compatibilité', noData: true };
  const caseFmt = pcCase.form_factor.toLowerCase();
  const moboFmt = mobo.form_factor;
  for (const [caseKey, supported] of Object.entries(CASE_COMPAT)) {
    if (caseFmt.includes(caseKey)) {
      if (supported.some(s => moboFmt.toLowerCase().includes(s.toLowerCase()))) {
        return { status: 'compatible', message: `Format ${moboFmt} compatible avec ce boîtier` };
      }
      return { status: 'incompatible', message: `Format ${moboFmt} trop grand pour ce boîtier` };
    }
  }
  return { status: 'warning', message: 'Compatibilité format non vérifiable', noData: true };
}
