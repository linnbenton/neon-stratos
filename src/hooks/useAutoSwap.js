import { useEffect, useState } from "react";
import axios from "axios";

const PRICES = {
  SOL: 148,
  USDC: 1,
  JUP: 0.92,
  BONK: 0.000032,
};

export function useAutoSwap(tokenIn, tokenOut, amount) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!amount || Number(amount) <= 0) {
      setRoute(null);
      setValid(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        setLoading(true);

        const inputPrice = PRICES[tokenIn];
        const outputPrice = PRICES[tokenOut];

        if (!inputPrice || !outputPrice) {
          setValid(false);
          return;
        }

        // simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 300));

        const usdValue = Number(amount) * inputPrice;

        const outAmount = usdValue / outputPrice;

        setRoute({
          outAmount: outAmount.toFixed(2),
          pricePerUnit: inputPrice,
        });

        setValid(true);
      } catch (err) {
        console.error(err);
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 250);

    return () => clearTimeout(timer);
  }, [tokenIn, tokenOut, amount]);

  return {
    route,
    loading,
    valid,
  };
}
