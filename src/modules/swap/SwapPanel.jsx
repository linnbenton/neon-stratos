import { useState } from "react";

import GlassPanel from "../../components/ui/GlassPanel";

import { TOKENS } from "../../lib/tokens";

export default function SwapPanel() {
  const [fromToken, setFromToken] = useState("SOL");

  const [toToken, setToToken] = useState("USDC");

  const [amount, setAmount] = useState("");

  const from = TOKENS.find((t) => t.symbol === fromToken);

  const to = TOKENS.find((t) => t.symbol === toToken);

  const estimated =
    amount && from && to
      ? ((Number(amount) * from.price) / to.price).toFixed(4)
      : "0.00";

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
        <div
          className="
            rounded-2xl

            border border-white/10

            bg-white/[0.03]

            p-4
          "
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm">From</div>

            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="
                bg-transparent

                text-cyan-400

                outline-none
              "
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-black">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="
              w-full

              bg-transparent

              outline-none

              text-4xl

              text-white

              placeholder:text-slate-600
            "
          />
        </div>

        {/* TO */}
        <div
          className="
            rounded-2xl

            border border-white/10

            bg-white/[0.03]

            p-4
          "
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm">To</div>

            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="
                bg-transparent

                text-emerald-400

                outline-none
              "
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-black">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="text-4xl text-white">{estimated}</div>
        </div>

        {/* INFO */}
        <div
          className="
            rounded-2xl

            border border-white/10

            bg-white/[0.02]

            p-4

            space-y-2
          "
        >
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Price Impact</span>

            <span className="text-white">0.02%</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Route</span>

            <span className="text-cyan-400">Offline CEX</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Liquidity</span>

            <span className="text-emerald-400">Deep</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          className="
            w-full

            rounded-2xl

            bg-cyan-500

            py-4

            text-black

            font-semibold

            transition-all

            hover:scale-[1.02]
          "
        >
          Execute Swap
        </button>
      </div>
    </GlassPanel>
  );
}
