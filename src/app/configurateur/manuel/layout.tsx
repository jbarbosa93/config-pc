import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Configurateur Manuel",
  description:
    "Configurateur PC manuel étape par étape — choisissez chaque composant avec vérification de compatibilité en temps réel. CPU, carte mère, RAM, GPU, stockage.",
  openGraph: {
    title: "Configurateur Manuel PC — config-pc.ch",
    description:
      "Construisez votre PC composant par composant avec vérification de compatibilité automatique.",
    url: "https://config-pc.ch/configurateur/manuel",
  },
  alternates: { canonical: "https://config-pc.ch/configurateur/manuel" },
};

export default function ManuelLayout({ children }: { children: ReactNode }) {
  return children;
}
