import { useEffect, useState, useCallback } from "react";

export function useAutoSwap(tokenIn, tokenOut, amount) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const fetchRoute = useCallback(() => {
    const num = Number(amount);

    if (!num || num <= 0) {
      setRoute(null);
      setValid(false);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 🔥 MOCK PRICE ENGINE (AMAN UNTUK COMMIT)
      const fakePrice = 142;

      const out = num * fakePrice;

      setRoute({
        outAmount: out.toFixed(4),
        pricePerUnit: fakePrice,
      });

      setValid(true);
      setLoading(false);
    }, 150);
  }, [tokenIn, tokenOut, amount]);

  useEffect(() => {
    const num = Number(amount);

    if (!tokenIn || !tokenOut || !num) {
      setRoute(null);
      setValid(false);
      return;
    }

    const delay = setTimeout(fetchRoute, 150);

    return () => clearTimeout(delay);
  }, [tokenIn, tokenOut, amount, fetchRoute]);

  return { route, loading, valid };
}
