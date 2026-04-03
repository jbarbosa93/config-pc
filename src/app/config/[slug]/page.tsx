"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import ConfigResult from "@/components/ConfigResult";
import type { PCConfig } from "@/lib/types";

export default function SharedConfigPage() {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<PCConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/configs/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.config_data) setConfig(data.config_data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-bg">
      <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/"><Logo size="small" /></Link>
          <Link href="/" className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Créer ma config →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Chargement de la configuration...</p>
          </div>
        )}

        {!loading && notFound && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32">
            <p className="text-4xl mb-4">🔍</p>
            <h1 className="text-2xl font-bold mb-2">Config introuvable</h1>
            <p className="text-text-secondary mb-8">Ce lien est invalide ou a expiré.</p>
            <Link href="/" className="px-6 py-3 rounded-full bg-accent text-white font-medium hover:opacity-90 transition-opacity">
              Créer ma config
            </Link>
          </motion.div>
        )}

        {!loading && config && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Configuration partagée</p>
                <p className="text-xs text-blue-600">Créée sur config-pc.ch · Tu peux créer ta propre config gratuitement</p>
              </div>
              <Link href="/" className="shrink-0 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Créer la mienne →
              </Link>
            </div>
            <ConfigResult config={config} onReset={() => window.location.href = "/"} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
