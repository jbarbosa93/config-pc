"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/i18n";
import type { Usage, Resolution, TechLevel, Market, ConfigRequest, PCConfig } from "@/lib/types";

function Icon({ d }: { d: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

function AnimatedCheck() {
  return (
    <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
      <motion.circle cx="12" cy="12" r="10" fill="#0A0A0A" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12 }} />
      <motion.path d="M8 12.5l2.5 2.5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.3 }} />
    </motion.svg>
  );
}

const USAGE_PATHS: Record<Usage, string> = {
  gaming: "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 00-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.544-.604-6.584-.685-7.258A4 4 0 0017.32 5z",
  streaming: "M2 8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zM10 12a2 2 0 104 0 2 2 0 00-4 0z",
  montage: "M4 8V4a1 1 0 011-1h4M4 16v4a1 1 0 001 1h4M16 3h4a1 1 0 011 1v4M16 21h4a1 1 0 001-1v-4",
  bureautique: "M2 3h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V3zM8 21h8M12 17v4",
  polyvalent: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

const USAGES: Usage[] = ["gaming", "streaming", "montage", "bureautique", "polyvalent"];
const RESOLUTIONS: Resolution[] = ["1080p", "1440p", "4K"];
const TECH: TechLevel[] = ["debutant", "intermediaire", "expert"];
const MARKETS: Market[] = ["france", "suisse", "both"];
const BUDGET_TICKS = [300, 800, 1500, 2500, 5000];

const BUDGET_PRESETS: { key: string; emoji: string; value: number; badgeKey?: string }[] = [
  { key: "budget.gaming", emoji: "\u{1F3AE}", value: 800 },
  { key: "budget.popular", emoji: "\u26A1", value: 1200, badgeKey: "budget.popular.badge" },
  { key: "budget.perf", emoji: "\u{1F525}", value: 2000 },
  { key: "budget.enthusiast", emoji: "\u{1F451}", value: 3500 },
];

const LOADING_EMOJIS = ["\u{1F50D}", "\u{1F9E0}", "\u26A1", "\u{1F527}", "\u2705"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
};

function LoadingOverlay({ step, t }: { step: number; t: (k: string) => string }) {
  const progress = Math.min(((step + 1) / 5) * 100, 95);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white/95 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-center mb-8">
          <span className="text-5xl">{LOADING_EMOJIS[step]}</span>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center font-medium text-lg mb-8">
            {t(`loading.${step}`)}
          </motion.p>
        </AnimatePresence>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
          <motion.div className="h-full bg-accent rounded-full" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 1.8, ease: "easeOut" }} />
        </div>
        <p className="text-center text-xs text-text-secondary">{t("loading.step")} {step + 1} {t("loading.of")} 5</p>
      </div>
    </motion.div>
  );
}

interface Props { onResult: (config: PCConfig) => void; }

export default function ConfiguratorForm({ onResult }: Props) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [usage, setUsage] = useState<Usage | null>(null);
  const [budget, setBudget] = useState(1000);
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [favoriteGames, setFavoriteGames] = useState("");
  const [techLevel, setTechLevel] = useState<TechLevel>("intermediaire");
  const [market, setMarket] = useState<Market>("france");

  const loadingRef = useRef<NodeJS.Timeout | null>(null);
  const totalSteps = 4;
  const canNext = (step === 0 && usage !== null) || (step === 1 && budget >= 300) || step === 2 || step === 3;

  function nextStep() { setDirection(1); setStep((s) => s + 1); }
  function prevStep() { setDirection(-1); setStep((s) => s - 1); }

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      loadingRef.current = setInterval(() => setLoadingStep((m) => m < 4 ? m + 1 : m), 2000);
    } else if (loadingRef.current) clearInterval(loadingRef.current);
    return () => { if (loadingRef.current) clearInterval(loadingRef.current); };
  }, [loading]);

  async function handleSubmit() {
    if (!usage) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usage, budget, resolution, favoriteGames, techLevel, market } satisfies ConfigRequest),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      data.market = market;
      setLoadingStep(4);
      await new Promise((r) => setTimeout(r, 800));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ["#0A0A0A", "#666666", "#E5E5E5"] });
      setTimeout(() => { setLoading(false); onResult(data); }, 400);
    } catch { setLoading(false); setError(t("error.generate")); }
  }

  return (
    <>
      <AnimatePresence>{loading && <LoadingOverlay step={loadingStep} t={t} />}</AnimatePresence>

      <div className="w-full max-w-lg mx-auto">
        {/* Progress */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-text-secondary">{t("step.label")} {step + 1} {t("step.of")} {totalSteps}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <motion.div key={i} className="h-1.5 rounded-full" initial={false} animate={{ width: i === step ? 24 : 8, backgroundColor: i <= step ? "#0A0A0A" : "#E5E5E5" }} transition={{ type: "spring", stiffness: 300, damping: 25 }} />
              ))}
            </div>
          </div>
          <div className="h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent rounded-full" initial={false} animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          </div>
        </div>

        <div className="min-h-[440px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t("step0.title")}</h2>
                  <p className="text-text-secondary text-sm mb-8">{t("step0.desc")}</p>
                  <div className="flex flex-col gap-2">
                    {USAGES.map((u, i) => {
                      const sel = usage === u;
                      return (
                        <motion.button key={u} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", rotateX: 2, rotateY: -1 }} whileTap={{ scale: 0.98 }} onClick={() => setUsage(u)} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors duration-150 text-left ${sel ? "bg-accent text-white border-accent" : "bg-card border-border hover:border-border-hover"}`} style={{ perspective: 800 }}>
                          <motion.div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sel ? "bg-white/20" : "bg-white"}`} whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                            <div className={sel ? "text-white" : "text-text"}><Icon d={USAGE_PATHS[u]} /></div>
                          </motion.div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{t(`usage.${u}`)}</div>
                            <div className={`text-xs ${sel ? "text-white/70" : "text-text-secondary"}`}>{t(`usage.${u}.desc`)}</div>
                          </div>
                          {sel && <AnimatedCheck />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t("step1.title")}</h2>
                  <p className="text-text-secondary text-sm mb-10">{t("step1.desc")}</p>
                  <div className="text-center mb-8">
                    <motion.span key={budget} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-bold tracking-tight inline-block">{budget}&euro;</motion.span>
                  </div>
                  <div className="px-1 mb-8">
                    <input type="range" min={300} max={5000} step={50} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                    <div className="flex justify-between mt-4 text-xs text-text-secondary">
                      {BUDGET_TICKS.map((v) => <span key={v} className={budget >= v ? "text-text font-medium" : ""}>{v}&euro;</span>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_PRESETS.map((p, i) => {
                      const active = budget === p.value;
                      return (
                        <motion.button key={p.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ y: -2, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }} whileTap={{ scale: 0.97 }} onClick={() => setBudget(p.value)} className={`relative p-3 rounded-xl border text-left transition-colors duration-150 ${active ? "bg-accent text-white border-accent" : "bg-card border-border hover:border-border-hover"}`}>
                          {p.badgeKey && <span className={`absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${active ? "bg-white text-accent" : "bg-accent text-white"}`}>{t(p.badgeKey)}</span>}
                          <span className="text-base mr-1.5">{p.emoji}</span>
                          <span className="text-xs font-medium">{t(p.key)}</span>
                          <div className={`text-sm font-bold mt-1 ${active ? "text-white" : "text-text"}`}>{p.value}&euro;</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t("step2.title")}</h2>
                  <p className="text-text-secondary text-sm mb-8">{t("step2.desc")}</p>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">{t("step2.resolution")}</label>
                  <div className="flex gap-2 mb-8">
                    {RESOLUTIONS.map((r) => <motion.button key={r} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setResolution(r)} className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors duration-150 ${resolution === r ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>{r}</motion.button>)}
                  </div>
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">{t("step2.games")}</label>
                  <input type="text" placeholder={t("step2.games.placeholder")} value={favoriteGames} onChange={(e) => setFavoriteGames(e.target.value)} className="w-full mb-8 px-4 py-3 rounded-xl border border-border bg-card text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-150" />
                  <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">{t("step2.level")}</label>
                  <div className="flex gap-2">
                    {TECH.map((v) => <motion.button key={v} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setTechLevel(v)} className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors duration-150 ${techLevel === v ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>{t(`level.${v}`)}</motion.button>)}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t("step3.title")}</h2>
                  <p className="text-text-secondary text-sm mb-8">{t("step3.desc")}</p>
                  <div className="flex flex-col gap-2">
                    {MARKETS.map((m, i) => {
                      const sel = market === m;
                      return (
                        <motion.button key={m} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }} whileTap={{ scale: 0.98 }} onClick={() => setMarket(m)} className={`p-5 rounded-xl border text-left font-medium transition-colors duration-150 ${sel ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>
                          <div className="flex items-center justify-between">
                            <span>{t(`market.${m}`)}</span>
                            {sel && <AnimatedCheck />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {error && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 border border-border rounded-xl text-sm text-text-secondary">{error}</motion.div>}

        <div className="flex justify-between mt-12">
          <motion.button whileHover={{ x: -3 }} onClick={prevStep} disabled={step === 0} className="text-sm text-text-secondary hover:text-text transition-colors duration-150 disabled:opacity-0">{t("btn.back")}</motion.button>
          {step < 3 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={nextStep} disabled={!canNext} className="px-7 py-2.5 rounded-full bg-accent text-white text-sm font-medium transition-opacity disabled:opacity-20 disabled:cursor-not-allowed">{t("btn.next")}</motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading || !canNext} className="px-7 py-2.5 rounded-full bg-accent text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shimmer">{t("btn.generate")}</motion.button>
          )}
        </div>
      </div>
    </>
  );
}
