"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart } from "@/lib/cart";
import type { Component } from "@/lib/types";
import {
  checkCPUMotherboard,
  checkRAMMotherboard,
  checkCoolerCPU,
  checkPSU,
  checkCaseMotherboard,
  calcRequiredWatts,
  type DBComp,
  type CompatResult,
} from "@/lib/compatibility";

/* ─── Types ─── */

interface DBCompWithImages extends DBComp {
  component_images?: { url: string; is_primary: boolean }[];
}

type StepId = 'mobo' | 'cpu' | 'ram' | 'gpu' | 'storage' | 'cooler' | 'psu' | 'case';

interface StepConfig {
  id: StepId;
  type: string;
  label: string;
  icon: string;
  desc: string;
}

type Build = Partial<Record<StepId, DBCompWithImages>>;

/* ─── Steps config ─── */

const STEPS: StepConfig[] = [
  { id: 'mobo',    type: 'Carte mère',     label: 'Carte mère',       icon: '🔧', desc: 'Détermine le socket et le format — point de départ de toute config' },
  { id: 'cpu',     type: 'CPU',            label: 'Processeur',       icon: '⚡', desc: 'Filtré par socket de la carte mère choisie' },
  { id: 'ram',     type: 'RAM',            label: 'Mémoire RAM',      icon: '📊', desc: 'DDR4 ou DDR5 selon la carte mère' },
  { id: 'gpu',     type: 'GPU',            label: 'Carte graphique',  icon: '🎮', desc: 'Vérification alimentation recommandée' },
  { id: 'storage', type: 'Stockage',       label: 'Stockage',         icon: '💾', desc: 'SSD M.2 ou SATA' },
  { id: 'cooler',  type: 'Refroidissement',label: 'Refroidissement',  icon: '❄️', desc: 'Filtré par socket CPU' },
  { id: 'psu',     type: 'Alimentation',   label: 'Alimentation',     icon: '🔌', desc: 'Calculé selon CPU + GPU TDP' },
  { id: 'case',    type: 'Boîtier',        label: 'Boîtier',          icon: '🖥️', desc: 'Filtré par format carte mère' },
];

/* ─── SVG Icons per component type ─── */

function ComponentIcon({ type, size = 40 }: { type: string; size?: number }) {
  const s = size;
  const t = type.toLowerCase();

  if (t.includes('carte mère') || t.includes('mobo') || t.includes('motherboard')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="3" stroke="#4f8ef7" strokeWidth="2" fill="#EEF3FE"/>
        <rect x="8" y="8" width="10" height="10" rx="1.5" fill="#4f8ef7" opacity="0.7"/>
        <rect x="22" y="8" width="6" height="6" rx="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="22" y="17" width="6" height="3" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="8" y="22" width="24" height="2" rx="1" fill="#4f8ef7" opacity="0.3"/>
        <rect x="8" y="27" width="24" height="2" rx="1" fill="#4f8ef7" opacity="0.3"/>
        <circle cx="32" cy="32" r="2" fill="#4f8ef7" opacity="0.6"/>
        <circle cx="8" cy="32" r="2" fill="#4f8ef7" opacity="0.6"/>
      </svg>
    );
  }
  if (t.includes('cpu') || t.includes('processeur')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="10" y="10" width="20" height="20" rx="3" fill="#131929" stroke="#4f8ef7" strokeWidth="1.5"/>
        <rect x="14" y="14" width="12" height="12" rx="2" fill="#4f8ef7" opacity="0.8"/>
        <rect x="17" y="17" width="6" height="6" rx="1" fill="white"/>
        {[13,20,27].map(p => <rect key={`t${p}`} x={p} y={5} width="2.5" height="5" rx="1.2" fill="#4f8ef7"/>)}
        {[13,20,27].map(p => <rect key={`b${p}`} x={p} y={30} width="2.5" height="5" rx="1.2" fill="#4f8ef7"/>)}
        {[13,20,27].map(p => <rect key={`l${p}`} x={5} y={p} width="5" height="2.5" rx="1.2" fill="#4f8ef7"/>)}
        {[13,20,27].map(p => <rect key={`r${p}`} x={30} y={p} width="5" height="2.5" rx="1.2" fill="#4f8ef7"/>)}
      </svg>
    );
  }
  if (t.includes('ram') || t.includes('mémoire')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="5" y="12" width="30" height="16" rx="2" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
        {[9,13,17,21,25,29].map(x => <rect key={x} x={x} y="15" width="3" height="10" rx="1" fill="#4f8ef7" opacity="0.6"/>)}
        <rect x="5" y="24" width="30" height="4" rx="1" fill="#4f8ef7" opacity="0.15"/>
        <rect x="14" y="28" width="4" height="5" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="22" y="28" width="4" height="5" rx="1" fill="#4f8ef7" opacity="0.4"/>
      </svg>
    );
  }
  if (t.includes('gpu') || t.includes('graphique')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="3" y="10" width="34" height="20" rx="3" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
        <circle cx="14" cy="20" r="6" fill="#4f8ef7" opacity="0.7"/>
        <circle cx="14" cy="20" r="3" fill="white"/>
        <rect x="22" y="15" width="10" height="3" rx="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="22" y="20" width="10" height="3" rx="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="22" y="25" width="7" height="2" rx="1" fill="#4f8ef7" opacity="0.3"/>
        <rect x="8" y="30" width="4" height="5" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="15" y="30" width="4" height="5" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="22" y="30" width="4" height="5" rx="1" fill="#4f8ef7" opacity="0.4"/>
      </svg>
    );
  }
  if (t.includes('stockage') || t.includes('ssd') || t.includes('hdd')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="5" y="10" width="30" height="20" rx="3" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
        <circle cx="12" cy="20" r="5" stroke="#4f8ef7" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="20" r="2" fill="#4f8ef7" opacity="0.5"/>
        <rect x="20" y="14" width="11" height="2" rx="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="20" y="19" width="11" height="2" rx="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="20" y="24" width="7" height="2" rx="1" fill="#4f8ef7" opacity="0.3"/>
      </svg>
    );
  }
  if (t.includes('refroid') || t.includes('cooler') || t.includes('ventirad')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#4f8ef7" strokeWidth="1.5" fill="#EEF3FE"/>
        <circle cx="20" cy="20" r="4" fill="#4f8ef7" opacity="0.7"/>
        <path d="M20 6 C22 10 24 14 20 16 C16 14 18 10 20 6Z" fill="#4f8ef7" opacity="0.5"/>
        <path d="M20 34 C18 30 16 26 20 24 C24 26 22 30 20 34Z" fill="#4f8ef7" opacity="0.5"/>
        <path d="M6 20 C10 18 14 16 16 20 C14 24 10 22 6 20Z" fill="#4f8ef7" opacity="0.5"/>
        <path d="M34 20 C30 22 26 24 24 20 C26 16 30 18 34 20Z" fill="#4f8ef7" opacity="0.5"/>
      </svg>
    );
  }
  if (t.includes('alimentation') || t.includes('psu')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="5" y="8" width="30" height="24" rx="3" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
        <rect x="9" y="12" width="10" height="8" rx="2" fill="#4f8ef7" opacity="0.5"/>
        <path d="M22 14 L27 20 L23 20 L23 26 L18 20 L22 20 Z" fill="#4f8ef7" opacity="0.7"/>
        <rect x="9" y="23" width="5" height="2" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="16" y="23" width="3" height="2" rx="1" fill="#4f8ef7" opacity="0.4"/>
      </svg>
    );
  }
  if (t.includes('boîtier') || t.includes('case') || t.includes('tower')) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="8" y="4" width="20" height="32" rx="3" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
        <rect x="11" y="8" width="8" height="8" rx="1.5" fill="#4f8ef7" opacity="0.5"/>
        <circle cx="15" cy="22" r="3" stroke="#4f8ef7" strokeWidth="1.5" fill="none"/>
        <circle cx="15" cy="22" r="1" fill="#4f8ef7" opacity="0.5"/>
        <rect x="11" y="28" width="12" height="2" rx="1" fill="#4f8ef7" opacity="0.3"/>
        <rect x="28" y="10" width="4" height="2" rx="1" fill="#4f8ef7" opacity="0.4"/>
        <rect x="28" y="14" width="4" height="2" rx="1" fill="#4f8ef7" opacity="0.4"/>
      </svg>
    );
  }
  // Default
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="30" height="30" rx="5" fill="#EEF3FE" stroke="#4f8ef7" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="8" fill="#4f8ef7" opacity="0.3"/>
    </svg>
  );
}

/* ─── Compatibility badge ─── */

function CompatBadge({ result }: { result: CompatResult }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const config = {
    compatible:   { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', icon: '✅', label: 'Compatible' },
    warning:      { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: '⚠️', label: 'Attention' },
    incompatible: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '❌', label: 'Incompatible' },
  }[result.status];

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-help"
        style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
      >
        {config.icon} {config.label}
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg shadow-lg p-2 text-xs"
            style={{ background: '#1a1a2e', color: '#e0e0e0', border: '1px solid #333' }}
          >
            {result.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Key specs extraction ─── */

function getKeySpecs(comp: DBCompWithImages): string[] {
  const specs: string[] = [];
  if (!comp.specs) return specs;
  const s = comp.specs;

  // Priority keys per type
  const priorityKeys = [
    'Fréquence', 'Cores', 'Capacité', 'Type', 'Vitesse', 'Format', 'Socket',
    'TDP', 'Puissance', 'Wattage', 'Chipset', 'Interface', 'Vitesse de rotation',
    'Mémoire', 'VRAM', 'Fréquence de base', 'Nombre de coeurs',
  ];

  for (const key of priorityKeys) {
    const val = s[key];
    if (val && specs.length < 3) specs.push(String(val));
  }

  if (specs.length < 3) {
    for (const [, val] of Object.entries(s)) {
      if (specs.length >= 3) break;
      const v = String(val);
      if (v && !specs.includes(v)) specs.push(v);
    }
  }

  if (comp.socket && specs.length < 3) specs.push(comp.socket);
  if (comp.tdp && specs.length < 3) specs.push(`${comp.tdp}W TDP`);
  if (comp.form_factor && specs.length < 3) specs.push(comp.form_factor);

  return specs.slice(0, 3);
}

/* ─── Compatibility check per step ─── */

function getCompatResult(comp: DBCompWithImages, stepId: StepId, build: Build): CompatResult {
  const noCheck: CompatResult = { status: 'compatible', message: 'Aucune vérification requise' };

  switch (stepId) {
    case 'cpu':
      if (build.mobo) return checkCPUMotherboard(comp, build.mobo);
      return noCheck;
    case 'ram':
      if (build.mobo) return checkRAMMotherboard(comp, build.mobo);
      return noCheck;
    case 'cooler':
      if (build.cpu) return checkCoolerCPU(comp, build.cpu);
      return noCheck;
    case 'psu':
      return checkPSU(comp, build.cpu ?? null, build.gpu ?? null);
    case 'case':
      if (build.mobo) return checkCaseMotherboard(comp, build.mobo);
      return noCheck;
    default:
      return noCheck;
  }
}

/* ─── Component image with SVG fallback ─── */

function ComponentImageOrIcon({ comp }: { comp: DBCompWithImages }) {
  const [imgError, setImgError] = useState(false);
  const primaryImg = comp.component_images?.find((i) => i.is_primary)?.url
    || comp.component_images?.[0]?.url;

  if (primaryImg && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={primaryImg}
        alt={comp.name}
        className="w-[44px] h-[44px] object-contain"
        onError={() => setImgError(true)}
      />
    );
  }
  return <ComponentIcon type={comp.type} size={36} />;
}

/* ─── Component Card ─── */

function CompCard({
  comp,
  stepId,
  build,
  onSelect,
  isSelected,
}: {
  comp: DBCompWithImages;
  stepId: StepId;
  build: Build;
  onSelect: (c: DBCompWithImages) => void;
  isSelected: boolean;
}) {
  const compat = getCompatResult(comp, stepId, build);
  const specs = getKeySpecs(comp);

  const borderColor = isSelected ? '#4f8ef7' :
    compat.status === 'incompatible' ? '#FECACA' :
    compat.status === 'warning' ? '#FDE68A' : '#E5E5E5';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl p-4 flex flex-col gap-3 transition-shadow hover:shadow-md"
      style={{
        border: `2px solid ${borderColor}`,
        background: isSelected ? '#EEF3FE' : '#FFFFFF',
        opacity: compat.status === 'incompatible' ? 0.75 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-[52px] h-[52px] rounded-xl bg-[#F5F7FF] flex items-center justify-center overflow-hidden border border-[#E8EEFF]">
          <ComponentImageOrIcon comp={comp} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#666] font-medium uppercase tracking-wide">{comp.brand}</p>
          <p className="text-sm font-semibold text-[#0A0A0A] leading-snug line-clamp-2">{comp.name}</p>
        </div>
      </div>

      {/* Specs pills */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specs.map((spec, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#F0F4FF', color: '#4f8ef7', border: '1px solid #D4E2FD' }}>
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* Price + compat */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-lg font-bold" style={{ color: '#4f8ef7' }}>
          CHF {comp.price_ch.toFixed(0)}
        </span>
        <CompatBadge result={compat} />
      </div>

      {/* Action button */}
      {isSelected ? (
        <button
          onClick={() => onSelect(comp)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: '#4f8ef7', color: 'white' }}
        >
          ✓ Sélectionné
        </button>
      ) : compat.status === 'incompatible' ? (
        <button
          onClick={() => onSelect(comp)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'transparent', color: '#991B1B', border: '1px solid #FECACA' }}
        >
          Choisir quand même
        </button>
      ) : compat.status === 'warning' ? (
        <button
          onClick={() => onSelect(comp)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: 'transparent', color: '#92400E', border: '1px solid #FDE68A' }}
        >
          Choisir
        </button>
      ) : (
        <button
          onClick={() => onSelect(comp)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: '#0A0A0A', color: 'white' }}
        >
          Choisir
        </button>
      )}
    </motion.div>
  );
}

/* ─── Sidebar ─── */

function Sidebar({
  currentStep,
  build,
  onStepClick,
}: {
  currentStep: number;
  build: Build;
  onStepClick: (idx: number) => void;
}) {
  const totalPrice = STEPS.reduce((sum, s) => sum + (build[s.id]?.price_ch ?? 0), 0);
  const cpu = build.cpu;
  const gpu = build.gpu;
  const estimatedWatts = (cpu?.tdp ?? 65) + (gpu?.tdp ?? 0) + 80;

  return (
    <div className="w-72 shrink-0 flex flex-col gap-2 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto pb-6">
      {/* Steps */}
      <div className="rounded-xl p-4" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-3">Progression</p>
        <div className="flex flex-col gap-1">
          {STEPS.map((step, idx) => {
            const selected = build[step.id];
            const isCurrent = idx === currentStep;
            const isDone = !!selected;
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(idx)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors w-full"
                style={{
                  background: isCurrent ? '#EEF3FE' : 'transparent',
                  border: isCurrent ? '1px solid #4f8ef7' : '1px solid transparent',
                }}
              >
                <span className="text-base w-6 flex-shrink-0">
                  {isDone ? '✅' : isCurrent ? '🔵' : '⬜'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: isCurrent ? '#4f8ef7' : '#0A0A0A' }}>
                    {step.label}
                  </p>
                  {selected && (
                    <p className="text-xs truncate" style={{ color: '#666' }}>
                      {selected.name}
                    </p>
                  )}
                </div>
                {selected && (
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#4f8ef7' }}>
                    {selected.price_ch.toFixed(0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Total prix */}
      <div className="rounded-xl p-4" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-[#666]">Total config</span>
          <span className="text-lg font-bold" style={{ color: '#4f8ef7' }}>CHF {totalPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* PSU Power breakdown */}
      <div className="rounded-xl p-4" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-3">Consommation estimée</p>
        {[
          { label: 'CPU', value: cpu?.tdp ?? null, fallback: '—', color: '#4f8ef7' },
          { label: 'GPU', value: gpu?.tdp ?? null, fallback: '—', color: '#10b981' },
          { label: 'Système', value: 80, fallback: '80', color: '#666' },
        ].map(({ label, value, fallback, color }) => (
          <div key={label} className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-[#666]">{label}</span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: value ? color : '#CCC' }}>
              {value ? `${value} W` : fallback}
            </span>
          </div>
        ))}
        <div className="my-2" style={{ borderTop: '1px solid #E5E5E5' }} />
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-[#444]">Total</span>
          <span className="text-xs font-bold tabular-nums text-[#0A0A0A]">~{estimatedWatts} W</span>
        </div>
        {(cpu || gpu) && (
          <div className="flex justify-between items-center mt-1 pt-1.5" style={{ borderTop: '1px dashed #E5E5E5' }}>
            <span className="text-xs text-[#888]">PSU min. recommandé</span>
            <span className="text-xs font-bold tabular-nums" style={{ color: '#f59e0b' }}>
              {calcRequiredWatts(cpu ?? null, gpu ?? null)} W
            </span>
          </div>
        )}
        {!cpu && !gpu && (
          <p className="text-[10px] text-[#CCC] italic mt-1">Sélectionnez CPU et GPU pour le calcul</p>
        )}
      </div>
    </div>
  );
}

/* ─── Recap Section ─── */

function RecapSection({ build, onReset }: { build: Build; onReset: () => void }) {
  const { addItem } = useCart();

  const totalPrice = STEPS.reduce((sum, s) => sum + (build[s.id]?.price_ch ?? 0), 0);
  const selectedCount = STEPS.filter(s => build[s.id]).length;

  // Precise compatibility score (100 - penalties)
  const compatScore = (() => {
    let score = 100;
    const cpu = build.cpu;
    const mobo = build.mobo;
    const ram = build.ram;
    const gpu = build.gpu;
    const psu = build.psu;
    const cooler = build.cooler;

    // CPU socket ≠ carte mère socket → -50
    if (cpu && mobo) {
      const r = checkCPUMotherboard(cpu, mobo);
      if (r.status === 'incompatible') score -= 50;
    }
    // RAM DDR ≠ carte mère DDR → -30
    if (ram && mobo) {
      const r = checkRAMMotherboard(ram, mobo);
      if (r.status === 'incompatible') score -= 30;
    }
    // GPU TDP + CPU TDP > PSU watts × 0.8 → -20
    if (psu && (cpu || gpu)) {
      const r = checkPSU(psu, cpu ?? null, gpu ?? null);
      if (r.status === 'incompatible') score -= 20;
      else if (r.status === 'warning') score -= 10;
    }
    // Ventirad TDP < CPU TDP → -10
    if (cooler && cpu) {
      const r = checkCoolerCPU(cooler, cpu);
      if (r.status === 'incompatible') score -= 10;
    }

    return Math.max(0, score);
  })();

  function compatLabel(score: number) {
    if (score >= 95) return { text: '✅ Configuration parfaite', color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7' };
    if (score >= 80) return { text: '✅ Compatible', color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7' };
    if (score >= 60) return { text: '⚠️ Quelques avertissements', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' };
    return { text: '❌ Incompatibilités détectées', color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' };
  }
  const { text: compatText, color: compatColor, bg: compatBg, border: compatBorder } = compatLabel(compatScore);

  function addAllToCart() {
    for (const step of STEPS) {
      const comp = build[step.id];
      if (!comp) continue;
      const cartComp: Component = {
        type: comp.type,
        name: comp.name,
        reason: `Sélectionné manuellement via le configurateur`,
        price_fr: comp.price_ch,
        price_ch: comp.price_ch,
        search_terms: [comp.name, comp.brand],
        priority: 'essentiel',
        specs: comp.specs ? Object.fromEntries(Object.entries(comp.specs).map(([k, v]) => [k, String(v)])) : undefined,
        image_url: comp.component_images?.find(i => i.is_primary)?.url,
      };
      addItem(cartComp);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#0A0A0A] mb-2">🎉 Configuration complète !</h2>
        <p className="text-[#666]">Votre PC est prêt. Vérifiez le récapitulatif avant de commander.</p>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
          <p className="text-2xl font-bold" style={{ color: '#4f8ef7' }}>{selectedCount}/8</p>
          <p className="text-xs text-[#666] mt-1">Composants</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
          <p className="text-2xl font-bold" style={{ color: '#4f8ef7' }}>CHF {totalPrice.toFixed(0)}</p>
          <p className="text-xs text-[#666] mt-1">Total estimé</p>
        </div>
      </div>

      {/* Compatibility score global */}
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ border: `1px solid ${compatBorder}`, background: compatBg }}>
        <div className="shrink-0 text-center" style={{ minWidth: '60px' }}>
          <p className="text-3xl font-black tabular-nums" style={{ color: compatColor }}>{compatScore}</p>
          <p className="text-[10px] font-medium" style={{ color: compatColor }}>/100</p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: compatColor }}>{compatText}</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-white/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${compatScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: compatColor }}
            />
          </div>
        </div>
      </div>

      {/* Component list */}
      <div className="flex flex-col gap-3">
        {STEPS.map(step => {
          const comp = build[step.id];
          if (!comp) return (
            <div key={step.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px dashed #E5E5E5' }}>
              <span className="text-xl">{step.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-[#999]">{step.label} — non sélectionné</p>
              </div>
            </div>
          );
          const compat = getCompatResult(comp, step.id, build);
          return (
            <div key={step.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}>
              <span className="text-xl">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] font-medium">{step.label}</p>
                <p className="text-sm font-semibold text-[#0A0A0A] truncate">{comp.brand} {comp.name}</p>
              </div>
              <CompatBadge result={compat} />
              <span className="text-sm font-bold flex-shrink-0" style={{ color: '#4f8ef7' }}>
                CHF {comp.price_ch.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={addAllToCart}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#4f8ef7' }}
        >
          🛒 Ajouter tout au panier
        </button>
        <Link
          href="/"
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-center transition-colors hover:opacity-90"
          style={{ background: '#0A0A0A', color: 'white' }}
        >
          Optimiser avec l'IA →
        </Link>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 rounded-xl font-semibold transition-colors"
          style={{ border: '1px solid #E5E5E5', color: '#0A0A0A', background: 'white' }}
        >
          Recommencer
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function ManualConfiguratorPage() {
  const { count: cartCount } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [build, setBuild] = useState<Build>({});
  const [done, setDone] = useState(false);

  // Per-step state
  const [components, setComponents] = useState<DBCompWithImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(9999);
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState<'prix' | 'popularité'>('popularité');
  const [compatOnly, setCompatOnly] = useState(true);

  const step = STEPS[currentStep];

  // Fetch components when step changes
  useEffect(() => {
    if (done) return;
    setLoading(true);
    setComponents([]);
    setSearch('');
    setBrandFilter('');
    setMaxPrice(9999);

    fetch(`/api/db-components?type=${encodeURIComponent(step.type)}&limit=150`)
      .then(r => r.json())
      .then((data: DBCompWithImages[]) => {
        setComponents(Array.isArray(data) ? data : []);
      })
      .catch(() => setComponents([]))
      .finally(() => setLoading(false));
  }, [currentStep, done, step.type]);

  // Filtered + sorted components
  const filteredComponents = useCallback((): DBCompWithImages[] => {
    let list = [...components];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    if (brandFilter) {
      list = list.filter(c => c.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    list = list.filter(c => c.price_ch <= maxPrice);

    if (compatOnly) {
      list = list.filter(c => {
        const r = getCompatResult(c, step.id, build);
        return r.status !== 'incompatible';
      });
    }

    if (sortBy === 'prix') {
      list.sort((a, b) => a.price_ch - b.price_ch);
    } else {
      list.sort((a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0));
    }

    return list;
  }, [components, search, brandFilter, maxPrice, compatOnly, sortBy, step.id, build]);

  const brands = [...new Set(components.map(c => c.brand))].sort();
  const visibleComponents = filteredComponents();

  function handleSelect(comp: DBCompWithImages) {
    setBuild(prev => ({ ...prev, [step.id]: comp }));
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setDone(true);
      }
    }, 300);
  }

  function handleReset() {
    setBuild({});
    setCurrentStep(0);
    setDone(false);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF', color: '#0A0A0A' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-sm" style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Logo size="small" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#666] hidden sm:inline">Configurateur Manuel</span>
            {cartCount > 0 && (
              <a
                href="/panier"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white hover:opacity-90 transition-opacity"
                style={{ background: '#4f8ef7' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.56L23 6H6"/>
                </svg>
                Panier ({cartCount})
              </a>
            )}
            <Link href="/" className="flex items-center gap-1 text-sm text-[#666] hover:text-[#0A0A0A] transition-colors">
              ← Accueil
            </Link>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-6">
        {done ? (
          <RecapSection build={build} onReset={handleReset} />
        ) : (
          <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar currentStep={currentStep} build={build} onStepClick={setCurrentStep} />

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* Step header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl p-5"
                  style={{ border: '1px solid #E5E5E5', background: '#FAFAFA' }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-[#0A0A0A]">
                          Étape {currentStep + 1}/{STEPS.length} — {step.label}
                        </h1>
                        {build[step.id] && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }}>
                            ✅ Sélectionné
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#666]">{step.desc}</p>
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      className="px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-30"
                      style={{ border: '1px solid #E5E5E5', background: 'white' }}
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={() => {
                        if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
                        else setDone(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                      style={{ background: '#4f8ef7', color: 'white' }}
                    >
                      {build[step.id] ? (currentStep === STEPS.length - 1 ? 'Voir le récap →' : 'Suivant →') : 'Passer →'}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 min-w-[160px] px-3 py-2 rounded-lg text-sm outline-none focus:ring-2"
                  style={{
                    border: '1px solid #E5E5E5',
                    background: 'white',
                    color: '#0A0A0A',
                  }}
                />
                {brands.length > 1 && (
                  <select
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1px solid #E5E5E5', background: 'white', color: '#0A0A0A' }}
                  >
                    <option value="">Toutes marques</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                )}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'prix' | 'popularité')}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1px solid #E5E5E5', background: 'white', color: '#0A0A0A' }}
                >
                  <option value="popularité">Popularité</option>
                  <option value="prix">Prix croissant</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setCompatOnly(prev => !prev)}
                    className="w-9 h-5 rounded-full transition-colors flex items-center px-0.5"
                    style={{ background: compatOnly ? '#4f8ef7' : '#E5E5E5' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ transform: compatOnly ? 'translateX(16px)' : 'translateX(0)' }}
                    />
                  </div>
                  <span className="text-sm text-[#666]">Compatibles seulement</span>
                </label>
              </div>

              {/* Components grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl p-4 h-48 animate-pulse" style={{ background: '#F0F0F0', border: '1px solid #E5E5E5' }} />
                  ))}
                </div>
              ) : visibleComponents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-lg font-semibold text-[#0A0A0A]">Aucun composant trouvé</p>
                  <p className="text-sm text-[#666] mt-1">
                    {compatOnly ? 'Essayez de désactiver le filtre "Compatibles seulement"' : 'Essayez de modifier vos filtres'}
                  </p>
                  {compatOnly && (
                    <button
                      onClick={() => setCompatOnly(false)}
                      className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: '#4f8ef7', color: 'white' }}
                    >
                      Voir tous les composants
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <AnimatePresence>
                    {visibleComponents.map(comp => (
                      <CompCard
                        key={comp.id}
                        comp={comp}
                        stepId={step.id}
                        build={build}
                        onSelect={handleSelect}
                        isSelected={build[step.id]?.id === comp.id}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
