"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/i18n";
import type { Usage, Resolution, Market, ConfigRequest, PCConfig, GamingProfile, Frequency, ExistingPeripherals } from "@/lib/types";

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
const MARKETS: Market[] = ["suisse"];

const GAMING_PROFILES: { key: GamingProfile; label: string; desc: string; icon: string }[] = [
  { key: "competitive", label: "Gaming compétitif", desc: "FPS, CS2, Valorant — priorité FPS", icon: "🎯" },
  { key: "aaa", label: "Gaming AAA", desc: "Cyberpunk, Hogwarts, grands titres", icon: "🏆" },
  { key: "streaming_gaming", label: "Streaming + Gaming", desc: "Jouer et streamer simultanément", icon: "📡" },
  { key: "gaming_creation", label: "Gaming + Création", desc: "Gaming + montage, design, 3D", icon: "🎨" },
];

const FREQUENCIES: { key: Frequency; label: string; desc: string }[] = [
  { key: "casual", label: "Casual", desc: "Weekends uniquement" },
  { key: "regular", label: "Régulier", desc: "Quelques soirées / semaine" },
  { key: "intensive", label: "Intensif", desc: "Daily, plusieurs heures" },
];
const BUDGET_TICKS = [300, 1000, 1500, 2500, 4000];
const BUDGET_MAX = 4000;
const BUDGET_UNLIMITED = 999999;

const BUDGET_PRESETS: { key: string; emoji: string; value: number; badgeKey?: string }[] = [
  { key: "budget.gaming", emoji: "\u{1F3AE}", value: 800 },
  { key: "budget.popular", emoji: "\u26A1", value: 1200, badgeKey: "budget.popular.badge" },
  { key: "budget.perf", emoji: "\u{1F525}", value: 2000 },
  { key: "budget.enthusiast", emoji: "\u{1F451}", value: 3500 },
];

const LOADING_STEPS = [
  { icon: "💰", message: "loading.0" },     // Analyse du budget
  { icon: "🧠", message: "loading.1" },     // Sélection CPU
  { icon: "🎯", message: "loading.2" },     // Vérification compatibilités
  { icon: "🎮", message: "loading.3" },     // Optimisation GPU
  { icon: "💾", message: "loading.4" },     // Recherche meilleurs prix
  { icon: "✅", message: "loading.5" },     // Config prête
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
};

/* ── Loading Overlay with animated icons ── */

function LoadingOverlay({ progress, messageIndex, t }: {
  progress: number;
  messageIndex: number;
  t: (k: string) => string;
}) {
  const step = LOADING_STEPS[messageIndex] ?? LOADING_STEPS[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Animated icon */}
        <div className="text-center mb-6 h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-5xl inline-block"
            >
              {step.icon}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Animated message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center font-medium text-lg mb-8"
          >
            {t(step.message)}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4f8ef7, #7b5cf5)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="text-center text-xs text-[#888]">{Math.round(progress)}%</p>
      </div>
    </motion.div>
  );
}

/* ── Main Form ── */

interface Props { onResult: (config: PCConfig) => void; onBack?: () => void; }

export default function ConfiguratorForm({ onResult, onBack }: Props) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [usage, setUsage] = useState<Usage | null>(null);
  const [budget, setBudget] = useState(1200);
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [favoriteGames, setFavoriteGames] = useState("");
  const [gamingProfile, setGamingProfile] = useState<GamingProfile | null>(null);
  const [frequency, setFrequency] = useState<Frequency>("regular");
  const [existingPeripherals, setExistingPeripherals] = useState<ExistingPeripherals>({ monitor: false, keyboard_mouse: false, headset: false });
  const [market] = useState<Market>("suisse");

  const phase1Ref = useRef<NodeJS.Timeout | null>(null);
  const phase2Ref = useRef<NodeJS.Timeout | null>(null);
  const msgRef = useRef<NodeJS.Timeout | null>(null);
  const totalSteps = 3;
  const canNext = (step === 0 && usage !== null) || (step === 1 && budget >= 300) || step === 2;

  function nextStep() { setDirection(1); setStep((s) => s + 1); }
  function prevStep() { setDirection(-1); setStep((s) => s - 1); }

  const clearTimers = useCallback(() => {
    if (phase1Ref.current) clearInterval(phase1Ref.current);
    if (phase2Ref.current) clearInterval(phase2Ref.current);
    if (msgRef.current) clearInterval(msgRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  async function handleSubmit() {
    if (!usage) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setMessageIndex(0);

    // Phase 1: 0% → 30% in 3 seconds (slow ramp-up)
    let p = 0;
    phase1Ref.current = setInterval(() => {
      p = Math.min(p + 1, 30);
      setProgress(p);
      if (p >= 30 && phase1Ref.current) clearInterval(phase1Ref.current);
    }, 100);

    // Message rotation every 4 seconds (slower to feel real)
    let msg = 0;
    msgRef.current = setInterval(() => {
      msg = Math.min(msg + 1, 4);
      setMessageIndex(msg);
    }, 4000);

    try {
      // Phase 2: 30% → 92% during API call — logarithmic slowdown
      // Starts fast, progressively slows so it never feels stuck
      const phase2Start = setTimeout(() => {
        let elapsed = 0;
        phase2Ref.current = setInterval(() => {
          elapsed += 300;
          setProgress((prev) => {
            if (prev >= 92) {
              if (phase2Ref.current) clearInterval(phase2Ref.current);
              return 92;
            }
            // Increment shrinks over time: fast at start, crawls near 92%
            const remaining = 92 - prev;
            const increment = Math.max(0.1, remaining * 0.04);
            return Math.min(prev + increment, 92);
          });
        }, 300);
      }, 3000);

      const res = await fetch("/api/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usage, budget: budget >= BUDGET_MAX ? BUDGET_UNLIMITED : budget, resolution, favoriteGames, gamingProfile: gamingProfile ?? undefined, frequency, existingPeripherals, market } satisfies ConfigRequest),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      data.market = market;

      // Phase 3: Response received → jump to 100%
      clearTimeout(phase2Start);
      clearTimers();
      setProgress(100);
      setMessageIndex(5); // "Config prête !"

      // Wait 600ms then show results
      await new Promise((r) => setTimeout(r, 600));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ["#0A0A0A", "#666666", "#E5E5E5"] });
      setTimeout(() => { setLoading(false); onResult(data); }, 400);
    } catch {
      clearTimers();
      setLoading(false);
      setError(t("error.generate"));
    }
  }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingOverlay progress={progress} messageIndex={messageIndex} t={t} />}
      </AnimatePresence>

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

        <div className="min-h-[480px] relative overflow-hidden">
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
                    <motion.span key={budget} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-bold tracking-tight inline-block">
                      {budget >= BUDGET_MAX ? "Sans limite" : `${budget} CHF`}
                    </motion.span>
                  </div>
                  <div className="px-1 mb-8">
                    <input
                      type="range"
                      min={300}
                      max={4000}
                      step={50}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      style={{ background: `linear-gradient(to right, #0A0A0A ${((budget - 300) / (4000 - 300)) * 100}%, #E5E5E5 ${((budget - 300) / (4000 - 300)) * 100}%)` }}
                    />
                    <div className="relative mt-4 h-5 text-xs text-text-secondary">
                      {BUDGET_TICKS.map((v) => (
                        <span
                          key={v}
                          className={`absolute ${v === 300 ? "left-0" : v === 4000 ? "right-0" : "-translate-x-1/2"} ${budget >= v ? "text-text font-medium" : ""}`}
                          style={v !== 300 && v !== 4000 ? { left: `${((v - 300) / (4000 - 300)) * 100}%` } : undefined}
                        >
                          {v === 4000 ? "∞" : v}
                        </span>
                      ))}
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
                          <div className={`text-sm font-bold mt-1 ${active ? "text-white" : "text-text"}`}>{p.value} CHF</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{t("step2.title")}</h2>
                    <p className="text-text-secondary text-sm">{t("step2.desc")}</p>
                  </div>

                  {/* Résolution cible */}
                  <div>
                    <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">Résolution cible</label>
                    <div className="flex gap-2">
                      {RESOLUTIONS.map((r) => (
                        <motion.button key={r} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setResolution(r)} className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors duration-150 ${resolution === r ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>{r}</motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Usage principal gaming */}
                  <div>
                    <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">Usage principal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GAMING_PROFILES.map((p) => {
                        const sel = gamingProfile === p.key;
                        return (
                          <motion.button key={p.key} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setGamingProfile(p.key)} className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors duration-150 ${sel ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>
                            <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
                            <div>
                              <div className={`text-xs font-semibold leading-tight ${sel ? "text-white" : "text-text"}`}>{p.label}</div>
                              <div className={`text-[10px] leading-tight mt-0.5 ${sel ? "text-white/70" : "text-text-secondary"}`}>{p.desc}</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Jeux principaux */}
                  <div>
                    <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">Jeux principaux</label>
                    <input type="text" placeholder="Ex: Fortnite, Cyberpunk 2077, Valorant..." value={favoriteGames} onChange={(e) => setFavoriteGames(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-150 text-sm" />
                  </div>

                  {/* Fréquence d'utilisation */}
                  <div>
                    <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">Fréquence d'utilisation</label>
                    <div className="flex gap-2">
                      {FREQUENCIES.map((f) => {
                        const sel = frequency === f.key;
                        return (
                          <motion.button key={f.key} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setFrequency(f.key)} className={`flex-1 py-2.5 px-2 rounded-xl border text-center transition-colors duration-150 ${sel ? "bg-accent text-white border-accent" : "border-border hover:border-border-hover bg-card"}`}>
                            <div className={`text-xs font-semibold ${sel ? "text-white" : "text-text"}`}>{f.label}</div>
                            <div className={`text-[10px] mt-0.5 ${sel ? "text-white/70" : "text-text-secondary"}`}>{f.desc}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Périphériques existants */}
                  <div>
                    <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">Périphériques existants</label>
                    <div className="flex flex-col gap-2">
                      {([
                        { key: "monitor" as const, label: "J'ai déjà un écran" },
                        { key: "keyboard_mouse" as const, label: "J'ai déjà un clavier-souris" },
                        { key: "headset" as const, label: "J'ai déjà un casque" },
                      ] as { key: keyof ExistingPeripherals; label: string }[]).map(({ key, label }) => {
                        const checked = existingPeripherals[key];
                        return (
                          <button key={key} type="button" onClick={() => setExistingPeripherals((prev) => ({ ...prev, [key]: !prev[key] }))} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors duration-150 ${checked ? "bg-accent/5 border-accent text-accent" : "border-border hover:border-border-hover bg-card"}`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${checked ? "bg-accent border-accent" : "border-border"}`}>
                              {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span className="text-sm font-medium text-text">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {error && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 border border-border rounded-xl text-sm text-text-secondary">{error}</motion.div>}

        <div className="flex justify-between mt-12">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={step === 0 ? onBack : prevStep}
            className={`text-sm text-text-secondary hover:text-text transition-colors duration-150 ${step === 0 && !onBack ? "opacity-0 pointer-events-none" : ""}`}
          >
            {t("btn.back")}
          </motion.button>
          {step < 2 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={nextStep} disabled={!canNext} className="px-7 py-2.5 rounded-full bg-accent text-white text-sm font-medium transition-opacity disabled:opacity-20 disabled:cursor-not-allowed">{t("btn.next")}</motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading || !canNext} className="px-7 py-2.5 rounded-full bg-accent text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shimmer">{t("btn.generate")}</motion.button>
          )}
        </div>
      </div>
    </>
  );
}
