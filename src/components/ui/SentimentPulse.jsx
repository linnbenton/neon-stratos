export default function SentimentPulse() {
  return (
    <div
      className="
        fixed
        left-6
        bottom-6

        z-50

        flex
        items-center
        gap-3
      "
    >
      <div className="relative">
        <div className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
      </div>

      <div className="text-xs text-slate-300">
        Market Sentiment:
        <span className="text-emerald-400 ml-1">Bullish</span>
      </div>
    </div>
  );
}
