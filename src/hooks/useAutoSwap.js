import { useEffect, useState } from "react";

const MINTS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2q9H2wzq1y4nP3Q6F4w8sYwK7t",
};

export function useAutoSwap(tokenIn, tokenOut, amount) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenIn || !tokenOut) return;

    const num = parseFloat(amount);

    if (isNaN(num) || num <= 0) {
      setRoute(null);
      setValid(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const inputMint = MINTS[tokenIn];
        const outputMint = MINTS[tokenOut];

        if (!inputMint || !outputMint) return;

        // 🔥 FIX: dynamic decimals (SOL vs USDC)
        const decimals = tokenIn === "USDC" ? 6 : 9;

        const res = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${Math.floor(
            num * Math.pow(10, decimals),
          )}&slippageBps=50`,
        );

        const data = await res.json();

        console.log("JUPITER RESPONSE:", data);

        if (!data?.outAmount) {
          setRoute(null);
          setValid(false);
          return;
        }

        setRoute({
          outAmount: (Number(data.outAmount) / 1e6).toFixed(4),
          pricePerUnit: (Number(data.outAmount) / num / 1e6).toFixed(4),
        });

        setValid(true);
      } catch (e) {
        console.error("AUTO SWAP ERROR:", e);
        setRoute(null);
        setValid(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [tokenIn, tokenOut, amount]);

  return { quote, loading };
}
