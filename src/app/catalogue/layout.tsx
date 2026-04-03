import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catalogue composants PC Suisse — 2160 produits",
  description:
    "Catalogue de 2160+ composants PC disponibles en Suisse — processeurs, cartes graphiques, RAM, stockage, boîtiers. Comparez les prix CHF chez Digitec, Galaxus et Brack.",
  keywords: [
    "catalogue composants pc suisse",
    "composants pc chf",
    "prix pc digitec",
    "prix pc galaxus",
    "processeur suisse prix",
    "carte graphique suisse",
  ],
  openGraph: {
    title: "Catalogue composants PC Suisse — 2160 produits | config-pc.ch",
    description:
      "2160+ composants PC disponibles en Suisse. Filtrez par catégorie, marque et prix CHF. Digitec, Galaxus, Brack.",
    url: "https://config-pc.ch/catalogue",
  },
  alternates: { canonical: "https://config-pc.ch/catalogue" },
};

export default function CatalogueLayout({ children }: { children: ReactNode }) {
  return children;
}
