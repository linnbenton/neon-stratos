import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketTable({ tokens = [] }) {
  return (
    <div
      className="bg-[#0b0f17]
      border border-[#1a2332]
      rounded-xl
      overflow-hidden
      shadow-[0_0_30px_rgba(168,85,247,0.12)]
      "
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1a2332] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Live Markets</h2>

          <p className="text-sm text-slate-500">Real-time token overview</p>
        </div>

        <div className="text-xs text-[#00ffa3]">LIVE</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 border-b border-[#1a2332]">
            <tr>
              <th className="text-left font-medium px-5 py-3">Token</th>
              <th className="text-right font-medium px-5 py-3">Price</th>
              <th className="text-right font-medium px-5 py-3">24h</th>
              <th className="text-right font-medium px-5 py-3">Volume</th>
            </tr>
          </thead>

          <tbody>
            {tokens.map((token, index) => {
              const positive = token.change24h >= 0;

              return (
                <tr
                  key={index}
                  className="border-b border-[#111827] hover:bg-[#00ffa3]/[0.04]"
                >
                  {/* Token */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#111827] border border-[#1a2332] flex items-center justify-center text-xs font-bold">
                        {token.symbol?.slice(0, 2)}
                      </div>

                      <div>
                        <div className="font-medium text-slate-200">
                          {token.symbol}
                        </div>

                        <div className="text-xs text-slate-500">
                          {token.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-right text-slate-200 font-medium">
                    ${token.price?.toLocaleString()}
                  </td>

                  {/* Change */}
                  <td
                    className={`px-5 py-4 text-right font-medium ${
                      positive ? "text-[#00ffa3]" : "text-red-400"
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {positive ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {positive ? "+" : ""}
                      {token.change24h?.toFixed(2)}%
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="px-5 py-4 text-right text-slate-200 font-medium">
                    ${token.volume?.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
