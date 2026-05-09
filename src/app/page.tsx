"use client";

import React, { useState, useEffect } from "react";

export default function KasmTerminal() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("VAULTS");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#02060d]" />;

  return (
    <div className="min-h-screen bg-[#02060d] text-cyan-400 font-mono p-4 selection:bg-cyan-500/30">
      {/* 1. TOP BAR (Logo, Status, & Clock) */}
      <header className="flex justify-between items-center mb-4 border-b border-cyan-900/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 flex items-center justify-center rotate-45 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <span className="-rotate-45 font-black text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-cyan-100">
              KASM
            </h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em]">
              DEFI TERMINAL V2.4.1
            </p>
          </div>
          <div className="flex gap-2 ml-8">
            <span className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/20 rounded-full text-[9px] text-cyan-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>{" "}
              SOLANA
            </span>
            <span className="px-3 py-1 bg-fuchsia-950/30 border border-fuchsia-500/20 rounded-full text-[9px] text-fuchsia-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></span>{" "}
              KAMINO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div className="text-[10px] text-yellow-500/70 font-bold">
            <span className="text-yellow-500 tracking-widest">
              ⚡ SIMULATED
            </span>{" "}
            — 281ms
          </div>
          <div>
            <div className="text-xl font-black text-cyan-400 leading-none">
              {currentTime}
            </div>
            <div className="text-[9px] text-gray-500 mt-1">
              Sat, May 9, 2026
            </div>
          </div>
        </div>
      </header>

      {/* 2. PRICE TICKER MARQUEE */}
      <div className="flex gap-8 overflow-hidden border-b border-cyan-900/20 pb-4 mb-6 text-[11px] font-bold">
        {[
          "USDC $1.0000",
          "USDT $1.0000",
          "BTC $63,420",
          "mSOL $157.73",
          "JTO $2.84",
          "WIF $2.18",
        ].map((ticker, i) => (
          <div key={i} className="flex gap-2 whitespace-nowrap">
            <span className="text-gray-400">{ticker.split(" ")[0]}</span>
            <span className="text-white">{ticker.split(" ")[1]}</span>
            <span className="text-green-500">▲ 0.00%</span>
          </div>
        ))}
      </div>

      {/* 3. ALERT BANNER */}
      <div className="bg-yellow-500/5 border border-yellow-500/30 p-3 mb-6 flex justify-between items-center">
        <div className="text-[11px] text-yellow-500 font-bold flex items-center gap-2">
          ⚠️ Live data unavailable — showing simulated vaults. (Kamino API 400)
        </div>
        <button className="text-yellow-500/50 hover:text-yellow-500">✕</button>
      </div>

      {/* 4. GLOBAL STATS CARDS */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {[
          {
            label: "TOTAL TVL",
            value: "$69.38M",
            sub: "Across 6 vaults",
            color: "cyan",
          },
          {
            label: "VOLUME 24H",
            value: "$25.09M",
            sub: "$1.05M avg/hr",
            color: "fuchsia",
          },
          {
            label: "AVG APY",
            value: "32.16%",
            sub: "Fees + rewards",
            color: "green",
          },
          {
            label: "PEAK APY",
            value: "67.33%",
            sub: "WIF/USDC",
            color: "yellow",
          },
          {
            label: "AVG UTIL",
            value: "76.8%",
            sub: "Capital efficiency",
            color: "purple",
          },
          {
            label: "ACTIVE VAULTS",
            value: "6",
            sub: "6 total tracked",
            color: "cyan",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`border border-${stat.color}-500/20 bg-${stat.color}-950/5 p-4 relative group`}
          >
            <div className="text-[9px] text-gray-500 font-black mb-2 uppercase">
              {stat.label}
            </div>
            <div className={`text-2xl font-black text-${stat.color}-400 mb-1`}>
              {stat.value}
            </div>
            <div className="text-[9px] text-gray-600">{stat.sub}</div>
            <div
              className={`absolute top-2 right-2 text-[10px] text-${stat.color}-500/30 opacity-50`}
            >
              ▨
            </div>
          </div>
        ))}
      </div>

      {/* 5. NAVIGATION TABS */}
      <nav className="flex gap-10 mb-8 border-b border-white/5">
        {[
          { id: "VAULTS", count: 6 },
          { id: "POSITIONS", count: 4 },
          { id: "MARKET", count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 flex items-center gap-2 group`}
          >
            <span
              className={`text-[11px] font-black tracking-widest ${activeTab === tab.id ? "text-cyan-400" : "text-gray-600"}`}
            >
              {activeTab === tab.id && "≡ "} {tab.id}
            </span>
            {tab.count && (
              <span
                className={`text-[10px] px-1.5 bg-cyan-900/20 border border-cyan-500/30 text-cyan-500 rounded-sm`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            )}
          </button>
        ))}
      </nav>

      {/* 6. VAULT CARDS (Grid 3 Kolom) */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            pair: "WIF/USDC",
            dex: "Orca",
            apy: "67.33%",
            risk: "ULTRA",
            color: "fuchsia",
          },
          {
            pair: "JTO/USDC",
            dex: "Raydium",
            apy: "42.18%",
            risk: "HIGH",
            color: "cyan",
          },
          {
            pair: "SOL/USDT",
            dex: "Raydium",
            apy: "31.22%",
            risk: "HIGH",
            color: "green",
          },
        ].map((v, i) => (
          <div
            key={i}
            className="border border-white/5 bg-[#050a14] p-6 group hover:border-cyan-500/50 transition-all"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-[8px] font-bold">
                    T1
                  </div>
                  <div className="w-8 h-8 rounded-full bg-fuchsia-900 border border-fuchsia-400 flex items-center justify-center text-[8px] font-bold">
                    T2
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-white italic">
                    {v.pair}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {v.dex}
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold">
                      Aggressive
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black text-${v.color}-400`}>
                  {v.apy}
                </div>
                <div className="text-[9px] font-bold text-gray-500">
                  APY • {v.risk}
                </div>
              </div>
            </div>

            {/* Mini Sparkline Simulation */}
            <div className="h-16 flex items-end gap-1 mb-4">
              {[40, 70, 45, 90, 65, 80, 30, 50, 40, 60].map((h, j) => (
                <div
                  key={j}
                  className={`flex-1 bg-${v.color}-500/20 border-t border-${v.color}-500`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>

            <div className="flex justify-between text-[9px] text-gray-600 font-black uppercase">
              <span>TVL</span>
              <span>VOL 24H</span>
              <span>UTIL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
