import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orderbook, setOrderbook] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "orderbook") {
        setOrderbook(data);
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  return (
    <div className="space-y-4">
      {/* HEADER STATUS */}
      <div className="flex items-center justify-between">
        <h1 className="text-white font-semibold">Market Dashboard</h1>

        <div
          className={`text-xs px-2 py-1 rounded ${
            connected ? "text-green-400" : "text-red-400"
          }`}
        >
          {connected ? "LIVE" : "DISCONNECTED"}
        </div>
      </div>

      {/* MID PRICE */}
      {orderbook && (
        <div className="bg-[#05060a] border border-[#1a2332] p-4 rounded-lg">
          <div className="text-slate-500 text-xs">MID PRICE</div>
          <div className="text-[#00ffa3] text-2xl font-bold">
            {orderbook.midPrice.toFixed(4)}
          </div>
        </div>
      )}

      {/* ORDERBOOK */}
      {orderbook && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* BIDS */}
          <div className="bg-[#05060a] border border-[#1a2332] p-3 rounded">
            <div className="text-green-400 mb-2">BIDS</div>

            {orderbook.bids.map((b, i) => (
              <div key={i} className="text-green-400">
                {b.price.toFixed(2)} | {b.size.toFixed(2)}
              </div>
            ))}
          </div>

          {/* ASKS */}
          <div className="bg-[#05060a] border border-[#1a2332] p-3 rounded">
            <div className="text-red-400 mb-2">ASKS</div>

            {orderbook.asks.map((a, i) => (
              <div key={i} className="text-red-400">
                {a.price.toFixed(2)} | {a.size.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
