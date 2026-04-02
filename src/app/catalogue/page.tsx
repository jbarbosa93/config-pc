"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import Link from "next/link";
import { ComponentImage } from "@/components/ComponentSVG";

/* ── Types ── */
interface ComponentImage {
  url: string;
  is_primary: boolean;
  alt_text: string;
}

interface Component {
  id: string;
  type: string;
  name: string;
  brand: string;
  specs: Record<string, string>;
  price_ch: number;
  description: string;
  socket: string | null;
  chipset: string | null;
  form_factor: string | null;
  tdp: number | null;
  popularity_score: number;
  component_images: ComponentImage[];
}

/* ── Category config ── */
const CATEGORIES = [
  { key: "all", label: "Tout", icon: "⚡" },
  { key: "CPU", label: "Processeurs", icon: "🧠" },
  { key: "GPU", label: "Cartes graphiques", icon: "🎮" },
  { key: "RAM", label: "Mémoire RAM", icon: "📊" },
  { key: "Stockage", label: "Stockage", icon: "💾" },
  { key: "Carte mère", label: "Cartes mères", icon: "🔧" },
  { key: "Alimentation", label: "Alimentations", icon: "⚡" },
  { key: "Boîtier", label: "Boîtiers", icon: "🖥️" },
  { key: "Refroidissement", label: "Refroidissement", icon: "❄️" },
  { key: "Clavier", label: "Claviers", icon: "⌨️" },
  { key: "Souris", label: "Souris", icon: "🖱️" },
  { key: "Casque", label: "Casques", icon: "🎧" },
];

const TYPE_COLORS: Record<string, string> = {
  CPU: "bg-blue-50 text-blue-700 border-blue-200",
  GPU: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RAM: "bg-purple-50 text-purple-700 border-purple-200",
  Stockage: "bg-orange-50 text-orange-700 border-orange-200",
  "Carte mère": "bg-red-50 text-red-700 border-red-200",
  Alimentation: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Boîtier": "bg-gray-50 text-gray-700 border-gray-200",
  Refroidissement: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Clavier: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Souris: "bg-pink-50 text-pink-700 border-pink-200",
  Casque: "bg-violet-50 text-violet-700 border-violet-200",
};

const SPEC_LABELS: Record<string, string> = {
  cores: "Coeurs", base_clock: "Fréquence de base", boost_clock: "Fréquence boost",
  architecture: "Architecture", igpu: "GPU intégré", chipset: "Chipset", vram: "VRAM",
  core_clock: "Fréquence coeur", length: "Longueur", color: "Couleur",
  speed: "Vitesse", modules: "Modules", cas_latency: "Latence CAS",
  first_word_latency: "First Word Latency", capacity: "Capacité",
  form_factor: "Format", interface: "Interface", cache: "Cache", type: "Type",
  memory_max: "RAM max", memory_slots: "Slots RAM", wattage: "Puissance (W)",
  efficiency: "Certification", modular: "Modulaire", psu_type: "Type PSU",
  case_type: "Type boîtier", side_panel: "Panneau latéral", volume: "Volume",
  cooler_type: "Type refroidissement", fan_rpm: "Vitesse ventilateur",
  noise_level: "Niveau sonore", radiator_size: "Taille radiateur",
  style: "Style", switch_type: "Type de switch", backlit: "Rétroéclairage",
  tenkeyless: "Tenkeyless", connection: "Connexion",
  tracking: "Type capteur", max_dpi: "DPI maximum", hand_orientation: "Main",
  headphone_type: "Type", frequency_response: "Réponse en fréquence",
  microphone: "Microphone", wireless: "Sans fil", enclosure: "Type enceinte",
};

/* ── Spec display helpers ── */
function getMainSpecs(component: Component): { label: string; value: string }[] {
  const s = component.specs;
  const type = component.type;
  switch (type) {
    case "CPU": {
      const threads = s.threads ? String(s.threads) : null;
      const cores = s.cores ? String(s.cores) : null;
      const coreThread = cores && threads ? `${cores}C/${threads}T` : cores || null;
      const l3 = s.l3_cache_mb ? `${s.l3_cache_mb} Mo L3` : null;
      return [
        coreThread && { label: "Cœurs", value: coreThread },
        l3 && { label: "Cache", value: l3 },
        s.boost_clock && { label: "Boost", value: String(s.boost_clock) },
        component.socket && { label: "Socket", value: component.socket },
      ].filter(Boolean) as { label: string; value: string }[];
    }
    case "GPU": {
      const vram = s.vram_gb ? `${s.vram_gb} Go` : s.memory ? String(s.memory) : null;
      const arch = s.architecture ? String(s.architecture) : null;
      return [
        vram && { label: "VRAM", value: vram },
        arch && { label: "Archi", value: arch },
        s.boost_clock && { label: "Boost", value: String(s.boost_clock) },
      ].filter(Boolean) as { label: string; value: string }[];
    }
    case "RAM": {
      const ddr = s.ddr_gen ? String(s.ddr_gen) : null;
      const freq = s.frequency_mhz ? `${s.ddr_gen || "DDR"}-${s.frequency_mhz}` : s.speed ? String(s.speed) : null;
      const mods = s.num_modules && s.total_gb ? `${s.num_modules}×${Math.round(Number(s.total_gb) / Number(s.num_modules))} Go` : s.modules ? String(s.modules) : null;
      return [
        freq && { label: "Vitesse", value: freq },
        mods && { label: "Config", value: mods },
        !freq && ddr && { label: "Type", value: ddr },
      ].filter(Boolean) as { label: string; value: string }[];
    }
    case "Stockage":
      return [s.capacity && { label: "Capacité", value: s.capacity }, s.interface && { label: "Interface", value: s.interface }, s.form_factor && { label: "Format", value: s.form_factor }].filter(Boolean) as { label: string; value: string }[];
    case "Carte mère":
      return [component.socket && { label: "Socket", value: component.socket }, component.chipset && { label: "Chipset", value: component.chipset }, component.form_factor && { label: "Format", value: component.form_factor }, s.memory_slots && { label: "Slots RAM", value: s.memory_slots }].filter(Boolean) as { label: string; value: string }[];
    case "Alimentation":
      return [s.wattage && { label: "Puissance", value: `${s.wattage}W` }, s.efficiency && { label: "Certif.", value: s.efficiency }, s.modular && { label: "Modulaire", value: s.modular }].filter(Boolean) as { label: string; value: string }[];
    case "Boîtier":
      return [s.case_type && { label: "Type", value: s.case_type }, s.side_panel && { label: "Panneau", value: s.side_panel }, s.color && { label: "Couleur", value: s.color }].filter(Boolean) as { label: string; value: string }[];
    case "Refroidissement":
      return [s.cooler_type && { label: "Type", value: s.cooler_type }, s.fan_rpm && { label: "RPM", value: s.fan_rpm }, s.noise_level && { label: "Bruit", value: s.noise_level }].filter(Boolean) as { label: string; value: string }[];
    case "Clavier":
      return [s.switch_type && { label: "Switches", value: s.switch_type }, s.connection && { label: "Connexion", value: s.connection }, s.backlit && s.backlit !== "None" && { label: "Rétroéclairage", value: s.backlit }].filter(Boolean) as { label: string; value: string }[];
    case "Souris":
      return [s.max_dpi && { label: "DPI max", value: s.max_dpi }, s.connection && { label: "Connexion", value: s.connection }, s.tracking && { label: "Capteur", value: s.tracking }].filter(Boolean) as { label: string; value: string }[];
    case "Casque":
      return [s.microphone && { label: "Micro", value: s.microphone === "Yes" ? "Oui" : "Non" }, s.wireless && { label: "Sans fil", value: s.wireless === "Yes" ? "Oui" : "Non" }, s.enclosure && { label: "Type", value: s.enclosure }].filter(Boolean) as { label: string; value: string }[];
    default:
      return Object.entries(s).slice(0, 3).map(([k, v]) => ({ label: k, value: v }));
  }
}

function getAllSpecs(component: Component): { label: string; value: string }[] {
  const result: { label: string; value: string }[] = [];
  if (component.socket) result.push({ label: "Socket", value: component.socket });
  if (component.chipset) result.push({ label: "Chipset", value: component.chipset });
  if (component.form_factor) result.push({ label: "Format", value: component.form_factor });
  if (component.tdp) result.push({ label: "TDP", value: `${component.tdp}W` });
  for (const [key, val] of Object.entries(component.specs)) {
    if (val && val !== "N/A" && val !== "0") {
      result.push({ label: SPEC_LABELS[key] || key.replace(/_/g, " "), value: String(val) });
    }
  }
  return result;
}

/* ── Product Detail Panel ── */
function ProductDetail({ component, onClose }: { component: Component; onClose: () => void }) {
  const primaryImage = component.component_images?.find((i) => i.is_primary)?.url || component.component_images?.[0]?.url;
  const allSpecs = getAllSpecs(component);
  const colorClass = TYPE_COLORS[component.type] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="bg-gray-50 aspect-square flex items-center justify-center p-8">
          <ComponentImage
            url={primaryImage}
            alt={component.name}
            type={component.type}
            size={160}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${colorClass}`}>
              {component.type}
            </span>
            {component.popularity_score > 0 && (
              <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-full shrink-0">
                ★ {component.popularity_score} avis
              </span>
            )}
          </div>

          <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
            {component.brand}
          </p>
          <h2 className="text-xl font-bold mb-2">{component.name}</h2>
          {component.price_ch > 0 && (
            <p className="text-2xl font-bold mb-4" style={{ color: "#0A0A0A" }}>
              CHF {component.price_ch.toFixed(0)}
              <span className="text-sm font-normal text-text-secondary ml-2">prix indicatif</span>
            </p>
          )}

          {component.description && (
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {component.description}
            </p>
          )}

          {/* GPU Performance bar */}
          {component.type === "GPU" && component.specs?.perf_score && (
            <div className="mb-6 rounded-xl p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Score Performance</p>
              {[
                { label: "Gaming 1080p", score: Math.min(100, Number(component.specs.perf_score)) },
                { label: "Gaming 1440p", score: Math.min(100, Math.round(Number(component.specs.perf_score) * 0.82)) },
                { label: "Gaming 4K",   score: Math.min(100, Math.round(Number(component.specs.perf_score) * 0.58)) },
              ].map(({ label, score }) => (
                <div key={label} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{label}</span>
                    <span className="font-bold tabular-nums">{score}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${score}%`,
                        background: score >= 80 ? "#22c55e" : score >= 60 ? "#4f8ef7" : score >= 40 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              ))}
              {component.specs.architecture && (
                <p className="text-xs text-gray-400 mt-2">Architecture : {String(component.specs.architecture)}</p>
              )}
            </div>
          )}

          {/* CPU highlight specs */}
          {component.type === "CPU" && (component.specs?.threads || component.specs?.l3_cache_mb) && (
            <div className="mb-6 grid grid-cols-2 gap-3">
              {component.specs.threads && (
                <div className="rounded-xl p-3 bg-blue-50 text-center">
                  <p className="text-2xl font-bold text-blue-700">{String(component.specs.threads)}</p>
                  <p className="text-xs text-blue-500 font-medium mt-0.5">Threads</p>
                </div>
              )}
              {component.specs.l3_cache_mb && (
                <div className="rounded-xl p-3 bg-purple-50 text-center">
                  <p className="text-2xl font-bold text-purple-700">{String(component.specs.l3_cache_mb)}</p>
                  <p className="text-xs text-purple-500 font-medium mt-0.5">Mo Cache L3</p>
                </div>
              )}
            </div>
          )}

          {/* All Specs */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Spécifications
            </h3>
            <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
              {allSpecs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-2.5">
                  <span className="text-sm text-text-secondary">{spec.label}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search on retailers */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Trouver au meilleur prix
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Digitec", url: `https://www.digitec.ch/fr/search?q=${encodeURIComponent(component.name)}` },
                { name: "Galaxus", url: `https://www.galaxus.ch/fr/search?q=${encodeURIComponent(component.name)}` },
                { name: "Brack", url: `https://www.brack.ch/search?query=${encodeURIComponent(component.name)}` },
                { name: "TopPreise", url: `https://www.toppreise.ch/fr/search?q=${encodeURIComponent(component.name)}` },
              ].map((store) => (
                <a
                  key={store.name}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 hover:border-border-hover transition-all text-sm font-medium"
                >
                  {store.name}
                  <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Component Card ── */
function ComponentCard({ component, onClick }: { component: Component; onClick: () => void }) {
  const primaryImage = component.component_images?.find((i) => i.is_primary)?.url || component.component_images?.[0]?.url;
  const specs = getMainSpecs(component);
  const colorClass = TYPE_COLORS[component.type] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-border hover:border-border-hover hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center w-full h-full">
          <ComponentImage
            url={primaryImage}
            alt={component.name}
            type={component.type}
            size={100}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}>{component.type}</span>
        {component.popularity_score > 0 && (
          <span className="absolute top-3 right-3 text-xs text-text-secondary bg-white/80 backdrop-blur px-2 py-1 rounded-full">★ {component.popularity_score}</span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur text-sm font-medium px-4 py-2 rounded-full shadow-sm">
            Voir détails
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">{component.brand}</p>
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{component.name}</h3>
        {component.price_ch > 0 && (
          <p className="text-base font-bold mb-2" style={{ color: "#0A0A0A" }}>
            CHF {component.price_ch.toFixed(0)}
            <span className="text-xs font-normal text-text-secondary ml-1">indicatif</span>
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {specs.map((spec, i) => (
            <span key={i} className="inline-flex items-center text-[11px] bg-gray-100 text-text-secondary px-2 py-0.5 rounded-md">
              <span className="font-medium text-text mr-1">{spec.label}:</span>{spec.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Loading Skeleton ── */
function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded mt-3" />
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CataloguePage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<"popularity" | "price_asc" | "price_desc">("popularity");
  // Advanced filters
  const [filterVram, setFilterVram] = useState<string | null>(null);
  const [filterArch, setFilterArch] = useState<string | null>(null);
  const [filterCores, setFilterCores] = useState<string | null>(null);
  const [filterSocket, setFilterSocket] = useState<string | null>(null);
  const [filterDdr, setFilterDdr] = useState<string | null>(null);
  const [filterCapacity, setFilterCapacity] = useState<string | null>(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  // Close panel on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedComponent(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  async function fetchComponents() {
    setLoading(true);
    try {
      const res = await fetch("/api/catalogue");
      const data = await res.json();
      setComponents(data);
    } catch (err) {
      console.error("Failed to fetch components:", err);
    } finally {
      setLoading(false);
    }
  }

  // Compute max price ceiling from current category
  const priceCeiling = useMemo(() => {
    let base = components;
    if (activeCategory !== "all") base = base.filter((c) => c.type === activeCategory);
    const max = Math.max(...base.map((c) => c.price_ch || 0).filter(Boolean));
    return max > 0 ? Math.ceil(max / 100) * 100 : 5000;
  }, [components, activeCategory]);

  // Reset all filters when category changes
  useEffect(() => {
    setMaxPrice(priceCeiling);
    setFilterVram(null); setFilterArch(null);
    setFilterCores(null); setFilterSocket(null);
    setFilterDdr(null); setFilterCapacity(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, priceCeiling]);

  const filtered = useMemo(() => {
    let result = components;
    if (activeCategory !== "all") {
      result = result.filter((c) => c.type === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    result = result.filter((c) => !c.price_ch || c.price_ch <= maxPrice);

    // GPU filters
    if (filterVram) {
      result = result.filter((c) => {
        const v = Number(c.specs?.vram_gb || 0);
        if (filterVram === "16+") return v >= 16;
        return v === Number(filterVram);
      });
    }
    if (filterArch) {
      result = result.filter((c) =>
        String(c.specs?.architecture || "").toLowerCase().includes(filterArch.toLowerCase())
      );
    }

    // CPU filters
    if (filterCores) {
      result = result.filter((c) => {
        const cores = Number(c.specs?.cores || 0);
        if (filterCores === "12+") return cores >= 12;
        return cores === Number(filterCores);
      });
    }
    if (filterSocket) {
      result = result.filter((c) => (c.socket || "").toLowerCase() === filterSocket.toLowerCase());
    }

    // RAM filters
    if (filterDdr) {
      result = result.filter((c) =>
        String(c.specs?.ddr_gen || c.specs?.speed || "").toUpperCase().includes(filterDdr)
      );
    }
    if (filterCapacity) {
      result = result.filter((c) => {
        const gb = Number(c.specs?.total_gb || 0);
        if (filterCapacity === "64+") return gb >= 64;
        return gb === Number(filterCapacity);
      });
    }

    if (sortBy === "price_asc") result = [...result].sort((a, b) => (a.price_ch || 0) - (b.price_ch || 0));
    else if (sortBy === "price_desc") result = [...result].sort((a, b) => (b.price_ch || 0) - (a.price_ch || 0));
    return result;
  }, [components, activeCategory, search, maxPrice, sortBy, filterVram, filterArch, filterCores, filterSocket, filterDdr, filterCapacity]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: components.length };
    components.forEach((c) => { map[c.type] = (map[c.type] || 0) + 1; });
    return map;
  }, [components]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Logo /></Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-text-secondary hover:text-text transition-colors">Configurateur</Link>
            <span className="text-sm font-medium text-text">Catalogue</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Catalogue Composants</h1>
          <p className="text-text-secondary max-w-lg mx-auto mb-8">{components.length} composants et périphériques disponibles pour ta configuration PC</p>
          <div className="max-w-md mx-auto relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
            <input type="text" placeholder="Rechercher un composant..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all" />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = counts[cat.key] || 0;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive ? "bg-black text-white shadow-sm" : "bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text"}`}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                  {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white text-text-secondary"}`}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Price range */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <label className="text-sm font-medium whitespace-nowrap text-text-secondary shrink-0">
            Prix max
          </label>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-black"
          />
          <span className="text-sm font-bold tabular-nums whitespace-nowrap" style={{ minWidth: "72px" }}>
            CHF {maxPrice}
          </span>
        </div>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 shrink-0"
        >
          <option value="popularity">Popularité</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      {/* Advanced filters — dynamic by category */}
      {(activeCategory === "GPU" || activeCategory === "CPU" || activeCategory === "RAM") && (
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-text-secondary font-medium shrink-0 mr-1">Filtres :</span>

            {/* GPU filters */}
            {activeCategory === "GPU" && (
              <>
                {/* VRAM */}
                {[
                  { label: "4 Go", value: "4" },
                  { label: "8 Go", value: "8" },
                  { label: "12 Go", value: "12" },
                  { label: "16 Go+", value: "16+" },
                ].map(({ label, value }) => (
                  <button
                    key={`vram-${value}`}
                    onClick={() => setFilterVram(filterVram === value ? null : value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterVram === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    VRAM {label}
                  </button>
                ))}
                <span className="w-px h-4 bg-border mx-1" />
                {/* Architecture */}
                {["Ampere", "Ada", "Blackwell", "RDNA 3", "RDNA 4"].map((arch) => (
                  <button
                    key={`arch-${arch}`}
                    onClick={() => setFilterArch(filterArch === arch ? null : arch)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterArch === arch ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {arch}
                  </button>
                ))}
              </>
            )}

            {/* CPU filters */}
            {activeCategory === "CPU" && (
              <>
                {/* Cores */}
                {[
                  { label: "4 cœurs", value: "4" },
                  { label: "6 cœurs", value: "6" },
                  { label: "8 cœurs", value: "8" },
                  { label: "12+ cœurs", value: "12+" },
                ].map(({ label, value }) => (
                  <button
                    key={`cores-${value}`}
                    onClick={() => setFilterCores(filterCores === value ? null : value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterCores === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {label}
                  </button>
                ))}
                <span className="w-px h-4 bg-border mx-1" />
                {/* Socket */}
                {["AM4", "AM5", "LGA1700", "LGA1851"].map((socket) => (
                  <button
                    key={`socket-${socket}`}
                    onClick={() => setFilterSocket(filterSocket === socket ? null : socket)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterSocket === socket ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {socket}
                  </button>
                ))}
              </>
            )}

            {/* RAM filters */}
            {activeCategory === "RAM" && (
              <>
                {["DDR4", "DDR5"].map((ddr) => (
                  <button
                    key={`ddr-${ddr}`}
                    onClick={() => setFilterDdr(filterDdr === ddr ? null : ddr)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterDdr === ddr ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {ddr}
                  </button>
                ))}
                <span className="w-px h-4 bg-border mx-1" />
                {[
                  { label: "16 Go", value: "16" },
                  { label: "32 Go", value: "32" },
                  { label: "64 Go+", value: "64+" },
                ].map(({ label, value }) => (
                  <button
                    key={`cap-${value}`}
                    onClick={() => setFilterCapacity(filterCapacity === value ? null : value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${filterCapacity === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-text-secondary border-border hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-lg font-medium mb-1">Aucun résultat</p>
            <p className="text-text-secondary text-sm">Essaie un autre mot-clé ou une autre catégorie</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-4">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""}
              {activeCategory !== "all" && ` dans ${CATEGORIES.find((c) => c.key === activeCategory)?.label}`}
            </p>
            <div key={activeCategory + search} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((component) => (
                <ComponentCard key={component.id} component={component} onClick={() => setSelectedComponent(component)} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Product Detail Panel */}
      <AnimatePresence>
        {selectedComponent && (
          <ProductDetail component={selectedComponent} onClose={() => setSelectedComponent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
