"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";

interface OrderItem {
  description: string;
  quantity: number | null;
  amountTotal: number | null;
}

interface OrderDetails {
  id: string;
  status: string;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  lineItems: OrderItem[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      clearCart();
      fetch(`/api/orders?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setOrder(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  return (
    <main className="flex-1 flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md">
        {/* Success icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#E6F9F0" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-[#666] text-sm">
            Un email de confirmation a été envoyé
            {order?.customerEmail ? ` à ${order.customerEmail}` : ""}.
          </p>
          {sessionId && (
            <p className="text-xs text-[#AAA] mt-2 font-mono">
              Réf : {sessionId.slice(-12).toUpperCase()}
            </p>
          )}
        </motion.div>

        {/* Order recap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl mb-6 overflow-hidden"
          style={{ border: "1px solid #E5E5E5" }}
        >
          <div className="px-5 py-3 bg-[#F8F8F8]" style={{ borderBottom: "1px solid #E5E5E5" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">Récapitulatif de la commande</p>
          </div>

          {loading ? (
            <div className="px-5 py-8 flex items-center justify-center gap-2 text-sm text-[#888]">
              <div className="w-4 h-4 rounded-full border-2 border-[#E5E5E5] border-t-[#4f8ef7] animate-spin" />
              Chargement…
            </div>
          ) : order && order.lineItems.length > 0 ? (
            <div>
              {order.lineItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 text-sm"
                  style={{ borderBottom: i < order.lineItems.length - 1 ? "1px solid #F0F0F0" : undefined }}
                >
                  <span className="text-[#333] flex-1 pr-4">{item.description}</span>
                  {item.amountTotal != null && (
                    <span className="font-semibold text-[#0A0A0A] shrink-0">
                      CHF {(item.amountTotal / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
              {order.amountTotal != null && (
                <div className="flex items-center justify-between px-5 py-3 font-bold text-sm bg-[#F8F8F8]" style={{ borderTop: "1px solid #E5E5E5" }}>
                  <span>Total payé</span>
                  <span style={{ color: "#4f8ef7" }}>CHF {(order.amountTotal / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-6 text-sm text-[#888] text-center">
              Notre équipe vous contactera sous 24–48h pour organiser la livraison.
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-[#666] text-center mb-6 leading-relaxed"
        >
          Notre équipe vous contactera sous <strong>24–48h</strong> pour organiser la livraison ou le retrait.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-white font-semibold text-center transition-opacity hover:opacity-90 text-sm"
            style={{ background: "#4f8ef7" }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-medium text-[#666] text-center transition-colors hover:text-[#333] text-sm"
            style={{ border: "1px solid #E5E5E5" }}
          >
            Configurer un autre PC
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E5E5E5] border-t-[#4f8ef7] animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
