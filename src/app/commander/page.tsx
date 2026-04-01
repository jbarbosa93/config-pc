"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  npa: string;
  city: string;
  assembly: boolean;
  delivery: "livraison" | "retrait";
  acceptedTerms: boolean;
}

const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", npa: "", city: "",
  assembly: false, delivery: "livraison", acceptedTerms: false,
};

export default function CommanderPage() {
  const { items, totalCHF, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = totalCHF + (form.assembly ? 150 : 0);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function step1Valid() {
    return form.firstName && form.lastName && form.email && form.phone &&
      (form.delivery === "retrait" || (form.address && form.npa && form.city));
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          assembly: form.assembly,
          customerEmail: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de paiement");
      if (data.url) {
        // Don't clear cart before redirect — clear on confirmation page instead
        window.location.href = data.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-[#666] mb-4">Votre panier est vide.</p>
          <Link href="/" className="text-[#4f8ef7] hover:underline">Configurer mon PC →</Link>
        </div>
      </main>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#4f8ef7] transition-colors";

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
      <Link href="/panier" className="text-sm text-[#888] hover:text-[#333] mb-6 inline-flex items-center gap-1">
        ← Retour au panier
      </Link>
      <h1 className="text-3xl font-bold mb-8">Commander</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={{
                background: s <= step ? "#4f8ef7" : "#F0F0F0",
                color: s <= step ? "#fff" : "#999",
              }}
            >
              {s}
            </div>
            <span className="text-sm font-medium" style={{ color: s === step ? "#0A0A0A" : "#999" }}>
              {s === 1 ? "Livraison" : s === 2 ? "Récapitulatif" : "Paiement"}
            </span>
            {s < 3 && <div className="w-8 h-px bg-[#E5E5E5]" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold">Vos informations</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#666] mb-1.5 block">Prénom *</label>
                  <input required className={inputCls} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Jean" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#666] mb-1.5 block">Nom *</label>
                  <input required className={inputCls} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Dupont" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#666] mb-1.5 block">Email *</label>
                <input required type="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jean@exemple.ch" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#666] mb-1.5 block">Téléphone *</label>
                <input required className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+41 79 000 00 00" />
              </div>

              {/* Delivery method */}
              <div>
                <label className="text-xs font-medium text-[#666] mb-2 block">Mode de réception *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["livraison", "retrait"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => update("delivery", mode)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        border: `2px solid ${form.delivery === mode ? "#4f8ef7" : "#E5E5E5"}`,
                        background: form.delivery === mode ? "#F0F7FF" : "white",
                      }}
                    >
                      <div className="font-semibold text-sm">{mode === "livraison" ? "🚚 Livraison" : "🏪 Retrait"}</div>
                      <div className="text-xs text-[#888] mt-0.5">{mode === "livraison" ? "À domicile en Suisse" : "En personne à Monthey, Valais"}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address fields only for delivery */}
              {form.delivery === "livraison" && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#666] mb-1.5 block">Adresse *</label>
                    <input required className={inputCls} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Rue des Alpes 12" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#666] mb-1.5 block">NPA *</label>
                      <input required className={inputCls} value={form.npa} onChange={(e) => update("npa", e.target.value)} placeholder="1000" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-[#666] mb-1.5 block">Ville *</label>
                      <input required className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Lausanne" />
                    </div>
                  </div>
                </div>
              )}

              {/* Assembly option */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all" style={{ border: `2px solid ${form.assembly ? "#4f8ef7" : "#E5E5E5"}`, background: form.assembly ? "#F0F7FF" : "white" }}>
                <input type="checkbox" checked={form.assembly} onChange={(e) => update("assembly", e.target.checked)} className="mt-0.5 accent-[#4f8ef7]" />
                <div>
                  <p className="font-semibold text-sm">🔧 Montage professionnel du PC <span className="text-[#4f8ef7]">+150 CHF</span></p>
                  <p className="text-xs text-[#888] mt-0.5">Assemblage complet, tests et vérification de compatibilité par nos experts.</p>
                </div>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => step1Valid() && setStep(2)}
                disabled={!step1Valid()}
                className="w-full py-4 rounded-xl text-white font-semibold text-base mt-2 transition-opacity disabled:opacity-40"
                style={{ background: "#4f8ef7" }}
              >
                Continuer →
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">Récapitulatif de la commande</h2>

              {/* Customer info */}
              <div className="p-4 rounded-xl bg-[#F8F8F8]" style={{ border: "1px solid #E5E5E5" }}>
                <p className="text-xs font-medium text-[#888] mb-2 uppercase tracking-wide">Livraison</p>
                <p className="font-medium">{form.firstName} {form.lastName}</p>
                <p className="text-sm text-[#666]">{form.email} · {form.phone}</p>
                {form.delivery === "livraison" && <p className="text-sm text-[#666]">{form.address}, {form.npa} {form.city}</p>}
                {form.delivery === "retrait" && <p className="text-sm text-[#666]">Retrait en personne — Monthey, Valais, Suisse</p>}
              </div>

              {/* Items */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E5E5E5" }}>
                {items.map((item, i) => (
                  <div key={item.name} className={`flex justify-between items-center px-4 py-3 text-sm ${i > 0 ? "border-t border-[#F0F0F0]" : ""}`}>
                    <div>
                      <span className="text-[10px] font-bold text-[#4f8ef7] uppercase mr-2">{item.type}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="tabular-nums font-semibold">{item.price_ch} CHF</span>
                  </div>
                ))}
                {form.assembly && (
                  <div className="flex justify-between items-center px-4 py-3 text-sm border-t border-[#F0F0F0] bg-[#F8FAFF]">
                    <span className="font-medium">🔧 Montage professionnel</span>
                    <span className="tabular-nums font-semibold">150 CHF</span>
                  </div>
                )}
                <div className="flex justify-between items-center px-4 py-4 border-t border-[#E5E5E5] bg-[#F8FAFF]">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold" style={{ color: "#4f8ef7" }}>{total} CHF</span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.acceptedTerms} onChange={(e) => update("acceptedTerms", e.target.checked)} className="mt-0.5 accent-[#4f8ef7]" />
                <p className="text-sm text-[#666]">
                  J&apos;accepte les <Link href="/mentions-legales" target="_blank" className="text-[#4f8ef7] underline">conditions générales</Link> et la <Link href="/politique-confidentialite" target="_blank" className="text-[#4f8ef7] underline">politique de confidentialité</Link>.
                </p>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-[#E5E5E5] text-sm font-medium text-[#666] hover:border-[#CCC] transition-colors">
                  ← Retour
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => form.acceptedTerms && setStep(3)}
                  disabled={!form.acceptedTerms}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-base transition-opacity disabled:opacity-40"
                  style={{ background: "#4f8ef7" }}
                >
                  Procéder au paiement →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">Paiement</h2>

              <div className="p-6 rounded-2xl text-center" style={{ background: "#F8FAFF", border: "1px solid #E0ECFF" }}>
                <div className="text-4xl mb-3">🔒</div>
                <p className="font-bold text-lg mb-1">Paiement sécurisé</p>
                <p className="text-[#666] text-sm mb-4">Vous allez être redirigé vers Stripe pour finaliser votre paiement.</p>
                <div className="text-3xl font-bold mb-6" style={{ color: "#4f8ef7" }}>{total} CHF</div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: loading ? "#888" : "#4f8ef7" }}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Redirection…</>
                  ) : (
                    <>Payer {total} CHF →</>
                  )}
                </motion.button>

                <p className="text-[11px] text-[#999] mt-3">
                  Carte Visa, Mastercard, TWINT · Chiffrement SSL
                </p>
              </div>

              <button onClick={() => setStep(2)} className="text-sm text-[#888] hover:text-[#333] text-center transition-colors">
                ← Retour au récapitulatif
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
