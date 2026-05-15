import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import GlassPanel from "../../components/ui/GlassPanel";

const data = [
  { value: 120 },
  { value: 180 },
  { value: 160 },
  { value: 240 },
  { value: 300 },
  { value: 280 },
  { value: 420 },
];

export default function PriceChart({ price = 178 }) {
  return (
    <GlassPanel
      className="
        relative
        overflow-hidden
        min-h-[520px]
        p-0
      "
    >
      {/* HERO LIGHTING */}
      <div
        className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2

          w-[700px]
          h-[300px]

          bg-cyan-400/10

          blur-[120px]

          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-180px]
          right-[-100px]

          w-[500px]
          h-[400px]

          bg-blue-500/10

          blur-[140px]

          rounded-full

          pointer-events-none
        "
      />

      {/* RADIAL CORE */}
      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05),transparent_60%)]

          pointer-events-none
        "
      />

      {/* CINEMATIC OVERLAY */}
      <div
        className="
          absolute
          inset-0
          z-10
          pointer-events-none

          bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%,transparent_80%,rgba(0,0,0,0.35))]
        "
      />

      {/* TOP TERMINAL BAR */}
      <div
        className="
          relative
          z-20

          flex items-center justify-between

          px-6
          py-4

          border-b border-white/5

          bg-black/20
          backdrop-blur-xl
        "
      >
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
            Neon Stratos Terminal
          </div>

          <div className="mt-1 text-xl font-semibold text-white">
            SOL / USDC
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="
              flex items-center gap-2

              rounded-full

              border border-emerald-400/20

              bg-emerald-400/10

              px-3 py-1
            "
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-xs text-emerald-300">LIVE</span>
          </div>

          <div className="text-sm text-slate-400">Institutional Feed</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">
              Live Market Movement
            </h2>

            <p className="text-sm text-slate-500">
              Real-time liquidity visualization
            </p>
          </div>

          <div className="text-[#00ffa3] text-2xl font-bold">${price}</div>
        </div>

        <div className="relative z-20 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="neon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ffa3" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00ffa3" stopOpacity={0} />
                </linearGradient>
              </defs>

              <Tooltip
                contentStyle={{
                  background: "#081018",
                  border: "1px solid rgba(0,255,163,0.25)",
                  borderRadius: "14px",
                  color: "#ffffff",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 30px rgba(0,255,163,0.15)",
                }}
                labelStyle={{
                  color: "#00ffa3",
                  fontWeight: "bold",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#00ffa3"
                strokeWidth={3}
                fill="url(#neon)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassPanel>
  );
}
