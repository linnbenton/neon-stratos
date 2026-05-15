import useMarketStream from "../../hooks/useMarketStream";

import LiveMarketPanel from "./LiveMarketPanel";

import SwapPanel from "../swap/SwapPanel";

import GlassPanel from "../../components/ui/GlassPanel";

import LiveChart from "./LiveChart";

export default function Dashboard({ agentState, intelState }) {
  const { price, connected } = useMarketStream();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-3">
        <div
          className="
            inline-flex
            items-center
            gap-2

            px-3 py-1

            rounded-full

            border border-white/10

            bg-white/[0.03]

            text-xs
            text-slate-300
          "
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          MARKET LIVE
        </div>

        <div>
          <h1
            className="
              text-5xl
              font-semibold
              tracking-tight

              text-white
            "
          >
            Neon Market Terminal
          </h1>

          <p className="text-slate-400 text-base mt-2">
            Institutional-grade real-time exchange engine.
          </p>
        </div>
      </div>

      {/* HERO */}
      <LiveMarketPanel />

      <LiveChart />

      {/* AI INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* SIGNAL */}
        <GlassPanel className="p-5">
          <div className="text-xs tracking-[0.2em] uppercase text-cyan-400/70">
            AI SIGNAL
          </div>

          <div className="mt-3 text-3xl font-bold text-white">
            {intelState?.signal || "WAIT"}
          </div>

          <div className="mt-2 text-sm text-slate-400">
            {intelState?.message || "Analyzing market conditions"}
          </div>
        </GlassPanel>

        {/* REGIME */}
        <GlassPanel className="p-5">
          <div className="text-xs tracking-[0.2em] uppercase text-slate-500">
            MARKET REGIME
          </div>

          <div className="mt-3 text-2xl font-semibold text-white">
            {intelState?.regime || "RANGE"}
          </div>

          <div className="mt-2 text-sm text-slate-500">
            Adaptive volatility detection
          </div>
        </GlassPanel>

        {/* CONFIDENCE */}
        <GlassPanel className="p-5">
          <div className="text-xs tracking-[0.2em] uppercase text-emerald-300/70">
            CONFIDENCE
          </div>

          <div className="mt-3 text-3xl font-bold text-emerald-400">
            {Math.round((intelState?.confidence || 0) * 100)}%
          </div>

          <div className="mt-2 text-sm text-slate-500">
            Institutional AI conviction
          </div>
        </GlassPanel>
      </div>

      {/* AGENT PANEL */}
      <GlassPanel className="p-5">
        <div className="text-xs tracking-[0.2em] uppercase text-slate-500">
          AGENT DECISION ENGINE
        </div>

        <div className="mt-3 text-2xl font-semibold text-white">
          {agentState?.signal || "NEUTRAL"}
        </div>

        <div className="mt-2 text-sm text-slate-400">
          {agentState?.message || "Awaiting signal generation"}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{
              width: `${Math.round((agentState?.confidence || 0) * 100)}%`,
            }}
          />
        </div>
      </GlassPanel>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassPanel className="p-6">
          <div className="text-slate-500 text-sm">SOL PRICE</div>

          <div className="text-4xl font-semibold text-white mt-3">
            ${price.toFixed(2)}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="text-slate-500 text-sm">STREAM STATUS</div>

          <div
            className={`
              text-2xl
              font-semibold
              mt-3

              ${connected ? "text-emerald-400" : "text-red-400"}
            `}
          >
            {connected ? "CONNECTED" : "OFFLINE"}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="text-slate-500 text-sm">ENGINE</div>

          <div className="text-2xl font-semibold text-cyan-400 mt-3">
            OFFLINE CEX
          </div>
        </GlassPanel>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 xl:col-span-8">
          <GlassPanel className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white text-xl font-semibold">
                  Live Market
                </div>

                <div className="text-slate-500 text-sm mt-1">
                  Real-time exchange activity
                </div>
              </div>

              <div className="text-emerald-400 text-sm">LIVE</div>
            </div>

            {/* MARKET STATS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          p-4
        "
              >
                <div className="text-slate-500 text-xs">24H VOLUME</div>

                <div className="text-white text-2xl mt-2">$2.4M</div>
              </div>

              <div
                className="
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          p-4
        "
              >
                <div className="text-slate-500 text-xs">OPEN INTEREST</div>

                <div className="text-white text-2xl mt-2">$842K</div>
              </div>

              <div
                className="
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          p-4
        "
              >
                <div className="text-slate-500 text-xs">ACTIVE TRADES</div>

                <div className="text-white text-2xl mt-2">1,284</div>
              </div>
            </div>

            {/* ACTIVITY FEED */}
            <div className="space-y-3">
              {[
                "Whale bought 120 SOL",
                "Jupiter route updated",
                "Large USDC inflow detected",
                "Market volatility increased",
              ].map((item, i) => (
                <div
                  key={i}
                  className="
            rounded-xl

            border border-white/5

            bg-white/[0.02]

            px-4 py-3

            text-sm
            text-slate-300
          "
                >
                  {item}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 xl:col-span-4">
          <SwapPanel />
        </div>
      </div>
    </div>
  );
}
