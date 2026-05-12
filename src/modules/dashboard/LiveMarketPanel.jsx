import GlassPanel from "../../components/ui/GlassPanel";

import { useMarket } from "../../state/marketStore.jsx";

export default function LiveMarketPanel() {
  const market = useMarket();

  return (
    <GlassPanel className="p-7">
      <div className="flex items-start justify-between">
        <div>
          <div
            className="
              text-xs
              tracking-[0.25em]
              uppercase
              text-cyan-400
            "
          >
            LIVE MARKET
          </div>

          <div className="mt-5 flex items-end gap-4">
            <div
              className="
                text-7xl
                font-black
                leading-none
                text-white
              "
            >
              ${market.price.toFixed(2)}
            </div>

            <div className="pb-2 text-emerald-400 text-xl">
              +{market.change}%
            </div>
          </div>

          <div className="mt-4 text-slate-500">{market.pair}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-[320px]">
          <div
            className="
              rounded-xl
              border border-cyan-500/10
              bg-black/20
              p-4
            "
          >
            <div className="text-xs text-slate-500">24H VOLUME</div>

            <div className="text-2xl text-white mt-2">
              ${(market.volume / 1000000).toFixed(1)}M
            </div>
          </div>

          <div
            className="
              rounded-xl
              border border-emerald-500/10
              bg-black/20
              p-4
            "
          >
            <div className="text-xs text-slate-500">ENGINE</div>

            <div className="text-emerald-400 text-xl mt-2">ONLINE</div>
          </div>

          <div
            className="
              rounded-xl
              border border-orange-500/10
              bg-black/20
              p-4
            "
          >
            <div className="text-xs text-slate-500">LATENCY</div>

            <div className="text-orange-400 text-xl mt-2">12ms</div>
          </div>

          <div
            className="
              rounded-xl
              border border-purple-500/10
              bg-black/20
              p-4
            "
          >
            <div className="text-xs text-slate-500">STREAM</div>

            <div className="text-cyan-400 text-xl mt-2">LIVE</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
