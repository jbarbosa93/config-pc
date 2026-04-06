"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Component } from "./types";

export interface CartItem extends Component {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (component: Component) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  totalCHF: number;
  count: number;
  lastAdded: { name: string; type: string; price_ch: number; price_fr: number; ts: number } | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<{ name: string; type: string; price_ch: number; price_fr: number; ts: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((component: Component) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.name === component.name);
      if (exists) return prev;
      return [...prev, { ...component, quantity: 1 }];
    });
    setLastAdded({ name: component.name, type: component.type, price_ch: component.price_ch, price_fr: component.price_fr ?? component.price_ch, ts: Date.now() });
  }, []);

  const removeItem = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCHF = items.reduce((s, i) => s + i.price_ch * i.quantity, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalCHF, count, lastAdded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
