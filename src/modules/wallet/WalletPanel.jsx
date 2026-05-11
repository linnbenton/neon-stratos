import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, Check, LogOut } from "lucide-react";
import { useState } from "react";

export default function WalletPanel() {
  const { publicKey, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const address = publicKey?.toBase58();

  const handleCopy = async () => {
    try {
      if (!address) return;
      await navigator.clipboard.writeText(address);

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#0b0f17]/80 backdrop-blur-xl border border-[#1a2332] rounded-2xl p-5 space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-white font-semibold text-lg">My Balance</h2>
        <p className="text-slate-500 text-xs">Solana mainnet connection</p>
      </div>

      {/* WALLET BOX */}
      <div className="flex items-center justify-between gap-3 bg-[#05060a] border border-[#1a2332] rounded-xl px-4 py-3">
        {/* ADDRESS (FIX: TRUNCATE + NO OVERFLOW) */}
        <div className="flex-1 min-w-0">
          {address ? (
            <div className="text-sm text-slate-300 font-mono truncate">
              {address}
            </div>
          ) : (
            <div className="text-sm text-slate-500">Not connected</div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* COPY */}
          {address && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-[#0f1722] transition"
            >
              {copied ? (
                <Check size={18} className="text-[#00ffa3]" />
              ) : (
                <Copy size={18} className="text-slate-400" />
              )}
            </button>
          )}

          {/* DISCONNECT */}
          {address && (
            <button
              onClick={disconnect}
              className="p-2 rounded-lg hover:bg-red-500/10 transition"
            >
              <LogOut size={18} className="text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#05060a] border border-[#1a2332] rounded-xl p-3">
          <div className="text-xs text-slate-500">Balance</div>
          <div className="text-white font-semibold mt-1">-- SOL</div>
        </div>

        <div className="bg-[#05060a] border border-[#1a2332] rounded-xl p-3">
          <div className="text-xs text-slate-500">Portfolio</div>
          <div className="text-[#00ffa3] font-semibold mt-1">-- USD</div>
        </div>
      </div>
    </div>
  );
}
