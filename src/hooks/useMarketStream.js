import { useEffect, useState } from "react";

export function useMarketStream() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPrice(data.price);
    };

    return () => ws.close();
  }, []);

  return price;
}
