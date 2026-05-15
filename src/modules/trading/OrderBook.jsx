import { useEffect, useState } from "react";

import GlassPanel from "../../components/ui/GlassPanel";

const initialBids = Array.from({ length: 14 }, (_, i) => ({
  price: 145 - i * 0.12,

  size: Math.random() * 12 + 1,
}));

const initialAsks = Array.from({ length: 14 }, (_, i) => ({
  price: 145 + i * 0.12,

  size: Math.random() * 12 + 1,
}));

const trades = Array.from({ length: 12 }, (_, i) => ({
  side: Math.random() > 0.5 ? "buy" : "sell",

  price: 145 + (Math.random() - 0.5),

  size: Math.random() * 3,

  time: "12:4" + i,
}));

export default function OrderBook() {
  const [bids, setBids] = useState(initialBids);
  const [asks, setAsks] = useState(initialAsks);

  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prev) =>
        prev.map((b) => ({
          ...b,
          size: Math.max(0.1, b.size + (Math.random() - 0.5) * 0.2),
        })),
      );

      setAsks((prev) =>
        prev.map((a) => ({
          ...a,
          size: Math.max(0.1, a.size + (Math.random() - 0.5) * 0.2),
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassPanel
      className="
      relative
      overflow-hidden
      p-0
    "
    >
      {/* DEPTH LIGHTING */}
      <div
        className="
        absolute
        top-[-120px]
        right-[-120px]

        w-[300px]
        h-[300px]

        rounded-full

        bg-cyan-400/10

        blur-[120px]

        pointer-events-none
      "
      />

      <div
        className="
        absolute
        bottom-[-100px]
        left-[-100px]

        w-[260px]
        h-[260px]

        rounded-full

        bg-emerald-400/10

        blur-[120px]

        pointer-events-none
      "
      />

      {/* TERMINAL HEADER */}
      <div
        className="
        relative z-20

        border-b border-white/5

        bg-black/20
        backdrop-blur-xl

        px-6
        py-5
      "
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div
              className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border border-white/10

              bg-white/[0.03]

              px-3
              py-1

              text-xs
              text-slate-300
            "
            >
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              LIVE DEPTH
            </div>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Orderbook
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Real-time liquidity depth engine
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div
              className="
              rounded-2xl

              border border-emerald-400/10

              bg-emerald-400/10

              px-4
              py-2
            "
            >
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                Market Status
              </div>

              <div className="mt-1 text-sm font-semibold text-emerald-300">
                ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 space-y-6 p-6">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GlassPanel className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Spread
            </div>

            <div className="mt-2 text-3xl font-semibold text-emerald-400">
              0.02%
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Buy Pressure
            </div>

            <div className="mt-2 text-3xl font-semibold text-cyan-400">68%</div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Depth
            </div>

            <div className="mt-2 text-3xl font-semibold text-orange-400">
              $4.2M
            </div>
          </GlassPanel>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* ORDERBOOK */}
          <div className="col-span-12 xl:col-span-8">
            <GlassPanel className="p-5">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* BIDS */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-semibold tracking-wide text-emerald-400">
                      BIDS
                    </div>

                    <div className="text-[10px] uppercase tracking-wider text-slate-500">
                      Buy Wall
                    </div>
                  </div>

                  <div className="space-y-2">
                    {bids.map((b, i) => (
                      <div
                        key={i}
                        className="
                        group
                        relative

                        overflow-hidden

                        rounded-xl

                        border border-emerald-500/10

                        bg-emerald-500/[0.04]

                        px-3
                        py-2.5

                        transition-all
                        duration-200

                        hover:border-emerald-400/20
                        hover:bg-emerald-500/[0.06]
                      "
                      >
                        <div
                          className="
                          absolute
                          inset-y-0
                          right-0

                          bg-emerald-400/10

                          transition-all
                          duration-300
                        "
                          style={{
                            width: `${b.size * 8}%`,
                          }}
                        />

                        <div className="relative flex items-center justify-between text-sm">
                          <span className="font-medium text-emerald-400">
                            {b.price.toFixed(2)}
                          </span>

                          <span className="text-white">
                            {b.size.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ASKS */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-semibold tracking-wide text-red-400">
                      ASKS
                    </div>

                    <div className="text-[10px] uppercase tracking-wider text-slate-500">
                      Sell Wall
                    </div>
                  </div>

                  <div className="space-y-2">
                    {asks.map((a, i) => (
                      <div
                        key={i}
                        className="
                        group
                        relative

                        overflow-hidden

                        rounded-xl

                        border border-red-500/10

                        bg-red-500/[0.04]

                        px-3
                        py-2.5

                        transition-all
                        duration-200

                        hover:border-red-400/20
                        hover:bg-red-500/[0.06]
                      "
                      >
                        <div
                          className="
                          absolute
                          inset-y-0
                          left-0

                          bg-red-400/10

                          transition-all
                          duration-300
                        "
                          style={{
                            width: `${a.size * 8}%`,
                          }}
                        />

                        <div className="relative flex items-center justify-between text-sm">
                          <span className="font-medium text-red-400">
                            {a.price.toFixed(2)}
                          </span>

                          <span className="text-white">
                            {a.size.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* TRADE TAPE */}
          <div className="col-span-12 xl:col-span-4">
            <GlassPanel className="h-full p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Live Trades
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    Market Flow
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                  <span className="text-xs text-emerald-300">LIVE</span>
                </div>
              </div>

              <div className="space-y-2">
                {trades.map((t, i) => (
                  <div
                    key={i}
                    className="
                    flex
                    items-center
                    justify-between

                    rounded-xl

                    border border-white/5

                    bg-white/[0.03]

                    px-3
                    py-2.5

                    transition-all
                    duration-200

                    hover:bg-white/[0.05]
                  "
                  >
                    <div>
                      <div
                        className={`font-medium ${
                          t.side === "buy" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {t.side.toUpperCase()}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {t.time}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        ${t.price.toFixed(2)}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {t.size.toFixed(3)} SOL
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
