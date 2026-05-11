export default function OrderBook({ bids = [], asks = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="text-green-400">
        {bids.map((b, i) => (
          <div key={i}>
            {b.price.toFixed(4)} | {b.size.toFixed(2)}
          </div>
        ))}
      </div>

      <div className="text-red-400">
        {asks.map((a, i) => (
          <div key={i}>
            {a.price.toFixed(4)} | {a.size.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
