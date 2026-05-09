export default function StatsCard({ title, value, change, positive = true }) {
  return (
    <div
      className="
        relative overflow-hidden
        bg-[#0b0f17]/80
        backdrop-blur-xl
        border border-[#1a2332]
        rounded-2xl
        p-5
        transition
        hover:scale-[1.02]
        hover:border-[#00ffa3]/30
        hover:shadow-[0_0_35px_rgba(0,255,163,0.15)]
      "
    >
      {/* neon glow orb */}
      <div
        className="
          absolute
          -top-10
          -right-10
          w-32
          h-32
          rounded-full
          bg-[#00ffa3]/10
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div className="text-sm text-slate-500">{title}</div>

        <div className="mt-3 text-3xl font-bold text-slate-100">{value}</div>

        <div
          className={`mt-3 text-sm font-medium ${
            positive ? "text-[#00ffa3]" : "text-pink-400"
          }`}
        >
          {positive ? "+" : ""}
          {change}
        </div>
      </div>
    </div>
  );
}
