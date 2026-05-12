import * as WebSocket from "ws";
import { generateOrderbook } from "./orderbook.js";

const WebSocketServer = WebSocket.WebSocketServer;

export function startMarketStream() {
  const PORT = 8080;

  const wss = new WebSocketServer({
    port: PORT,
  });

  console.log(`WS Market Stream :${PORT}`);

  let currentPrice = 145;

  setInterval(() => {
    // SMALL REALISTIC MOVEMENT
    const move = (Math.random() - 0.5) * 0.8;

    currentPrice += move;

    const orderbook = generateOrderbook(currentPrice);

    const payload = {
      type: "market",

      symbol: "SOL/USDC",

      price: Number(currentPrice.toFixed(2)),

      change: Number((move * 2).toFixed(2)),

      volume: Math.floor(1000000 + Math.random() * 500000),

      orderbook,

      trades: Array.from({ length: 8 }, (_, i) => ({
        side: Math.random() > 0.5 ? "buy" : "sell",

        price: Number((currentPrice + (Math.random() - 0.5)).toFixed(2)),

        size: Number((Math.random() * 5).toFixed(3)),

        ts: Date.now() - i * 1000,
      })),

      ts: Date.now(),
    };

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(payload));
      }
    });
  }, 1200);

  wss.on("connection", (ws) => {
    console.log("client connected");

    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "connected to Neon market stream",
      }),
    );
  });
}
