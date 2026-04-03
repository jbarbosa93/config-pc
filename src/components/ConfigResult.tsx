"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { PCConfig, Component, Alternative } from "@/lib/types";
import { buildSearchUrl, buildToppreiseUrl } from "@/lib/affiliates";
import { jsPDF } from "jspdf";
import { useCart } from "@/lib/cart";
import { ComponentSVG as SharedComponentSVG, ComponentImage } from "@/components/ComponentSVG";

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

  if (key.includes("moniteur") || key.includes("ecran") || key.includes("monitor")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="12" width="60" height="40" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5"/>
      <rect x="14" y="16" width="52" height="32" rx="2" fill="#3B82F6" opacity="0.08"/>
      <line x1="14" y1="44" x2="66" y2="44" stroke="#3B82F6" strokeWidth="0.8" opacity="0.3"/>
      <rect x="30" y="52" width="20" height="4" rx="1.5" fill="#3B82F6" opacity="0.15" stroke="#3B82F6" strokeWidth="0.8"/>
      <rect x="25" y="56" width="30" height="3" rx="1.5" fill="#3B82F6" opacity="0.1" stroke="#3B82F6" strokeWidth="0.6"/>
      <circle cx="40" cy="32" r="6" fill="#3B82F6" opacity="0.1">
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="2s" repeatCount="indefinite"/>
      </circle>
      <rect x="18" y="20" width="8" height="5" rx="1" fill="#3B82F6" opacity="0.12"/>
      <text x="40" y="69" textAnchor="middle" fontSize="6" fill="#3B82F6" opacity="0.4" fontFamily="system-ui">Hz</text>
    </svg>
  );

  if (key.includes("souris") || key.includes("mouse")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="24" y="12" width="32" height="52" rx="16" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5"/>
      <line x1="40" y1="12" x2="40" y2="32" stroke="#10B981" strokeWidth="1" opacity="0.3"/>
      <rect x="36" y="18" width="8" height="12" rx="4" fill="#10B981" opacity="0.12" stroke="#10B981" strokeWidth="0.8"/>
      <circle cx="40" cy="24" r="2" fill="#10B981" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <ellipse cx="40" cy="48" rx="10" ry="8" fill="#10B981" opacity="0.05"/>
      <circle cx="32" cy="40" r="1.5" fill="#10B981" opacity="0.2"/>
      <circle cx="48" cy="40" r="1.5" fill="#10B981" opacity="0.2"/>
    </svg>
  );

  if (key.includes("clavier") || key.includes("keyboard")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="6" y="26" width="68" height="32" rx="5" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5"/>
      {[14,22,30,38,46,54,62].map((x,i) => (
        <rect key={`k1${x}`} x={x} y="32" width="6" height="6" rx="1" fill="#8B5CF6" opacity="0.12" stroke="#8B5CF6" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur="2s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
        </rect>
      ))}
      {[18,26,34,42,50,58].map(x => (
        <rect key={`k2${x}`} x={x} y="40" width="6" height="6" rx="1" fill="#8B5CF6" opacity="0.1" stroke="#8B5CF6" strokeWidth="0.5"/>
      ))}
      <rect x="22" y="48" width="36" height="5" rx="1.5" fill="#8B5CF6" opacity="0.08" stroke="#8B5CF6" strokeWidth="0.5"/>
    </svg>
  );

  if (key.includes("casque") || key.includes("headset") || key.includes("headphone")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <path d="M20 42C20 28.745 30.745 18 44 18H36C49.255 18 60 28.745 60 42" stroke="#EF4444" strokeWidth="2" fill="none"/>
      <rect x="16" y="38" width="10" height="18" rx="5" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5"/>
      <rect x="54" y="38" width="10" height="18" rx="5" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5"/>
      <rect x="18" y="42" width="6" height="10" rx="3" fill="#EF4444" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite"/>
      </rect>
      <rect x="56" y="42" width="6" height="10" rx="3" fill="#EF4444" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      </rect>
      <path d="M22 56L22 62C22 64 24 66 26 66L30 66" stroke="#EF4444" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
    </svg>
  );

  if (key.includes("chaise") || key.includes("chair") || key.includes("siege")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <path d="M28 16C28 14 30 12 32 12H48C50 12 52 14 52 16V44H28V16Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" rx="3"/>
      <rect x="26" y="44" width="28" height="8" rx="2" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="1"/>
      <path d="M30 52V60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M50 52V60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 60L30 60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M50 60L54 60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="62" r="2" fill="#F59E0B" opacity="0.3"/>
      <circle cx="52" cy="62" r="2" fill="#F59E0B" opacity="0.3"/>
      <rect x="24" y="20" width="4" height="16" rx="2" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
      <rect x="52" y="20" width="4" height="16" rx="2" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
    </svg>
  );

  if (key.includes("tapis") || key.includes("mousepad") || key.includes("deskpad")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="8" y="24" width="64" height="32" rx="4" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="12" y="28" width="56" height="24" rx="2" fill="#6B7280" opacity="0.04"/>
      {[20,32,44,56].map((x,i) => (
        <line key={x} x1={x} y1="30" x2={x} y2="50" stroke="#6B7280" strokeWidth="0.3" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite"/>
        </line>
      ))}
      <rect x="48" y="32" width="14" height="20" rx="7" stroke="#6B7280" strokeWidth="0.8" opacity="0.2"/>
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


function ProductImageWithFallback({ url, alt, type }: { url: string; alt: string; type: string }) {
  return <ComponentImage url={url} alt={alt} type={type} size={120} className="w-full h-full object-contain p-4" />;
}

function ProductImage({ type, name }: { type: string; name: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    fetch(`/api/components/search?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const images: { url: string; is_primary: boolean }[] = data?.component_images || [];
        const primary = images.find(i => i.is_primary)?.url || images[0]?.url || null;
        setImgUrl(primary);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [name]);

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
      className="w-[80px] h-[80px] rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary shrink-0 overflow-hidden"
    >
      <ComponentImage url={imgUrl} alt={name} type={type} size={72} className="w-full h-full object-contain p-1.5" />
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

const MERCHANT_STORES = [
  { storeId: "digitec", label: "Digitec" },
  { storeId: "galaxus", label: "Galaxus" },
  { storeId: "brack", label: "Brack.ch" },
  { storeId: "interdiscount", label: "Interdiscount" },
];

function MerchantTable({ component }: { component: Component }) {
  return (
    <div className="mt-3 rounded-lg border border-border bg-bg overflow-hidden">
      {MERCHANT_STORES.map((p, i) => (
        <a
          key={p.storeId}
          href={buildSearchUrl(p.storeId, component.name)}
          target="_blank" rel="noopener noreferrer"
          className={`flex items-center justify-between px-3 py-2.5 text-xs hover:bg-card transition-colors duration-150 ${i > 0 ? "border-t border-border" : ""}`}
        >
          <span className="font-medium text-text">{p.label}</span>
          <span className="text-xs font-semibold text-[#4f8ef7]">Voir →</span>
        </a>
      ))}
      <p className="px-3 py-2 text-[10px] text-[#AAA] border-t border-border">
        Prix indicatif — vérifiez sur le site du marchand
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
  available_ch?: boolean;
  component_images: DBImage[];
  component_prices: DBPrice[];
}

function ImageCarousel({ images, name, type, tall = false }: { images: DBImage[]; name: string; type: string; tall?: boolean }) {
  const h = tall ? "h-[300px]" : "h-[220px]";
  const primaryUrl = images?.find((i) => i.is_primary)?.url ?? images?.[0]?.url;
  return (
    <div className={`w-full ${h} rounded-xl bg-[#F8F8F8] border flex items-center justify-center`} style={{ borderColor: "#E5E5E5" }}>
      <ComponentImage url={primaryUrl} alt={name} type={type} size={tall ? 160 : 110} className="w-full h-full object-contain p-4" />
    </div>
  );
}


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

function InfoModal({ component, allComponents, onClose }: { component: Component; allComponents?: Component[]; onClose: () => void }) {
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const specs = { ...(component.specs || {}), ...(dbData?.specs || {}) };
  const description = dbData?.description || component.full_description || component.reason;
  const mfUrl = dbData?.manufacturer_url || manufacturerUrl;
  const brand = dbData?.brand || component.name.split(" ")[0];
  const displayPrice = dbData?.price_ch || component.price_ch;
  const tdp = dbData?.tdp || null;

  // Compatibility score (heuristic based on having matching specs)
  const compatScore = Math.min(100, 75 + (dbData?.socket ? 5 : 0) + (dbData?.form_factor ? 5 : 0) + (dbData?.chipset ? 5 : 0) + (Object.keys(specs).length > 3 ? 10 : 0));

  // "Pourquoi ce composant?" dynamic points — enriched with build context
  const whyPoints: string[] = [];
  if (component.reason) whyPoints.push(component.reason);

  // Build-specific context
  const others = allComponents || [];
  const cpu = others.find((c) => c.type === "CPU");
  const gpu = others.find((c) => c.type === "GPU");
  const mobo = others.find((c) => c.type === "Carte mère");
  const ram = others.find((c) => c.type === "RAM");
  const psu = others.find((c) => c.type === "Alimentation");

  const cType = component.type.toLowerCase();
  if (cType.includes("cpu") && gpu) {
    whyPoints.push(`Équilibré avec la ${gpu.name} pour éviter tout goulot d'étranglement.`);
  }
  if (cType.includes("gpu") && cpu) {
    whyPoints.push(`Parfaitement associé au ${cpu.name} pour des performances optimales.`);
  }
  if ((cType.includes("carte") && cType.includes("mère")) || cType.includes("mere")) {
    if (cpu) whyPoints.push(`Compatible avec le ${cpu.name} — même socket, même plateforme.`);
    if (ram) whyPoints.push(`Supporte la ${ram.name} sans problème de compatibilité.`);
  }
  if (cType.includes("ram") && mobo) {
    whyPoints.push(`Compatible avec la ${mobo.name} — bon couple mémoire/carte mère.`);
  }
  if (cType.includes("alimentation") && gpu) {
    whyPoints.push(`Puissance suffisante pour alimenter la ${gpu.name} et l'ensemble de la config.`);
  }
  if (cType.includes("refroidissement") && cpu) {
    whyPoints.push(`Refroidissement adapté au TDP du ${cpu.name}.`);
  }
  if (cType.includes("boîtier") || cType.includes("boitier")) {
    if (gpu) whyPoints.push(`Espace suffisant pour accueillir la ${gpu.name}.`);
    if (mobo) whyPoints.push(`Format compatible avec la ${mobo.name}.`);
  }

  // General points
  if (tdp && tdp <= 65) whyPoints.push("Faible consommation — silencieux et durable.");
  else if (tdp && tdp > 150) whyPoints.push("Haute performance — nécessite un bon flux d'air.");
  if (dbData?.release_year && dbData.release_year >= 2024) whyPoints.push("Composant récent avec les dernières technologies.");
  if (component.priority === "essentiel") whyPoints.push("Composant essentiel de cette configuration.");

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        key="panel"
        className="fixed inset-y-0 right-0 z-[101] w-full max-w-3xl bg-white shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #E5E5E5" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 text-[11px] px-2.5 py-1 rounded-full font-semibold text-white" style={{ background: "#4f8ef7" }}>{component.type}</span>
            <span className="text-sm font-medium text-[#444] truncate">{brand}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[#CCC]"><path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm text-[#666] truncate">{component.name}</span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 w-10 h-10 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] flex items-center justify-center text-[#444] hover:text-[#0A0A0A] transition-all ml-4 text-lg font-bold">✕</button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 flex flex-col gap-4 animate-pulse">
              <div className="flex gap-6">
                <div className="w-44 h-44 bg-[#F0F0F0] rounded-2xl shrink-0" />
                <div className="flex-1 flex flex-col gap-3 pt-2">
                  <div className="h-5 bg-[#F0F0F0] rounded w-1/3" />
                  <div className="h-7 bg-[#F0F0F0] rounded w-3/4" />
                  <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
                  <div className="h-16 bg-[#F0F0F0] rounded-xl mt-2" />
                  <div className="h-10 bg-[#F0F0F0] rounded-xl" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">

              {/* ── Hero: image or SVG + info ── */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product image */}
                {(() => {
                  const primaryImg = dbData?.component_images?.find(i => i.is_primary)?.url
                    || dbData?.component_images?.[0]?.url;
                  return (
                    <div className="w-full sm:w-44 h-44 shrink-0 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #E0ECFF 100%)" }}>
                      {primaryImg ? (
                        <ProductImageWithFallback url={primaryImg} alt={component.name} type={component.type} />
                      ) : (
                        <ComponentSVG type={component.type} size={120} />
                      )}
                    </div>
                  );
                })()}

                {/* Info */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#4f8ef7] uppercase tracking-wide">{brand}</span>
                    {dbData?.release_year && <span className="text-xs text-[#999] bg-[#F5F5F5] px-2 py-0.5 rounded-full">{dbData.release_year}</span>}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] leading-tight">{component.name}</h1>

                  {/* Badges with stagger */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      dbData?.socket ? <span key="socket" className="text-xs px-2.5 py-1 rounded-lg bg-[#F0F7FF] text-[#3B70C4] font-medium">Socket {dbData.socket}</span> : null,
                      dbData?.form_factor ? <span key="ff" className="text-xs px-2.5 py-1 rounded-lg bg-[#F5F5F5] text-[#555] font-medium">{dbData.form_factor}</span> : null,
                      tdp ? <TDPBadge key="tdp" tdp={tdp} /> : null,
                      dbData?.chipset ? <span key="chipset" className="text-xs px-2.5 py-1 rounded-lg bg-[#F0FFF4] text-[#2F855A] font-medium">{dbData.chipset}</span> : null,
                    ].filter(Boolean).map((badge, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 + i * 0.07, type: "spring", stiffness: 300 }}>
                        {badge}
                      </motion.div>
                    ))}
                  </div>

                  {/* Compatibility */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-[#888] uppercase tracking-wide font-medium">Compatibilité</span>
                    </div>
                    <CompatibilityScore score={compatScore} />
                  </div>

                  {/* Price box */}
                  <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 100%)", border: "1px solid #D0E4FF" }}>
                    <p className="text-[11px] text-[#888] uppercase tracking-wide font-medium mb-1">Prix estimé</p>
                    {displayPrice > 0 ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black" style={{ color: "#4f8ef7" }}><AnimatedPrice value={displayPrice} suffix="" /></span>
                        <span className="text-lg font-bold text-[#4f8ef7]">CHF</span>
                      </div>
                    ) : (
                      <span className="text-base font-medium text-[#999] italic">Prix à confirmer</span>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={buildSearchUrl("galaxus", component.name)}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-opacity"
                      style={{ background: "#4f8ef7" }}
                    >
                      Voir sur Galaxus →
                    </a>
                    {mfUrl !== "#" && (
                      <a href={mfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-[#555] hover:text-[#0A0A0A] transition-all" style={{ border: "1px solid #E5E5E5" }}>
                        Site fabricant →
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Description ── */}
              {description && (
                <p className="text-sm leading-relaxed text-[#555]">{description}</p>
              )}

              {/* ── Pourquoi ce composant? ── */}
              {whyPoints.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
                  <h2 className="text-sm font-bold text-[#4f8ef7] mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#4f8ef7" strokeWidth="1.5"/><path d="M8 5v4M8 11h.01" stroke="#4f8ef7" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Pourquoi ce composant ?
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {whyPoints.slice(0, 3).map((point, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="text-sm text-[#555] flex items-start gap-2">
                        <span className="text-[#4f8ef7] mt-0.5 shrink-0">•</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Marchands suisses ── */}
              <Accordion title="Acheter en Suisse" defaultOpen>
                <div>
                  {MERCHANT_STORES.map((p, i) => (
                    <motion.div
                      key={p.storeId}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t" : ""}`}
                      style={{ borderColor: "#F0F0F0" }}
                    >
                      <span className="font-medium text-[#0A0A0A]">{p.label}</span>
                      <a
                        href={buildSearchUrl(p.storeId, component.name)}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
                        style={{ background: "#4f8ef7" }}
                      >
                        Voir →
                      </a>
                    </motion.div>
                  ))}
                </div>
                <p className="px-4 py-3 text-xs text-[#AAA] border-t" style={{ borderColor: "#F0F0F0" }}>
                  Prix indicatif — vérifiez sur le site du marchand
                </p>
              </Accordion>

              {/* ── Specs table ── */}
              {(() => {
                const allRows: { label: string; value: string }[] = [];
                const added = new Set<string>();
                function addRow(label: string, value: string | number | null | undefined) {
                  if (value === null || value === undefined || value === "" || added.has(label.toLowerCase())) return;
                  const str = String(value);
                  if (str === "0" && (label.toLowerCase().includes("prix") || label.toLowerCase().includes("price"))) return;
                  added.add(label.toLowerCase());
                  allRows.push({ label, value: str });
                }
                addRow("Marque", dbData?.brand);
                addRow("Catégorie", component.type);
                addRow("Socket", dbData?.socket);
                addRow("Chipset", dbData?.chipset);
                addRow("Format", dbData?.form_factor);
                addRow("TDP", tdp ? `${tdp} W` : null);
                addRow("Année de sortie", dbData?.release_year);
                if (specs) { for (const [key, value] of Object.entries(specs)) addRow(SPEC_TRANSLATIONS[key] || key.replace(/_/g, ' '), value); }
                addRow("Score de popularité", dbData?.popularity_score ? `${dbData.popularity_score}/100` : null);
                if (dbData?.available_ch !== null && dbData?.available_ch !== undefined) addRow("Dispo Suisse", dbData.available_ch ? "Oui" : "Non");
                if (displayPrice && displayPrice > 0) addRow("Prix indicatif", `${displayPrice} CHF`);

                return allRows.length > 0 ? (
                  <Accordion title="Fiche technique" defaultOpen>
                    <div>
                      {allRows.map((row, i) => (
                        <motion.div key={row.label} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.18 }} className={`flex items-start justify-between px-4 py-3 text-sm ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#F0F0F0", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                          <span className="text-[#666] w-2/5 shrink-0">{row.label}</span>
                          <span className="font-medium text-[#0A0A0A] text-right flex-1">{row.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </Accordion>
                ) : null;
              })()}

            </div>
          )}
        </div>

        {/* ── Sticky footer ── */}
        {!loading && (
          <div className="shrink-0 bg-white px-6 py-4 flex flex-wrap gap-2 sm:gap-3" style={{ borderTop: "1px solid #E5E5E5" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !inCart && addItem(component)}
              className={`flex-1 min-w-[140px] py-3 rounded-xl text-sm font-semibold transition-all ${inCart ? "bg-green-100 text-green-700 border border-green-200" : "text-white"}`}
              style={inCart ? {} : { background: "#4f8ef7" }}
            >
              {inCart ? "✓ Dans le panier" : "Ajouter à ma config"}
            </motion.button>
            <a
              href={buildSearchUrl("galaxus", component.name)}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 min-w-[120px] py-3 rounded-xl text-sm font-semibold text-center hover:opacity-90 transition-opacity"
              style={{ border: "1px solid #E5E5E5", color: "#555" }}
            >
              Voir sur Galaxus →
            </a>
            <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-medium text-[#666] hover:text-[#333] transition-colors" style={{ border: "1px solid #E5E5E5" }}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </AnimatePresence>
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

/* ── Spec key → French label dictionary ── */
const SPEC_TRANSLATIONS: Record<string, string> = {
  // CPU
  cores: "Cœurs", threads: "Threads",
  base_clock: "Fréquence de base", boost_clock: "Fréquence boost",
  l3_cache_mb: "Cache L3 (MB)", l2_cache_mb: "Cache L2 (MB)",
  architecture: "Architecture", igpu: "GPU intégré",
  // GPU
  vram_gb: "VRAM (Go)", core_clock: "Fréquence cœur",
  memory_type: "Type mémoire", perf_score: "Score perf.",
  // RAM
  ddr_gen: "Génération DDR", frequency_mhz: "Fréquence (MHz)",
  total_gb: "Capacité (Go)", num_modules: "Nb modules",
  cas_latency: "Latence CAS", first_word_latency: "First Word Latency",
  // Storage
  capacity: "Capacité", interface: "Interface",
  read_speed: "Lecture (MB/s)", write_speed: "Écriture (MB/s)",
  // PSU
  wattage: "Puissance (W)", efficiency: "Certification 80+",
  modular: "Modulaire", psu_type: "Type PSU",
  // Case
  case_type: "Type boîtier", side_panel: "Panneau latéral",
  volume: "Volume (L)", color: "Couleur",
  // Cooler
  cooler_type: "Type refroidissement", fan_rpm: "Vitesse ventilateur",
  noise_level: "Niveau sonore (dB)", radiator_size: "Taille radiateur",
  // Keyboard
  switch_type: "Type de switch", backlit: "Rétroéclairage",
  tenkeyless: "Tenkeyless", connection: "Connexion", style: "Style",
  // Mouse
  tracking: "Type capteur", max_dpi: "DPI maximum",
  hand_orientation: "Main", weight_g: "Poids (g)",
  // Headset
  headphone_type: "Type casque", frequency_response: "Réponse fréquence",
  microphone: "Microphone", wireless: "Sans fil", enclosure: "Type enceinte",
  // Monitor
  resolution: "Résolution", panel_type: "Type dalle",
  refresh_rate: "Taux rafraîchissement", response_time: "Temps de réponse",
  size_inches: "Taille (pouces)", hdr: "HDR",
  // Common DB columns (already capitalised by assignTiers / configure route)
  Socket: "Socket", Chipset: "Chipset", Format: "Format",
  TDP: "TDP", "Année": "Année",
};

function translateSpecKey(key: string): string {
  return SPEC_TRANSLATIONS[key] ?? key.replace(/_/g, " ");
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
    // Merge individual DB fields into specs
    const mergedSpecs: Record<string, string> = {};
    if (c.socket) mergedSpecs["Socket"] = c.socket;
    if (c.chipset) mergedSpecs["Chipset"] = c.chipset;
    if (c.form_factor) mergedSpecs["Format"] = c.form_factor;
    if (c.tdp) mergedSpecs["TDP"] = `${c.tdp}W`;
    if (c.specs) {
      for (const [k, v] of Object.entries(c.specs)) {
        if (v !== null && v !== undefined) mergedSpecs[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      }
    }
    return {
      name: c.name,
      reason: c.description || "",
      tier,
      price_ch: c.price_ch,
      price_fr: c.price_ch,
      compatible: true,
      specs: mergedSpecs,
      images: c.component_images || [],
    } as Alternative & { specs: Record<string, string>; images: DBImage[] };
  }).filter(Boolean) as Alternative[];
}

/* ── Spec comparison helpers ── */

function parseNumeric(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v;
  const m = String(v).match(/[\d.]+/);
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

function AlternativesModal({ component, allComponents, usage, budget, preloadedAlts, onSelect, onClose }: { component: Component; allComponents: Component[]; usage: string; budget: number; preloadedAlts?: Alternative[]; onSelect: (a: Alternative) => void; onClose: () => void }) {
  const { t } = useLanguage();
  const [alternatives, setAlternatives] = useState<Alternative[]>(preloadedAlts ?? []);
  const [currentSpecs, setCurrentSpecs] = useState<Record<string, string>>(component.specs ?? {});
  const [loading, setLoading] = useState(!preloadedAlts || preloadedAlts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If preloaded alternatives exist, skip fetching
    if (preloadedAlts && preloadedAlts.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        // Try DB first
        const dbRes = await fetch(`/api/db-components?type=${encodeURIComponent(component.type)}`);
        if (dbRes.ok) {
          const dbItems: DBComponent[] = await dbRes.json();
          // Get current component specs from DB — merge individual fields + specs JSON
          const compLower = component.name.toLowerCase();
          const dbCurrent = dbItems.find((c) => c.name.toLowerCase() === compLower)
            || dbItems.find((c) => c.name.toLowerCase().includes(compLower) || compLower.includes(c.name.toLowerCase()));
          if (dbCurrent) {
            const merged: Record<string, string> = {};
            if (dbCurrent.socket) merged["Socket"] = dbCurrent.socket;
            if (dbCurrent.chipset) merged["Chipset"] = dbCurrent.chipset;
            if (dbCurrent.form_factor) merged["Format"] = dbCurrent.form_factor;
            if (dbCurrent.tdp) merged["TDP"] = `${dbCurrent.tdp}W`;
            if (dbCurrent.specs) {
              for (const [k, v] of Object.entries(dbCurrent.specs)) {
                if (v !== null && v !== undefined) merged[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
              }
            }
            setCurrentSpecs(merged);
          } else if (component.specs && Object.keys(component.specs).length > 0) {
            setCurrentSpecs(component.specs);
          }
          const filtered = dbItems.filter((c) => c.name.toLowerCase() !== compLower && !c.name.toLowerCase().includes(compLower));
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
  }, [component, allComponents, usage, budget, preloadedAlts, t]);

  const handleOutside = useCallback((e: MouseEvent) => { if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose(); }, [onClose]);
  useEffect(() => { document.addEventListener("mousedown", handleOutside); return () => document.removeEventListener("mousedown", handleOutside); }, [handleOutside]);

  // Best value = lowest price among alternatives (simplest heuristic)
  const bestValueIndex = alternatives.length > 0
    ? alternatives.reduce((bi, alt, i) => alt.price_ch < alternatives[bi].price_ch ? i : bi, 0)
    : -1;

  // Collect ALL spec keys from current + all alternatives for full comparison
  const allSpecKeys = Array.from(new Set([
    ...Object.keys(currentSpecs),
    ...alternatives.flatMap((a) => Object.keys(a.specs || {})),
  ]));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-bg border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl">

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
          {Object.keys(currentSpecs).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(currentSpecs).map(([k, v]) => (
                <span key={k} className="text-[10px] px-2 py-0.5 rounded-md bg-white/70 border border-blue-200 text-[#4f8ef7] font-medium">
                  {translateSpecKey(k)}: {v}
                </span>
              ))}
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
              const altSpecs = alt.specs || {};
              // Union of all spec keys for this alternative + current
              const specKeys = Array.from(new Set([...allSpecKeys, ...Object.keys(altSpecs)]));
              const primaryImg = alt.images?.find((img) => img.is_primary) || alt.images?.[0];
              const isBestValue = i === bestValueIndex;
              return (
                <motion.div key={alt.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }} className="rounded-xl border border-border hover:border-border-hover transition-colors duration-150 p-4 bg-card">

                  {/* Alt header row */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-lg bg-bg border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      <ComponentImage url={primaryImg?.url} alt={alt.name} type={component.type} size={48} className="w-full h-full object-contain p-1" />
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

                  {/* Spec comparison table — ALL specs */}
                  {specKeys.length > 0 && (
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
                          {specKeys.map((k, si) => {
                            const curV = currentSpecs[k];
                            const altV = altSpecs[k];
                            if (!curV && !altV) return null;
                            return (
                              <tr key={k} style={{ background: si % 2 === 0 ? "#FFFFFF" : "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
                                <td className="px-3 py-1.5 text-text-secondary font-medium">{translateSpecKey(k)}</td>
                                <td className={`px-2 py-1.5 text-center tabular-nums ${curV != null ? "text-text-secondary" : "text-[#CCC] italic"}`}>{curV != null ? String(curV) : "N/A"}</td>
                                <td className={`px-2 py-1.5 text-center tabular-nums font-medium ${altV != null ? "text-text" : "text-[#CCC] italic"}`}>{altV != null ? String(altV) : "N/A"}</td>
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

/* ── Performance Section ── */

function PerformanceSection({ components }: { components: Component[] }) {
  const [gpuScore, setGpuScore] = useState<number | null>(null);
  const [cpuScore, setCpuScore] = useState<number | null>(null);
  const [gpuName, setGpuName] = useState<string>("");

  const gpuComp = components.find(c => c.type.toLowerCase().includes("gpu") || c.type.toLowerCase().includes("graphi"));
  const cpuComp = components.find(c => c.type.toLowerCase().includes("cpu") || c.type.toLowerCase().includes("processeur"));

  useEffect(() => {
    if (!gpuComp?.name) return;
    fetch(`/api/components/search?name=${encodeURIComponent(gpuComp.name)}`)
      .then(r => r.json())
      .then(data => {
        const score = data?.specs?.perf_score;
        if (score != null) { setGpuScore(Number(score)); setGpuName(data.name || gpuComp.name); }
        // fallback: try from specs in config
        else if (gpuComp.specs?.perf_score) setGpuScore(Number(gpuComp.specs.perf_score));
      }).catch(() => {});
  }, [gpuComp?.name]);

  useEffect(() => {
    if (!cpuComp?.name) return;
    fetch(`/api/components/search?name=${encodeURIComponent(cpuComp.name)}`)
      .then(r => r.json())
      .then(data => {
        const cores = Number(data?.specs?.cores || cpuComp.specs?.cores || 6);
        const boost = parseFloat(String(data?.specs?.boost_clock || cpuComp.specs?.boost_clock || "4").replace(/[^\d.]/g, ""));
        // heuristic cpu score: cores * boost / normalizer
        const heuristic = Math.min(100, Math.round((cores * boost) / 0.6));
        setCpuScore(heuristic);
      }).catch(() => {});
  }, [cpuComp?.name]);

  // Only show if we have a GPU score
  if (!gpuScore && !cpuScore) return null;

  const score = gpuScore || 50;
  const cpu = cpuScore || 60;

  const perfs: { label: string; score: number; color: string }[] = [
    { label: "Gaming 1080p",   score: Math.min(100, score),                                    color: "#22c55e" },
    { label: "Gaming 1440p",   score: Math.min(100, Math.round(score * 0.82)),                  color: "#4f8ef7" },
    { label: "Gaming 4K",      score: Math.min(100, Math.round(score * 0.58)),                  color: "#8b5cf6" },
    { label: "Streaming",      score: Math.min(100, Math.round((cpu + score) / 2 * 0.78)),      color: "#f59e0b" },
    { label: "Montage vidéo",  score: Math.min(100, Math.round(cpu * 0.65)),                    color: "#ef4444" },
  ];

  function scoreLabel(s: number) {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Très bon";
    if (s >= 55) return "Bon";
    if (s >= 40) return "Correct";
    return "Limité";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
      className="rounded-xl border border-border bg-card p-6 mb-4"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium">Performances estimées</h3>
        {gpuName && <span className="text-xs text-text-secondary truncate max-w-[200px]">{gpuName}</span>}
      </div>
      <div className="space-y-3">
        {perfs.map(({ label, score: s, color }) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-text">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">{scoreLabel(s)}</span>
                <span className="text-sm font-bold tabular-nums" style={{ color }}>{s}/100</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s}%` }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: color }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-text-secondary mt-4 italic">
        Scores basés sur le GPU {gpuName ? `(${gpuName})` : "sélectionné"}. Valeurs indicatives.
      </p>
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
        <ProductImage type={component.type} name={component.name} />
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
        {component.price_ch > 0 ? (
          <>
            <span className="text-3xl font-extrabold" style={{ color: "#4f8ef7" }}>{component.price_ch}</span>
            <span className="text-base font-semibold text-[#4f8ef7]">CHF</span>
          </>
        ) : (
          <span className="text-sm font-medium text-[#999] italic">Prix à confirmer</span>
        )}
      </div>

      {/* Merchant price table */}
      <MerchantTable component={component} />

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

function PriceRow({ component, changed, t, onInfo }: { component: Component; index: number; changed: boolean; t: (k: string) => string; onInfo: () => void }) {
  return (
    <tr className="border-b border-border/50 hover:bg-card/50 transition-colors duration-150">
      <td className="py-3">
        <span className="font-medium">{component.type}</span>
        <span className="text-text-secondary ml-2 text-xs">{component.name}</span>
        {changed && <span className="ml-2 text-[10px] text-text-secondary">({t("result.changed")})</span>}
      </td>
      <td className="text-right py-3 flex items-center justify-end gap-3">
        <button type="button" onClick={onInfo} className="text-[10px] px-2 py-0.5 rounded border border-border text-text-secondary hover:text-[#4f8ef7] hover:border-[#4f8ef7] transition-all font-medium">Infos &rarr;</button>
        <span className="tabular-nums font-medium">{component.price_ch > 0 ? `${component.price_ch} CHF` : <span className="text-[#999] italic text-xs">Prix à confirmer</span>}</span>
      </td>
    </tr>
  );
}

/* ── Peripherals & Setup Section ── */

const PERIPHERAL_CATEGORIES = [
  { type: "Moniteur", icon: "🖥️", color: "#3B82F6", bg: "#EFF6FF" },
  { type: "Clavier", icon: "⌨️", color: "#8B5CF6", bg: "#F5F3FF" },
  { type: "Souris", icon: "🖱️", color: "#10B981", bg: "#ECFDF5" },
  { type: "Casque", icon: "🎧", color: "#EF4444", bg: "#FEF2F2" },
  { type: "Chaise gaming", icon: "🪑", color: "#F59E0B", bg: "#FFFBEB" },
  { type: "Tapis de souris", icon: "🎯", color: "#6B7280", bg: "#F9FAFB" },
];

/** Get type-specific spec keys to display on peripheral cards */
function getPeripheralSpecs(type: string, specs: Record<string, string>): [string, string][] {
  const t = type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const s = (keys: string[]): [string, string][] => {
    const results: [string, string][] = [];
    for (const key of keys) {
      // Find matching spec key (case-insensitive partial match)
      const found = Object.entries(specs).find(([k]) => k.toLowerCase().includes(key.toLowerCase()));
      if (found) results.push(found);
    }
    return results;
  };

  if (t.includes("moniteur") || t.includes("ecran")) return s(["taille", "resolution", "hz", "rafra", "dalle", "panel", "hdr", "temps de reponse", "response"]);
  if (t.includes("souris")) return s(["dpi", "bouton", "poids", "weight", "filaire", "sans fil", "wireless", "capteur", "sensor"]);
  if (t.includes("clavier")) return s(["switch", "format", "layout", "rgb", "retroeclair", "sans fil", "wireless", "filaire"]);
  if (t.includes("casque")) return s(["type", "micro", "sans fil", "wireless", "impedance", "driver", "frequence", "reponse"]);
  if (t.includes("chaise")) return s(["materiau", "poids max", "accoudoir", "garantie", "inclinaison", "roulette"]);
  if (t.includes("tapis")) return s(["dimension", "taille", "epaisseur", "surface", "base", "materiau"]);
  // Generic fallback
  return Object.entries(specs).slice(0, 4).map(([k, v]) => [k, v]);
}

function PeripheralCard({ item, color, bg, onInfo }: { item: DBComponent & { component_images?: DBImage[] }; color: string; bg: string; onInfo: () => void }) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.name === item.name);
  const specs = item.specs || {};

  const asComponent: Component = {
    type: item.type, name: item.name, reason: item.description || "",
    price_fr: item.price_fr, price_ch: item.price_ch, search_terms: [item.name],
    priority: "optionnel", manufacturer_url: item.manufacturer_url,
    specs: item.specs,
  };

  const displaySpecs = getPeripheralSpecs(item.type, specs);

  return (
    <div className="rounded-xl border p-3 transition-all duration-150 hover:border-[#CCC] hover:shadow-sm group flex flex-col" style={{ borderColor: "#E5E5E5", background: bg }}>
      {/* Image */}
      <div className="w-full h-24 rounded-lg bg-white/60 border border-white/80 flex items-center justify-center mb-2.5 overflow-hidden">
        <ComponentImage
          url={item.component_images?.find((i: DBImage) => i.is_primary)?.url || item.component_images?.[0]?.url}
          alt={item.name}
          type={item.type}
          size={56}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Info */}
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{item.brand}</p>
      <p className="text-xs font-semibold text-[#333] mt-0.5 leading-snug line-clamp-2">{item.name}</p>

      {/* Type-specific specs */}
      {displaySpecs.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {displaySpecs.slice(0, 5).map(([k, v]) => (
            <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-white/70 border border-white text-[#666]">{k}: {String(v)}</span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-1 mt-2">
        {item.price_ch > 0 ? (
          <>
            <span className="text-lg font-bold" style={{ color: "#4f8ef7" }}>{item.price_ch}</span>
            <span className="text-xs font-medium text-[#4f8ef7]">CHF</span>
          </>
        ) : (
          <span className="text-[10px] text-[#999] italic">Prix à confirmer</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-2 mt-auto">
        <button type="button" onClick={onInfo} className="flex-1 text-[10px] py-1.5 rounded-lg border border-[#E5E5E5] text-[#666] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-all font-medium">
          Infos produit
        </button>
        <button
          type="button"
          onClick={() => !inCart && addItem(asComponent)}
          className={`flex-1 text-[10px] py-1.5 rounded-lg font-medium transition-all ${inCart ? "bg-green-100 text-green-700 border border-green-200" : "text-white border border-transparent"}`}
          style={inCart ? {} : { background: "#4f8ef7" }}
        >
          {inCart ? "Dans le panier" : "+ Panier"}
        </button>
      </div>
    </div>
  );
}

function PeripheralsSection({ onPeripheralInfo }: { onPeripheralInfo: (comp: Component) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [peripherals, setPeripherals] = useState<Record<string, (DBComponent & { component_images?: DBImage[] })[]>>({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!expanded || loaded) return;
    setLoading(true);
    Promise.all(
      PERIPHERAL_CATEGORIES.map((cat) =>
        fetch(`/api/db-components?type=${encodeURIComponent(cat.type)}&limit=12`)
          .then((r) => r.json())
          .then((data: DBComponent[]) => ({ type: cat.type, items: data }))
          .catch(() => ({ type: cat.type, items: [] }))
      )
    ).then((results) => {
      const map: Record<string, DBComponent[]> = {};
      for (const r of results) map[r.type] = r.items;
      setPeripherals(map);
      setLoaded(true);
      setLoading(false);
    });
  }, [expanded, loaded]);

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} className="w-6 h-6 rounded-full border-2 border-[#E5E5E5]" style={{ borderTopColor: "#4f8ef7" }} />
              </div>
            ) : (
              <div className="flex flex-col gap-5 pt-4">
                {PERIPHERAL_CATEGORIES.map((cat, ci) => {
                  const items = (peripherals[cat.type] || []).slice(0, 8);
                  if (items.length === 0) return null;
                  return (
                    <motion.div key={cat.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.type}</span>
                        <span className="text-[10px] text-[#AAA] ml-1">{items.length} produits</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {items.map((item) => {
                          const primaryImg = (item as DBComponent & { component_images?: DBImage[] }).component_images?.find((img: DBImage) => img.is_primary) || (item as DBComponent & { component_images?: DBImage[] }).component_images?.[0];
                          return (
                            <PeripheralCard
                              key={item.name}
                              item={item as DBComponent & { component_images?: DBImage[] }}
                              color={cat.color}
                              bg={cat.bg}
                              onInfo={() => onPeripheralInfo({
                                type: item.type, name: item.name, reason: item.description || "",
                                price_fr: item.price_fr, price_ch: item.price_ch, search_terms: [item.name],
                                priority: "optionnel", image_url: primaryImg?.url, manufacturer_url: item.manufacturer_url,
                                specs: item.specs,
                              })}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Share Config Button ── */

function ShareConfigButton({ config }: { config: PCConfig }) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleShare() {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/configs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  const label =
    state === "loading" ? "Génération du lien..." :
    state === "copied" ? "Lien copié ✓" :
    state === "error" ? "Erreur — réessayer" :
    shareUrl ? "Copier le lien" :
    "Partager ma config";

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleShare}
      disabled={state === "loading"}
      className="px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-150 disabled:opacity-60"
      style={{
        borderColor: state === "copied" ? "#22C55E" : "#4f8ef7",
        color: state === "copied" ? "#22C55E" : "#4f8ef7",
        background: state === "copied" ? "#f0fdf4" : "#eff6ff",
      }}
    >
      {state === "loading" ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
          Génération...
        </span>
      ) : label}
    </motion.button>
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
  const [peripheralInfo, setPeripheralInfo] = useState<Component | null>(null);

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
    const doc = new jsPDF();
    const blue = "#4f8ef7";
    const dark = "#0A0A0A";
    const gray = "#666666";
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(blue);
    doc.text("config-pc.ch", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(gray);
    doc.text("Ta config PC parfaite — www.config-pc.ch", 20, y);
    y += 14;

    // Config name
    doc.setFontSize(20);
    doc.setTextColor(dark);
    doc.text(config.config_name, 20, y);
    y += 10;

    // Total
    doc.setFontSize(14);
    doc.setTextColor(blue);
    doc.text(`Total: ${totalCH} CHF`, 20, y);
    y += 12;

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 8;

    // Components
    doc.setFontSize(12);
    doc.setTextColor(dark);
    doc.text("Composants", 20, y);
    y += 8;

    components.forEach((c) => {
      if (y > 260) { doc.addPage(); y = 20; }

      // Type badge
      doc.setFontSize(9);
      doc.setTextColor(blue);
      doc.text(c.type.toUpperCase(), 20, y);

      // Price
      doc.setTextColor(blue);
      doc.text(`${c.price_ch} CHF`, 170, y, { align: "right" });

      y += 5;

      // Name
      doc.setFontSize(11);
      doc.setTextColor(dark);
      doc.text(c.name, 20, y);
      y += 5;

      // Reason
      if (c.reason) {
        doc.setFontSize(8);
        doc.setTextColor(gray);
        const lines = doc.splitTextToSize(c.reason, 150);
        doc.text(lines, 20, y);
        y += lines.length * 4;
      }

      // Specs
      if (c.specs && Object.keys(c.specs).length > 0) {
        doc.setFontSize(7);
        doc.setTextColor("#999999");
        const specStr = Object.entries(c.specs).map(([k, v]) => `${k}: ${v}`).join(" · ");
        const specLines = doc.splitTextToSize(specStr, 150);
        doc.text(specLines, 20, y);
        y += specLines.length * 3.5;
      }

      y += 6;
    });

    // Notes
    if (y > 240) { doc.addPage(); y = 20; }
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 8;

    if (config.compatibility_notes) {
      doc.setFontSize(9);
      doc.setTextColor(dark);
      doc.text("Compatibilité", 20, y);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(gray);
      const lines = doc.splitTextToSize(config.compatibility_notes, 160);
      doc.text(lines, 20, y);
      y += lines.length * 4 + 4;
    }

    if (config.upgrade_path) {
      doc.setFontSize(9);
      doc.setTextColor(dark);
      doc.text("Évolutivité", 20, y);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(gray);
      const lines = doc.splitTextToSize(config.upgrade_path, 160);
      doc.text(lines, 20, y);
      y += lines.length * 4 + 4;
    }

    // Footer
    if (y > 270) { doc.addPage(); y = 20; }
    y = 280;
    doc.setFontSize(7);
    doc.setTextColor("#AAAAAA");
    doc.text("Généré par config-pc.ch · Prix indicatifs · j.barbosa@config-pc.ch", 105, y, { align: "center" });

    doc.save(`${config.config_name.replace(/\s+/g, "_")}.pdf`);
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
      <PeripheralsSection onPeripheralInfo={(comp) => setPeripheralInfo(comp)} />

      {/* Performance section */}
      <PerformanceSection components={components} />

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
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => <PriceRow key={`row-${c.type}-${i}`} component={c} index={i} changed={c.name !== originals[i].name} t={t} onInfo={() => setInfoIndex(i)} />)}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="pt-4">{t("result.total")}</td>
              <td className="text-right pt-4 font-bold" style={{ color: "#4f8ef7" }}>{totalCH} CHF</td>
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
        <ShareConfigButton config={{ ...config, components }} />
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReset} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.newConfig")}</motion.button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {swapIndex !== null && <AlternativesModal component={components[swapIndex]} allComponents={components} usage={config.config_name} budget={config.total_estimated} preloadedAlts={config.preloadedAlternatives?.[components[swapIndex].type]} onSelect={(alt) => handleSelectAlternative(swapIndex, alt)} onClose={() => setSwapIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {infoIndex !== null && <InfoModal component={components[infoIndex]} allComponents={components} onClose={() => setInfoIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {peripheralInfo !== null && <InfoModal component={peripheralInfo} onClose={() => setPeripheralInfo(null)} />}
      </AnimatePresence>
    </div>
  );
}
