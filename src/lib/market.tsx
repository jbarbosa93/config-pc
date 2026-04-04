"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Market = "ch" | "fr";

interface MarketContextValue {
  market: Market;
}

const MarketContext = createContext<MarketContextValue>({ market: "ch" });

export function MarketProvider({
  children,
  initial = "ch",
}: {
  children: ReactNode;
  initial?: Market;
}) {
  const [market, setMarket] = useState<Market>(initial);

  useEffect(() => {
    // Client-side: refine from actual hostname
    const hostname = window.location.hostname;
    if (hostname.includes("configpc-france.fr") || hostname.includes("configpc-france")) {
      setMarket("fr");
    } else {
      setMarket("ch");
    }
  }, []);

  return (
    <MarketContext.Provider value={{ market }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): Market {
  return useContext(MarketContext).market;
}
