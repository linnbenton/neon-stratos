import { useState, useEffect, useCallback } from "react";
import { PROXY_API, KAMINO_API } from "../config";

// Seed mock data – shown when Kamino API is unreachable
const MOCK_VAULTS = [
  {
    address: "USDC-SOL-0",
    tokenA: {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      decimals: 6,
    },
    tokenB: {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      decimals: 9,
    },
    apy: 24.87,
    tvl: 18_420_000,
    volume24h: 4_120_000,
    feesApy: 12.4,
    rewardsApy: 12.47,
    strategy: "Narrow",
    price: 148.42,
    priceRange: [141.2, 156.8],
    utilizationRate: 88.4,
    status: "ACTIVE",
    dex: "Orca",
  },
  {
    address: "SOL-USDT-1",
    tokenA: {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      decimals: 9,
    },
    tokenB: {
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      symbol: "USDT",
      decimals: 6,
    },
    apy: 31.22,
    tvl: 12_880_000,
    volume24h: 6_740_000,
    feesApy: 18.9,
    rewardsApy: 12.32,
    strategy: "Wide",
    price: 148.42,
    priceRange: [120.0, 180.0],
    utilizationRate: 72.1,
    status: "ACTIVE",
    dex: "Raydium",
  },
  {
    address: "BTC-SOL-2",
    tokenA: {
      mint: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      symbol: "BTC",
      decimals: 6,
    },
    tokenB: {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      decimals: 9,
    },
    apy: 18.44,
    tvl: 8_330_000,
    volume24h: 1_980_000,
    feesApy: 9.2,
    rewardsApy: 9.24,
    strategy: "Balanced",
    price: 63_420.1,
    priceRange: [58_000, 70_000],
    utilizationRate: 65.3,
    status: "ACTIVE",
    dex: "Orca",
  },
  {
    address: "MSOL-SOL-3",
    tokenA: {
      mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
      symbol: "mSOL",
      decimals: 9,
    },
    tokenB: {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      decimals: 9,
    },
    apy: 8.91,
    tvl: 22_100_000,
    volume24h: 890_000,
    feesApy: 2.3,
    rewardsApy: 6.61,
    strategy: "Correlated",
    price: 1.0628,
    priceRange: [1.04, 1.09],
    utilizationRate: 94.7,
    status: "ACTIVE",
    dex: "Meteora",
  },
  {
    address: "JTO-USDC-4",
    tokenA: {
      mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
      symbol: "JTO",
      decimals: 9,
    },
    tokenB: {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      decimals: 6,
    },
    apy: 42.18,
    tvl: 4_210_000,
    volume24h: 3_140_000,
    feesApy: 28.6,
    rewardsApy: 13.58,
    strategy: "Aggressive",
    price: 2.84,
    priceRange: [2.4, 3.3],
    utilizationRate: 78.9,
    status: "ACTIVE",
    dex: "Raydium",
  },
  {
    address: "WIF-USDC-5",
    tokenA: {
      mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      symbol: "WIF",
      decimals: 6,
    },
    tokenB: {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      decimals: 6,
    },
    apy: 67.33,
    tvl: 3_440_000,
    volume24h: 8_220_000,
    feesApy: 52.1,
    rewardsApy: 15.23,
    strategy: "Aggressive",
    price: 2.18,
    priceRange: [1.7, 2.7],
    utilizationRate: 61.2,
    status: "ACTIVE",
    dex: "Orca",
  },
];

const MOCK_POSITIONS = [
  {
    vault: "USDC-SOL-0",
    tokenA: "USDC",
    tokenB: "SOL",
    valueUSD: 12_440,
    pnl: 842.3,
    pnlPct: 7.27,
    shares: 0.0000821,
    deposited: 11_597.7,
    earned: 842.3,
  },
  {
    vault: "SOL-USDT-1",
    tokenA: "SOL",
    tokenB: "USDT",
    valueUSD: 4_820,
    pnl: -128.4,
    pnlPct: -2.59,
    shares: 0.0000374,
    deposited: 4_948.4,
    earned: -128.4,
  },
  {
    vault: "JTO-USDC-4",
    tokenA: "JTO",
    tokenB: "USDC",
    valueUSD: 2_110,
    pnl: 418.7,
    pnlPct: 24.76,
    shares: 0.0000501,
    deposited: 1_691.3,
    earned: 418.7,
  },
  {
    vault: "WIF-USDC-5",
    tokenA: "WIF",
    tokenB: "USDC",
    valueUSD: 940,
    pnl: 220.6,
    pnlPct: 30.66,
    shares: 0.0000273,
    deposited: 719.4,
    earned: 220.6,
  },
];

async function fetchKaminoStrategies() {
  const url = PROXY_API(
    `${KAMINO_API}/strategies?env=mainnet-beta&status=ACTIVE&strategyType=NON_PEGGED`,
  );
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Kamino API ${res.status}`);
  return res.json();
}

function normalizeKaminoVault(raw) {
  const apy = parseFloat(raw.apy24h || raw.apy || 0) * 100;
  return {
    address: raw.address,
    tokenA: {
      mint: raw.tokenAMint,
      symbol: raw.tokenASymbol || "TOKEN_A",
      decimals: raw.tokenADecimals || 6,
    },
    tokenB: {
      mint: raw.tokenBMint,
      symbol: raw.tokenBSymbol || "TOKEN_B",
      decimals: raw.tokenBDecimals || 6,
    },
    apy: apy,
    tvl: parseFloat(raw.tvl || 0),
    volume24h: parseFloat(raw.volume24h || 0),
    feesApy: parseFloat(raw.feesApy24h || 0) * 100,
    rewardsApy: parseFloat(raw.rewardsApy || 0) * 100,
    strategy: raw.strategyType || "Standard",
    price: parseFloat(raw.price || 0),
    priceRange: [
      parseFloat(raw.priceLower || 0),
      parseFloat(raw.priceUpper || 0),
    ],
    utilizationRate: parseFloat(raw.utilizationRate || 0) * 100,
    status: raw.status || "ACTIVE",
    dex: raw.dex || "Unknown",
  };
}

export function useKamino() {
  const [vaults, setVaults] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchKaminoStrategies();
      const top = (Array.isArray(data) ? data : data.strategies || [])
        .slice(0, 12)
        .map(normalizeKaminoVault)
        .filter((v) => v.apy > 0);
      if (top.length === 0) throw new Error("No vault data returned");
      setVaults(top);
      setIsMock(false);
    } catch (err) {
      setVaults(MOCK_VAULTS);
      setIsMock(true);
      setError(
        `Live data unavailable — showing simulated vaults. (${err.message})`,
      );
    } finally {
      setPositions(MOCK_POSITIONS);
      setLoading(false);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  return {
    vaults,
    positions,
    loading,
    error,
    isMock,
    lastUpdate,
    refresh: load,
  };
}
