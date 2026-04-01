"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { PCConfig, Component, Alternative, Market } from "@/lib/types";

/* ── Store URLs — use exact product name ── */

function buildSearchUrl(store: string, name: string): string {
  const q = encodeURIComponent(name);
  const qPlus = name.replace(/\s+/g, "+");
  const urls: Record<string, string> = {
    ldlc: `https://www.ldlc.com/recherche/${encodeURIComponent(name)}/`,
    amazon: `https://www.amazon.fr/s?k=${qPlus}`,
    materielnet: `https://www.materiel.net/recherche/${encodeURIComponent(name)}/`,
    cdiscount: `https://www.cdiscount.com/search/10/${q}.html`,
    topachat: `https://www.topachat.com/pages/recherche.php?mot=${q}`,
    digitec: `https://www.digitec.ch/search?q=${qPlus}`,
    galaxus: `https://www.galaxus.ch/search?q=${qPlus}`,
    brack: `https://www.brack.ch/search/${qPlus}`,
    interdiscount: `https://www.interdiscount.ch/search?q=${qPlus}`,
  };
  return urls[store] || "#";
}

const FR_STORES = ["ldlc", "amazon", "materielnet", "cdiscount", "topachat"];
const CH_STORES = ["galaxus", "digitec", "brack", "interdiscount"];

const STORE_LABELS: Record<string, string> = {
  ldlc: "LDLC", amazon: "Amazon.fr", materielnet: "Matériel.net", cdiscount: "Cdiscount", topachat: "TopAchat",
  digitec: "Digitec", galaxus: "Galaxus", brack: "Brack.ch", interdiscount: "Interdiscount",
};

function getStoresForMarket(market: Market) {
  if (market === "france") return FR_STORES;
  if (market === "suisse") return CH_STORES;
  return [...FR_STORES.slice(0, 2), ...CH_STORES.slice(0, 2)];
}

/* ── Fake Swiss multi-store prices ── */

function getSwissPrices(baseCHF: number): { store: string; price: number }[] {
  return CH_STORES.map((store, i) => {
    const variance = ((baseCHF * (i + 7)) % 25) - 8;
    return { store, price: Math.round(baseCHF + variance) };
  }).sort((a, b) => a.price - b.price);
}

/* ── Component type icons ── */

const TYPE_ICONS: Record<string, string> = {
  CPU: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7V7zM10 10h4v4h-4v-4z",
  GPU: "M4 6h16v10H4V6zM8 16v2M16 16v2M2 6h2M20 6h2M7 10h2M11 10h2M15 10h2",
  RAM: "M4 4h16v16H4V4zM8 4v16M12 4v16M16 4v16M4 10h16",
  "Carte mère": "M4 2h16v20H4V2zM8 6h8v4H8V6zM8 14h3v3H8v-3zM13 14h3v3h-3v-3z",
  Stockage: "M4 6h16v12H4V6zM4 10h16M8 14h2",
  Alimentation: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  "Boîtier": "M6 2h12v20H6V2zM10 18h4M6 6h12",
  Boitier: "M6 2h12v20H6V2zM10 18h4M6 6h12",
  Refroidissement: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

function ComponentIcon({ type }: { type: string }) {
  const d = TYPE_ICONS[type] || TYPE_ICONS["CPU"];
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

function ParallaxIcon({ type }: { type: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);
  function handleMouse(e: React.MouseEvent<HTMLDivElement>) { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left - r.width / 2); y.set(e.clientY - r.top - r.height / 2); }
  function handleLeave() { x.set(0); y.set(0); }
  return (
    <motion.div onMouseMove={handleMouse} onMouseLeave={handleLeave} style={{ rotateX, rotateY, perspective: 600 }} className="w-[100px] h-[100px] rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary shrink-0">
      <ComponentIcon type={type} />
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

/* ── Swiss price table ── */

function SwissPriceTable({ component, t }: { component: Component; t: (k: string) => string }) {
  const prices = getSwissPrices(component.price_ch);
  const best = prices[0].price;
  return (
    <div className="mt-3 rounded-lg border border-border bg-bg overflow-hidden">
      {prices.map((p) => (
        <a key={p.store} href={buildSearchUrl(p.store, component.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 text-xs border-b border-border last:border-b-0 hover:bg-card transition-colors duration-150">
          <span className="font-medium">{STORE_LABELS[p.store]}</span>
          <span className="flex items-center gap-2">
            <span className="tabular-nums">{p.price} CHF</span>
            {p.price === best && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">{t("result.bestPrice")}</span>}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ── Alternatives Modal — market-aware ── */

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
    if (showFR && showCH) return `${alt.price_fr}\u20AC · ${alt.price_ch} CHF`;
    if (showCH) return `${alt.price_ch} CHF`;
    return `${alt.price_fr}\u20AC`;
  }

  function formatCurrentPrice() {
    if (showFR && showCH) return `${component.price_fr}\u20AC · ${component.price_ch} CHF`;
    if (showCH) return `${component.price_ch} CHF`;
    return `${component.price_fr}\u20AC`;
  }

  function getDiff(alt: { price_fr: number; price_ch: number }) {
    const diff = showCH && !showFR
      ? alt.price_ch - component.price_ch
      : alt.price_fr - component.price_fr;
    const unit = showCH && !showFR ? " CHF" : "\u20AC";
    if (diff === 0) return t("alt.samePrice");
    return diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-bg border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-bg border-b border-border p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-text-secondary">{t("alt.title")}</p>
            <h3 className="font-bold text-xl">{component.type}</h3>
          </div>
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

function ComponentCard({ component, original, index, market, onSwap, onRevert }: { component: Component; original: Component | null; index: number; market: Market; onSwap: () => void; onRevert: () => void }) {
  const { t } = useLanguage();
  const isEssential = component.priority === "essentiel";
  const isSwapped = original !== null && original.name !== component.name;
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";
  const stores = getStoresForMarket(market);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }} className="rounded-xl border border-border bg-card p-5 transition-colors duration-150 hover:border-border-hover">
      <div className="flex gap-4 mb-3">
        <ParallaxIcon type={component.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary font-medium">{component.type}</span>
              <h3 className="font-semibold mt-0.5 leading-tight">{component.name}</h3>
            </div>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 400 }} className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ml-2 ${isEssential ? "bg-accent text-white" : "bg-card text-text-secondary border border-border"}`}>{t(`priority.${component.priority}`)}</motion.span>
          </div>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{component.reason}</p>
        </div>
      </div>

      {/* Prices */}
      <div className="flex gap-3 mb-1">
        {showFR && <div className="flex-1 bg-bg rounded-lg p-2.5 text-center border border-border"><div className="text-[11px] text-text-secondary">{t("result.france")}</div><div className="font-semibold mt-0.5">{component.price_fr}&euro;</div></div>}
        {showCH && <div className="flex-1 bg-bg rounded-lg p-2.5 text-center border border-border"><div className="text-[11px] text-text-secondary">{t("result.suisse")}</div><div className="font-semibold mt-0.5">{component.price_ch} CHF</div></div>}
      </div>
      <p className="text-[10px] text-text-secondary mb-3">{t("result.priceNote")}</p>

      {/* Swiss price comparison */}
      {showCH && !showFR && <SwissPriceTable component={component} t={t} />}

      {/* Store links */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {stores.map((s) => (
          <a key={s} href={buildSearchUrl(s, component.name)} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[60px] text-center text-xs py-2 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">
            {STORE_LABELS[s]} &rarr;
          </a>
        ))}
      </div>

      {/* Swap / Revert */}
      <div className="flex gap-2 mt-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSwap} className="flex-1 text-center text-xs py-2 rounded-lg border border-border text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-150 font-medium">{t("change")}</motion.button>
        {isSwapped && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.97 }} onClick={onRevert} className="text-xs py-2 px-3 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">{t("restore")}</motion.button>}
      </div>
    </motion.div>
  );
}

/* ── Expandable Price Row ── */

function PriceRow({ component, changed, market, t }: { component: Component; index: number; changed: boolean; market: Market; t: (k: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const showFR = market === "france" || market === "both";
  const showCH = market === "suisse" || market === "both";
  const stores = [...(showFR ? FR_STORES : []), ...(showCH ? CH_STORES : [])];

  return (
    <>
      <tr className="border-b border-border/50 cursor-pointer hover:bg-card/50 transition-colors duration-150" onClick={() => setExpanded(!expanded)}>
        <td className="py-3">
          <span className="font-medium">{component.type}</span>
          <span className="text-text-secondary ml-2 text-xs">{component.name}</span>
          {changed && <span className="ml-2 text-[10px] text-text-secondary">({t("result.changed")})</span>}
          <svg className={`inline ml-1.5 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </td>
        {showFR && <td className="text-right py-3 tabular-nums">{component.price_fr}&euro;</td>}
        {showCH && <td className="text-right py-3 tabular-nums">{component.price_ch} CHF</td>}
      </tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <td colSpan={1 + (showFR ? 1 : 0) + (showCH ? 1 : 0)} className="pb-3 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {stores.map((s) => (
                  <a key={s} href={buildSearchUrl(s, component.name)} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-text-secondary hover:border-border-hover hover:text-text transition-all duration-150 font-medium">{STORE_LABELS[s]} &rarr;</a>
                ))}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Main ── */

interface Props { config: PCConfig; onReset: () => void; }

export default function ConfigResult({ config, onReset }: Props) {
  const { t } = useLanguage();
  const [components, setComponents] = useState<Component[]>(config.components);
  const [originals] = useState<Component[]>(config.components);
  const [swapIndex, setSwapIndex] = useState<number | null>(null);

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

  function openGalaxus() {
    for (const c of components) {
      window.open(buildSearchUrl("galaxus", c.name), "_blank");
    }
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
        {components.map((c, i) => <ComponentCard key={`${c.type}-${i}`} component={c} original={originals[i]} index={i} market={market} onSwap={() => setSwapIndex(i)} onRevert={() => handleRevert(i)} />)}
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
            </tr>
          </tfoot>
        </table>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary mb-10 px-1">{t("result.disclaimer")}</p>

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-3 pb-8">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium">{t("result.save")}</motion.button>
        {showCH && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openGalaxus} className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium">
            {t("result.galaxus")} &rarr;
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReset} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-hover transition-all duration-150">{t("result.newConfig")}</motion.button>
      </motion.div>

      {/* Alternatives modal */}
      <AnimatePresence>
        {swapIndex !== null && <AlternativesModal component={components[swapIndex]} allComponents={components} usage={config.config_name} budget={config.total_estimated} market={market} onSelect={(alt) => handleSelectAlternative(swapIndex, alt)} onClose={() => setSwapIndex(null)} />}
      </AnimatePresence>
    </div>
  );
}
