"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";

export default function CartToast() {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<typeof lastAdded>(null);

  useEffect(() => {
    if (!lastAdded) return;
    setCurrent(lastAdded);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [lastAdded?.ts]); // react to each new add via timestamp

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <AnimatePresence>
        {visible && current && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl pointer-events-auto"
            style={{ background: '#0A0A0A', color: 'white', minWidth: '260px', maxWidth: '360px' }}
          >
            {/* Check icon */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#22C55E' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-tight truncate">{current.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Ajouté au panier · CHF {current.price_ch.toFixed(0)}
              </p>
            </div>
            <a
              href="/panier"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-opacity hover:opacity-90"
              style={{ background: '#4f8ef7', color: 'white' }}
            >
              Voir →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
