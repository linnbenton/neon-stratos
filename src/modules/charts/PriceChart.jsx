import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

const data = [
  { value: 120 },
  { value: 180 },
  { value: 160 },
  { value: 240 },
  { value: 300 },
  { value: 280 },
  { value: 420 },
];

export default function PriceChart() {
  return (
    <div
      className="
        bg-[#0b0f17]/80
        backdrop-blur-xl
        border border-[#1a2332]
        rounded-xl
        p-5
        shadow-[0_0_35px_rgba(0,255,163,0.08)]
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">SOL / USDC</h2>

          <p className="text-sm text-slate-500">Live market movement</p>
        </div>

        <div className="text-[#00ffa3] drop-shadow-[0_0_12px_rgba(0,255,163,0.8)] text-2xl font-bold">
          $178.42
        </div>
      </div>

      <div className="h-[300px]">
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
                background: "#14071f",
                border: "1px solid #ff4fd8",
                borderRadius: "12px",
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(255,79,216,0.45)",
              }}
              labelStyle={{
                color: "#ff4fd8",
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
  );
}
