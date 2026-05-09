"use client";
import React, { useState, useMemo } from "react";
import { useKamino } from "../hooks/useKamino";
import { useBirdeye } from "../hooks/useBirdeye";
import { TerminalCard } from "@/components/TerminalCard";
import {
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  Crosshair,
} from "lucide-react";

interface BirdeyeData {
  [key: string]: {
    price: number;
    priceChange: number;
    volume24h: number;
  };
}

export default function NeonStratos() {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const { vaults, loading: kaminoLoading } = (useKamino as any)();
  const { tokenData, loading: priceLoading } = (useBirdeye as any)([
    { symbol: "SOL" },
    { symbol: "USDC" },
    { symbol: "JUP" },
  ]) as { tokenData: BirdeyeData; loading: boolean };

  // 1. SMART SIGNAL LOGIC: Deteksi Volatilitas/Volume dari Birdeye
  const isHighVol = useMemo(() => {
    return (tokenData?.["SOL"]?.volume24h || 0) > 1000000000; // Spike di atas $1B
  }, [tokenData]);

  return (
    <main className="min-h-screen bg-cyber-black text-white p-6 font-mono selection:bg-cyber-pink selection:text-black">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-cyber-cyan/30 pb-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
            NEON_STRATOS v1.1
          </h1>
          <p className="text-[10px] text-cyber-cyan flex items-center gap-2 tracking-[0.2em]">
            <Activity size={12} className="animate-pulse" />
            {isHighVol
              ? "STATUS: MARKET_VOLATILITY_DETECTED"
              : "STATUS: STEADY_YIELD_FARMING"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-gray-500 uppercase">
              Current Network
            </p>
            <p className="text-xs text-green-400 font-bold">SOLANA_MAINNET</p>
          </div>
          <button className="px-6 py-2 border-2 border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)] uppercase text-sm font-black">
            Connect Solflare
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: MARKET INTEL */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xs font-bold flex items-center gap-2 text-cyber-pink tracking-widest">
            <TrendingUp size={14} /> [01] MARKET_INTEL
          </h2>
          <TerminalCard
            title="SOL_PRICE"
            value={
              priceLoading
                ? "SYNCING..."
                : `$${tokenData?.["SOL"]?.price?.toFixed(2)}`
            }
            trend={tokenData?.["SOL"]?.priceChange || 0}
            type="pink"
          />
          <div
            className={`p-4 border ${isHighVol ? "border-cyber-pink animate-pulse bg-cyber-pink/5" : "border-white/10"}`}
          >
            <p className="text-[10px] text-gray-500 mb-1">SOL_24H_VOLUME</p>
            <p className="text-2xl font-bold">
              ${((tokenData?.["SOL"]?.volume24h || 0) / 1e9).toFixed(2)}B
            </p>
            {isHighVol && (
              <p className="text-[9px] text-cyber-pink mt-2 flex items-center gap-1">
                <AlertTriangle size={10} /> ALERT: VOLUME_SPIKE_DETECTED
              </p>
            )}
          </div>
        </div>

        {/* MIDDLE: THE ENGINE */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-xs font-bold flex items-center gap-2 text-cyber-cyan tracking-widest">
            <Zap size={14} /> [02] YIELD_ENGINE_V2
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {kaminoLoading ? (
              <div className="h-64 border border-dashed border-cyber-cyan/20 flex items-center justify-center italic text-cyber-cyan">
                SCANNING_KAMINO_CONTRACTS...
              </div>
            ) : (
              Array.isArray(vaults) &&
              vaults.slice(0, 5).map((vault: any) => (
                <div
                  key={vault.address}
                  className="group relative border border-white/5 bg-gradient-to-r from-white/5 to-transparent p-5 hover:border-cyber-cyan hover:from-cyber-cyan/10 transition-all cursor-pointer"
                  onClick={() => setSelectedVault(vault)}
                >
                  {isHighVol && vault.tokenA?.symbol === "SOL" && (
                    <div className="absolute -top-2 -right-2 bg-cyber-pink text-[8px] font-bold px-2 py-1 shadow-lg animate-bounce">
                      OPPORTUNITY
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 bg-cyber-cyan/20 rounded-full flex items-center justify-center font-bold text-cyber-cyan border border-cyber-cyan/40">
                        {vault.tokenA?.symbol[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none">
                          {vault.tokenA?.symbol}-{vault.tokenB?.symbol}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                          {vault.strategy} • TVL: $
                          {(vault.tvl / 1e6).toFixed(2)}M
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
                        {vault.apy?.toFixed(2)}%
                        <span className="text-xs ml-1">APY</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: EXECUTION / SIMULATOR */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xs font-bold flex items-center gap-2 text-white/50 tracking-widest">
            <Crosshair size={14} /> [03] TERMINAL_SIM
          </h2>

          {selectedVault ? (
            <div className="border border-cyber-cyan p-6 bg-cyber-cyan/5 space-y-6">
              <div className="border-b border-cyber-cyan/30 pb-4">
                <p className="text-[10px] text-cyber-cyan font-bold uppercase">
                  Target_Vault
                </p>
                <h4 className="text-xl font-black">
                  {selectedVault.tokenA?.symbol}-{selectedVault.tokenB?.symbol}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">EST_DAILY_YIELD</span>
                  <span className="text-green-400 font-bold">
                    +${((selectedVault.apy / 365) * 10).toFixed(2)} (per $1k)
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">RISK_SCORE</span>
                  <span className="text-yellow-500 font-bold uppercase">
                    MODERATE
                  </span>
                </div>
                <div className="h-[1px] bg-white/10 w-full" />
                <button className="w-full py-4 bg-cyber-cyan text-black font-black text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] uppercase">
                  Execute_Deploy
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-white/5 p-8 text-center opacity-30 italic text-xs">
              SELECT_VAULT_TO_START_SIMULATION
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
