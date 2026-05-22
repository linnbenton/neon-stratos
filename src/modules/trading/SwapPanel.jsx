import { useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { connection } from "../../lib/solana";

import { getQuote, createSwapTransaction } from "../../lib/jupiter";

export default function SwapPanel() {
  const [amount, setAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState(0);
  const [quote, setQuote] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const { publicKey, signTransaction } = useWallet();

  const valid = !!quote && !!publicKey;

  // ===============================
  // CONFIG & MAPPING
  // ===============================
  const DECIMALS = {
    SOL: 9,
    USDC: 6,
  };

  // ===============================
  // REAL-TIME QUOTE ENGINE
  // ===============================
  useEffect(() => {
    const rawAmount = parseFloat(amount);

    // 1. Validasi Input Cepat
    if (!amount || isNaN(rawAmount) || rawAmount <= 0) {
      setQuote(null);
      setLoading(false);
      return;
    }

    // 2. Setup AbortController untuk membatalkan request lama
    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        // Konversi ke satuan Lamports (SOL = 9 decimals)
        const baseAmount = Math.floor(rawAmount * 1e9).toString();

        const data = await getQuote({
          inputMint: "So11111111111111111111111111111111111111112", // SOL
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
          amount: baseAmount,
          // Teruskan signal abort ke fungsi getQuote jika didukung (opsional)
          signal: controller.signal,
        });

        // 3. Update State jika data valid
        setQuote(data || null);

        setPriceImpact(Number(data?.priceImpactPct || 0) * 100);
      } catch (err) {
        // Abaikan error jika itu disebabkan oleh pembatalan request (Abort)
        if (err.name !== "AbortError") {
          console.error("UI Quote Engine Error:", err);
          setQuote(null);
        }
      } finally {
        // Pastikan loading berhenti hanya jika ini request terakhir
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 450); // Debounce 450ms agar lebih smooth

    // 4. Cleanup Function
    return () => {
      clearTimeout(timeout);
      controller.abort(); // Batalkan fetch jika user mengetik karakter baru
    };
  }, [amount]);

  console.log("AMOUNT:", amount);
  console.log("QUOTE:", quote);

  // ===============================
  // UI DERIVED STATE (OUTPUT FIX)
  // ===============================
  const outAmount = quote?.outAmount ? Number(quote.outAmount) / 1e6 : null;

  const minReceived = quote?.otherAmountThreshold
    ? Number(quote.otherAmountThreshold) / Math.pow(10, DECIMALS.USDC)
    : 0;

  // ===============================
  // HANDLE SWAP EXECUTION
  // ===============================
  const handleSwap = async () => {
    // Tambahkan pengecekan signTransaction
    if (!publicKey || !quote || !signTransaction) {
      console.error("Wallet tidak siap atau tidak mendukung signTransaction");
      alert("Hubungkan wallet Solana (Phantom/Solflare) terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);

      // Pastikan kita menggunakan Buffer versi terbaru untuk Mainnet
      const swapData = await createSwapTransaction({
        quoteResponse: quote,
        userPublicKey: publicKey.toBase58(),
        wrapAndUnwrapSol: true,
        prioritizationFeeLamports: 50000, // Wajib di Mainnet agar tidak macet
      });

      // 2. Deserialize Transaction
      const swapTransactionBuf = Buffer.from(
        swapData.swapTransaction,
        "base64",
      );
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // 3. Ambil Blockhash Terbaru (PENTING untuk Mainnet)
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      transaction.message.recentBlockhash = blockhash;

      // 4. Sign Transaction via Wallet
      const signedTx = await signTransaction(transaction);

      // 5. Kirim Transaksi dengan konfigurasi khusus Mainnet
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: false, // Biarkan sistem mengecek simulasi dulu
          preflightCommitment: "confirmed",
          maxRetries: 3, // Coba lagi otomatis jika gagal di awal
        },
      );

      setToast(true);
      console.log("Transaction Sent:", signature);

      // 6. Konfirmasi Transaksi
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed",
      );

      if (confirmation.value.err) {
        throw new Error("Transaction confirmed but failed on-chain");
      }

      console.log("SWAP SUCCESS:", signature);
      setTimeout(() => setToast(false), 5000); // Tutup toast setelah 5 detik
    } catch (err) {
      // Ini akan memunculkan pesan error asli dari Solana/Jupiter di console
      console.error("--- SWAP ERROR DETAIL ---");
      console.error("Message:", err.message);
      if (err.logs) {
        console.error("Logs dari Blockchain:", err.logs);
      }
      alert(`Eksekusi Gagal: ${err.message}`);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="bg-[#0b0f17]/80 backdrop-blur-xl border border-[#1a2332] rounded-2xl p-5 space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-white font-semibold text-lg">Instant Swap</h2>
        <p className="text-slate-500 text-xs">
          Real-time Jupiter execution engine
        </p>
      </div>

      {/* INPUT */}
      <div>
        <div className="text-xs text-slate-500 mb-1">From</div>

        <div className="flex items-center justify-between bg-[#05060a] border border-[#1a2332] rounded-lg px-3 py-2 text-white">
          <span>SOL</span>
          <span className="text-xs text-slate-500">Solana</span>
        </div>

        <input
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) {
              setAmount(val);
            }
          }}
          placeholder="0.0"
          className="w-full px-3 py-2 bg-[#05060a] border border-[#1a2332] rounded-lg text-white outline-none"
        />
      </div>

      {/* =============================== */}
      {/* OUTPUT FIELD */}
      {/* =============================== */}
      <div className="bg-[#05060a] border border-[#1a2332] rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Estimated Output
          </div>
          <div className="text-[10px] bg-[#1a2332] text-slate-400 px-2 py-0.5 rounded">
            USDC
          </div>
        </div>

        <div className="mt-2 text-xl font-semibold">
          {loading ? (
            <span className="text-slate-400">Calculating route...</span>
          ) : outAmount ? (
            <>
              {outAmount.toFixed(4)}{" "}
              <span className="text-sm text-slate-400">USDC</span>
            </>
          ) : (
            <span className="text-slate-500">0.0000 USDC</span>
          )}
        </div>
      </div>

      {/* =============================== */}
      {/* INFO PANEL (PRICE IMPACT & MIN RECEIVED) */}
      {/* =============================== */}
      {quote && !loading && (
        <div className="grid grid-cols-2 gap-3 text-xs mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="bg-[#05060a] border border-[#1a2332] rounded-lg p-3 hover:border-[#1a2332]/80 transition-colors">
            <div className="text-slate-500 mb-1">Price Impact</div>
            <div
              className={`font-mono font-semibold ${priceImpact > 1 ? "text-red-400" : "text-[#00ffa3]"}`}
            >
              {priceImpact}%
            </div>
          </div>

          <div className="bg-[#05060a] border border-[#1a2332] rounded-lg p-3 hover:border-[#1a2332]/80 transition-colors">
            <div className="text-slate-500 mb-1">Min. Received</div>
            <div className="text-white font-mono font-semibold">
              {minReceived.toFixed(4)}{" "}
              <span className="text-[10px] text-slate-500">USDC</span>
            </div>
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSwap}
        disabled={!valid || loading}
        className={`
          w-full py-3 rounded-xl font-medium transition
          ${
            valid
              ? "bg-[#00ffa3] text-black hover:opacity-90"
              : "bg-[#1a2332] text-slate-500 cursor-not-allowed"
          }
        `}
      >
        {loading ? "Executing..." : "Instant Swap"}
      </button>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#05060a]/95 border border-[#00ffa3]/20 px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(0,255,163,0.15)] backdrop-blur-xl">
          <div className="text-[#00ffa3] text-sm font-medium">
            ✓ Swap executed
          </div>
          <div className="text-slate-500 text-xs mt-1">
            Transaction sent to Solana network
          </div>
        </div>
      )}
    </div>
  );
}
