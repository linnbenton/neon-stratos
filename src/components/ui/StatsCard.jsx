import GlassPanel from "./GlassPanel";

export default function StatsCard({ title, value, change, positive = true }) {
  return (
    <GlassPanel
      className="
      p-5
      transition-transform
      duration-300
      hover:scale-[1.02]
    "
    >
      <div className="relative z-10">
        <div className="text-sm tracking-wide text-slate-500">{title}</div>

        <div className="mt-3 text-3xl font-bold text-slate-100">{value}</div>

        <div
          className={`mt-3 text-sm font-semibold ${
            positive ? "text-[#00ffa3]" : "text-pink-400"
          }`}
        >
          {positive ? "+" : ""}
          {change}
        </div>
      </div>
    </GlassPanel>
  );
}
