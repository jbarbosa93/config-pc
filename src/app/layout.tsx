import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "config-pc.ch — Ta config PC parfaite en 30 secondes",
  description:
    "Configurateur PC intelligent propulsé par Claude AI. Recommandations optimisées pour la Suisse. Catalogue de 400+ composants.",
  openGraph: {
    title: "config-pc.ch — Ta config PC parfaite en 30 secondes",
    description:
      "Configurateur PC intelligent propulsé par Claude AI. Recommandations optimisées pour la Suisse.",
  },
  icons: { icon: "/icon.svg" },
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
      </body>
    </html>
  );
}
