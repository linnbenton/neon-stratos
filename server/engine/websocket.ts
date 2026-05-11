import * as WebSocket from "ws";
import { generateOrderbook } from "./orderbook.js";

const WebSocketServer = WebSocket.WebSocketServer;

export function startMarketStream() {
  const PORT = 8080;
  const SYMBOL = "SOL/USDC";

  const wss = new WebSocketServer({ port: PORT });

  console.log(`WS Market Stream running on :${PORT}`);

  // ===============================
  // MARKET LOOP (ORDERBOOK STREAM)
  // ===============================
  const interval = setInterval(() => {
    const midPrice = 100 + Math.random() * 2;

    const orderbook = generateOrderbook(midPrice);

    const payload = {
      type: "orderbook",
      symbol: SYMBOL,
      midPrice,
      bids: orderbook.bids,
      asks: orderbook.asks,
      ts: Date.now(),
    };

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(payload));
      }
    });
  }, 1000);

  // ===============================
  // CONNECTION EVENT
  // ===============================
  wss.on("connection", (ws) => {
    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "connected to CEX market stream v3",
        symbol: SYMBOL,
      }),
    );
  });

  // ===============================
  // CLEAN SHUTDOWN
  // ===============================
  wss.on("close", () => {
    clearInterval(interval);
  });
}
