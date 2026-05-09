export default function TickerBar({ tokens = [] }) {
  const duplicatedTokens = [...tokens, ...tokens];

  return (
    <div
      className="
        overflow-hidden
        border-y border-[#1a2332]
        bg-[#0b0f17]
        py-2
      "
    >
      <div className="ticker-wrapper">
        <div className="ticker-marquee">
          {duplicatedTokens.map((token, index) => (
            <div
              key={`${token.symbol}-${index}`}
              className="
                flex items-center gap-2
                whitespace-nowrap
                px-6
              "
            >
              <span className="text-white text-sm">{token.symbol}</span>

              <span className="text-[#00ffa3] font-medium text-sm">
                ${token.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
