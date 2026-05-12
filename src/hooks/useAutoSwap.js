import { useEffect, useState } from "react";

export function useAutoSwap(from, to, amount) {
  const [route, setRoute] = useState(null);

  const [loading, setLoading] = useState(false);

  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!amount || Number(amount) <= 0) {
      setRoute(null);
      setValid(false);
      return;
    }

    async function fetchQuote() {
      try {
        setLoading(true);

        // OFFLINE CEX MODE
        // simulated quote

        const simulatedOutput = (Number(amount) * 145.12).toFixed(2);

        await new Promise((r) => setTimeout(r, 400));

        setRoute({
          outAmount: simulatedOutput,
        });

        setValid(true);
      } catch (err) {
        console.error(err);

        setRoute(null);

        setValid(false);
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, [from, to, amount]);

  return {
    route,
    loading,
    valid,
  };
}
