import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import type { Market } from "@/lib/market";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const market = (headersList.get("x-market") ?? "ch") as Market;

  if (market === "fr") {
    return {
      title: {
        default: "Configurateur PC France | Config IA en EUR — configpc-france.fr",
        template: "%s | configpc-france.fr",
      },
      description:
        "Configurez votre PC gaming en France. L'IA génère votre config optimale avec les prix LDLC, Amazon, Materiel.net et Cdiscount en EUR.",
      keywords: [
        "configurateur pc france",
        "config pc gaming eur",
        "pc gaming ldlc",
        "configuration pc gamer france",
        "builder pc france",
        "configurer pc france",
        "montage pc france",
        "pc gamer france",
        "composants pc france",
        "meilleur pc gaming france",
      ],
      metadataBase: new URL("https://configpc-france.fr"),
      openGraph: {
        type: "website",
        locale: "fr_FR",
        siteName: "configpc-france.fr",
        title: "Configurateur PC France | Config IA en EUR — configpc-france.fr",
        description:
          "Configurez votre PC gaming en France. L'IA génère votre config optimale avec les prix LDLC, Amazon, Materiel.net et Cdiscount en EUR.",
        url: "https://configpc-france.fr",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "configpc-france.fr — Configurateur PC France" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Configurateur PC France | Config IA en EUR — configpc-france.fr",
        description:
          "Configurez votre PC gaming en France. L'IA génère votre config optimale avec les prix LDLC, Amazon, Materiel.net et Cdiscount en EUR.",
        images: ["/og-image.png"],
      },
      icons: { icon: "/icon.svg" },
      robots: { index: true, follow: true },
      alternates: { canonical: "https://configpc-france.fr" },
      verification: { google: "EhD0S1fmrk2OgCEBNOnI2MjfZws_hBJ-YDGr_totVow" },
    };
  }

  // Default: Switzerland
  return {
    title: {
      default: "Configurateur PC Suisse | Config IA en CHF — config-pc.ch",
      template: "%s | config-pc.ch",
    },
    description:
      "Configurez votre PC gaming en Suisse. L'IA génère votre config optimale avec les prix Digitec, Galaxus, Brack et Interdiscount en CHF.",
    keywords: [
      "configurateur pc suisse",
      "config pc gaming chf",
      "pc gaming digitec",
      "configuration pc suisse romande",
      "builder pc suisse",
      "configurer pc suisse",
      "montage pc suisse",
      "pc gamer suisse",
      "composants pc chf",
      "meilleur pc gaming suisse",
    ],
    metadataBase: new URL("https://config-pc.ch"),
    openGraph: {
      type: "website",
      locale: "fr_CH",
      siteName: "config-pc.ch",
      title: "Configurateur PC Suisse | Config IA en CHF — config-pc.ch",
      description:
        "Configurez votre PC gaming en Suisse. L'IA génère votre config optimale avec les prix Digitec, Galaxus, Brack et Interdiscount en CHF.",
      url: "https://config-pc.ch",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "config-pc.ch — Configurateur PC Suisse" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Configurateur PC Suisse | Config IA en CHF — config-pc.ch",
      description:
        "Configurez votre PC gaming en Suisse. L'IA génère votre config optimale avec les prix Digitec, Galaxus, Brack et Interdiscount en CHF.",
      images: ["/og-image.png"],
    },
    icons: { icon: "/icon.svg" },
    robots: { index: true, follow: true },
    alternates: { canonical: "https://config-pc.ch" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const market = (headersList.get("x-market") ?? "ch") as Market;

  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <Providers market={market}>
          {children}
          <Footer />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
