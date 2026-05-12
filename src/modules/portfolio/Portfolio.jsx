const assets = [
  {
    symbol: "SOL",
    balance: 12.42,
    value: 1800,
  },

  {
    symbol: "USDC",
    balance: 4200,
    value: 4200,
  },

  {
    symbol: "JUP",
    balance: 1200,
    value: 980,
  },
];

export default function Portfolio() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-[#00ffa3]">Portfolio</h1>

        <p className="text-slate-400 text-sm mt-1">Asset overview</p>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className="bg-[#0f172a] border border-[#1a2332] rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-white font-semibold">{asset.symbol}</div>

              <div className="text-slate-500 text-sm">{asset.balance}</div>
            </div>

            <div className="text-[#00ffa3] font-bold">${asset.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
