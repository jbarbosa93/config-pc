import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Configurer un PC Bureautique en Suisse : Guide 2025",
  description:
    "Guide complet pour configurer un PC bureautique performant en Suisse. Composants recommandés, prix CHF chez Digitec et Brack, conseils home office et télétravail.",
  keywords: [
    "pc bureautique suisse",
    "configurer pc travail suisse",
    "ordinateur bureau chf",
    "pc home office suisse romande",
    "config pc télétravail suisse",
    "meilleur pc bureau suisse 2025",
  ],
  alternates: { canonical: "https://config-pc.ch/blog/config-pc-bureautique-suisse" },
  openGraph: {
    title: "Configurer un PC Bureautique en Suisse : Guide 2025 | config-pc.ch",
    description:
      "Guide complet pour choisir les composants d'un PC bureautique en Suisse. Prix CHF, disponibilité Digitec et Brack.",
    url: "https://config-pc.ch/blog/config-pc-bureautique-suisse",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Configurer un PC Bureautique en Suisse : Guide Complet 2025",
  description:
    "Guide complet pour configurer un PC bureautique performant en Suisse avec les prix CHF actuels.",
  author: { "@type": "Organization", name: "config-pc.ch" },
  publisher: {
    "@type": "Organization",
    name: "config-pc.ch",
    url: "https://config-pc.ch",
  },
  datePublished: "2025-03-10",
  dateModified: "2025-03-10",
  url: "https://config-pc.ch/blog/config-pc-bureautique-suisse",
  mainEntityOfPage: "https://config-pc.ch/blog/config-pc-bureautique-suisse",
};

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
          <span className="text-[#333]">PC Bureautique Suisse</span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]">Bureautique</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]">Home Office</span>
          <span className="text-xs text-[#999] ml-auto">10 mars 2025 · 7 min de lecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A] mb-6 leading-tight">
          Configurer un PC Bureautique en Suisse : Guide Complet 2025
        </h1>

        <p className="text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#4f8ef7] pl-4">
          Le télétravail s&apos;est imposé en Suisse romande comme une nouvelle norme pour des millions
          de travailleurs. Que vous soyez à Genève, Lausanne ou Neuchâtel, voici comment configurer
          un PC bureautique performant et durable avec les meilleurs composants disponibles en CHF.
        </p>

        <div className="prose prose-lg max-w-none text-[#333]">
          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Les besoins d&apos;un PC bureautique en 2025</h2>
          <p className="leading-relaxed mb-4">
            Un PC bureautique moderne doit gérer simultanément des dizaines d&apos;onglets de navigateur,
            des applications de visioconférence (Teams, Zoom, Webex), des suites office (Microsoft 365,
            LibreOffice) et potentiellement des outils métier spécialisés. Les exigences ont considérablement
            augmenté depuis la démocratisation du télétravail en Suisse.
          </p>
          <p className="leading-relaxed mb-4">
            Contrairement aux idées reçues, un PC bureautique de qualité n&apos;est pas forcément bon marché.
            Un système bien dimensionné vous accompagnera 5 à 7 ans, ce qui représente un investissement
            rentable surtout si vous travaillez à domicile en Suisse où la productivité est directement
            liée à la fiabilité de votre outil de travail.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Budget : à partir de combien configurer un bon PC de bureau ?</h2>
          <p className="leading-relaxed mb-4">
            En Suisse, nous recommandons les paliers de budget suivants pour un PC bureautique :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>600–800 CHF</strong> : PC bureautique d&apos;entrée de gamme, idéal pour les tâches simples, le traitement de texte et la navigation web.</li>
            <li><strong>800–1200 CHF</strong> : Le sweet spot pour le télétravail intensif. Gère le multitâche lourd, la visioconférence en 4K et les applications métier exigeantes.</li>
            <li><strong>1200–1800 CHF</strong> : PC bureautique haut de gamme pour les professions créatives, les développeurs ou les analystes de données.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Les composants essentiels d&apos;un PC bureautique</h2>

          <div className="bg-[#f8f9fa] rounded-xl p-6 mb-6 border border-[#E5E5E5]">
            <h3 className="font-bold text-[#0A0A0A] mb-4">Configuration recommandée à ~900 CHF (home office)</h3>
            <div className="flex flex-col gap-3">
              {[
                { part: "Processeur", choice: "AMD Ryzen 5 7600 (6 cœurs, efficace énergétiquement)", price: "~220 CHF" },
                { part: "RAM", choice: "32 Go DDR5 — indispensable pour le multitâche", price: "~90 CHF" },
                { part: "Stockage", choice: "SSD NVMe 1 To + HDD 2 To pour les archives", price: "~130 CHF" },
                { part: "Carte mère", choice: "B650 micro-ATX, compacte et fiable", price: "~120 CHF" },
                { part: "Alimentation", choice: "550W 80+ Bronze — suffisant sans GPU dédié", price: "~70 CHF" },
                { part: "Boîtier", choice: "Compact micro-ATX silencieux", price: "~60 CHF" },
                { part: "Moniteur (optionnel)", choice: "27\" IPS 2560×1440 pour le confort visuel", price: "~250–350 CHF" },
              ].map((row) => (
                <div key={row.part} className="flex justify-between items-center py-2 border-b border-[#E5E5E5] last:border-0">
                  <div>
                    <span className="font-medium text-[#0A0A0A] text-sm">{row.part}</span>
                    <p className="text-xs text-[#666]">{row.choice}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#4f8ef7] whitespace-nowrap ml-4">{row.price}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Faut-il une carte graphique dédiée pour un PC bureautique ?</h2>
          <p className="leading-relaxed mb-4">
            Pour la plupart des usages bureautiques, le GPU intégré du processeur — comme l&apos;AMD
            Radeon 760M du Ryzen 5 7600 — est largement suffisant. Il gère sans problème la 4K sur
            un ou deux moniteurs, la visioconférence en HD et même des présentations PowerPoint animées.
          </p>
          <p className="leading-relaxed mb-4">
            Une carte graphique dédiée devient nécessaire si vous faites du montage vidéo, de la 3D,
            du développement avec accélération GPU (CUDA, ROCm) ou si vous souhaitez profiter d&apos;une
            touche de gaming après le travail. Dans ce cas, une RTX 4060 (~320 CHF chez Digitec)
            couvre la quasi-totalité des besoins.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Pourquoi la RAM est cruciale pour le home office</h2>
          <p className="leading-relaxed mb-4">
            C&apos;est l&apos;erreur la plus fréquente : sous-dimensionner la RAM d&apos;un PC bureautique.
            En 2025, 16 Go ne suffisent plus pour un usage professionnel intensif. Avec Chrome,
            Teams, Outlook, Excel et un VPN ouverts simultanément, vous pouvez facilement dépasser
            12 Go de RAM utilisée. Avec 32 Go, votre système reste fluide en toutes circonstances.
          </p>
          <p className="leading-relaxed mb-4">
            La DDR5 est maintenant accessible et les prix ont chuté en 2024-2025. Chez Digitec,
            un kit 32 Go DDR5-6000 se trouve entre 85 et 110 CHF selon les marques (G.Skill, Kingston, Corsair).
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Le choix du stockage : SSD NVMe obligatoire</h2>
          <p className="leading-relaxed mb-4">
            Si vous travaillez encore avec un disque dur mécanique (HDD), un SSD NVMe est la mise à niveau
            la plus impactante que vous puissiez faire. Le démarrage de Windows passe de 2 minutes à 15 secondes,
            les applications s&apos;ouvrent instantanément et le confort de travail est transformé.
          </p>
          <p className="leading-relaxed mb-4">
            En Suisse, les meilleurs rapports qualité/prix se trouvent chez Brack et Galaxus pour les SSD NVMe.
            Un Samsung 870 Evo 1 To ou un WD Blue SN580 1 To se trouvent entre 80 et 100 CHF — c&apos;est
            un investissement qui s&apos;amortit en quelques semaines grâce au temps gagné chaque jour.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] mt-10 mb-4">Consommation électrique : un critère suisse important</h2>
          <p className="leading-relaxed mb-4">
            La Suisse a connu des hausses de tarifs électriques significatives. Un PC bureautique bien
            optimisé consomme entre 30 et 80W en utilisation normale, contre 150 à 300W pour un PC gaming.
            Sur une année de travail (250 jours × 8h), cela représente une économie de 80 à 150 CHF
            par rapport à un PC gaming utilisé pour le travail.
          </p>
          <p className="leading-relaxed mb-6">
            Optez pour une alimentation 80+ Gold, un processeur à faible TDP et évitez le surmenage matériel.
            Notre configurateur prend en compte ces critères pour vous proposer la configuration la plus
            économe en énergie selon votre usage.
          </p>
        </div>

        {/* CTA */}
        <div
          className="mt-12 p-8 rounded-2xl text-center"
          style={{ background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)" }}
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Configurez votre PC bureautique sur mesure
          </h2>
          <p className="text-white/80 text-sm mb-5">
            Décrivez votre usage et l&apos;IA génère la configuration idéale avec les prix CHF actuels chez Digitec, Brack et Galaxus.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-[#1e40af] font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Configurer mon PC bureautique →
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
