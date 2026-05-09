import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "./layout/MainLayout";
import MarketTable from "./modules/markets/MarketTable";
import PriceChart from "./modules/charts/PriceChart";
import TickerBar from "./modules/markets/TickerBar";
import StatsCard from "./components/ui/StatsCard";
import WalletPanel from "./modules/wallet/WalletPanel";
import SwapPanel from "./modules/trading/SwapPanel";
import ActivityFeed from "./modules/activity/ActivityFeed";

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
    <MainLayout search={search} setSearch={setSearch}>
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
            <PriceChart />
          </div>

          <WalletPanel />
        </div>

        {/* Market Table */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MarketTable tokens={filteredTokens} />
          </div>

          <SwapPanel />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
