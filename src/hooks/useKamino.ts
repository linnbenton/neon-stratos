import { useState, useEffect, useCallback } from "react";
import { PROXY_API, KAMINO_API } from "../config";

// --- 1. DEFINISI TYPES (PENTING UNTUK BUILD) ---
interface KaminoVaultRaw {
  address: string;
  tokenAMint: string;
  tokenASymbol?: string;
  tokenADecimals?: number;
  tokenBMint: string;
  tokenBSymbol?: string;
  tokenBDecimals?: number;
  apy24h?: string | number;
  apy?: string | number;
  tvl?: string | number;
  volume24h?: string | number;
  feesApy24h?: string | number;
  rewardsApy?: string | number;
  strategyType?: string;
  price?: string | number;
  priceLower?: string | number;
  priceUpper?: string | number;
  utilizationRate?: string | number;
  status?: string;
  dex?: string;
}

export interface KaminoVault {
  address: string;
  symbol: string; // Ini yang tadi bikin merah
  tokenA: { mint: string; symbol: string; decimals: number };
  tokenB: { mint: string; symbol: string; decimals: number };
  apy: number;
  tvl: number;
  volume24h: number;
  feesApy: number;
  rewardsApy: number;
  strategy: string;
  price: number;
  priceRange: [number, number];
  utilizationRate: number;
  status: string;
  dex: string;
}

// Seed mock data – ditambahkan properti 'symbol' agar sesuai Interface dan tidak error
const MOCK_VAULTS: KaminoVault[] = [
  {
    address: "USDC-SOL-0",
    symbol: "USDC-SOL",
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
    symbol: "SOL-USDT",
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
    address: "JTO-USDC-4",
    symbol: "JTO-USDC",
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
];

async function fetchKaminoStrategies() {
  const url = PROXY_API(
    `${KAMINO_API}/strategies?env=mainnet-beta&status=ACTIVE&strategyType=NON_PEGGED`,
  );
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Kamino API ${res.status}`);
  return res.json();
}

// --- 2. PERBAIKAN FUNGSI NORMALIZE (RAW TYPE FIXED) ---
function normalizeKaminoVault(raw: KaminoVaultRaw): KaminoVault {
  const apy = parseFloat(String(raw.apy24h || raw.apy || 0)) * 100;

  // Ambil symbol token atau gunakan fallback
  const symbolA = raw.tokenASymbol || "TOKEN_A";
  const symbolB = raw.tokenBSymbol || "TOKEN_B";

  return {
    address: raw.address,
    // TAMBAHKAN INI: Gabungkan symbol agar sesuai dengan Interface KaminoVault
    symbol: `${symbolA}-${symbolB}`,

    tokenA: {
      mint: raw.tokenAMint,
      symbol: symbolA,
      decimals: raw.tokenADecimals || 6,
    },
    tokenB: {
      mint: raw.tokenBMint,
      symbol: symbolB,
      decimals: raw.tokenBDecimals || 6,
    },
    apy: apy,
    tvl: parseFloat(String(raw.tvl || 0)),
    volume24h: parseFloat(String(raw.volume24h || 0)),
    feesApy: parseFloat(String(raw.feesApy24h || 0)) * 100,
    rewardsApy: parseFloat(String(raw.rewardsApy || 0)) * 100,
    strategy: raw.strategyType || "Standard",
    price: parseFloat(String(raw.price || 0)),
    priceRange: [
      parseFloat(String(raw.priceLower || 0)),
      parseFloat(String(raw.priceUpper || 0)),
    ],
    utilizationRate: parseFloat(String(raw.utilizationRate || 0)) * 100,
    status: raw.status || "ACTIVE",
    dex: raw.dex || "Unknown",
  };
}

export function useKamino() {
  const [vaults, setVaults] = useState<KaminoVault[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchKaminoStrategies();
      const top = (Array.isArray(data) ? data : data.strategies || [])
        .slice(0, 12)
        .map((v: any) => normalizeKaminoVault(v as KaminoVaultRaw))
        .filter((v: KaminoVault) => v.apy > 0);

      if (top.length === 0) throw new Error("No vault data returned");
      setVaults(top);
      setIsMock(false);
    } catch (err: any) {
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
