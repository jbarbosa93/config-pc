import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConfigPC.ch — Ta config PC parfaite en 30 secondes",
  description:
    "Configurateur PC intelligent propulsé par Claude AI. Recommandations optimisées pour la France et la Suisse.",
  openGraph: {
    title: "ConfigPC.ch — Ta config PC parfaite en 30 secondes",
    description:
      "Configurateur PC intelligent propulsé par Claude AI. Recommandations optimisées pour la France et la Suisse.",
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
        <LanguageProvider>
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
