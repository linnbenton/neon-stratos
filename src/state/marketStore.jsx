import { createContext, useContext, useEffect, useState } from "react";

const MarketContext = createContext(null);

export function MarketProvider({ children }) {
  const [market, setMarket] = useState({
    pair: "SOL/USDC",

    price: 145.12,

    change: 2.4,

    volume: 2400000,

    activity: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarket((prev) => {
        const move = (Math.random() - 0.5) * 0.8;

        const newPrice = prev.price + move;

        const trade = {
          side: Math.random() > 0.5 ? "BUY" : "SELL",

          amount: (Math.random() * 4).toFixed(2),

          price: newPrice.toFixed(2),

          ts: Date.now(),
        };

        return {
          ...prev,

          price: newPrice,

          activity: [trade, ...prev.activity].slice(0, 20),
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketContext.Provider value={market}>{children}</MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
