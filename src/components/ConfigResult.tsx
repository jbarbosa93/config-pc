"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { PCConfig, Component, Alternative } from "@/lib/types";
import { buildSearchUrl, getSimulatedPrices, buildToppreiseUrl } from "@/lib/affiliates";
import { useCart } from "@/lib/cart";

/* ── Manufacturer URL mapping ── */

const MANUFACTURER_URLS: Record<string, string> = {
  amd: "https://www.amd.com/fr/products/processors/desktops/ryzen.html",
  intel: "https://www.intel.fr/content/www/fr/fr/products/details/processors.html",
  nvidia: "https://www.nvidia.com/fr-fr/geforce/graphics-cards/",
  corsair: "https://www.corsair.com/fr/fr/",
  msi: "https://fr.msi.com/",
  asus: "https://www.asus.com/fr/",
  gigabyte: "https://www.gigabyte.com/fr/",
  "be quiet": "https://www.bequiet.com/fr/",
  "be quiet!": "https://www.bequiet.com/fr/",
  noctua: "https://noctua.at/fr/",
  samsung: "https://www.samsung.com/fr/",
  "western digital": "https://www.westerndigital.com/fr-fr/",
  wd: "https://www.westerndigital.com/fr-fr/",
  seagate: "https://www.seagate.com/fr/fr/",
  "g.skill": "https://www.gskill.com/",
  gskill: "https://www.gskill.com/",
  kingston: "https://www.kingston.com/fr/",
  "fractal design": "https://www.fractal-design.com/fr/",
  fractal: "https://www.fractal-design.com/fr/",
  seasonic: "https://seasonic.com/",
  "cooler master": "https://www.coolermaster.com/fr-fr/",
  deepcool: "https://www.deepcool.com/fr/",
  arctic: "https://www.arctic.de/fr/",
  "lian li": "https://www.lian-li.com/fr/",
  evga: "https://www.evga.com/",
  crucial: "https://www.crucial.fr/",
  nzxt: "https://nzxt.com/",
};

function getManufacturerUrl(componentName: string, fallback?: string): string {
  const lower = componentName.toLowerCase();
  for (const [brand, url] of Object.entries(MANUFACTURER_URLS)) {
    if (lower.includes(brand)) return url;
  }
  return fallback || "#";
}

/* ── Colored animated SVG icons per component type ── */

function ComponentSVG({ type, size = 80 }: { type: string; size?: number }) {
  const key = type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const s = size;

  if (key.includes("cpu") || key.includes("processeur")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="20" width="40" height="40" rx="5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5"/>
      <rect x="28" y="28" width="24" height="24" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1"/>
      <rect x="34" y="34" width="12" height="12" rx="2" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite"/>
      </rect>
      {[30,40,50].map(x => <line key={`t${x}`} x1={x} y1="20" x2={x} y2="11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(x => <line key={`b${x}`} x1={x} y1="60" x2={x} y2="69" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(y => <line key={`l${y}`} x1="20" y1={y} x2="11" y2={y} stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(y => <line key={`r${y}`} x1="60" y1={y} x2="69" y2={y} stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("gpu") || key.includes("graphi") || key.includes("carte graph")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="8" y="22" width="64" height="36" rx="5" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5"/>
      <rect x="8" y="17" width="22" height="5" rx="2" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="0.8"/>
      <g className="animate-spin-slow" style={{transformOrigin:"28px 40px"}}>
        <circle cx="28" cy="40" r="11" stroke="#10B981" strokeWidth="1"/>
        <circle cx="28" cy="40" r="5" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="28" y1="29" x2="28" y2="34" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="28" y1="46" x2="28" y2="51" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="17" y1="40" x2="22" y2="40" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="34" y1="40" x2="39" y2="40" stroke="#10B981" strokeWidth="0.8"/>
      </g>
      <g className="animate-spin-slow" style={{transformOrigin:"54px 40px"}}>
        <circle cx="54" cy="40" r="11" stroke="#10B981" strokeWidth="1"/>
        <circle cx="54" cy="40" r="5" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="54" y1="29" x2="54" y2="34" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="54" y1="46" x2="54" y2="51" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="43" y1="40" x2="48" y2="40" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="60" y1="40" x2="65" y2="40" stroke="#10B981" strokeWidth="0.8"/>
      </g>
      {[18,28,38].map(x => <line key={x} x1={x} y1="58" x2={x} y2="66" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("ram") || key.includes("memoire") || key.includes("memory")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="24" width="60" height="32" rx="4" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5"/>
      <rect x="10" y="19" width="12" height="5" rx="2" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" strokeWidth="0.8"/>
      {[16,28,40,52].map((x,i) => (
        <rect key={x} x={x} y="30" width="8" height="16" rx="1.5" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.6" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="1.5s" begin={`${i*0.3}s`} repeatCount="indefinite"/>
        </rect>
      ))}
      {[16,24,32,40,48,56,64].map(x => <line key={x} x1={x} y1="56" x2={x} y2="63" stroke="#8B5CF6" strokeWidth="1" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("ssd") || key.includes("stockage") || key.includes("storage") || key.includes("nvme") || key.includes("m.2")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="12" y="28" width="56" height="24" rx="4" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5"/>
      <rect x="18" y="33" width="18" height="14" rx="2" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="0.8"/>
      <rect x="42" y="35" width="10" height="10" rx="1.5" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="60" cy="40" r="3.5" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="60" cy="40" r="1" fill="#F59E0B">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
      </circle>
      <path d="M22 34L28 34L28 39" stroke="#F59E0B" strokeWidth="0.6" opacity="0.5"/>
      <path d="M20 43L32 43" stroke="#F59E0B" strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );

  if (key.includes("carte mere") || key.includes("motherboard")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="14" y="10" width="52" height="60" rx="4" fill="#ECFDF5" stroke="#065F46" strokeWidth="1.5"/>
      <rect x="22" y="16" width="20" height="14" rx="2.5" fill="#065F46" opacity="0.1" stroke="#065F46" strokeWidth="1"/>
      <rect x="27" y="20" width="10" height="6" rx="1.5" fill="#065F46" opacity="0.2"/>
      <rect x="22" y="38" width="10" height="8" rx="1.5" fill="#065F46" opacity="0.08" stroke="#065F46" strokeWidth="0.8"/>
      <rect x="36" y="38" width="10" height="8" rx="1.5" fill="#065F46" opacity="0.08" stroke="#065F46" strokeWidth="0.8"/>
      <rect x="22" y="52" width="24" height="10" rx="2" stroke="#065F46" strokeWidth="0.8" strokeDasharray="3 2"/>
      <circle cx="54" cy="20" r="3" fill="#065F46" opacity="0.15" stroke="#065F46" strokeWidth="0.8"/>
      <circle cx="54" cy="32" r="3" fill="#065F46" opacity="0.15" stroke="#065F46" strokeWidth="0.8"/>
      {[42,46,50].map(y => <line key={y} x1="50" y1={y} x2="58" y2={y} stroke="#065F46" strokeWidth="0.8" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("alimentation") || key.includes("power")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="14" y="18" width="52" height="44" rx="5" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5"/>
      <circle cx="40" cy="40" r="15" fill="#EAB308" opacity="0.08" stroke="#EAB308" strokeWidth="1"/>
      <path d="M43 30L37 41H43L37 52" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
      </path>
      <rect x="14" y="62" width="10" height="4" rx="1.5" fill="#EAB308" opacity="0.2" stroke="#EAB308" strokeWidth="0.8"/>
      <rect x="28" y="62" width="10" height="4" rx="1.5" fill="#EAB308" opacity="0.2" stroke="#EAB308" strokeWidth="0.8"/>
      <circle cx="58" cy="24" r="2" fill="#EAB308" opacity="0.4"/>
    </svg>
  );

  if (key.includes("boitier") || key.includes("boîtier") || key.includes("case") || key.includes("tour")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="8" width="40" height="64" rx="5" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="26" y="14" width="28" height="24" rx="3" fill="#6B7280" opacity="0.05" stroke="#6B7280" strokeWidth="0.8"/>
      <rect x="30" y="18" width="20" height="16" rx="2" fill="#6B7280" opacity="0.08">
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite"/>
      </rect>
      <line x1="26" y1="44" x2="54" y2="44" stroke="#6B7280" strokeWidth="0.8" opacity="0.3"/>
      <rect x="28" y="48" width="24" height="3" rx="1" fill="#6B7280" opacity="0.1" stroke="#6B7280" strokeWidth="0.5"/>
      <rect x="28" y="54" width="24" height="3" rx="1" fill="#6B7280" opacity="0.1" stroke="#6B7280" strokeWidth="0.5"/>
      <circle cx="40" cy="66" r="2.5" stroke="#6B7280" strokeWidth="1"/>
      <circle cx="27" cy="12" r="1.2" fill="#6B7280" opacity="0.4"/>
    </svg>
  );

  if (key.includes("refroidissement") || key.includes("cooler") || key.includes("ventil") || key.includes("cooling")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="28" fill="#ECFEFF" stroke="#06B6D4" strokeWidth="1.5"/>
      <g className="animate-spin-slow" style={{transformOrigin:"40px 40px"}}>
        <circle cx="40" cy="40" r="7" fill="#06B6D4" opacity="0.15" stroke="#06B6D4" strokeWidth="1"/>
        <path d="M40 12C40 12 45 26 40 33" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M40 68C40 68 35 54 40 47" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 40C12 40 26 35 33 40" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M68 40C68 40 54 45 47 40" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 20C20 20 30 27 34 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 60C60 60 50 53 46 46" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 20C60 20 53 30 46 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 60C20 60 27 50 34 46" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );

  return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="20" width="40" height="40" rx="5" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5"/>
      <rect x="30" y="30" width="20" height="20" rx="3" fill="#9CA3AF" opacity="0.1" stroke="#9CA3AF" strokeWidth="1"/>
      {[30,40,50].map(x => <line key={`t${x}`} x1={x} y1="20" x2={x} y2="12" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>)}
      {[30,50].map(x => <line key={`b${x}`} x1={x} y1="60" x2={x} y2="68" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );
}

function ProductImage({ type }: { type: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  }
  function handleLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 600 }}
      className="w-[80px] h-[80px] rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary shrink-0"
    >
      <ComponentSVG type={type} />
    </motion.div>
  );
}

/* ── Animated Counter ── */

function AnimatedPrice({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = display; const diff = value - start; const duration = 600; const startTime = performance.now();
    function tick(now: number) { const p = Math.min((now - startTime) / duration, 1); setDisplay(Math.round(start + diff * (1 - Math.pow(1 - p, 3)))); if (p < 1) ref.current = requestAnimationFrame(tick); }
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className="tabular-nums">{display}{suffix}</span>;
}

/* ── Merchant price table with "Voir plus" ── */

function MerchantTable({ component, t }: { component: Component; t: (k: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const prices = getSimulatedPrices(component.price_ch);
  const visiblePrices = expanded ? prices : prices.slice(0, 4);
  const best = prices[0]?.price;
  const hasMore = prices.length > 4;

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg overflow-hidden">
      {visiblePrices.map((p) => (
        <a key={p.storeId} href={buildSearchUrl(p.storeId, component.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 text-xs border-b border-border last:border-b-0 hover:bg-card transition-colors duration-150">
          <span className="font-medium">{p.label}</span>
          <span className="flex items-center gap-2">
            {p.price === best && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">{t("result.bestPrice")}</span>}
            <span className="tabular-nums">{p.price} CHF</span>
            <span className="text-[10px] text-text-secondary">{t("compare.see")} &rarr;</span>
          </span>
        </a>
      ))}
      {hasMore && (
        <button type="button" onClick={() => setExpanded((e) => !e)} className="w-full px-3 py-2 text-xs text-text-secondary hover:text-text hover:bg-card/50 transition-colors duration-150 font-medium text-center">
          {expanded ? "Voir moins \u2191" : `Voir plus \u2193 (${prices.length - 4} sites)`}
        </button>
      )}
      <p className="px-3 py-1.5 text-[10px] text-text-secondary italic bg-card/30">
        {t("compare.note.dev")}
      </p>
    </div>
  );
}

/* ── Infos Produit Modal ── */

interface DBImage { url: string; is_primary: boolean; alt_text: string; order_index: number }
interface DBPrice { id: string; site: string; price: number; currency: string; url: string; in_stock: boolean }
interface DBComponent {
  id: string; type: string; name: string; brand: string;
  description: string; specs: Record<string, string>;
  manufacturer_url: string; price_ch: number; price_fr: number;
  socket: string | null; chipset: string | null; form_factor: string | null;
  tdp: number | null; release_year: number | null; popularity_score: number;
  component_images: DBImage[];
  component_prices: DBPrice[];
}

function ImageCarousel({ images, name, type, tall = false }: { images: DBImage[]; name: string; type: string; tall?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const sorted = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.order_index - b.order_index);
  const valid = sorted.filter((_, i) => !failed.has(i));
  const h = tall ? "h-[300px]" : "h-[220px]";

  if (valid.length === 0) {
    return (
      <div className={`w-full ${h} rounded-xl bg-[#F8F8F8] border flex items-center justify-center`} style={{ borderColor: "#E5E5E5" }}>
        <ComponentSVG type={type} size={tall ? 160 : 110} />
      </div>
    );
  }

  const cur = valid[Math.min(idx, valid.length - 1)];
  return (
    <div>
      <div className={`relative w-full ${h} rounded-xl bg-[#F8F8F8] border flex items-center justify-center overflow-hidden`} style={{ borderColor: "#E5E5E5" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.url} alt={cur.alt_text || name} className="max-h-full max-w-full object-contain p-4" onError={() => { setFailed((s) => new Set([...s, sorted.indexOf(cur)])); }} />
        {valid.length > 1 && (
          <>
            <button type="button" onClick={() => setIdx((i) => (i - 1 + valid.length) % valid.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border flex items-center justify-center text-[#666] hover:bg-white shadow-sm transition-all" style={{ borderColor: "#E5E5E5" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button type="button" onClick={() => setIdx((i) => (i + 1) % valid.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border flex items-center justify-center text-[#666] hover:bg-white shadow-sm transition-all" style={{ borderColor: "#E5E5E5" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}
      </div>
      {valid.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-2">
          {valid.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button key={i} type="button" onClick={() => setIdx(i)} className={`w-12 h-12 rounded-lg border overflow-hidden transition-all ${i === Math.min(idx, valid.length - 1) ? "border-[#4f8ef7]" : "border-[#E5E5E5] opacity-60 hover:opacity-100"}`}>
              <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Store label mapping — Swiss merchants only */
const STORE_LABELS: Record<string, string> = {
  digitec: "Digitec", galaxus: "Galaxus", brack: "Brack.ch",
  interdiscount: "Interdiscount", microspot: "Microspot", mediamarkt: "MediaMarkt",
};

/* ── Accordion wrapper ── */

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E5E5E5" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#888] hover:bg-[#FAFAFA] transition-colors">
        {title}
        <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── TDP Badge with color coding ── */

function TDPBadge({ tdp }: { tdp: number }) {
  const color = tdp > 150 ? "#EF4444" : tdp > 65 ? "#F59E0B" : "#22C55E";
  const bg = tdp > 150 ? "#FEF2F2" : tdp > 65 ? "#FFFBEB" : "#F0FFF4";
  const label = tdp > 150 ? "Énergivore" : tdp > 65 ? "Modéré" : "Efficace";
  return (
    <span className="text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5" style={{ background: bg, color, border: `1px solid ${color}20` }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      TDP {tdp}W · {label}
    </span>
  );
}

/* ── Compatibility Score Bar ── */

function CompatibilityScore({ score }: { score: number }) {
  const color = score >= 90 ? "#22C55E" : score >= 70 ? "#F59E0B" : "#EF4444";
  const label = score >= 90 ? "Excellente" : score >= 70 ? "Bonne" : "À vérifier";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="h-full rounded-full" style={{ background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums shrink-0" style={{ color }}>{score}% · {label}</span>
    </div>
  );
}

function InfoModal({ component, onClose }: { component: Component; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [dbData, setDbData] = useState<DBComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, items: cartItems } = useCart();
  const inCart = cartItems.some((i) => i.name === component.name);
  const manufacturerUrl = getManufacturerUrl(component.name, component.manufacturer_url);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/components/search?name=${encodeURIComponent(component.name)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setDbData(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [component.name]);

  const handleOutside = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [handleOutside]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const specs = dbData?.specs || component.specs || {};
  const description = dbData?.description || component.full_description || component.reason;
  const mfUrl = dbData?.manufacturer_url || manufacturerUrl;
  const images: DBImage[] = dbData?.component_images || [];
  const brand = dbData?.brand || component.name.split(" ")[0];
  const displayPrice = dbData?.price_ch || component.price_ch;
  const tdp = dbData?.tdp || null;

  const dbPrices: DBPrice[] = dbData?.component_prices || [];
  const hasPricesInDB = dbPrices.length > 0;
  const simulatedPrices = getSimulatedPrices(displayPrice);
  const bestSimPrice = simulatedPrices[0]?.price;

  const bestMerchantUrl = hasPricesInDB
    ? (dbPrices.sort((a, b) => a.price - b.price)[0]?.url || "#")
    : buildSearchUrl(simulatedPrices[0]?.storeId || "galaxus", component.name);

  // Compatibility score (heuristic based on having matching specs)
  const compatScore = Math.min(100, 75 + (dbData?.socket ? 5 : 0) + (dbData?.form_factor ? 5 : 0) + (dbData?.chipset ? 5 : 0) + (Object.keys(specs).length > 3 ? 10 : 0));

  // "Pourquoi ce composant?" dynamic points
  const whyPoints: string[] = [];
  if (component.priority === "essentiel") whyPoints.push("Composant essentiel pour cette configuration.");
  if (component.reason) whyPoints.push(component.reason);
  if (tdp && tdp <= 65) whyPoints.push("Faible consommation énergétique — bon pour le silence et la durabilité.");
  else if (tdp && tdp > 150) whyPoints.push("Haute performance qui nécessite un bon refroidissement.");
  if (dbData?.release_year && dbData.release_year >= 2024) whyPoints.push("Composant récent avec les dernières technologies.");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative"
        style={{ border: "1px solid #E5E5E5" }}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E5E5" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 text-[11px] px-2.5 py-1 rounded-full font-semibold text-white" style={{ background: "#4f8ef7" }}>{component.type}</span>
            <span className="text-sm font-medium text-[#444] truncate">{brand}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[#CCC]"><path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm text-[#666] truncate">{component.name}</span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-[#666] hover:text-[#0A0A0A] transition-colors ml-4" style={{ borderColor: "#E5E5E5" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} className="w-7 h-7 rounded-full border-2 border-[#E5E5E5]" style={{ borderTopColor: "#4f8ef7" }} />
          </div>
        ) : (
          <div className="p-6 pb-24 flex flex-col gap-6">

            {/* ── TOP: Image + Info ── */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-[42%] shrink-0">
                <ImageCarousel images={images} name={component.name} type={component.type} tall />
              </div>

              <div className="flex-1 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#4f8ef7] uppercase tracking-wide">{brand}</span>
                    {dbData?.release_year && <span className="text-xs text-[#999] bg-[#F5F5F5] px-2 py-0.5 rounded-full">{dbData.release_year}</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-[#0A0A0A] leading-tight mb-3">{component.name}</h1>

                  {/* Attribute badges with colored TDP */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dbData?.socket && <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F0F7FF] text-[#3B70C4] font-medium">Socket {dbData.socket}</span>}
                    {dbData?.form_factor && <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F5F5F5] text-[#555] font-medium">{dbData.form_factor}</span>}
                    {tdp ? <TDPBadge tdp={tdp} /> : null}
                    {dbData?.chipset && <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F0FFF4] text-[#2F855A] font-medium">{dbData.chipset}</span>}
                  </div>

                  {/* Compatibility score */}
                  <div className="mb-4">
                    <p className="text-[11px] text-[#888] uppercase tracking-wide font-medium mb-1.5">Compatibilité</p>
                    <CompatibilityScore score={compatScore} />
                  </div>

                  {description && (
                    <p className="text-sm leading-relaxed text-[#555] line-clamp-3">{description}</p>
                  )}
                </div>

                {/* Price with count-up animation */}
                <div className="rounded-2xl p-5" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
                  <p className="text-xs text-[#888] mb-1 uppercase tracking-wide font-medium">Meilleur prix</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold" style={{ color: "#4f8ef7" }}><AnimatedPrice value={displayPrice} suffix="" /></span>
                    <span className="text-xl font-semibold text-[#4f8ef7]">CHF</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={bestMerchantUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "#4f8ef7" }}>
                      Voir l&apos;offre →
                    </a>
                    {mfUrl !== "#" && (
                      <a href={mfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-[#555] hover:text-[#0A0A0A] transition-all" style={{ border: "1px solid #E5E5E5" }}>
                        Site fabricant →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pourquoi ce composant? ── */}
            {whyPoints.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
                <h2 className="text-sm font-bold text-[#4f8ef7] mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#4f8ef7" strokeWidth="1.5"/><path d="M8 5v4M8 11h.01" stroke="#4f8ef7" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Pourquoi ce composant ?
                </h2>
                <ul className="flex flex-col gap-2">
                  {whyPoints.slice(0, 3).map((point, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="text-sm text-[#555] flex items-start gap-2">
                      <span className="text-[#4f8ef7] mt-0.5 shrink-0">•</span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Price comparison (accordion) ── */}
            <Accordion title="Comparer les prix" defaultOpen>
              <div>
                {hasPricesInDB ? (
                  [...dbPrices].sort((a, b) => a.price - b.price).map((p, i) => {
                    const isLowest = i === 0;
                    const label = STORE_LABELS[p.site] || p.site;
                    const href = p.url || buildSearchUrl(p.site, component.name);
                    return (
                      <div key={p.id} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#F0F0F0", background: isLowest ? "#F0FFF4" : "white" }}>
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: isLowest ? "#22C55E" : "#CBD5E1" }}>{label[0]}</span>
                          <span className="font-medium">{label}</span>
                          {!p.in_stock && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Indisponible</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          {isLowest && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Meilleur prix</span>}
                          <span className={`tabular-nums font-semibold ${isLowest ? "text-green-700 text-base" : "text-[#0A0A0A]"}`}>{p.price} {p.currency}</span>
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-80" style={{ background: "#4f8ef7" }}>Acheter</a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  simulatedPrices.map((p, i) => {
                    const isLowest = p.price === bestSimPrice;
                    const label = STORE_LABELS[p.storeId] || p.label;
                    return (
                      <div key={p.storeId} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#F0F0F0", background: isLowest ? "#F0FFF4" : "white" }}>
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: isLowest ? "#22C55E" : "#CBD5E1" }}>{label[0]}</span>
                          <span className="font-medium">{label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {isLowest && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Meilleur prix</span>}
                          <span className={`tabular-nums font-semibold ${isLowest ? "text-green-700 text-base" : "text-[#0A0A0A]"}`}>{p.price} CHF</span>
                          <a href={buildSearchUrl(p.storeId, component.name)} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-80" style={{ background: "#4f8ef7" }}>Acheter</a>
                        </div>
                      </div>
                    );
                  })
                )}
                {!hasPricesInDB && (
                  <p className="px-4 py-2 text-[11px] text-[#AAA] italic">Prix indicatifs — cliquez pour voir le prix réel sur chaque site.</p>
                )}
              </div>
              <a
                href={buildToppreiseUrl(component.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 mb-4 mt-2 flex items-center justify-center gap-2.5 w-[calc(100%-2rem)] py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: "#FF6B00" }}
              >
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-bold text-[10px] tracking-tight">TP</span>
                Comparer les prix sur TopPreise →
              </a>
            </Accordion>

            {/* ── Specs table (accordion) ── */}
            {specs && Object.keys(specs).length > 0 && (
              <Accordion title="Fiche technique" defaultOpen={false}>
                <div>
                  {Object.entries(specs).map(([key, value], i) => (
                    <div key={key} className={`flex items-start justify-between px-4 py-3 text-sm ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#F0F0F0", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <span className="text-[#666] w-2/5 shrink-0">{key}</span>
                      <span className="font-medium text-[#0A0A0A] text-right flex-1">{String(value)}</span>
                    </div>
                  ))}
                  {dbData?.socket && !specs["Socket"] && (
                    <div className="flex items-start justify-between px-4 py-3 text-sm border-t" style={{ borderColor: "#F0F0F0" }}>
                      <span className="text-[#666] w-2/5 shrink-0">Socket</span>
                      <span className="font-medium text-[#0A0A0A] text-right flex-1">{dbData.socket}</span>
                    </div>
                  )}
                  {dbData?.form_factor && !specs["Format"] && (
                    <div className="flex items-start justify-between px-4 py-3 text-sm border-t" style={{ borderColor: "#F0F0F0" }}>
                      <span className="text-[#666] w-2/5 shrink-0">Format</span>
                      <span className="font-medium text-[#0A0A0A] text-right flex-1">{dbData.form_factor}</span>
                    </div>
                  )}
                  {tdp && !specs["TDP"] && (
                    <div className="flex items-start justify-between px-4 py-3 text-sm border-t" style={{ borderColor: "#F0F0F0" }}>
                      <span className="text-[#666] w-2/5 shrink-0">TDP</span>
                      <span className="font-medium text-[#0A0A0A] text-right flex-1">{tdp} W</span>
                    </div>
                  )}
                </div>
              </Accordion>
            )}

            {/* ── Full description (accordion) ── */}
            {description && Object.keys(specs).length > 0 && (
              <Accordion title="Description" defaultOpen={false}>
                <p className="text-sm leading-relaxed text-[#444] p-4">{description}</p>
              </Accordion>
            )}

          </div>
        )}

        {/* ── Fixed bottom "Ajouter à ma config" button ── */}
        {!loading && (
          <div className="sticky bottom-0 bg-white px-6 py-4 flex gap-3" style={{ borderTop: "1px solid #E5E5E5" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !inCart && addItem(component)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${inCart ? "bg-green-100 text-green-700 border border-green-200" : "text-white"}`}
              style={inCart ? {} : { background: "#4f8ef7" }}
            >
              {inCart ? "✓ Dans le panier" : "Ajouter à ma config"}
            </motion.button>
            <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-medium text-[#666] hover:text-[#333] transition-colors" style={{ border: "1px solid #E5E5E5" }}>
              Fermer
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Alternatives Modal ── */

const TIER_LABELS: Record<string, string> = { budget: "Budget", equilibre: "Équilibré", performance: "Performance", overkill: "Overkill" };
const TIER_ORDER = ["budget", "equilibre", "performance", "overkill"];

function getKeySpecs(type: string, specs: Record<string, string>): string[] {
  const t = type.toLowerCase();
  if (t.includes("cpu") || t.includes("processeur")) return ["Cores/Threads", "Fréquence boost", "TDP", "Cache L3"];
  if (t.includes("gpu") || t.includes("graphi")) return ["VRAM", "Architecture", "TDP"];
  if (t.includes("ram") || t.includes("memoire") || t.includes("mémoire")) return ["Type", "Fréquence", "Latence CL", "Capacité"];
  if (t.includes("stockage") || t.includes("ssd") || t.includes("nvme")) return ["Capacité", "Interface", "Lecture séq.", "Écriture séq."];
  if (t.includes("carte") && (t.includes("mere") || t.includes("mère"))) return ["Socket", "Chipset", "Format", "RAM max"];
  if (t.includes("alimentation")) return ["Puissance", "Certification 80+", "Modulaire"];
  if (t.includes("boitier") || t.includes("boîtier")) return ["Format", "GPU max", "Ventirad max"];
  if (t.includes("refroidissement") || t.includes("cooler")) return ["Type", "TDP supporté", "Niveau sonore"];
  return Object.keys(specs).slice(0, 3);
}

function assignTiers(items: DBComponent[], currentPrice: number): Alternative[] {
  const sorted = [...items]
    .filter((c) => c.name !== undefined)
    .sort((a, b) => a.price_ch - b.price_ch);

  const below = sorted.filter((c) => c.price_ch <= currentPrice);
  const above = sorted.filter((c) => c.price_ch > currentPrice);

  const picks: (DBComponent | null)[] = [
    below.length >= 2 ? below[0] : (below[0] || null),   // budget
    below.length >= 2 ? below[Math.floor(below.length / 2)] : (below[0] || above[0] || null), // equilibre
    above[0] || (below[below.length - 1] || null),         // performance
    above.length >= 2 ? above[above.length - 1] : (above[0] || null), // overkill
  ];

  return TIER_ORDER.map((tier, i) => {
    const c = picks[i];
    if (!c) return null;
    return {
      name: c.name,
      reason: c.description || "",
      tier,
      price_ch: c.price_ch,
      price_fr: c.price_ch, // fallback
      compatible: true,
      specs: c.specs || {},
      images: c.component_images || [],
    } as Alternative & { specs: Record<string, string>; images: DBImage[] };
  }).filter(Boolean) as Alternative[];
}

/* ── Spec comparison helpers ── */

function parseNumeric(v: string): number | null {
  if (!v) return null;
  const m = v.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

// Returns "higher" if higher value is better, "lower" if lower is better, "equal" for non-numeric
function specDirection(key: string): "higher" | "lower" | "equal" {
  const k = key.toLowerCase();
  if (k.includes("tdp") || k.includes("sonore") || k.includes("bruit") || k.includes("watt") || k.includes("consomm")) return "lower";
  if (k.includes("fréquence") || k.includes("frequence") || k.includes("vitesse") || k.includes("ghz") || k.includes("mhz") || k.includes("cœur") || k.includes("coeur") || k.includes("core") || k.includes("vram") || k.includes("capacité") || k.includes("capacite") || k.includes("cache") || k.includes("ram max") || k.includes("puissance") || k.includes("tdp supporté") || k.includes("tdp supporte")) return "higher";
  return "equal";
}

function SpecDelta({ specKey, currentVal, altVal }: { specKey: string; currentVal?: string; altVal?: string }) {
  if (!currentVal || !altVal) return null;
  const dir = specDirection(specKey);
  if (dir === "equal") return <span className="text-[10px] font-bold text-gray-400">=</span>;
  const cur = parseNumeric(currentVal);
  const alt = parseNumeric(altVal);
  if (cur === null || alt === null || cur === alt) return <span className="text-[10px] font-bold text-gray-400">=</span>;
  const better = dir === "higher" ? alt > cur : alt < cur;
  return better
    ? <span className="text-[10px] font-bold text-green-600">↑</span>
    : <span className="text-[10px] font-bold text-red-500">↓</span>;
}

function AlternativesModal({ component, allComponents, usage, budget, onSelect, onClose }: { component: Component; allComponents: Component[]; usage: string; budget: number; onSelect: (a: Alternative) => void; onClose: () => void }) {
  const { t } = useLanguage();
  const [alternatives, setAlternatives] = useState<(Alternative & { specs?: Record<string, string>; images?: DBImage[] })[]>([]);
  const [currentSpecs, setCurrentSpecs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Try DB first
        const dbRes = await fetch(`/api/db-components?type=${encodeURIComponent(component.type)}`);
        if (dbRes.ok) {
          const dbItems: DBComponent[] = await dbRes.json();
          // Get current component specs from DB if available
          const dbCurrent = dbItems.find((c) => c.name === component.name);
          if (dbCurrent?.specs) setCurrentSpecs(dbCurrent.specs);
          const filtered = dbItems.filter((c) => c.name !== component.name);
          if (filtered.length >= 2) {
            const tiers = assignTiers(filtered, component.price_ch);
            if (!cancelled && tiers.length > 0) { setAlternatives(tiers); setLoading(false); return; }
          }
        }
        // Fallback to Claude
        const res = await fetch("/api/alternatives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ component_type: component.type, current_component: component, all_components: allComponents, usage, budget }) });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setAlternatives(data.alternatives || []);
      } catch { if (!cancelled) setError(t("alt.error")); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [component, allComponents, usage, budget, t]);

  const handleOutside = useCallback((e: MouseEvent) => { if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose(); }, [onClose]);
  useEffect(() => { document.addEventListener("mousedown", handleOutside); return () => document.removeEventListener("mousedown", handleOutside); }, [handleOutside]);

  // Best value = lowest price among alternatives (simplest heuristic)
  const bestValueIndex = alternatives.length > 0
    ? alternatives.reduce((bi, alt, i) => alt.price_ch < alternatives[bi].price_ch ? i : bi, 0)
    : -1;

  const currentKeySpecs = Object.keys(currentSpecs).length > 0
    ? getKeySpecs(component.type, currentSpecs)
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-bg border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-bg border-b border-border p-5 rounded-t-2xl flex items-center justify-between z-10">
          <div><p className="text-[11px] uppercase tracking-wider text-text-secondary">{t("alt.title")}</p><h3 className="font-bold text-lg">{component.type}</h3></div>
          <motion.button whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }} onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text hover:border-border-hover transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </motion.button>
        </div>

        {/* Current component card */}
        <div className="px-5 py-4 border-b border-border" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F7FF 100%)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: "#4f8ef7" }}>{t("alt.current")}</span>
            <span className="text-xs font-bold text-[#4f8ef7] tabular-nums">{component.price_ch} CHF</span>
          </div>
          <p className="font-semibold text-sm leading-tight mb-2">{component.name}</p>
          {currentKeySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {currentKeySpecs.map((k) => currentSpecs[k] ? (
                <span key={k} className="text-[10px] px-2 py-0.5 rounded-md bg-white/70 border border-blue-200 text-[#4f8ef7] font-medium">
                  {k}: {currentSpecs[k]}
                </span>
              ) : null)}
            </div>
          )}
        </div>

        {loading && <div className="p-12 text-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 mx-auto mb-4 border-2 border-border border-t-accent rounded-full" /><p className="text-sm text-text-secondary">{t("alt.searching")}</p></div>}
        {error && <div className="p-6"><p className="text-sm text-text-secondary">{error}</p></div>}

        {!loading && !error && (
          <div className="p-4 flex flex-col gap-3">
            {alternatives.map((alt, i) => {
              const priceDiff = alt.price_ch - component.price_ch;
              const priceDiffStr = priceDiff === 0 ? "= prix" : priceDiff > 0 ? `+${priceDiff} CHF` : `${priceDiff} CHF`;
              const altWithExtras = alt as Alternative & { specs?: Record<string, string>; images?: DBImage[] };
              const altSpecs = altWithExtras.specs || {};
              const keySpecs = Object.keys(altSpecs).length > 0 ? getKeySpecs(component.type, altSpecs) : currentKeySpecs;
              const primaryImg = altWithExtras.images?.find((img) => img.is_primary) || altWithExtras.images?.[0];
              const isBestValue = i === bestValueIndex;
              return (
                <motion.div key={alt.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }} className="rounded-xl border border-border hover:border-border-hover transition-colors duration-150 p-4 bg-card">

                  {/* Alt header row */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-lg bg-bg border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {primaryImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={primaryImg.url} alt={alt.name} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <ComponentSVG type={component.type} size={36} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-text-secondary font-medium">{TIER_LABELS[alt.tier] || alt.tier}</span>
                        {isBestValue && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: "#f59e0b" }}>⭐ Rapport Q/P</span>}
                        {alt.compatible !== false
                          ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium">Compatibilité ✓</span>
                          : <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">⚠️ Vérifier</span>
                        }
                      </div>
                      <p className="font-semibold text-sm leading-tight">{alt.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold tabular-nums" style={{ color: "#4f8ef7" }}>{alt.price_ch} CHF</span>
                        <span className={`text-[11px] font-medium tabular-nums ${priceDiff < 0 ? "text-green-600" : priceDiff > 0 ? "text-red-500" : "text-text-secondary"}`}>{priceDiffStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spec comparison table */}
                  {keySpecs.length > 0 && (
                    <div className="rounded-lg overflow-hidden border border-border mb-3">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr style={{ background: "#F8F8F8" }}>
                            <th className="text-left px-3 py-1.5 font-medium text-text-secondary">Spec</th>
                            <th className="text-center px-2 py-1.5 font-medium text-text-secondary">Actuel</th>
                            <th className="text-center px-2 py-1.5 font-medium text-text-secondary">Alternative</th>
                            <th className="text-center px-2 py-1.5 font-medium text-text-secondary w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {keySpecs.map((k, si) => {
                            const curV = currentSpecs[k];
                            const altV = altSpecs[k];
                            if (!curV && !altV) return null;
                            return (
                              <tr key={k} style={{ background: si % 2 === 0 ? "#FFFFFF" : "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
                                <td className="px-3 py-1.5 text-text-secondary font-medium">{k}</td>
                                <td className="px-2 py-1.5 text-center tabular-nums text-text-secondary">{curV || "—"}</td>
                                <td className="px-2 py-1.5 text-center tabular-nums font-medium text-text">{altV || "—"}</td>
                                <td className="px-2 py-1.5 text-center">
                                  <SpecDelta specKey={k} currentVal={curV} altVal={altV} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {alt.reason && <p className="text-xs text-text-secondary mb-3 leading-relaxed">{alt.reason}</p>}
                  {!alt.compatible && alt.compatibility_warning && (
                    <p className="text-xs text-amber-600 mb-2">⚠️ {alt.compatibility_warning}</p>
                  )}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(alt)} className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-150">{t("alt.choose")}</motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Change button label per component type ── */

function getChangeLabel(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("cpu") || t.includes("processeur")) return "Changer le processeur";
  if (t.includes("gpu") || t.includes("graphi")) return "Changer la carte graphique";
  if (t.includes("ram") || t.includes("mémoire") || t.includes("memoire")) return "Changer la RAM";
  if (t.includes("stockage") || t.includes("ssd") || t.includes("nvme")) return "Changer le stockage";
  if (t.includes("carte") && t.includes("mère") || t.includes("mere")) return "Changer la carte mère";
  if (t.includes("alimentation")) return "Changer l'alimentation";
  if (t.includes("boîtier") || t.includes("boitier")) return "Changer le boîtier";
  if (t.includes("refroidissement") || t.includes("cooler")) return "Changer le refroidissement";
  return "Changer";
}

/* ── Component Card ── */

function ComponentCard({ component, original, index, onSwap, onRevert, onInfo }: { component: Component; original: Component | null; index: number; onSwap: () => void; onRevert: () => void; onInfo: () => void }) {
  const { t } = useLanguage();
  const { addItem, items } = useCart();
  const isEssential = component.priority === "essentiel";
  const isSwapped = original !== null && original.name !== component.name;
  const inCart = items.some((i) => i.name === component.name);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }} className="rounded-xl border border-border bg-card p-5 transition-colors duration-150 hover:border-border-hover">
      <div className="flex gap-4 mb-3">
        <ProductImage type={component.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary font-medium">{component.type}</span>
              <h3 className="font-semibold mt-0.5 leading-tight">{component.name}</h3>
            </div>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 400 }} className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ml-2 ${isEssential ? "bg-accent text-white" : "bg-card text-text-secondary border border-border"}`}>{t(`priority.${component.priority}`)}</motion.span>
          </div>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{component.reason}</p>
          <div className="mt-2">
            <button type="button" onClick={onInfo} className="text-[11px] px-2 py-0.5 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">
              {t("info.product")} &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2 mt-1">
        <span className="text-3xl font-extrabold" style={{ color: "#4f8ef7" }}>{component.price_ch}</span>
        <span className="text-base font-semibold text-[#4f8ef7]">CHF</span>
      </div>

      {/* Merchant price table */}
      <MerchantTable component={component} t={t} />

      {/* Compare on TopPreise */}
      <a href={buildToppreiseUrl(component.name)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full text-xs py-2.5 rounded-lg bg-[#0A0A0A] text-white hover:bg-[#333] transition-all duration-150 font-medium">
        <span className="px-1.5 py-0.5 rounded bg-[#FF6B00] text-white font-bold text-[10px] tracking-tight">TP</span>
        Comparer sur TopPreise
      </a>

      <div className="flex gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => !inCart && addItem(component)}
          className={`flex-1 text-center text-xs py-2 rounded-lg font-medium transition-all duration-150 ${inCart ? "bg-green-100 text-green-700 border border-green-200" : "border border-border text-text-secondary hover:bg-accent hover:text-white hover:border-accent"}`}
        >
          {inCart ? "✓ Dans le panier" : "＋ Ajouter au panier"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSwap} className="text-xs py-2 px-3 rounded-lg border border-border text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-150 font-medium">{getChangeLabel(component.type)}</motion.button>
        {isSwapped && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.97 }} onClick={onRevert} className="text-xs py-2 px-3 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">{t("restore")}</motion.button>}
      </div>
    </motion.div>
  );
}

/* ── Expandable Price Row ── */

function PriceRow({ component, changed, t }: { component: Component; index: number; changed: boolean; t: (k: string) => string }) {
  return (
    <tr className="border-b border-border/50 hover:bg-card/50 transition-colors duration-150">
      <td className="py-3">
        <span className="font-medium">{component.type}</span>
        <span className="text-text-secondary ml-2 text-xs">{component.name}</span>
        {changed && <span className="ml-2 text-[10px] text-text-secondary">({t("result.changed")})</span>}
      </td>
      <td className="text-right py-3 tabular-nums">{component.price_ch} CHF</td>
      <td className="text-right py-3">
        <a href={buildToppreiseUrl(component.name)} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium flex items-center gap-1 justify-end whitespace-nowrap">
          <span className="px-1 py-0.5 rounded bg-[#FF6B00] text-white font-bold text-[9px]">TP</span>
          TopPreise &rarr;
        </a>
      </td>
    </tr>
  );
}

/* ── Peripherals & Setup Section ── */

const PERIPHERAL_CATEGORIES = [
  { type: "Moniteur", icon: "🖥️", desc: "Écran gaming ou productivité", color: "#3B82F6", bg: "#EFF6FF" },
  { type: "Clavier", icon: "⌨️", desc: "Mécanique, membrane, sans fil", color: "#8B5CF6", bg: "#F5F3FF" },
  { type: "Souris", icon: "🖱️", desc: "Gaming, ergonomique, sans fil", color: "#10B981", bg: "#ECFDF5" },
  { type: "Casque gaming", icon: "🎧", desc: "Audio immersif, micro intégré", color: "#EF4444", bg: "#FEF2F2" },
  { type: "Chaise gaming", icon: "🪑", desc: "Ergonomique, confort longue durée", color: "#F59E0B", bg: "#FFFBEB" },
  { type: "Tapis de souris", icon: "🎯", desc: "XL, RGB, precision", color: "#6B7280", bg: "#F9FAFB" },
];

function PeripheralsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-10">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 hover:border-[#CCC]"
        style={{ borderColor: expanded ? "#4f8ef7" : "#E5E5E5", background: expanded ? "#F8FAFF" : "white" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🎮</span>
          <div className="text-left">
            <span className="font-semibold text-sm">Compléter ton setup</span>
            <span className="text-xs text-[#888] ml-2">Périphériques & accessoires</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#888] font-medium border border-[#E5E5E5]">Optionnel</span>
          <motion.svg animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {PERIPHERAL_CATEGORIES.map((cat, i) => (
                <motion.a
                  key={cat.type}
                  href={buildSearchUrl("digitec", cat.type)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-xl p-4 border transition-all duration-150 cursor-pointer group"
                  style={{ borderColor: "#E5E5E5", background: cat.bg }}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <p className="font-semibold text-sm" style={{ color: cat.color }}>{cat.type}</p>
                  <p className="text-[11px] text-[#888] mt-0.5 leading-snug">{cat.desc}</p>
                  <div className="mt-3 text-[10px] font-medium text-[#888] group-hover:text-[#4f8ef7] transition-colors flex items-center gap-1">
                    Voir sur Digitec <span className="text-[10px]">→</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ── */

interface Props { config: PCConfig; onReset: () => void; }

export default function ConfigResult({ config, onReset }: Props) {
  const { t } = useLanguage();
  const [components, setComponents] = useState<Component[]>(config.components);
  const [originals] = useState<Component[]>(config.components);
  const [swapIndex, setSwapIndex] = useState<number | null>(null);
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const totalCH = components.reduce((s, c) => s + c.price_ch, 0);
  const hasChanges = components.some((c, i) => c.name !== originals[i].name);
  const { addItem, items: cartItems, count: cartCount } = useCart();

  function addAllToCart() {
    components.forEach((c) => addItem(c));
  }

  function handleSelectAlternative(index: number, alt: Alternative) {
    setComponents((prev) => { const next = [...prev]; next[index] = { ...prev[index], name: alt.name, reason: alt.reason, price_fr: alt.price_fr, price_ch: alt.price_ch, search_terms: alt.search_terms }; return next; });
    setSwapIndex(null);
  }

  function handleRevert(index: number) { setComponents((prev) => { const next = [...prev]; next[index] = originals[index]; return next; }); }

  function handleSave() {
    const exported: PCConfig = { ...config, components, total_estimated: totalCH };
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${config.config_name.replace(/\s+/g, "_")}.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
        <p className="text-text-secondary text-xs uppercase tracking-widest mb-3">{t("result.generated")}</p>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight" style={{ letterSpacing: "-0.02em" }}>{config.config_name}</h1>
            <p className="text-text-secondary text-sm mt-1.5">{config.compatibility_notes?.split(".")[0] || "Configuration optimisée · Suisse"}</p>
            {hasChanges && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-text-secondary mt-1 inline-block">{t("result.modified")}</motion.span>}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs text-text-secondary mb-1 uppercase tracking-wide">Total config</div>
            <div className="text-3xl font-bold" style={{ color: "#4f8ef7" }}><AnimatedPrice value={totalCH} suffix=" CHF" /></div>
          </div>
        </div>
      </motion.div>

      {/* Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {components.map((c, i) => <ComponentCard key={`${c.type}-${i}`} component={c} original={originals[i]} index={i} onSwap={() => setSwapIndex(i)} onRevert={() => handleRevert(i)} onInfo={() => setInfoIndex(i)} />)}
      </div>

      {/* Peripherals & Setup */}
      <PeripheralsSection />

      {/* Notes */}
      {(config.compatibility_notes || config.upgrade_path) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {config.compatibility_notes && <div className="rounded-xl border border-border p-5 bg-card"><h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium mb-2">{t("result.compatibility")}</h3><p className="text-sm leading-relaxed">{config.compatibility_notes}</p></div>}
          {config.upgrade_path && <div className="rounded-xl border border-border p-5 bg-card"><h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium mb-2">{t("result.upgradability")}</h3><p className="text-sm leading-relaxed">{config.upgrade_path}</p></div>}
        </motion.div>
      )}

      {/* Price table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl border border-border bg-card p-6 mb-4">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium mb-4">{t("result.priceDetail")}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="text-left py-2 font-medium">{t("result.component")}</th>
              <th className="text-right py-2 font-medium">Prix CHF</th>
              <th className="text-right py-2 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => <PriceRow key={`row-${c.type}-${i}`} component={c} index={i} changed={c.name !== originals[i].name} t={t} />)}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="pt-4">{t("result.total")}</td>
              <td className="text-right pt-4 font-bold" style={{ color: "#4f8ef7" }}>{totalCH} CHF</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </motion.div>

      <p className="text-xs text-text-secondary mb-10 px-1">{t("result.disclaimer")}</p>

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-3 pb-8">
        {/* Add all to cart */}
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={addAllToCart}
          className="px-6 py-2.5 rounded-full text-white text-sm font-medium flex items-center gap-2"
          style={{ background: "#4f8ef7" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.56L23 6H6"/>
          </svg>
          Tout ajouter au panier
        </motion.button>

        {/* Go to cart if items */}
        {cartCount > 0 && (
          <motion.a
            href="/panier"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-2 transition-all"
            style={{ background: "#22C55E" }}
          >
            Voir le panier ({cartCount}) →
          </motion.a>
        )}

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.save")}</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReset} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.newConfig")}</motion.button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {swapIndex !== null && <AlternativesModal component={components[swapIndex]} allComponents={components} usage={config.config_name} budget={config.total_estimated} onSelect={(alt) => handleSelectAlternative(swapIndex, alt)} onClose={() => setSwapIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {infoIndex !== null && <InfoModal component={components[infoIndex]} onClose={() => setInfoIndex(null)} />}
      </AnimatePresence>
    </div>
  );
}
