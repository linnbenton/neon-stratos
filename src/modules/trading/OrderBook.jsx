import GlassPanel from "../../components/ui/GlassPanel";

const bids = Array.from({ length: 14 }, (_, i) => ({
  price: 145 - i * 0.12,

  size: Math.random() * 12 + 1,
}));

const asks = Array.from({ length: 14 }, (_, i) => ({
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
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-2">
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
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          LIVE DEPTH
        </div>

        <h1 className="text-5xl font-semibold text-white">Orderbook</h1>

        <p className="text-slate-400">Real-time liquidity depth engine</p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-3 gap-4">
        <GlassPanel className="p-5">
          <div className="text-slate-500 text-xs">SPREAD</div>

          <div className="text-3xl text-emerald-400 mt-2">0.02%</div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="text-slate-500 text-xs">BUY PRESSURE</div>

          <div className="text-3xl text-cyan-400 mt-2">68%</div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="text-slate-500 text-xs">DEPTH</div>

          <div className="text-3xl text-orange-400 mt-2">$4.2M</div>
        </GlassPanel>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-12 gap-6">
        {/* ORDERBOOK */}
        <div className="col-span-12 xl:col-span-8">
          <GlassPanel className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {/* BIDS */}
              <div>
                <div className="flex justify-between mb-4">
                  <div className="text-emerald-400 font-semibold">BIDS</div>

                  <div className="text-xs text-slate-500">BUY WALL</div>
                </div>

                <div className="space-y-2">
                  {bids.map((b, i) => (
                    <div
                      key={i}
                      className="
                        relative

                        overflow-hidden

                        rounded-lg

                        border border-emerald-500/10

                        bg-emerald-500/[0.04]

                        px-3 py-2
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-y-0
                          right-0

                          bg-emerald-500/10
                        "
                        style={{
                          width: `${b.size * 8}%`,
                        }}
                      />

                      <div className="relative flex justify-between text-sm">
                        <span className="text-emerald-400">
                          {b.price.toFixed(2)}
                        </span>

                        <span className="text-white">{b.size.toFixed(3)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASKS */}
              <div>
                <div className="flex justify-between mb-4">
                  <div className="text-red-400 font-semibold">ASKS</div>

                  <div className="text-xs text-slate-500">SELL WALL</div>
                </div>

                <div className="space-y-2">
                  {asks.map((a, i) => (
                    <div
                      key={i}
                      className="
                        relative

                        overflow-hidden

                        rounded-lg

                        border border-red-500/10

                        bg-red-500/[0.04]

                        px-3 py-2
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-y-0
                          left-0

                          bg-red-500/10
                        "
                        style={{
                          width: `${a.size * 8}%`,
                        }}
                      />

                      <div className="relative flex justify-between text-sm">
                        <span className="text-red-400">
                          {a.price.toFixed(2)}
                        </span>

                        <span className="text-white">{a.size.toFixed(3)}</span>
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
          <GlassPanel className="p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="text-white font-semibold">Live Trades</div>

              <div className="text-xs text-slate-500">MARKET FLOW</div>
            </div>

            <div className="space-y-2">
              {trades.map((t, i) => (
                <div
                  key={i}
                  className="
                    flex
                    items-center
                    justify-between

                    rounded-lg

                    border border-white/5

                    bg-white/[0.03]

                    px-3 py-2
                  "
                >
                  <div>
                    <div
                      className={
                        t.side === "buy" ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {t.side.toUpperCase()}
                    </div>

                    <div className="text-xs text-slate-500">{t.time}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-white">${t.price.toFixed(2)}</div>

                    <div className="text-xs text-slate-500">
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
  );
}
