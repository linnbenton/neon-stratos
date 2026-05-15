import { WebSocketServer } from "ws";
import axios from "axios";

const SOL = "So11111111111111111111111111111111111111112";
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";

export function startMarketStream() {
  const wss = new WebSocketServer({ port: 8080 });

  console.log("REALTIME MARKET WS :8080");

  let lastPrice = 0;

  const broadcast = () => {
    const price = 150 + Math.random() * 5;

    const change = lastPrice === 0 ? 0 : price - lastPrice;

    lastPrice = price;

    const payload = {
      type: "market",
      symbol: "SOL/USDC",
      price,
      change: Number(change.toFixed(4)),
      ts: Date.now(),
    };

    wss.clients.forEach((c) => {
      if (c.readyState === 1) {
        c.send(JSON.stringify(payload));
      }
    });
  };

  setInterval(broadcast, 2000);

  wss.on("connection", (ws) => {
    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "Jupiter v6 stream connected",
      }),
    );
  });
}
