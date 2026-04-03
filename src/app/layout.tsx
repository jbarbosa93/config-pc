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
    default: "config-pc.ch — Ta config PC parfaite en 30 secondes",
    template: "%s | config-pc.ch",
  },
  description:
    "Configurateur PC intelligent propulsé par Claude AI. Recommandations sur-mesure pour la Suisse. 2800+ composants, meilleurs prix CHF.",
  metadataBase: new URL("https://config-pc.ch"),
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: "config-pc.ch",
    title: "config-pc.ch — Ta config PC parfaite en 30 secondes",
    description:
      "Configurateur PC intelligent propulsé par Claude AI. Recommandations sur-mesure pour la Suisse.",
    url: "https://config-pc.ch",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "config-pc.ch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "config-pc.ch — Ta config PC parfaite en 30 secondes",
    description: "Configurateur PC intelligent propulsé par Claude AI. Recommandations sur-mesure pour la Suisse.",
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
