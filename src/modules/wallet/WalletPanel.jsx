import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function WalletPanel() {
  const walletAddress = "7xKz...a9Q2Zx9";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      className="
        bg-[#0b0f17]/80
        backdrop-blur-xl
        border border-[#1a2332]
        rounded-2xl
        p-5
        space-y-4
      "
    >
      {/* HEADER */}
      <div>
        <h2 className="text-white font-semibold text-lg">Wallet</h2>

        <p className="text-slate-500 text-xs">Connected Solana wallet</p>
      </div>

      {/* WALLET ADDRESS BOX */}
      <div
        className="
          flex items-center justify-between
          bg-[#05060a]
          border border-[#1a2332]
          rounded-xl
          px-4 py-3
        "
      >
        {/* Address */}
        <div className="text-sm text-slate-300">{walletAddress}</div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="
            text-slate-400
            hover:text-[#00ffa3]
            transition
          "
        >
          {copied ? (
            <Check size={18} className="text-[#00ffa3]" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>

      {/* WALLET STATS */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="
            bg-[#05060a]
            border border-[#1a2332]
            rounded-xl
            p-3
          "
        >
          <div className="text-xs text-slate-500">Balance</div>
          <div className="text-white font-semibold mt-1">12.84 SOL</div>
        </div>

        <div
          className="
            bg-[#05060a]
            border border-[#1a2332]
            rounded-xl
            p-3
          "
        >
          <div className="text-xs text-slate-500">Portfolio</div>
          <div className="text-[#00ffa3] font-semibold mt-1">$2,418</div>
        </div>
      </div>
    </div>
  );
}
