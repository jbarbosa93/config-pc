"use client";

import { LanguageProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { MarketProvider, type Market } from "@/lib/market";
import CartToast from "@/components/CartToast";
import type { ReactNode } from "react";

export default function Providers({ children, market }: { children: ReactNode; market?: Market }) {
  return (
    <MarketProvider initial={market}>
      <LanguageProvider>
        <CartProvider>
          {children}
          <CartToast />
        </CartProvider>
      </LanguageProvider>
    </MarketProvider>
  );
}
