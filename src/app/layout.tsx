import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <Providers>
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
