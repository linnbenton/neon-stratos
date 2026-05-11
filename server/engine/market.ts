type MarketData = any;

const marketCache = new Map<
  string,
  {
    data: MarketData;
    ts: number;
  }
>();

export function setMarket(symbol: string, data: MarketData) {
  marketCache.set(symbol, {
    data,
    ts: Date.now(),
  });
}

export function getMarket(symbol: string): MarketData | null {
  const cached = marketCache.get(symbol);

  if (!cached) return null;

  if (Date.now() - cached.ts > 2000) return null;

  return cached.data;
}
