import { useEffect, useState } from "react";

export default function useMarketStream() {
  const [price, setPrice] = useState(178);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data?.price) {
            setPrice(data.price);
          }
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    } catch (err) {
      console.error(err);
    }

    // FALLBACK ENGINE
    const interval = setInterval(() => {
      setPrice((prev) => {
        const move = (Math.random() - 0.5) * 1.5;

        return Number((prev + move).toFixed(2));
      });
    }, 1500);

    return () => {
      ws?.close();
      clearInterval(interval);
    };
  }, []);

  return {
    price,
    connected,
  };
}
