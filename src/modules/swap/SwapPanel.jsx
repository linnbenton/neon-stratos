import { useEffect, useState } from "react";

export function useAutoSwap(tokenIn, tokenOut, amount) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const num = Number(amount);

    if (!tokenIn || !tokenOut || !num) {
      setRoute(null);
      setValid(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${tokenIn}&outputMint=${tokenOut}&amount=${Math.floor(
            num * 1e9,
          )}&slippageBps=50`,
        );

        const data = await res.json();

        console.log("JUPITER RESPONSE:", data); // 🔥 DEBUG WAJIB

        if (!data?.outAmount) {
          setRoute(null);
          setValid(false);
        } else {
          setRoute({
            outAmount: (Number(data.outAmount) / 1e6).toFixed(4),
            pricePerUnit: (Number(data.outAmount) / num / 1e6).toFixed(4),
          });

          setValid(true);
        }
      } catch (e) {
        console.error(e);
        setRoute(null);
        setValid(false);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [tokenIn, tokenOut, amount]);

  return { route, loading, valid };
}
