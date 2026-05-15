import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { startMarketStream } from "./engine/websocket.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    status: "active",
    server_time: new Date().toISOString(),
  });
});

app.get("/api/jupiter/quote", async (req: Request, res: Response) => {
  const { inputMint, outputMint, amount, slippageBps = "50" } = req.query;

  if (!inputMint || !outputMint || !amount) {
    return res.status(400).json({
      error: "Missing parameters",
    });
  }

  try {
    const url = new URL(JUPITER_QUOTE_API);
    url.searchParams.set("inputMint", String(inputMint));
    url.searchParams.set("outputMint", String(outputMint));
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("slippageBps", String(slippageBps));

    const response = await fetch(url.toString());

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

startMarketStream();

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
