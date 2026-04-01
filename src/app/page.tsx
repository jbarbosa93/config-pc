"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfiguratorForm from "@/components/ConfiguratorForm";
import ConfigResult from "@/components/ConfigResult";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import type { PCConfig } from "@/lib/types";

/* ── Particles ── */

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    function resize() { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 40; i++) {
      dots.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1 });
    }
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const dot of dots) {
        dot.x += dot.vx; dot.y += dot.vy;
        if (dot.x < 0 || dot.x > canvas!.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas!.height) dot.vy *= -1;
        ctx!.beginPath(); ctx!.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(10, 10, 10, 0.08)"; ctx!.fill();
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

/* ── Typewriter ── */

function Typewriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < textRef.current.length) {
        setDisplayed(textRef.current.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else { clearInterval(interval); onDone?.(); }
    }, 45);
    return () => clearInterval(interval);
  }, [text, onDone]);
  return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

/* ── Hero ── */

function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  const [titleDone, setTitleDone] = useState(false);
  const hasPlayedRef = useRef(false);
  const handleTitleDone = useCallback(() => {
    setTitleDone(true);
    hasPlayedRef.current = true;
  }, []);

  // When language changes after initial typewriter, keep titleDone true
  useEffect(() => {
    if (hasPlayedRef.current) setTitleDone(true);
  }, [t]);

  return (
    <div className="relative flex-1 flex flex-col">
      <Particles />
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 px-4 py-1.5 rounded-full border border-border text-text-secondary text-sm">
          {t("hero.badge")}
        </motion.div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-center tracking-tight leading-[0.95] mb-6 min-h-[1.2em]">
          {hasPlayedRef.current ? t("hero.title") : <Typewriter text={t("hero.title")} onDone={handleTitleDone} />}
        </h1>
        <AnimatePresence>
          {titleDone && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-text-secondary text-lg sm:text-xl text-center max-w-md mb-12">
              {t("hero.subtitle.1")}<br />{t("hero.subtitle.2")}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {titleDone && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onStart} className="px-10 py-4 bg-accent text-white font-medium rounded-full text-lg cta-pulse">
              {t("hero.cta")}
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {titleDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-20 flex items-center gap-6 text-xs text-text-secondary">
              <span>{t("hero.stat.1")}</span>
              <span className="w-px h-3 bg-border" />
              <span>{t("hero.stat.2")}</span>
              <span className="w-px h-3 bg-border" />
              <span>{t("hero.stat.3")}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function Home() {
  const { t } = useLanguage();
  const { count: cartCount } = useCart();
  const [result, setResult] = useState<PCConfig | null>(null);
  const [started, setStarted] = useState(false);

  // Restore config from localStorage on mount (for "back to configurator" flow)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("configpc-last-result");
      if (saved) {
        const parsed = JSON.parse(saved) as PCConfig;
        if (parsed?.config_name && parsed?.components?.length) {
          setResult(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Save config to localStorage when generated
  function handleResult(config: PCConfig) {
    setResult(config);
    try { localStorage.setItem("configpc-last-result", JSON.stringify(config)); } catch { /* ignore */ }
  }

  function reset() { setResult(null); setStarted(false); localStorage.removeItem("configpc-last-result"); }

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Navbar sticky */}
      <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <button type="button" onClick={reset} className="appearance-none bg-transparent border-none cursor-pointer p-0 flex items-center">
            <Logo size="small" />
          </button>
          <div className="flex items-center gap-3">
            {cartCount > 0 && (
              <a href="/panier" className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ background: "#4f8ef7" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.56L23 6H6"/>
                </svg>
                Panier ({cartCount})
              </a>
            )}
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 px-6 py-16">
            <ConfigResult config={result} onReset={reset} />
          </motion.div>
        ) : started ? (
          <motion.div key="configurator" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col items-center px-6 py-16">
            <ConfiguratorForm onResult={handleResult} />
          </motion.div>
        ) : (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <Hero onStart={() => setStarted(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
