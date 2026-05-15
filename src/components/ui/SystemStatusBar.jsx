export default function SystemStatusBar() {
  return (
    <div
      className="
        w-full

        flex
        items-center
        justify-between

        px-4
        py-2

        text-[10px]

        text-slate-400

        border-b border-white/5

        bg-black/40
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-3">
        <span className="text-cyan-300">NEON STRATOS OS</span>
        <span className="opacity-50">•</span>
        <span>MARKET CORE ONLINE</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-emerald-400">SYNC: OK</span>
        <span className="opacity-50">|</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
