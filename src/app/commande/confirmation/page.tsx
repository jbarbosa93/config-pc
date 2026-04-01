"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="flex-1 flex items-center justify-center py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="text-center max-w-md"
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

        <h1 className="text-3xl font-bold mb-3">Commande confirmée !</h1>
        <p className="text-[#666] mb-2">
          Merci pour votre commande. Vous recevrez un email de confirmation dans quelques minutes.
        </p>
        {sessionId && (
          <p className="text-xs text-[#AAA] mb-8 font-mono">Ref: {sessionId.slice(-12)}</p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-white font-semibold text-center transition-opacity hover:opacity-90"
            style={{ background: "#4f8ef7" }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-medium text-[#666] text-center transition-colors hover:text-[#333]"
            style={{ border: "1px solid #E5E5E5" }}
          >
            Configurer un autre PC
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#E5E5E5] border-t-[#4f8ef7] animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
