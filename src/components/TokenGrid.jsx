import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import MiniChart from "./MiniChart";

function fmtPrice(p) {
  if (p >= 1000)
    return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(4)}`;
  if (p >= 0.01) return `$${p.toFixed(6)}`;
  return `$${p.toFixed(8)}`;
}

function fmtVol(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(0)}`;
}

export default function TokenGrid({ tokenData }) {
  const [selected, setSelected] = useState(null);
  const tokens = Object.values(tokenData);
  if (!tokens.length) return null;

  const active = selected ? tokenData[selected] : null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-3 border-b border-cyber-border/40 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan glow-pulse" />
        <span className="font-display text-xs font-bold text-cyber-text tracking-widest uppercase">
          Market Prices
        </span>
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="ml-auto text-[9px] font-mono text-cyber-dim hover:text-cyber-cyan transition-colors"
          >
            ← BACK
          </button>
        )}
      </div>

      {!active ? (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {tokens.map((t) => (
            <button
              key={t.symbol}
              onClick={() => setSelected(t.symbol)}
              className="text-left p-2.5 rounded-lg border border-cyber-border/40 bg-cyber-surface/20
                hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display text-[10px] font-bold text-cyber-text group-hover:text-cyber-cyan transition-colors">
                  {t.symbol}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[9px] font-mono font-bold
                  ${t.priceChange >= 0 ? "text-cyber-green" : "text-cyber-red"}`}
                >
                  {t.priceChange >= 0 ? (
                    <TrendingUp className="w-2 h-2" />
                  ) : (
                    <TrendingDown className="w-2 h-2" />
                  )}
                  {Math.abs(t.priceChange).toFixed(2)}%
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-cyber-text">
                {fmtPrice(t.price)}
              </div>
              <div className="mt-1.5 rounded overflow-hidden h-6">
                <MiniChart data={t.history} symbol={t.symbol} />
              </div>
              <div className="mt-1.5 text-[9px] font-mono text-cyber-dim">
                {fmtVol(t.volume24h)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-display text-2xl font-bold text-cyber-cyan">
                {active.symbol}
              </div>
              <div className="font-display text-3xl font-bold text-cyber-text mt-1">
                {fmtPrice(active.price)}
              </div>
              <div
                className={`flex items-center gap-1.5 mt-2 text-sm font-mono font-bold
                ${active.priceChange >= 0 ? "text-cyber-green" : "text-cyber-red"}`}
              >
                {active.priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {active.priceChange >= 0 ? "+" : ""}
                {active.priceChange.toFixed(4)}%
                <span className="text-cyber-dim font-normal text-xs">24h</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-right">
              {[
                { label: "VOLUME 24H", value: fmtVol(active.volume24h) },
                {
                  label: "MARKET CAP",
                  value: active.marketCap > 0 ? fmtVol(active.marketCap) : "—",
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[9px] font-mono text-cyber-dim uppercase tracking-widest">
                    {label}
                  </div>
                  <div className="font-mono text-sm text-cyber-text font-bold mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden bg-cyber-surface/40 h-48">
            <MiniChart data={active.history} symbol={active.symbol} />
          </div>
          <div className="mt-3 text-[9px] font-mono text-cyber-dim text-center">
            24H price chart • {active.history.length} data points •{" "}
            {active.isMock ? "SIMULATED" : "LIVE"}
          </div>
        </div>
      )}
    </div>
  );
}
