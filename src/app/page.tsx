"use client";

import React, { useState, useEffect } from "react";
import { useBirdeye, KNOWN_TOKENS } from "../hooks/useBirdeye";
import { useKamino } from "../hooks/useKamino";

export default function NeonStratosCyberpunk() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // --- STATE UNTUK FITUR KLIK GONTA-GANTI ---
  const [selectedVaultIndex, setSelectedVaultIndex] = useState(1); // Default ke vault kedua (SOL-USDT)

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { tokenData } = useBirdeye([
    { symbol: "SOL", mint: KNOWN_TOKENS.SOL },
    { symbol: "USDC", mint: KNOWN_TOKENS.USDC },
  ]);

  const { vaults } = useKamino();

  // Ambil data vault yang sedang dipilih untuk ditampilkan di Terminal Sim
  const activeVault = vaults[selectedVaultIndex] || vaults[0];

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 font-mono p-6 selection:bg-fuchsia-500 selection:text-white">
      {/* HEADER: JUDUL GRADIENT */}
      <header className="flex justify-between items-start mb-12 border-b border-red-900/30 pb-6">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            NEON_STRATOS v1.1
          </h1>
          <div className="text-[10px] text-yellow-400 mt-2 flex items-center gap-2 font-bold tracking-widest">
            <span className="animate-ping text-green-400">●</span> STATUS:
            MARKET_VOLATILITY_DETECTED
          </div>
        </div>
        <div className="text-right">
          <button className="border-2 border-fuchsia-600 px-8 py-3 text-xs uppercase font-black text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:bg-fuchsia-600 hover:text-white transition-all transform hover:scale-105 active:scale-95">
            Connect Solflare
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT: MARKET INTEL */}
        <div className="col-span-3 space-y-8">
          <h2 className="text-xs font-black text-fuchsia-500 tracking-[0.3em] uppercase border-l-4 border-fuchsia-600 pl-3">
            [01] Market_Intel
          </h2>

          <div className="border-2 border-red-900 bg-black p-6 shadow-[5px_5px_0px_#7f1d1d] relative">
            <span className="text-[10px] text-gray-500 uppercase block mb-4 font-bold italic">
              SOL_Price
            </span>
            <div className="text-4xl font-black text-white mb-2">
              ${tokenData[KNOWN_TOKENS.SOL]?.price.toLocaleString() || "148.42"}
            </div>
            <div className="text-green-400 text-[10px] font-bold flex items-center gap-1">
              ▲ LIVE_SIGNAL{" "}
              <span className="text-red-800 ml-2 italic">STABLE_FLOW</span>
            </div>
          </div>

          <div className="border border-fuchsia-900/50 p-6 bg-[#1a061a]/40">
            <span className="text-[10px] text-fuchsia-300 uppercase block mb-4 italic font-bold">
              SOL_24h_Volume
            </span>
            <div className="text-2xl font-bold text-yellow-400">$2.84B</div>
            <div className="text-cyan-400 text-[9px] uppercase tracking-widest mt-2 animate-pulse">
              !! Volume_Spike_Detected !!
            </div>
          </div>
        </div>

        {/* MIDDLE: YIELD ENGINE (Daftar Vault) */}
        <div className="col-span-6">
          <h2 className="text-xs font-black text-cyan-400 tracking-[0.3em] uppercase border-l-4 border-cyan-500 pl-3 mb-8">
            [02] Yield_Engine_V2
          </h2>

          <div className="space-y-4">
            {vaults.map((vault: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedVaultIndex(i)} // <-- FUNGSI KLIK DI SINI
                className={`group flex items-center justify-between p-6 bg-[#0a0a0a] border-l-4 border-y border-r transition-all cursor-pointer relative
                  ${
                    selectedVaultIndex === i
                      ? "border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.15)] bg-[#120512]"
                      : "border-cyan-900/40 border-l-green-500 hover:border-cyan-400 hover:bg-cyan-950/10"
                  }`}
              >
                {i === 1 && (
                  <div className="absolute -top-3 right-6 bg-yellow-400 text-black text-[9px] font-black px-3 py-1 uppercase italic shadow-lg">
                    Hot Opportunity
                  </div>
                )}
                <div className="flex items-center gap-5">
                  <div
                    className={`w-10 h-10 rounded-sm border-2 flex items-center justify-center text-xs font-black transition-all
                    ${selectedVaultIndex === i ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-950/20" : "border-green-500 text-green-400 bg-green-950/20"}`}
                  >
                    {vault.symbol?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="text-lg font-black text-white italic tracking-tight">
                      {vault.symbol}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">
                      {vault.dex} <span className="text-red-950 mx-2">|</span>{" "}
                      TVL: ${(vault.tvl / 1e6).toFixed(2)}M
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-green-400 group-hover:text-yellow-400 transition-colors drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                    {vault.apy.toFixed(2)}%{" "}
                    <span className="text-[10px] font-normal text-gray-600 ml-1">
                      APY
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: TERMINAL SIM (Bagian yang Gonta-Ganti) */}
        <div className="col-span-3">
          <h2 className="text-xs font-black text-yellow-500 tracking-[0.3em] uppercase border-l-4 border-yellow-600 pl-3 mb-8">
            [03] Terminal_Sim
          </h2>
          <div className="border-2 border-cyan-500/30 bg-[#050505] p-8 flex flex-col justify-between min-h-[400px] shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]">
            <div>
              <span className="text-[10px] text-cyan-900 uppercase block mb-2 font-black">
                Target_Execution
              </span>
              <div className="text-2xl font-black text-white italic border-b-2 border-red-950 pb-4 mb-8 text-center bg-red-950/10">
                {activeVault?.symbol || "---"}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold italic">
                    Est_Daily
                  </span>
                  <span className="text-green-400 text-xs font-black">
                    +${(activeVault?.apy / 365 || 0).toFixed(2)}{" "}
                    <span className="text-[8px] text-gray-700">/1k</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold italic">
                    Risk_Factor
                  </span>
                  <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    {activeVault?.apy > 35 ? "High_Risk" : "Moderate"}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-black font-black py-4 text-xs uppercase tracking-[0.3em] hover:from-yellow-400 hover:to-fuchsia-500 shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all active:scale-95">
              Execute_Deploy
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER CLOCK */}
      <footer className="fixed bottom-8 left-8 text-[10px] text-red-950 tracking-[0.5em] font-black uppercase">
        System_Clock_Sync: {currentTime || "WAITING..."}
      </footer>
    </div>
  );
}
