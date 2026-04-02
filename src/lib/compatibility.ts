// Compatibility checking for manual PC configurator
// Returns status + message for each compatibility check

export type CompatStatus = 'compatible' | 'warning' | 'incompatible';

export interface CompatResult {
  status: CompatStatus;
  message: string;
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
  if (!cpu.socket || !mobo.socket) return { status: 'warning', message: 'Socket non vérifié — vérifiez la compatibilité manuellement' };
  if (cpu.socket.toLowerCase() === mobo.socket.toLowerCase()) return { status: 'compatible', message: `Socket ${cpu.socket} compatible` };
  return { status: 'incompatible', message: `Incompatible : CPU socket ${cpu.socket} ≠ carte mère socket ${mobo.socket}` };
}

// RAM ↔ Motherboard: DDR generation from specs
export function checkRAMMotherboard(ram: DBComp, mobo: DBComp): CompatResult {
  const ramType = String(ram.specs?.['Type'] || ram.specs?.['type'] || '').toUpperCase();
  const moboSpecs = String(mobo.specs?.['RAM supportée'] || mobo.specs?.['DDR'] || mobo.specs?.['ram'] || '').toUpperCase();
  if (!ramType || !moboSpecs) return { status: 'warning', message: 'Compatibilité DDR non vérifiable — vérifiez manuellement' };
  const ramDDR = ramType.includes('DDR5') ? 'DDR5' : ramType.includes('DDR4') ? 'DDR4' : null;
  if (!ramDDR) return { status: 'warning', message: 'Type DDR non détecté dans la fiche' };
  if (moboSpecs.includes(ramDDR)) return { status: 'compatible', message: `${ramDDR} supportée par cette carte mère` };
  return { status: 'incompatible', message: `${ramDDR} non supportée par cette carte mère` };
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
  return { status: 'warning', message: 'TDP non vérifiable — vérifiez la compatibilité' };
}

// PSU: calculate required wattage
export function calcRequiredWatts(cpu: DBComp | null, gpu: DBComp | null): number {
  const cpuW = cpu?.tdp || 65;
  const gpuW = gpu?.tdp || 0;
  return Math.ceil((cpuW + gpuW + 80) * 1.2); // +80W system, +20% margin
}

export function checkPSU(psu: DBComp, cpu: DBComp | null, gpu: DBComp | null): CompatResult {
  const psuWatts = psu.tdp || parseInt(String(psu.specs?.['Puissance'] || psu.specs?.['Wattage'] || '0').replace(/\D/g, '')) || 0;
  if (!psuWatts) return { status: 'warning', message: 'Puissance non vérifiable — vérifiez manuellement' };
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
  if (!pcCase.form_factor || !mobo.form_factor) return { status: 'warning', message: 'Format non vérifiable — vérifiez la compatibilité' };
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
  return { status: 'warning', message: 'Compatibilité format non vérifiable' };
}
