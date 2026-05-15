import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import MainLayout from "./layout/MainLayout";
import MarketTable from "./modules/markets/MarketTable";
import TickerBar from "./modules/markets/TickerBar";
import StatsCard from "./components/ui/StatsCard";
import WalletPanel from "./modules/wallet/WalletPanel";
import { useAppStore } from "./state/appStore.jsx";
import { createMarketEngine } from "./lib/marketEngine";
import { createAIMarketEngine } from "./lib/aiMarketEngine";
import { MarketAgent } from "./modules/agent/MarketAgent";

import Dashboard from "./modules/dashboard/Dashboard";
import Portfolio from "./modules/portfolio/Portfolio";
import OrderBook from "./modules/trading/OrderBook";
import Vaults from "./modules/vaults/Vaults";
import AIAgent from "./modules/agent/AIAgent";
import CinematicBackground from "./components/ui/CinematicBackground";
import SentimentPulse from "./components/ui/SentimentPulse";
import { IntelligenceCore } from "./modules/agent/IntelligenceCore";

const PriceChart = lazy(() => import("./modules/charts/PriceChart"));
const SwapPanel = lazy(() => import("./modules/trading/SwapPanel"));
const ActivityFeed = lazy(() => import("./modules/activity/ActivityFeed"));

export default function App() {
  // 1. hooks state
  const { activeTab } = useAppStore();
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

  const [livePrice, setLivePrice] = useState(178);
  const agentRef = useRef(null);
  const [agentState, setAgentState] = useState(null);
  const [intelState, setIntelState] = useState(null);

  // ⭐ AI STATE
  const [aiInsights, setAiInsights] = useState([]);

  // =========================
  // 2. AI MARKET ENGINE
  // =========================
  useEffect(() => {
    const ai = createAIMarketEngine();

    const unsub = ai.subscribe((data) => {
      setAiInsights((prev) => {
        const next = [data, ...prev];
        return next.slice(0, 5);
      });
    });

    const interval = setInterval(() => {
      ai.push(livePrice, (Math.random() - 0.5) * 0.8);
    }, 2500);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [livePrice]);

  // =========================
  // 3. MARKET AGENT CORE
  // =========================
  useEffect(() => {
    const agent = new MarketAgent();
    agentRef.current = agent;

    const unsub = agent.subscribe((state) => {
      setAgentState(state);
    });

    const interval = setInterval(() => {
      agent.step({ price: livePrice });
    }, 1500);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [livePrice]);

  // =========================
  // 4. TOKEN SIMULATION
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token, index) => {
          const target = Math.floor(Math.random() * prevTokens.length);

          if (index !== target) return token;

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

  // =========================
  // 5. MARKET ENGINE (PRICE FEED)
  // =========================
  useEffect(() => {
    const engine = createMarketEngine(178);

    const unsub = engine.subscribe((state) => {
      setLivePrice(state.price);
    });

    engine.start(1500);

    return () => {
      unsub();
      engine.stop();
    };
  }, []);

  useEffect(() => {
    const intel = new IntelligenceCore();

    const unsub = intel.subscribe((state) => {
      setIntelState({ ...state });
    });

    const interval = setInterval(() => {
      intel.update(livePrice);
    }, 1200);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [livePrice]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Suspense fallback={<div className="text-white">Loading app...</div>}>
      <CinematicBackground />

      <MainLayout search={search} setSearch={setSearch}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* CYAN CORE */}
          <div
            className="
    absolute

    top-[10%]
    left-[15%]

    w-[700px]
    h-[700px]

    bg-cyan-400/10

    blur-[180px]

    rounded-full
  "
          />

          {/* ORANGE ENERGY */}
          <div
            className="
    absolute

    bottom-[-200px]
    right-[-100px]

    w-[600px]
    h-[600px]

    bg-orange-500/10

    blur-[200px]

    rounded-full
  "
          />

          {/* CENTER GLOW */}
          <div
            className="
    absolute

    top-1/2
    left-1/2

    -translate-x-1/2
    -translate-y-1/2

    w-[900px]
    h-[900px]

    bg-emerald-400/5

    blur-[220px]

    rounded-full
  "
          />

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
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" && (
            <Dashboard agentState={agentState} intelState={intelState} />
          )}

          {activeTab === "portfolio" && <Portfolio />}

          {activeTab === "orderbook" && <OrderBook />}

          {activeTab === "vaults" && <Vaults />}

          {activeTab === "wallet" && <WalletPanel />}

          {activeTab === "agent" && <AIAgent />}
        </div>
      </MainLayout>
      <SentimentPulse />
    </Suspense>
  );
}
