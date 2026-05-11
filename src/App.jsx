import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import MainLayout from "./layout/MainLayout";
import MarketTable from "./modules/markets/MarketTable";
import TickerBar from "./modules/markets/TickerBar";
import StatsCard from "./components/ui/StatsCard";
import WalletPanel from "./modules/wallet/WalletPanel";

const PriceChart = lazy(() => import("./modules/charts/PriceChart"));
const SwapPanel = lazy(() => import("./modules/trading/SwapPanel"));
const ActivityFeed = lazy(() => import("./modules/activity/ActivityFeed"));

export default function App() {
  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState([
    {
      symbol: "SOL",
      name: "Solana",
      price: 178.42,
      change24h: 4.28,
      volume: 2840000000,
    },
    {
      symbol: "BONK",
      name: "Bonk",
      price: 0.000032,
      change24h: -2.14,
      volume: 482000000,
    },
    {
      symbol: "JUP",
      name: "Jupiter",
      price: 1.24,
      change24h: 8.91,
      volume: 182000000,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token, index) => {
          const target = Math.floor(Math.random() * prevTokens.length);

          if (index !== target) {
            return token;
          }

          const randomMove = (Math.random() - 0.5) * 0.15;

          const updatedPrice = token.price * (1 + randomMove / 100);

          return {
            ...token,
            price: Number(updatedPrice.toFixed(4)),
          };
        }),
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Suspense fallback={<div className="text-white">Loading app...</div>}>
      <MainLayout search={search} setSearch={setSearch}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Green ambient */}
          <div
            className="
      absolute

      top-[-120px]
      left-[-120px]

      w-[420px]
      h-[420px]

      bg-[#00ffa3]/10

      blur-[140px]
      rounded-full
    "
          />

          {/* Central orange energy */}
          <div
            className="
    absolute

    top-1/2
    left-1/2

    -translate-x-1/2
    -translate-y-1/2

    w-[900px]
    h-[900px]

    bg-orange-500/5

    blur-[200px]
    rounded-full
  "
          />

          {/* Inner amber core */}
          <div
            className="
    absolute

    top-1/2
    left-1/2

    -translate-x-1/2
    -translate-y-1/2

    w-[420px]
    h-[420px]

    bg-amber-400/20

    blur-[220px]
    rounded-full
  "
          />
        </div>
        <TickerBar tokens={tokens} />
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#00ffa3] drop-shadow-[0_0_12px_rgba(0,255,163,0.8)]">
              Dashboard
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Live Solana DeFi overview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatsCard
              title="Portfolio Value"
              value="$24,892"
              change="8.42%"
              positive={true}
            />

            <StatsCard
              title="Active Vaults"
              value="12"
              change="2 new"
              positive={true}
            />

            <StatsCard
              title="Daily PnL"
              value="+$1,284"
              change="-1.12%"
              positive={false}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Suspense
                fallback={
                  <div className="text-slate-500 text-sm">Loading chart...</div>
                }
              >
                <PriceChart />
              </Suspense>{" "}
            </div>

            <WalletPanel />
          </div>

          {/* Market Table */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <MarketTable tokens={filteredTokens} />
            </div>

            <Suspense
              fallback={
                <div className="text-slate-500 text-sm">Loading module...</div>
              }
            >
              <SwapPanel />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Suspense
                fallback={
                  <div className="text-slate-500 text-sm">
                    Loading activity...
                  </div>
                }
              >
                <ActivityFeed />
              </Suspense>{" "}
            </div>
          </div>
        </div>
      </MainLayout>
    </Suspense>
  );
}
