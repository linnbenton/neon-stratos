import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Menggunakan URL utama yang lebih stabil
const JUPITER_QUOTE_API = "https://lite-api.jup.ag/quote/v1/quote";

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    status: "active",
    server_time: new Date().toISOString(),
  });
});

// Jupiter Quote Proxy
app.get("/api/jupiter/quote", async (req: Request, res: Response) => {
  const { inputMint, outputMint, amount, slippageBps = "50" } = req.query;

  // 1. Validasi Parameter
  if (!inputMint || !outputMint || !amount) {
    return res.status(400).json({
      error: "Missing parameters",
      required: ["inputMint", "outputMint", "amount"],
    });
  }

  try {
    // 2. Konstruksi URL secara aman
    const url = new URL(JUPITER_QUOTE_API);
    url.searchParams.set("inputMint", String(inputMint));
    url.searchParams.set("outputMint", String(outputMint));
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("slippageBps", String(slippageBps));

    // 3. Fetch dengan Timeout (Mencegah server gantung)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "Neon-Stratos-Proxy",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 4. Handling Error dari Jupiter/Cloudflare
    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = errorText;
      }

      return res.status(response.status).json({
        error: "Upstream Provider Error",
        status: response.status,
        details: errorJson,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error(`[Proxy Error]: ${err.message}`);

    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ error: "Gateway Timeout: Jupiter took too long to respond" });
    }

    return res.status(502).json({
      error: "Bad Gateway",
      message: err.message,
    });
  }
});

// ===============================
// SERVER START
// ===============================
app.listen(PORT, () => {
  console.log("");
  console.log(`\x1b[36m%s\x1b[0m`, `  ⚡ Neon Stratos Engine Initialized`);
  console.log(
    `\x1b[32m%s\x1b[0m`,
    `  📡 Local Proxy : http://localhost:${PORT}`,
  );
  console.log(`\x1b[90m%s\x1b[0m`, `  🛠  Mode        : TypeScript (tsx)`);
  console.log("");
});
