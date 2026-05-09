import { useState, useEffect, useCallback, useRef } from "react";

// Types for better safety
interface PricePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  value: number;
}

interface TokenData {
  symbol: string;
  price: number;
  priceChange: number;
  volume24h: number;
  marketCap: number;
  history: PricePoint[];
  isMock: boolean;
}

export const KNOWN_TOKENS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  BTC: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  mSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
  JTO: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
};

const BASE_PRICES: Record<string, number> = {
  SOL: 148.42,
  USDC: 1.0,
  USDT: 1.0,
  BTC: 63420.1,
  mSOL: 157.73,
  JTO: 2.84,
  WIF: 2.18,
  BONK: 0.0000284,
  RAY: 4.82,
  JUP: 0.92,
};

const BASE_VOLUMES: Record<string, number> = {
  SOL: 2_840_000_000,
  USDC: 8_100_000_000,
  USDT: 12_300_000_000,
  BTC: 31_200_000_000,
  mSOL: 24_000_000,
  JTO: 88_000_000,
  WIF: 420_000_000,
  BONK: 320_000_000,
  RAY: 62_000_000,
  JUP: 140_000_000,
};

// Realistic mock price history generator - NOW WITH TYPES
function mockPriceHistory(
  basePrice: number,
  symbol: string,
  points: number = 24,
): PricePoint[] {
  const volatilities: Record<string, number> = {
    SOL: 0.025,
    USDC: 0.0002,
    USDT: 0.0002,
    BTC: 0.018,
    mSOL: 0.026,
    JTO: 0.045,
    WIF: 0.065,
    BONK: 0.07,
    RAY: 0.04,
    JUP: 0.035,
  };

  const volatility = volatilities[symbol] || 0.03;
  const history: PricePoint[] = [];
  let price = basePrice * (0.9 + Math.random() * 0.1);
  const now = Date.now();

  for (let i = points; i >= 0; i--) {
    const drift = (Math.random() - 0.48) * volatility;
    price = Math.max(price * (1 + drift), 0.0001);
    history.push({
      time: new Date(now - i * 3600_000).toISOString(),
      open: price * (1 - volatility * 0.3),
      high: price * (1 + volatility * 0.5),
      low: price * (1 - volatility * 0.5),
      close: price,
      value: price,
    });
  }
  return history;
}

function generateMockTokenData(symbol: string): TokenData {
  const base = BASE_PRICES[symbol] || 1;
  const vol = BASE_VOLUMES[symbol] || 1_000_000;
  const change = (Math.random() - 0.45) * 8;
  return {
    symbol,
    price: base * (1 + change / 100),
    priceChange: change,
    volume24h: vol * (0.8 + Math.random() * 0.4),
    marketCap: base * (Math.random() * 1e9 + 1e8),
    history: mockPriceHistory(base, symbol),
    isMock: true,
  };
}

const cache = new Map<string, { ts: number; data: TokenData }>();
const CACHE_TTL = 45_000;

async function fetchTokenData(
  symbol: string,
  mint: string,
): Promise<TokenData> {
  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const [overviewRes, historyRes] = await Promise.allSettled([
      fetch(`/api/birdeye/token?mint=${mint}`, {
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`/api/birdeye/history?mint=${mint}&type=1H`, {
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    let price = BASE_PRICES[symbol] || 1;
    let priceChange = 0;
    let volume24h = BASE_VOLUMES[symbol] || 0;
    let marketCap = 0;

    if (overviewRes.status === "fulfilled" && overviewRes.value.ok) {
      const json = await overviewRes.value.json();
      const d = json.data || json;
      price = parseFloat(d.price || d.value || price);
      priceChange = parseFloat(d.priceChange24hPercent || d.priceChange || 0);
      volume24h = parseFloat(d.v24hUSD || d.volume24h || volume24h);
      marketCap = parseFloat(d.mc || d.marketCap || 0);
    }

    let history = mockPriceHistory(price, symbol);
    if (historyRes.status === "fulfilled" && historyRes.value.ok) {
      const json = await historyRes.value.json();
      const items = json.data?.items || json.items || [];
      if (items.length > 0) {
        history = items.map((it: any) => ({
          time: new Date(it.unixTime * 1000).toISOString(),
          open: parseFloat(it.o || it.open || it.value),
          high: parseFloat(it.h || it.high || it.value),
          low: parseFloat(it.l || it.low || it.value),
          close: parseFloat(it.c || it.close || it.value),
          value: parseFloat(it.c || it.close || it.value),
        }));
      }
    }

    const data: TokenData = {
      symbol,
      price,
      priceChange,
      volume24h,
      marketCap,
      history,
      isMock: false,
    };
    cache.set(symbol, { ts: Date.now(), data });
    return data;
  } catch {
    const data = generateMockTokenData(symbol);
    cache.set(symbol, { ts: Date.now(), data });
    return data;
  }
}

export function useBirdeye(tokens: { symbol: string; mint?: string }[] = []) {
  const [tokenData, setTokenData] = useState<Record<string, TokenData>>({});
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!tokens.length) return;
    setLoading(true);
    const results: Record<string, TokenData> = {};
    let anyReal = false;

    await Promise.allSettled(
      tokens.map(async ({ symbol, mint }) => {
        const d = await fetchTokenData(
          symbol,
          mint || KNOWN_TOKENS[symbol] || "",
        );
        results[symbol] = d;
        if (!d.isMock) anyReal = true;
      }),
    );

    if (mountedRef.current) {
      setTokenData(results);
      setIsMock(!anyReal);
      setLoading(false);
    }
  }, [tokens.map((t) => t.symbol).join(",")]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  return { tokenData, loading, isMock, refresh: load };
}
