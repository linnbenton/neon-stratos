import axios from "axios";

const BASES = ["https://lite-api.jup.ag", "https://price.jup.ag/v6"];

export async function getQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
}) {
  if (!amount || Number(amount) <= 0) return null;

  for (const base of BASES) {
    try {
      const res = await axios.get(`${base}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount: String(amount),
          slippageBps,
        },
        timeout: 5000,
      });

      if (res.data?.outAmount) return res.data;
    } catch (e) {
      console.warn("quote fail:", base);
    }
  }

  return null;
}
