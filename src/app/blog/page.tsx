import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog PC Gaming Suisse — Conseils & Guides",
  description:
    "Guides et conseils pour configurer votre PC gaming en Suisse. Comparatifs prix CHF, meilleures configs pour chaque budget, composants disponibles chez Digitec et Galaxus.",
  keywords: [
    "blog pc gaming suisse",
    "guide config pc suisse",
    "conseils montage pc suisse",
    "pc gaming chf guide",
  ],
  alternates: { canonical: "https://config-pc.ch/blog" },
  openGraph: {
    title: "Blog PC Gaming Suisse — Conseils & Guides | config-pc.ch",
    description:
      "Guides et conseils pour configurer votre PC gaming en Suisse. Comparatifs prix CHF, meilleures configs pour chaque budget.",
    url: "https://config-pc.ch/blog",
    type: "website",
  },
};

const articles = [
  {
    slug: "meilleur-pc-gaming-1000-chf-suisse",
    title: "Meilleur PC Gaming à 1000 CHF en Suisse (2025)",
    description:
      "Notre sélection de la meilleure configuration PC gaming à 1000 CHF disponible chez Digitec et Galaxus. Processeur, carte graphique, RAM et stockage optimisés pour jouer en 1080p et 1440p.",
    date: "2025-03-15",
    readTime: "6 min",
    tags: ["Gaming", "Budget 1000 CHF", "Digitec"],
  },
  {
    slug: "config-pc-bureautique-suisse",
    title: "Configurer un PC Bureautique en Suisse : Guide Complet 2025",
    description:
      "Comment choisir les composants pour un PC bureautique performant en Suisse ? Budget, compatibilité, prix CHF et conseils pour le travail à domicile et le home office.",
    date: "2025-03-10",
    readTime: "7 min",
    tags: ["Bureautique", "Home Office", "Guide"],
  },
  {
    slug: "comparatif-composants-digitec-galaxus",
    title: "Digitec vs Galaxus : Où Acheter ses Composants PC en Suisse ?",
    description:
      "Comparatif complet entre Digitec, Galaxus, Brack et Interdiscount pour l'achat de composants PC en Suisse. Prix, disponibilité, délais et service après-vente.",
    date: "2025-03-05",
    readTime: "8 min",
    tags: ["Comparatif", "Digitec", "Galaxus", "Brack"],
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-3">
          <Link href="/" className="text-sm text-[#666] hover:text-[#333] transition-colors">
            ← Accueil
          </Link>
          <span className="text-[#ccc]">/</span>
          <span className="text-sm text-[#333]">Blog</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Blog PC Gaming Suisse
          </h1>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            Guides, conseils et comparatifs pour configurer votre PC en Suisse.
            Prix en CHF, disponibilité chez Digitec, Galaxus et Brack.
          </p>
        </div>

        {/* Articles */}
        <div className="flex flex-col gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block p-8 rounded-2xl border border-[#E5E5E5] hover:border-[#4f8ef7] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f7ff] text-[#4f8ef7]"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-[#999] ml-auto">{article.readTime} de lecture</span>
              </div>
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2 group-hover:text-[#4f8ef7] transition-colors">
                {article.title}
              </h2>
              <p className="text-[#666] leading-relaxed text-sm">{article.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#4f8ef7]">
                Lire l&apos;article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 p-8 rounded-2xl text-center"
          style={{ background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)" }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            Prêt à configurer votre PC ?
          </h2>
          <p className="text-white/80 mb-6">
            Notre IA génère votre configuration optimale en 30 secondes avec les prix actuels en CHF.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-[#1e40af] font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Configurer mon PC gratuitement →
          </Link>
        </div>
      </div>
    </main>
  );
}
