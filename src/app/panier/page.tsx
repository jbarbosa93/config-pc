"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useMarket } from "@/lib/market";
import { getCurrencyForMarket } from "@/lib/affiliates";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ComponentImage } from "@/components/ComponentSVG";

/* ── Component type icons (realistic category illustrations) ── */

const TYPE_ICONS: Record<string, string> = {
  CPU: "🧠", GPU: "🎯", "Carte mère": "🖥️", RAM: "💾",
  Stockage: "💿", Alimentation: "⚡", Boîtier: "🖥️", Refroidissement: "❄️",
  Moniteur: "🖥️", Clavier: "⌨️", Souris: "🖱️", Casque: "🎧",
};

const TYPE_ORDER = ["CPU", "GPU", "Carte mère", "RAM", "Stockage", "Alimentation", "Boîtier", "Refroidissement", "Moniteur", "Clavier", "Souris", "Casque"];

/* ── Performance estimation ── */

function estimatePerformance(items: { type: string; price_ch: number }[]) {
  const gpu = items.find((i) => i.type === "GPU");
  const cpu = items.find((i) => i.type === "CPU");
  if (!gpu || !cpu) return null;
  const gpuScore = Math.min(100, Math.round((gpu.price_ch / 15)));
  const cpuScore = Math.min(100, Math.round((cpu.price_ch / 8)));
  const avg = (gpuScore * 0.7 + cpuScore * 0.3);
  return {
    "1080p": Math.min(100, Math.round(avg * 1.15)),
    "1440p": Math.min(100, Math.round(avg * 0.85)),
    "4K": Math.min(100, Math.round(avg * 0.55)),
  };
}

function estimateWattage(items: { type: string; price_ch: number }[]) {
  let watts = 50; // base
  items.forEach((i) => {
    if (i.type === "CPU") watts += Math.min(200, Math.round(i.price_ch * 0.4));
    if (i.type === "GPU") watts += Math.min(350, Math.round(i.price_ch * 0.35));
    if (i.type === "RAM") watts += 10;
    if (i.type === "Stockage") watts += 8;
    if (i.type === "Refroidissement") watts += 15;
  });
  return watts;
}

function PerformanceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#666] w-12 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

/* Map component type → manual configurator step index (1-based) */
const TYPE_TO_STEP: Record<string, number> = {
  "Carte mère": 1, "CPU": 2, "RAM": 3, "GPU": 4,
  "Stockage": 5, "Refroidissement": 6, "Alimentation": 7, "Boîtier": 8,
};

function getChangeUrl(type: string): string {
  const step = TYPE_TO_STEP[type];
  if (step) return `/configurateur/manuel?step=${step}`;
  // For peripherals: go to catalogue filtered by type
  return `/catalogue?type=${encodeURIComponent(type)}`;
}

export default function PanierPage() {
  const { items, removeItem, clearCart } = useCart();
  const market = useMarket();
  const currency = getCurrencyForMarket(market);
  const totalCHF = items.reduce((s, i) => s + (market === "fr" ? i.price_fr : i.price_ch) * i.quantity, 0);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const sorted = [...items].sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));

  function handleClearCart() {
    clearCart();
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }

  const performance = estimatePerformance(items);
  const wattage = estimateWattage(items);

  function shareConfig() {
    const data = { items: items.map((i) => ({ type: i.type, name: i.name, price_ch: i.price_ch })) };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/panier?config=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.56L23 6H6"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Panier vide</h1>
          <p className="text-[#666] mb-8">Configurez votre PC et ajoutez vos composants au panier.</p>
          <Link href="/" className="px-6 py-3 rounded-full text-white text-sm font-medium" style={{ background: "#4f8ef7" }}>
            Configurer mon PC
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-sm text-[#888] hover:text-[#333] transition-colors mb-2 inline-flex items-center gap-1">
            ← Retour au configurateur
          </Link>
          <h1 className="text-3xl font-bold">Mon panier</h1>
          <p className="text-[#888] mt-1">{items.length} composant{items.length > 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="text-sm text-[#999] hover:text-red-500 transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
          Vider le panier
        </button>
      </div>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-1">Vider le panier ?</h3>
              <p className="text-sm text-[#888] text-center mb-6">Tous les {items.length} composants seront supprimés. Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#666] hover:text-[#333] transition-colors"
                  style={{ border: "1px solid #E5E5E5" }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#EF4444" }}
                >
                  Vider le panier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cleared toast */}
      <AnimatePresence>
        {cleared && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl"
            style={{ background: '#0A0A0A', color: 'white' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm font-medium">Panier vidé</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white"
                style={{ border: "1px solid #E5E5E5" }}
              >
                {/* Product image with SVG fallback */}
                <div className="w-14 h-14 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0 overflow-hidden">
                  <ComponentImage
                    url={item.image_url}
                    alt={item.name}
                    type={item.type}
                    size={48}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#4f8ef7] font-bold uppercase tracking-wide">{item.type}</p>
                      <p className="font-semibold text-sm leading-tight">{item.name}</p>
                      {item.reason && <p className="text-xs text-[#888] mt-1 line-clamp-1">{item.reason}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-extrabold" style={{ color: "#4f8ef7" }}>{market === "fr" ? item.price_fr : item.price_ch}</p>
                      <p className="text-[10px] text-[#999] font-medium">{currency}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Compatibility badge */}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-200">
                      ✅ Compatible
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={getChangeUrl(item.type)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-[#E5E5E5] text-[#666] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-all font-medium"
                      >
                        Changer
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.name)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6 sticky top-24" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
            {/* Build description */}
            <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #E0ECFF" }}>
              <h2 className="font-bold text-lg mb-2">Ta config PC</h2>
              <p className="text-sm text-[#666] leading-relaxed">
                {(() => {
                  const gpu = items.find((i) => i.type === "GPU");
                  const cpu = items.find((i) => i.type === "CPU");
                  const hasGpu = !!gpu;
                  const tier = totalCHF > 2500 ? "haut de gamme" : totalCHF > 1500 ? "performant" : totalCHF > 800 ? "équilibré" : "entrée de gamme";
                  const usage = hasGpu ? "gaming et création" : "bureautique et productivité";
                  const marche = market === "fr" ? "France" : "Suisse";
                  return `PC ${tier} orienté ${usage}${cpu ? ` — propulsé par le ${cpu.name}` : ""}${gpu ? ` et la ${gpu.name}` : ""}. Configuration ${items.length} composants, optimisée pour le marché ${marche}.`;
                })()}
              </p>
            </div>

            {/* Sub-totals by category */}
            <div className="flex flex-col gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #E0ECFF" }}>
              {TYPE_ORDER.filter((t) => sorted.some((i) => i.type === t)).map((type) => {
                const typeItems = sorted.filter((i) => i.type === type);
                const typeTotal = typeItems.reduce((s, i) => s + (market === "fr" ? i.price_fr : i.price_ch), 0);
                return (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-[#666] flex items-center gap-1.5">
                      <span className="text-xs">{TYPE_ICONS[type] || "🔧"}</span>
                      {type}
                    </span>
                    <span className="font-medium tabular-nums">{typeTotal} {currency}</span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline mb-4">
              <span className="font-bold text-base">Total</span>
              <span className="text-2xl font-extrabold" style={{ color: "#4f8ef7" }}>{totalCHF} {currency}</span>
            </div>

            {/* Compatibility badge */}
            <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-green-50 border border-green-200">
              <span className="text-green-600 text-sm">✅</span>
              <span className="text-xs font-semibold text-green-700">Configuration compatible</span>
            </div>

            {/* Estimated wattage */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs text-[#666]">Consommation estimée</span>
              <span className="text-xs font-bold text-[#333]">~{wattage} W</span>
            </div>

            {/* Performance scores */}
            {performance && (
              <div className="mb-5 flex flex-col gap-2">
                <p className="text-xs font-bold text-[#888] uppercase tracking-wide mb-1">Performance gaming</p>
                <PerformanceBar label="1080p" value={performance["1080p"]} color="#22C55E" />
                <PerformanceBar label="1440p" value={performance["1440p"]} color="#F59E0B" />
                <PerformanceBar label="4K" value={performance["4K"]} color="#EF4444" />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/commander")}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "#4f8ef7" }}
            >
              Commander →
            </motion.button>

            {/* Share config */}
            <button
              type="button"
              onClick={shareConfig}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-[#666] hover:text-[#333] transition-all flex items-center justify-center gap-2"
              style={{ border: "1px solid #E5E5E5" }}
            >
              {copied ? (
                <><span className="text-green-600">✓</span> Lien copié !</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg> Partager ma config</>
              )}
            </button>

            <p className="text-[11px] text-[#999] text-center mt-3">
              Paiement sécurisé par Stripe · Livraison en Suisse
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
