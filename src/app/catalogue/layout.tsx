import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Catalogue de 2800+ composants PC et périphériques gaming — processeurs, cartes graphiques, RAM, stockage, moniteurs. Meilleurs prix CHF en Suisse.",
  openGraph: {
    title: "Catalogue composants PC — config-pc.ch",
    description:
      "2800+ composants PC et périphériques gaming. Filtrez par catégorie, marque et prix. Meilleurs prix CHF.",
    url: "https://config-pc.ch/catalogue",
  },
  alternates: { canonical: "https://config-pc.ch/catalogue" },
};

export default function CatalogueLayout({ children }: { children: ReactNode }) {
  return children;
}
