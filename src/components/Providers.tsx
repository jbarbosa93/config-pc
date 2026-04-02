"use client";

import { LanguageProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import CartToast from "@/components/CartToast";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        {children}
        <CartToast />
      </CartProvider>
    </LanguageProvider>
  );
}
