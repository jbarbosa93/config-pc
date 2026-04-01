"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { PCConfig, Component, Alternative, Market } from "@/lib/types";
import { buildSearchUrl, getStoreLabel, getSimulatedPrices, getDefaultStoreIds, buildToppreiseUrl, buildIdealoUrl } from "@/lib/affiliates";

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

function MerchantTable({ component, market, t }: { component: Component; market: Market; t: (k: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const isCH = market === "suisse" || market === "both";
  const basePrice = isCH ? component.price_ch : component.price_fr;
  const currency = isCH ? "CHF" : "\u20AC";
  const prices = getSimulatedPrices(basePrice, market);
  const defaultIds = getDefaultStoreIds(market);
  const visiblePrices = expanded ? prices : prices.filter((p) => defaultIds.includes(p.storeId)).slice(0, 4);
  const best = prices[0]?.price;
  const hasMore = prices.length > 4;

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg overflow-hidden">
      {visiblePrices.map((p) => (
        <a key={p.storeId} href={buildSearchUrl(p.storeId, component.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 text-xs border-b border-border last:border-b-0 hover:bg-card transition-colors duration-150">
          <span className="font-medium">{p.label}</span>
          <span className="flex items-center gap-2">
            {p.price === best && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">{t("result.bestPrice")}</span>}
            <span className="tabular-nums">{p.price} {currency}</span>
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

function InfoModal({ component, onClose }: { component: Component; onClose: () => void }) {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const manufacturerUrl = getManufacturerUrl(component.name, component.manufacturer_url);

  const handleOutside = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  }, [onClose]);
  useEffect(() => { document.addEventListener("mousedown", handleOutside); return () => document.removeEventListener("mousedown", handleOutside); }, [handleOutside]);

  const hasImage = component.image_url && !imgFailed;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white border rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ borderColor: "#E5E5E5" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-5 rounded-t-2xl flex items-center justify-between z-10" style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0A0A0A] text-white font-medium">{component.type}</span>
            <h3 className="font-bold text-lg leading-tight">{component.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border flex items-center justify-center text-[#666] hover:text-[#0A0A0A] transition-colors" style={{ borderColor: "#E5E5E5" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          <div className="flex justify-center mb-6">
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={component.image_url}
                alt={component.name}
                width={200}
                height={200}
                className="w-[200px] h-[200px] object-contain rounded-xl"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="w-[200px] h-[200px] rounded-xl bg-[#F8F8F8] border flex items-center justify-center" style={{ borderColor: "#E5E5E5" }}>
                <ComponentSVG type={component.type} size={120} />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[#333] mb-6">
            {component.full_description || component.reason}
          </p>

          {/* Specs table */}
          {component.specs && Object.keys(component.specs).length > 0 && (
            <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: "#E5E5E5" }}>
              <div className="px-4 py-2.5 bg-[#F8F8F8] text-xs font-medium uppercase tracking-wider text-[#666]">{t("specs.title")}</div>
              {Object.entries(component.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-2.5 text-sm border-t" style={{ borderColor: "#F0F0F0" }}>
                  <span className="text-[#666]">{key}</span>
                  <span className="font-medium text-[#0A0A0A]">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Manufacturer link */}
          {manufacturerUrl !== "#" && (
            <a href={manufacturerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border text-sm font-medium text-[#666] hover:text-[#0A0A0A] hover:border-[#CCC] transition-all" style={{ borderColor: "#E5E5E5" }}>
              {t("info.manufacturer")} &rarr;
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Quote Modal ── */

function QuoteModal({ config, components, market, totalFR, totalCH, onClose }: {
  config: PCConfig; components: Component[]; market: Market; totalFR: number; totalCH: number; onClose: () => void;
}) {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", npa: "", city: "", country: "Suisse",
    message: "", delivery: false, assembly: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const handleOutside = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  }, [onClose]);
  useEffect(() => { document.addEventListener("mousedown", handleOutside); return () => document.removeEventListener("mousedown", handleOutside); }, [handleOutside]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          configName: config.config_name,
          components: components.map((c) => ({ type: c.type, name: c.name, price_fr: c.price_fr, price_ch: c.price_ch })),
          totalFR, totalCH, market,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-border bg-bg text-text text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-150";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-bg border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-bg border-b border-border p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
            <h3 className="font-bold text-lg">{t("quote.title")}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text hover:border-border-hover transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-4">{"\u2705"}</div>
            <p className="font-semibold text-lg mb-2">{t("quote.success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder={t("quote.firstName")} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
              <input required placeholder={t("quote.lastName")} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
            </div>
            <input required type="email" placeholder={t("quote.email")} value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
            <input placeholder={t("quote.phone")} value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
            <input required placeholder={t("quote.address")} value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder={t("quote.npa")} value={form.npa} onChange={(e) => update("npa", e.target.value)} className={inputClass} />
              <input required placeholder={t("quote.city")} value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
            </div>
            <input required placeholder={t("quote.country")} value={form.country} onChange={(e) => update("country", e.target.value)} className={inputClass} />
            <textarea placeholder={t("quote.message")} value={form.message} onChange={(e) => update("message", e.target.value)} rows={3} className={inputClass} />

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.delivery} onChange={(e) => update("delivery", e.target.checked)} className="w-4 h-4 rounded border-border accent-accent" />
              <span className="text-sm">{t("quote.delivery")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.assembly} onChange={(e) => update("assembly", e.target.checked)} className="w-4 h-4 rounded border-border accent-accent" />
              <span className="text-sm">{t("quote.assembly")}</span>
            </label>

            {error && <p className="text-sm text-red-500">{t("quote.error")}</p>}

            <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-accent text-white font-medium text-sm transition-opacity disabled:opacity-50">
              {sending ? t("quote.sending") : t("quote.send")}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Alternatives Modal ── */

function AlternativesModal({ component, allComponents, usage, budget, market, onSelect, onClose }: { component: Component; allComponents: Component[]; usage: string; budget: number; market: Market; onSelect: (a: Alternative) => void; onClose: () => void }) {
  const { t } = useLanguage();
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const res = await fetch("/api/alternatives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ component_type: component.type, current_component: component, all_components: allComponents, usage, budget }) });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!c) setAlternatives(data.alternatives || []);
      } catch { if (!c) setError(t("alt.error")); } finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, [component, allComponents, usage, budget, t]);

  const handleOutside = useCallback((e: MouseEvent) => { if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose(); }, [onClose]);
  useEffect(() => { document.addEventListener("mousedown", handleOutside); return () => document.removeEventListener("mousedown", handleOutside); }, [handleOutside]);

  function formatPrice(alt: { price_fr: number; price_ch: number }) {
    if (showFR && showCH) return `${alt.price_fr}\u20AC \u00B7 ${alt.price_ch} CHF`;
    if (showCH) return `${alt.price_ch} CHF`;
    return `${alt.price_fr}\u20AC`;
  }
  function formatCurrentPrice() {
    if (showFR && showCH) return `${component.price_fr}\u20AC \u00B7 ${component.price_ch} CHF`;
    if (showCH) return `${component.price_ch} CHF`;
    return `${component.price_fr}\u20AC`;
  }
  function getDiff(alt: { price_fr: number; price_ch: number }) {
    const diff = showCH && !showFR ? alt.price_ch - component.price_ch : alt.price_fr - component.price_fr;
    const unit = showCH && !showFR ? " CHF" : "\u20AC";
    if (diff === 0) return t("alt.samePrice");
    return diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-bg border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-bg border-b border-border p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div><p className="text-[11px] uppercase tracking-wider text-text-secondary">{t("alt.title")}</p><h3 className="font-bold text-xl">{component.type}</h3></div>
          <motion.button whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }} onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text hover:border-border-hover transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </motion.button>
        </div>
        <div className="px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-3"><span className="text-[11px] px-2.5 py-0.5 rounded-full bg-accent text-white font-medium">{t("alt.current")}</span><span className="font-medium text-sm">{component.name}</span></div>
          <p className="text-xs text-text-secondary mt-1 ml-[70px]">{formatCurrentPrice()}</p>
        </div>
        {loading && <div className="p-12 text-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 mx-auto mb-4 border-2 border-border border-t-accent rounded-full" /><p className="text-sm text-text-secondary">{t("alt.searching")}</p></div>}
        {error && <div className="p-6"><p className="text-sm text-text-secondary">{error}</p></div>}
        {!loading && !error && (
          <div className="p-4 flex flex-col gap-3">
            {alternatives.map((alt, i) => {
              const diffStr = getDiff(alt);
              const diff = showCH && !showFR ? alt.price_ch - component.price_ch : alt.price_fr - component.price_fr;
              return (
                <motion.div key={alt.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }} className="rounded-xl border border-border hover:border-border-hover transition-colors duration-150 p-4 bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-card border border-border text-text-secondary font-medium">{t(`tier.${alt.tier}`)}</span>
                    <span className={`text-xs font-medium tabular-nums ${diff < 0 ? "text-text-secondary" : "text-text"}`}>{diffStr}</span>
                  </div>
                  <p className="font-medium text-sm mb-1">{alt.name}</p>
                  <p className="text-xs text-text-secondary mb-3">{alt.reason}</p>
                  <div className="flex items-center gap-4 mb-3 text-xs">
                    <span>{formatPrice(alt)}</span>
                    <span className="ml-auto">{alt.compatible ? <span className="text-text-secondary">{"\u2713"} {t("alt.compatible")}</span> : <span className="text-text font-medium">{"\u26A0"} {alt.compatibility_warning || t("alt.check")}</span>}</span>
                  </div>
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

/* ── Component Card ── */

function ComponentCard({ component, original, index, market, onSwap, onRevert, onInfo }: { component: Component; original: Component | null; index: number; market: Market; onSwap: () => void; onRevert: () => void; onInfo: () => void }) {
  const { t } = useLanguage();
  const isEssential = component.priority === "essentiel";
  const isSwapped = original !== null && original.name !== component.name;
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";
  const isCH = market === "suisse" || market === "both";
  const compareUrl = isCH ? buildToppreiseUrl(component.name) : buildIdealoUrl(component.name);

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

      <div className="flex gap-3 mb-1">
        {showFR && <div className="flex-1 bg-bg rounded-lg p-2.5 text-center border border-border"><div className="text-[11px] text-text-secondary">{t("result.france")}</div><div className="font-semibold mt-0.5">{component.price_fr}&euro;</div></div>}
        {showCH && <div className="flex-1 bg-bg rounded-lg p-2.5 text-center border border-border"><div className="text-[11px] text-text-secondary">{t("result.suisse")}</div><div className="font-semibold mt-0.5">{component.price_ch} CHF</div></div>}
      </div>

      {/* Merchant price table */}
      <MerchantTable component={component} market={market} t={t} />

      {/* Compare all prices via Toppreise/idealo */}
      <a href={compareUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full text-xs py-2.5 rounded-lg bg-[#0A0A0A] text-white hover:bg-[#333] transition-all duration-150 font-medium">
        {t("compare.prices")} &rarr;
      </a>

      <div className="flex gap-2 mt-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSwap} className="flex-1 text-center text-xs py-2 rounded-lg border border-border text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-150 font-medium">{t("change")}</motion.button>
        {isSwapped && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.97 }} onClick={onRevert} className="text-xs py-2 px-3 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">{t("restore")}</motion.button>}
      </div>
    </motion.div>
  );
}

/* ── Expandable Price Row ── */

function PriceRow({ component, changed, market, t }: { component: Component; index: number; changed: boolean; market: Market; t: (k: string) => string }) {
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";
  const isCH = market === "suisse" || market === "both";
  const compareUrl = isCH ? buildToppreiseUrl(component.name) : buildIdealoUrl(component.name);

  return (
    <tr className="border-b border-border/50 hover:bg-card/50 transition-colors duration-150">
      <td className="py-3">
        <span className="font-medium">{component.type}</span>
        <span className="text-text-secondary ml-2 text-xs">{component.name}</span>
        {changed && <span className="ml-2 text-[10px] text-text-secondary">({t("result.changed")})</span>}
      </td>
      {showFR && <td className="text-right py-3 tabular-nums">{component.price_fr}&euro;</td>}
      {showCH && <td className="text-right py-3 tabular-nums">{component.price_ch} CHF</td>}
      <td className="text-right py-3">
        <a href={compareUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">{t("compare.see")} &rarr;</a>
      </td>
    </tr>
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
  const [showQuote, setShowQuote] = useState(false);

  const market: Market = config.market || "both";
  const totalFR = components.reduce((s, c) => s + c.price_fr, 0);
  const totalCH = components.reduce((s, c) => s + c.price_ch, 0);
  const hasChanges = components.some((c, i) => c.name !== originals[i].name);
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";

  function handleSelectAlternative(index: number, alt: Alternative) {
    setComponents((prev) => { const next = [...prev]; next[index] = { ...prev[index], name: alt.name, reason: alt.reason, price_fr: alt.price_fr, price_ch: alt.price_ch, search_terms: alt.search_terms }; return next; });
    setSwapIndex(null);
  }

  function handleRevert(index: number) { setComponents((prev) => { const next = [...prev]; next[index] = originals[index]; return next; }); }

  function handleSave() {
    const exported: PCConfig = { ...config, components, total_estimated: totalFR };
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${config.config_name.replace(/\s+/g, "_")}.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
        <p className="text-text-secondary text-xs uppercase tracking-widest mb-4">{t("result.generated")}</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">{config.config_name}</h1>
        <div className="flex items-center gap-8">
          {showFR && <div><div className="text-xs text-text-secondary mb-1">{t("result.france")}</div><div className="text-2xl font-bold"><AnimatedPrice value={totalFR} suffix="€" /></div></div>}
          {showFR && showCH && <div className="w-px h-8 bg-border" />}
          {showCH && <div><div className="text-xs text-text-secondary mb-1">{t("result.suisse")}</div><div className="text-2xl font-bold"><AnimatedPrice value={totalCH} suffix=" CHF" /></div></div>}
          {hasChanges && <><div className="w-px h-8 bg-border" /><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-text-secondary">{t("result.modified")}</motion.span></>}
        </div>
      </motion.div>

      {/* Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {components.map((c, i) => <ComponentCard key={`${c.type}-${i}`} component={c} original={originals[i]} index={i} market={market} onSwap={() => setSwapIndex(i)} onRevert={() => handleRevert(i)} onInfo={() => setInfoIndex(i)} />)}
      </div>

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
              {showFR && <th className="text-right py-2 font-medium">FR</th>}
              {showCH && <th className="text-right py-2 font-medium">CH</th>}
              <th className="text-right py-2 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => <PriceRow key={`row-${c.type}-${i}`} component={c} index={i} changed={c.name !== originals[i].name} market={market} t={t} />)}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="pt-4">{t("result.total")}</td>
              {showFR && <td className="text-right pt-4">{totalFR}&euro;</td>}
              {showCH && <td className="text-right pt-4">{totalCH} CHF</td>}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </motion.div>

      <p className="text-xs text-text-secondary mb-10 px-1">{t("result.disclaimer")}</p>

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-3 pb-8">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowQuote(true)} className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
          {t("quote.btn")}
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.save")}</motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReset} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.newConfig")}</motion.button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {swapIndex !== null && <AlternativesModal component={components[swapIndex]} allComponents={components} usage={config.config_name} budget={config.total_estimated} market={market} onSelect={(alt) => handleSelectAlternative(swapIndex, alt)} onClose={() => setSwapIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {infoIndex !== null && <InfoModal component={components[infoIndex]} onClose={() => setInfoIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showQuote && <QuoteModal config={config} components={components} market={market} totalFR={totalFR} totalCH={totalCH} onClose={() => setShowQuote(false)} />}
      </AnimatePresence>
    </div>
  );
}
