import GlassPanel from "../../components/ui/GlassPanel";

import { useMarket } from "../../state/marketStore.jsx";

export default function LiveActivityFeed() {
  const market = useMarket();

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="text-white font-semibold">Live Activity</div>

        <div className="text-xs text-slate-500">REALTIME FLOW</div>
      </div>

      <div className="space-y-2">
        {market.activity.map((t, i) => (
          <div
            key={i}
            className="
                flex
                justify-between

                rounded-xl

                border border-white/5

                bg-white/[0.03]

                px-4 py-3
              "
          >
            <div>
              <div
                className={
                  t.side === "BUY" ? "text-emerald-400" : "text-red-400"
                }
              >
                {t.side}
              </div>

              <div className="text-xs text-slate-500">{t.amount} SOL</div>
            </div>

            <div className="text-white">${t.price}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
