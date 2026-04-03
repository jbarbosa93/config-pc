"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

/* ── Catalogue CTA ── */

function CatalogueCTA() {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      className="w-full max-w-[480px] mt-5"
    >
      <p className="text-center text-[14px] text-text-secondary mb-3">
        {t("hero.catalogue.teaser")}
      </p>
      <Link href="/catalogue" className="block w-full">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{
            scale: hovered ? 1.01 : 1,
            boxShadow: hovered
              ? "0 4px 20px rgba(79,142,247,0.15)"
              : "0 0px 0px rgba(79,142,247,0)",
            background: hovered ? "#f0f7ff" : "#ffffff",
            borderColor: hovered ? "#4f8ef7" : "#e2e8f0",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative overflow-hidden catalogue-btn-shimmer flex items-center gap-4 px-8 py-5 cursor-pointer"
          style={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}
        >
          <span className="text-2xl shrink-0">🔍</span>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-semibold text-[#0A0A0A] leading-tight">
              {t("hero.catalogue.title")}
            </p>
            <p className="text-[13px] text-text-secondary mt-0.5">
              {t("hero.catalogue.count")}
            </p>
          </div>
          <motion.span
            animate={{ x: hovered ? 6 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-[#4f8ef7] text-xl font-bold shrink-0"
          >
            →
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
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
      <div className="relative z-10 flex flex-col items-center justify-center px-6 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 px-4 py-1.5 rounded-full border border-border text-text-secondary text-sm">
          {t("hero.badge")}
        </motion.div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-center tracking-tight leading-[0.95] mb-6 min-h-[1.2em]">
          {hasPlayedRef.current ? t("hero.title") : <Typewriter text={t("hero.title")} onDone={handleTitleDone} />}
        </h1>
        <AnimatePresence>
          {titleDone && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-text-secondary text-lg sm:text-xl text-center max-w-md mb-10">
              {t("hero.subtitle.1")}<br />{t("hero.subtitle.2")}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Two-option cards */}
        <AnimatePresence>
          {titleDone && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full max-w-2xl"
            >
              <p className="text-center text-sm font-medium text-text-secondary mb-4">
                {t("hero.howto")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Option */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col gap-3 p-5 rounded-2xl cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)', border: 'none' }}
                  onClick={onStart}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🤖</span>
                      <span className="font-bold text-white text-lg">{t("hero.ai.title")}</span>
                    </div>
                    <span className="text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ background: '#4f8ef7', borderRadius: '999px', padding: '4px 12px' }}>
                      {t("hero.ai.badge")}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {t("hero.ai.desc")}
                  </p>
                  <button
                    onClick={onStart}
                    className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 cta-pulse"
                    style={{ background: 'white', color: '#1e40af' }}
                  >
                    {t("hero.cta")}
                  </button>
                </motion.div>

                {/* Manual Option */}
                <Link href="/configurateur/manuel" className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col gap-3 p-5 rounded-2xl cursor-pointer h-full"
                    style={{ background: 'white', border: '2px solid #4f8ef7' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔧</span>
                      <span className="font-bold text-[#0A0A0A] text-lg">{t("hero.manual.title")}</span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {t("hero.manual.desc")}
                    </p>
                    <div
                      className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-center"
                      style={{ background: 'transparent', color: '#4f8ef7', border: '2px solid #4f8ef7' }}
                    >
                      {t("hero.manual.cta")}
                    </div>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalogue CTA */}
        <AnimatePresence>
          {titleDone && <CatalogueCTA />}
        </AnimatePresence>

        {/* Stats row */}
        <AnimatePresence>
          {titleDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 flex items-center gap-6 text-xs text-text-secondary">
              <span>{t("hero.stat.1")}</span>
              <span className="w-px h-3 bg-border" />
              <span>{t("hero.stat.2")}</span>
              <span className="w-px h-3 bg-border" />
              <span>{t("hero.stat.3")}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* "Comment ça marche" — below fold */}
      <div className="relative z-10 w-full px-6 py-20 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
          >
            {t("howto.title")}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {([
              { step: "1", icon: "🤖", titleKey: "howto.step1.title", descKey: "howto.step1.desc" },
              { step: "2", icon: "⚡", titleKey: "howto.step2.title", descKey: "howto.step2.desc" },
              { step: "3", icon: "🛒", titleKey: "howto.step3.title", descKey: "howto.step3.desc" },
            ] as { step: string; icon: string; titleKey: string; descKey: string }[]).map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-2xl shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{t("howto.step.label")} {item.step}</div>
                  <div className="font-bold text-base mb-1">{t(item.titleKey)}</div>
                  <div className="text-sm text-text-secondary">{t(item.descKey)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
            <Link href="/support" className="text-xs text-[#666] hover:text-[#333] transition-colors hidden sm:inline">
              {t("nav.support")}
            </Link>
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
            <ConfiguratorForm onResult={handleResult} onBack={() => setStarted(false)} />
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
