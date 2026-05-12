import { useEffect, useState } from "react";

export default function useMarketStream() {
  const [price, setPrice] = useState(145);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WS connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.price) {
          setPrice(data.price);
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => ws.close();
  }, []);

  return {
    price,
    connected,
  };
}
