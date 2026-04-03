import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digitec vs Galaxus vs Brack : Où Acheter ses Composants PC en Suisse ?",
  description:
    "Comparatif complet des meilleurs sites pour acheter des composants PC en Suisse : Digitec, Galaxus, Brack et Interdiscount. Prix CHF, disponibilité, livraison et SAV comparés.",
  keywords: [
    "digitec vs galaxus composants pc",
    "acheter composants pc suisse",
    "meilleur site pc suisse",
    "brack digitec galaxus comparatif",
    "composants pc pas cher suisse",
    "interdiscount pc composants",
  ],
  alternates: { canonical: "https://config-pc.ch/blog/comparatif-composants-digitec-galaxus" },
  openGraph: {
    title: "Digitec vs Galaxus vs Brack : Où Acheter ses Composants PC en Suisse ? | config-pc.ch",
    description:
      "Comparatif des meilleures boutiques en ligne pour acheter des composants PC en Suisse avec les meilleurs prix CHF.",
    url: "https://config-pc.ch/blog/comparatif-composants-digitec-galaxus",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Digitec vs Galaxus vs Brack : Où Acheter ses Composants PC en Suisse ?",
  description:
    "Comparatif complet des meilleurs sites pour acheter des composants PC en Suisse : Digitec, Galaxus, Brack et Interdiscount.",
  author: { "@type": "Organization", name: "config-pc.ch" },
  publisher: {
    "@type": "Organization",
    name: "config-pc.ch",
    url: "https://config-pc.ch",
  },
  datePublished: "2025-03-05",
  dateModified: "2025-03-05",
  url: "https://config-pc.ch/blog/comparatif-composants-digitec-galaxus",
  mainEntityOfPage: "https://config-pc.ch/blog/comparatif-composants-digitec-galaxus",
};

const retailers = [
  {
    name: "Digitec",
    note: "9.1/10",
    pros: ["Plus grand catalogue composants PC en Suisse", "Interface de recherche et filtres avancés", "Communauté active avec avis détaillés", "Click & Collect dans les magasins", "Livraison le lendemain (commande avant 17h)"],
    cons: ["Prix parfois légèrement supérieurs à Galaxus", "Pas toujours les meilleures promos flash"],
    verdict: "La référence absolue pour les composants PC en Suisse. Catalogue complet, fiabilité maximale.",
    color: "#e53935",
  },
  {
    name: "Galaxus",
    note: "8.8/10",
    pros: ["Marketplace élargie avec vendeurs tiers", "Souvent des prix identiques ou inférieurs à Digitec", "Promotions fréquentes et ventes flash", "Interface moderne et agréable", "Même réseau logistique que Digitec"],
    cons: ["Attention aux vendeurs marketplace (qualité variable)", "Catalogue composants PC moins spécialisé que Digitec"],
    verdict: "Excellent complément à Digitec, parfait pour les bonnes affaires et les produits plus polyvalents.",
    color: "#1e88e5",
  },
  {
    name: "Brack",
    note: "8.2/10",
    pros: ["Très bons prix sur le stockage et les périphériques", "Livraison fiable et rapide", "Bon SAV en cas de problème", "Stock propre (pas de marketplace)", "Promotions régulières sur les composants"],
    cons: ["Catalogue moins étendu que Digitec", "Interface de recherche moins performante", "Moins de détails techniques sur les fiches produit"],
    verdict: "Solide alternative à Digitec, particulièrement compétitif sur les SSD, RAM et boîtiers.",
    color: "#43a047",
  },
  {
    name: "Interdiscount",
    note: "6.5/10",
    pros: ["Présence physique partout en Suisse", "Parfois de bonnes promos sur les kits (PC complets)", "Accessible pour les achats en urgence"],
    cons: ["Catalogue composants PC très limité", "Prix généralement plus élevés", "Peu adapté pour les builds customs", "Manque de détails techniques"],
    verdict: "À utiliser uniquement pour les achats en urgence ou les accessoires basiques. Pas recommandé pour les builds PC.",
    color: "#fb8c00",
  },
];

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#E5E5E5] bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3 text-sm text-[#666]">
          <Link href="/" className="hover:text-[#333] transition-colors">Accueil</Link>
          <span className="text-[#ccc]">/</span>
          <Link href="/blog" className="hover:text-[#333] transition-colors">Blog</Link>
          <span className="text-[#ccc]">/</span>
          <span className="text-[#333]">Digitec vs Galaxus vs Brack</span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]">Comparatif</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]">Digitec</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]">Galaxus</span>
          <span className="text-xs text-[#999] ml-auto">5 mars 2025 · 8 min de lecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A] mb-6 leading-tight">
          Digitec vs Galaxus vs Brack : Où Acheter ses Composants PC en Suisse ?
        </h1>

        <p className="text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#4f8ef7] pl-4">
          Vous montez un PC et vous ne savez pas où acheter vos composants en Suisse ?
          Voici notre comparatif complet de Digitec, Galaxus, Brack et Interdiscount
          pour vous aider à trouver les meilleurs prix en CHF avec un service fiable.
        </p>

        <div className="prose prose-lg max-w-none text-[#333]">
          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-2 mb-4">Le marché suisse des composants PC</h2>
          <p className="leading-relaxed mb-4">
            La Suisse possède un marché e-commerce bien développé pour les composants PC, dominé
            par quelques acteurs majeurs. Contrairement à la France ou l&apos;Allemagne où les options
            sont plus fragmentées, le marché helvétique est assez concentré, ce qui facilite les
            comparaisons mais limite parfois la concurrence sur les prix.
          </p>
          <p className="leading-relaxed mb-4">
            Les prix en CHF sont généralement 10 à 20% supérieurs aux tarifs européens en euros,
            reflet du coût de la vie et des marges locales. Cependant, l&apos;achat en Suisse reste
            largement préférable pour éviter les frais douaniers, la TVA d&apos;importation (7.7%
            depuis 2024) et les complications en cas de retour ou de garantie.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-6">Comparatif des 4 grandes boutiques</h2>
        </div>

        {/* Cards comparatif */}
        <div className="flex flex-col gap-6 mb-10">
          {retailers.map((r) => (
            <div key={r.name} className="rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4" style={{ background: r.color }}>
                <h3 className="text-xl font-bold text-white">{r.name}</h3>
                <span className="ml-auto text-white/90 font-semibold">{r.note}</span>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#22c55e] uppercase tracking-wider mb-2">✓ Points forts</p>
                  <ul className="space-y-1.5">
                    {r.pros.map((p) => (
                      <li key={p} className="text-sm text-[#444] flex items-start gap-2">
                        <span className="text-[#22c55e] mt-0.5 shrink-0">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#ef4444] uppercase tracking-wider mb-2">✗ Points faibles</p>
                  <ul className="space-y-1.5">
                    {r.cons.map((c) => (
                      <li key={c} className="text-sm text-[#444] flex items-start gap-2">
                        <span className="text-[#ef4444] mt-0.5 shrink-0">−</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="px-6 pb-4">
                <p className="text-sm text-[#555] italic border-t border-[#E5E5E5] pt-4">{r.verdict}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="prose prose-lg max-w-none text-[#333]">
          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-4 mb-4">Nos conseils pour obtenir les meilleurs prix</h2>

          <h3 className="text-xl font-semibold text-[#0A0A0A] mt-6 mb-3">1. Comparez toujours sur plusieurs sites</h3>
          <p className="leading-relaxed mb-4">
            La même carte graphique peut varier de 20 à 50 CHF entre Digitec et Brack sur une semaine.
            Prenez l&apos;habitude de vérifier au moins 2-3 sites avant d&apos;acheter. Notre configurateur
            le fait automatiquement pour vous en temps réel.
          </p>

          <h3 className="text-xl font-semibold text-[#0A0A0A] mt-6 mb-3">2. Profitez des promotions saisonnières</h3>
          <p className="leading-relaxed mb-4">
            Digitec et Galaxus organisent régulièrement des «&nbsp;Tech Days&nbsp;» avec des réductions
            significatives sur les composants. Le Black Friday suisse (fin novembre) et les soldes
            de janvier sont également de bons moments pour acheter, avec des remises allant jusqu&apos;à
            20-30% sur certains composants.
          </p>

          <h3 className="text-xl font-semibold text-[#0A0A0A] mt-6 mb-3">3. Vérifiez la disponibilité en stock</h3>
          <p className="leading-relaxed mb-4">
            La disponibilité immédiate est cruciale quand vous montez un PC. Digitec est généralement
            le plus fiable sur ce point avec de larges stocks. Brack est également solide, tandis que
            les vendeurs marketplace de Galaxus peuvent parfois annoncer des délais.
          </p>

          <h3 className="text-xl font-semibold text-[#0A0A0A] mt-6 mb-3">4. Considérez la garantie suisse</h3>
          <p className="leading-relaxed mb-4">
            Acheter en Suisse vous garantit une prise en charge locale en cas de problème.
            La garantie légale suisse est de 2 ans, et les trois grandes enseignes (Digitec,
            Galaxus, Brack) offrent un SAV réactif et des retours simplifiés — un avantage
            considérable par rapport à l&apos;achat à l&apos;étranger.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Acheter à l&apos;étranger : une fausse bonne idée ?</h2>
          <p className="leading-relaxed mb-4">
            Certains tentent d&apos;économiser en achetant sur Amazon.de, Alternate.de ou LDLC.fr.
            En théorie, les prix en euros sont plus bas. En pratique, il faut ajouter les frais de port
            (15 à 30€ pour les composants lourds), la TVA suisse à la douane (7.7%), les éventuels
            droits d&apos;importation et les complications en cas de retour ou de garantie.
          </p>
          <p className="leading-relaxed mb-6">
            Pour un composant à 200€ acheté à l&apos;étranger, vous payez environ 200€ + 15€ de port
            + 16.5€ de TVA = ~231.5€ soit ~233 CHF. Souvent comparable ou plus cher qu&apos;en Suisse,
            sans les avantages du SAV local.
          </p>
        </div>

        {/* CTA */}
        <div
          className="mt-12 p-8 rounded-2xl text-center"
          style={{ background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)" }}
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Trouvez les meilleurs prix en CHF automatiquement
          </h2>
          <p className="text-white/80 text-sm mb-5">
            Notre IA compare Digitec, Galaxus, Brack et Interdiscount pour vous proposer la meilleure
            configuration au meilleur prix en Suisse.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-[#1e40af] font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Comparer les prix maintenant →
          </Link>
        </div>

        {/* Nav articles */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
          <Link href="/blog" className="text-sm text-[#4f8ef7] hover:underline">
            ← Tous les articles
          </Link>
        </div>
      </article>
    </main>
  );
}
