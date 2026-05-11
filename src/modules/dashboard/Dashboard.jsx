import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orderbook, setOrderbook] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "orderbook") {
        setOrderbook(data);
      }
    };

    return () => ws.close();
  }, []);

  if (!orderbook) {
    return <div className="text-slate-400">Loading market...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BIDS */}
      <div>
        <h2 className="text-green-400 mb-2">BIDS</h2>
        {orderbook.bids.map((b, i) => (
          <div key={i} className="text-xs text-green-400">
            {b.price.toFixed(2)} | {b.size.toFixed(2)}
          </div>
        ))}
      </div>

      {/* ASKS */}
      <div>
        <h2 className="text-red-400 mb-2">ASKS</h2>
        {orderbook.asks.map((a, i) => (
          <div key={i} className="text-xs text-red-400">
            {a.price.toFixed(2)} | {a.size.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
