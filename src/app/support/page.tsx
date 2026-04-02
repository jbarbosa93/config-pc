"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart } from "@/lib/cart";

/* ── FAQ ── */

const FAQ = [
  {
    q: "Comment fonctionne le configurateur IA ?",
    a: "Notre IA analyse ton budget, ton usage et ta résolution cible pour te proposer une configuration PC optimisée pour le marché suisse. En 30 secondes, tu obtiens une liste de composants compatibles avec les meilleurs rapports qualité/prix.",
  },
  {
    q: "Les prix affichés sont-ils à jour ?",
    a: "Les prix sont estimés sur la base des données de nos partenaires suisses (Digitec, Galaxus, Brack, Interdiscount). Pour les prix exacts en temps réel, clique sur le lien du composant pour accéder directement au site marchand.",
  },
  {
    q: "Puis-je personnaliser la configuration suggérée par l'IA ?",
    a: "Oui ! Depuis la page de résultat, tu peux remplacer n'importe quel composant par une alternative. Utilise le bouton 'Alternatives' sur chaque composant, ou accède au configurateur manuel pour un contrôle total.",
  },
  {
    q: "La compatibilité entre les composants est-elle garantie ?",
    a: "Le configurateur vérifie automatiquement les compatibilités principales (socket CPU/carte mère, DDR4 vs DDR5, alimentation, format boîtier). Pour les cas limites, nous recommandons de vérifier manuellement les spécifications des fabricants.",
  },
  {
    q: "Comment puis-je sauvegarder ou partager ma configuration ?",
    a: "Depuis la page panier, utilise le bouton 'Partager ma config' pour copier un lien unique vers ta configuration. Ce lien peut être partagé avec n'importe qui.",
  },
  {
    q: "config-pc.ch vend-il des composants directement ?",
    a: "Non, config-pc.ch est un configurateur et comparateur. Nous te redirigeons vers les meilleurs sites suisses pour acheter tes composants aux meilleurs prix. Nous ne stockons ni ne vendons de matériel.",
  },
  {
    q: "Mon pays est la France — puis-je utiliser config-pc.ch ?",
    a: "Le site est principalement optimisé pour le marché suisse (CHF). Pour la France, les prix en CHF peuvent différer légèrement des prix en EUR. Un mode France est en cours de développement.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid #E5E5E5" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8F8F8] transition-colors"
      >
        <span className="text-sm font-semibold text-[#0A0A0A] pr-4">{q}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path d="M4 6l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-4 text-sm text-[#666] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Contact Form ── */

const SUBJECTS = [
  "Question sur une configuration",
  "Problème technique",
  "Signaler un composant incorrect",
  "Demande de partenariat",
  "Autre",
];

export default function SupportPage() {
  const { count: cartCount } = useCart();
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setStatus("success");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <Link href="/" className="flex items-center">
            <Logo size="small" />
          </Link>
          <div className="flex items-center gap-3">
            {cartCount > 0 && (
              <Link href="/panier" className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ background: "#4f8ef7" }}>
                Panier ({cartCount})
              </Link>
            )}
            <Link href="/" className="text-sm text-[#666] hover:text-[#333] transition-colors">
              ← Accueil
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: "#EEF3FE", color: "#4f8ef7", border: "1px solid #D4E2FD" }}>
            💬 Support & FAQ
          </div>
          <h1 className="text-4xl font-bold mb-3">Besoin d'aide ?</h1>
          <p className="text-[#666] text-lg max-w-xl mx-auto">
            Consulte notre FAQ ou contacte-nous directement — nous répondons sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* FAQ */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className="text-[#4f8ef7]">📖</span> Questions fréquentes
            </h2>
            <div className="flex flex-col gap-3">
              {FAQ.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 bg-white sticky top-24" style={{ border: "1px solid #E5E5E5" }}>
              <h2 className="text-xl font-bold mb-1">Nous contacter</h2>
              <p className="text-sm text-[#888] mb-5">Réponse sous 24h ouvrables</p>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg mb-1">Message envoyé !</h3>
                    <p className="text-sm text-[#666] mb-4">Nous vous répondrons sous 24h à l'adresse indiquée.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-sm text-[#4f8ef7] font-medium hover:underline"
                    >
                      Envoyer un autre message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#666] block mb-1.5">Nom</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Ton prénom"
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{ border: "1px solid #E5E5E5", background: "#FAFAFA" }}
                        onFocus={e => e.target.style.borderColor = "#4f8ef7"}
                        onBlur={e => e.target.style.borderColor = "#E5E5E5"}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#666] block mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="ton@email.ch"
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{ border: "1px solid #E5E5E5", background: "#FAFAFA" }}
                        onFocus={e => e.target.style.borderColor = "#4f8ef7"}
                        onBlur={e => e.target.style.borderColor = "#E5E5E5"}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#666] block mb-1.5">Sujet</label>
                      <select
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                        style={{ border: "1px solid #E5E5E5", background: "#FAFAFA" }}
                      >
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#666] block mb-1.5">Message</label>
                      <textarea
                        required
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Décris ton problème ou ta question..."
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-colors"
                        style={{ border: "1px solid #E5E5E5", background: "#FAFAFA" }}
                        onFocus={e => e.target.style.borderColor = "#4f8ef7"}
                        onBlur={e => e.target.style.borderColor = "#E5E5E5"}
                      />
                    </div>
                    {status === "error" && (
                      <p className="text-xs text-red-500">{errorMsg || "Une erreur s'est produite. Réessaie."}</p>
                    )}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={status === "loading"}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity flex items-center justify-center gap-2"
                      style={{ background: "#4f8ef7", opacity: status === "loading" ? 0.7 : 1 }}
                    >
                      {status === "loading" ? (
                        <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Envoi…</>
                      ) : "Envoyer le message →"}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
