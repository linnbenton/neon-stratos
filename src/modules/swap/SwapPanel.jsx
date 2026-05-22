import { useState, useEffect } from "react";

import GlassPanel from "../../components/ui/GlassPanel";
import { TOKENS } from "../../lib/tokens";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { VersionedTransaction } from "@solana/web3.js";

export default function SwapPanel({ globalTx, setGlobalTx }) {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const [prices, setPrices] = useState({});
  const [quote, setQuote] = useState(null);
  const [typing, setTyping] = useState(false);
  const [txid, setTxid] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPrices();
      setPrices(data);
    };

    load();
  }, []);

  useEffect(() => {
    if (!amount || Number(amount) <= 0) return;

    const timeout = setTimeout(async () => {
      try {
        setTyping(true);

        const amountLamports = Number(amount) * Math.pow(10, from.decimals);

        const res = await fetch(
          `https://lite-api.jup.ag/swap/v1/quote?inputMint=${from.mint}&outputMint=${to.mint}&amount=${amountLamports}&slippageBps=50`,
        );

        const data = await res.json();

        setQuote(data);
      } catch (e) {
        console.error("quote error", e);
      } finally {
        setTyping(false);
      }
    }, 300); // 🔥 debounce seperti Binance UI

    return () => clearTimeout(timeout);
  }, [amount, fromToken, toToken]);

  const wallet = useWallet();

  const fromTokenData = TOKENS.find((t) => t.symbol === fromToken);
  const toTokenData = TOKENS.find((t) => t.symbol === toToken);

  if (!fromTokenData || !toTokenData) {
    return null;
  }

  const from = {
    ...fromTokenData,
    price: prices?.[fromTokenData.mint]?.price ?? fromTokenData.price ?? 0,
  };

  const to = {
    ...toTokenData,
    price: prices?.[toTokenData.mint]?.price ?? toTokenData.price ?? 1,
  };

  const estimated = quote?.outAmount
    ? (quote.outAmount / Math.pow(10, to.decimals)).toFixed(6)
    : "0.000000";

  // Fungsi baru untuk menangani klik tombol Execute Swap
  const handleSwap = async () => {
    try {
      if (!wallet.publicKey) {
        alert("Connect wallet first");
        return;
      }

      if (!wallet.signTransaction) {
        alert("Wallet tidak support signing");
        return;
      }

      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Invalid amount");
        return;
      }

      if (fromToken === toToken) {
        alert("Token tidak boleh sama");
        return;
      }

      setLoading(true);

      console.log("🚀 REAL SWAP START");

      const amountLamports = parsedAmount * Math.pow(10, from.decimals);

      // STEP 1 — QUOTE
      const quoteResponse = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=${from.mint}&outputMint=${to.mint}&amount=${amountLamports}&slippageBps=50`,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_JUP_API_KEY,
          },
        },
      );

      const quoteData = await quoteResponse.json();

      console.log("QUOTE:", quoteData);

      if (!quoteData.outAmount) {
        throw new Error("No route found");
      }

      // STEP 2 — BUILD TX
      const swapResponse = await fetch("https://lite-api.jup.ag/swap/v1/swap", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_JUP_API_KEY,
        },

        body: JSON.stringify({
          quoteResponse: quoteData,

          userPublicKey: wallet.publicKey.toString(),

          wrapAndUnwrapSol: true,

          dynamicComputeUnitLimit: true,

          prioritizationFeeLamports: "auto",
        }),
      });

      const swapData = await swapResponse.json();

      console.log("SWAP DATA:", swapData);

      if (!swapData.swapTransaction) {
        throw new Error("Swap transaction gagal dibuat");
      }

      // STEP 3 — DESERIALIZE
      const swapTransactionBuf = Buffer.from(
        swapData.swapTransaction,
        "base64",
      );

      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // STEP 4 — SIGN
      const signedTx = await wallet.signTransaction(transaction);

      console.log("SIGNED");

      // STEP 5 — SEND
      const txid = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 2,
      });

      await connection.confirmTransaction(txid, "confirmed");

      setTxid(txid);
      setGlobalTx(txid);

      if (setGlobalTx) {
        setGlobalTx(txid);
      }

      console.log("TX SENT:", txid);

      // STEP 6 — CONFIRM
      const latestBlockhash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        signature: txid,
        ...latestBlockhash,
      });

      console.log("SUCCESS:", txid);

      setAmount("");
    } catch (err) {
      console.error("SWAP ERROR:", err);

      alert(err?.message || "Swap gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassPanel className="p-6">
      <div className="space-y-5">
        {/* HEADER */}
        <div>
          <div className="text-white text-2xl font-semibold">Instant Swap</div>
          <div className="text-slate-500 text-sm mt-1">
            Simulated smart routing engine
          </div>
        </div>

        {/* FROM */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm">From</div>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-transparent text-cyan-400 outline-none"
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-black">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={loading}
            className="w-full bg-transparent outline-none text-4xl text-white placeholder:text-slate-600"
          />
        </div>

        {/* TO */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm">To</div>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-transparent text-emerald-400 outline-none"
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-black">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-4xl text-white">{estimated}</div>

          {typing && (
            <div className="text-xs text-cyan-400 animate-pulse mt-2">
              fetching Jupiter route...
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Price Impact</span>
            <span className="text-white">0.02%</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-slate-500">Route</span>

            {globalTx ? (
              <a
                href={`https://solscan.io/tx/${globalTx}`}
                target="_blank"
                rel="noreferrer"
                className="
        text-emerald-400
        hover:text-emerald-300
        transition
      "
              >
                View Solscan ↗
              </a>
            ) : (
              <span className="text-cyan-400">Jupiter Ultra</span>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Liquidity</span>
            <span className="text-emerald-400">Deep</span>
          </div>
        </div>

        {/* BUTTON (FIXED: Added onClick, disabled state, and dynamic text) */}
        <button
          onClick={handleSwap}
          disabled={loading || !amount}
          className="w-full rounded-2xl bg-cyan-500 py-4 text-black font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? "Processing Swap..." : "Execute Swap"}
        </button>
      </div>
    </GlassPanel>
  );
}
