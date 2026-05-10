import { useState } from "react";
import { useAutoSwap } from "../../hooks/useAutoSwap";

export default function SwapPanel() {
  const [tokenIn] = useState("SOL");
  const [tokenOut] = useState("USDC");
  const [amount, setAmount] = useState("");

  const { route, loading, valid } = useAutoSwap(tokenIn, tokenOut, amount);

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
        <h2 className="text-white font-semibold text-lg">Instant Swap</h2>

        <p className="text-slate-500 text-xs">Real-time Jupiter quote engine</p>
      </div>

      {/* FROM TOKEN */}
      <div>
        <div className="text-xs text-slate-500 mb-1">From</div>

        <div
          className="
            bg-[#05060a]
            border border-[#1a2332]
            rounded-lg
            px-3 py-2
            text-white
          "
        >
          SOL
        </div>
      </div>

      {/* AMOUNT */}
      <div>
        <div className="text-xs text-slate-500 mb-1">Amount</div>

        <input
          value={amount}
          onChange={(e) => {
            const val = e.target.value;

            if (/^\d*\.?\d*$/.test(val)) {
              setAmount(val);
            }
          }}
          placeholder="0.0"
          className="
            w-full
            px-3 py-2
            bg-[#05060a]
            border border-[#1a2332]
            rounded-lg
            text-white
            outline-none
          "
        />
      </div>

      {/* OUTPUT */}
      <div
        className="
          bg-[#05060a]
          border border-[#1a2332]
          rounded-xl
          p-4
        "
      >
        <div className="text-xs text-slate-500">Estimated Output</div>

        <div className="mt-2 text-xl font-semibold text-[#00ffa3]">
          {loading && "Calculating..."}

          {!loading && route?.outAmount && (
            <>
              {route.outAmount} {tokenOut}
            </>
          )}

          {!loading && !valid && (
            <span className="text-red-400 text-sm">No valid route</span>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <button
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
        {loading ? "Detecting Route..." : "Instant Swap"}
      </button>
    </div>
  );
}
