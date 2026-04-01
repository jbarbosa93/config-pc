"use client";

import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PanierPage() {
  const { items, removeItem, totalCHF } = useCart();
  const router = useRouter();

  const TYPE_ORDER = ["CPU", "GPU", "Carte mère", "RAM", "Stockage", "Alimentation", "Boîtier", "Refroidissement"];
  const sorted = [...items].sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));

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
    <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-sm text-[#888] hover:text-[#333] transition-colors mb-2 inline-flex items-center gap-1">
            ← Retour au configurateur
          </Link>
          <h1 className="text-3xl font-bold">Mon panier</h1>
          <p className="text-[#888] mt-1">{items.length} composant{items.length > 1 ? "s" : ""}</p>
        </div>
      </div>

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
                className="flex items-center gap-4 p-4 rounded-xl bg-white"
                style={{ border: "1px solid #E5E5E5" }}
              >
                {/* Type badge */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ background: "#4f8ef7" }}>
                  {item.type.slice(0, 3).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#888] font-medium uppercase tracking-wide">{item.type}</p>
                  <p className="font-semibold text-sm leading-tight truncate">{item.name}</p>
                  {item.reason && <p className="text-xs text-[#888] mt-0.5 line-clamp-1">{item.reason}</p>}
                </div>

                <div className="shrink-0 text-right mr-2">
                  <p className="font-bold text-base">{item.price_ch} CHF</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.name)}
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#AAA] hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6 sticky top-24" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
            <h2 className="font-bold text-lg mb-4">Récapitulatif</h2>

            {/* Sub-totals by category */}
            <div className="flex flex-col gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #E0ECFF" }}>
              {TYPE_ORDER.filter((t) => sorted.some((i) => i.type === t)).map((type) => {
                const typeItems = sorted.filter((i) => i.type === type);
                const typeTotal = typeItems.reduce((s, i) => s + i.price_ch, 0);
                return (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-[#666]">{type}</span>
                    <span className="font-medium tabular-nums">{typeTotal} CHF</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-bold text-base">Total</span>
              <span className="text-2xl font-bold" style={{ color: "#4f8ef7" }}>{totalCHF} CHF</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/commander")}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "#4f8ef7" }}
            >
              Commander →
            </motion.button>

            <p className="text-[11px] text-[#999] text-center mt-3">
              Paiement sécurisé par Stripe · Livraison en Suisse
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
