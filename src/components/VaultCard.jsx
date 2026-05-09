import React, { useState } from 'react'
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Layers, Zap } from 'lucide-react'
import MiniChart from './MiniChart'

const DEX_COLORS = {
  Orca:     'text-cyber-cyan    border-cyber-cyan/40',
  Raydium:  'text-cyber-magenta border-cyber-magenta/40',
  Meteora:  'text-cyber-purple  border-cyber-purple/40',
  Unknown:  'text-cyber-dim     border-cyber-dim/40',
}

const APY_TIER = (apy) => {
  if (apy >= 50) return { label: 'ULTRA',  color: 'text-cyber-magenta', glow: 'shadow-neon-magenta' }
  if (apy >= 25) return { label: 'HIGH',   color: 'text-cyber-cyan',    glow: 'shadow-neon-cyan'    }
  if (apy >= 10) return { label: 'MED',    color: 'text-cyber-green',   glow: 'shadow-neon-green'   }
  return             { label: 'LOW',    color: 'text-cyber-dim',     glow: ''                    }
}

function fmt(n, decimals = 2) {
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(decimals)}`
}

export default function VaultCard({ vault, tokenData, index }) {
  const [expanded, setExpanded] = useState(false)

  const symbolA = vault.tokenA.symbol
  const symbolB = vault.tokenB.symbol
  const dataA   = tokenData[symbolA]
  const dataB   = tokenData[symbolB]
  const tier    = APY_TIER(vault.apy)
  const dexCls  = DEX_COLORS[vault.dex] || DEX_COLORS.Unknown

  const priceChangeA = dataA?.priceChange || 0
  const priceChangeB = dataB?.priceChange || 0

  return (
    <div
      className={`glass-card group transition-all duration-300 hover:border-cyber-cyan/40 hover:-translate-y-0.5 cursor-pointer
        ${expanded ? 'border-cyber-cyan/30' : 'border-cyber-border/60'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => setExpanded(e => !e)}>

      {/* Animated top border */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${
        vault.apy >= 50 ? 'from-cyber-magenta via-cyber-purple to-transparent' :
        vault.apy >= 25 ? 'from-cyber-cyan via-cyber-purple to-transparent' :
        'from-cyber-green via-transparent to-transparent'
      } opacity-80`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Pair name */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[symbolA, symbolB].map(sym => (
                <div key={sym}
                  className="w-7 h-7 rounded-full border-2 border-cyber-bg bg-gradient-to-br from-cyber-card to-cyber-surface
                    flex items-center justify-center font-display text-[8px] font-bold text-cyber-cyan"
                  title={sym}>
                  {sym.slice(0, 2)}
                </div>
              ))}
            </div>
            <div>
              <div className="font-display text-sm font-bold text-cyber-text">
                {symbolA}<span className="text-cyber-dim">/</span>{symbolB}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${dexCls}`}>
                  {vault.dex}
                </span>
                <span className="text-[9px] font-mono text-cyber-dim px-1.5 py-0.5 rounded border border-cyber-border/40">
                  {vault.strategy}
                </span>
              </div>
            </div>
          </div>

          {/* APY */}
          <div className="text-right shrink-0">
            <div className={`font-display text-xl font-bold ${tier.color} leading-none`}>
              {vault.apy.toFixed(2)}%
            </div>
            <div className={`text-[9px] font-mono mt-0.5 ${tier.color} opacity-70`}>
              APY • {tier.label}
            </div>
          </div>
        </div>

        {/* Mini chart */}
        {dataA?.history && (
          <div className="mb-3 rounded overflow-hidden bg-cyber-surface/40">
            <MiniChart data={dataA.history} symbol={symbolA} />
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'TVL',    value: fmt(vault.tvl) },
            { label: 'VOL 24H', value: fmt(vault.volume24h) },
            { label: 'UTIL',   value: `${vault.utilizationRate.toFixed(1)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-cyber-surface/40 rounded p-2 text-center">
              <div className="text-[9px] font-mono text-cyber-dim uppercase tracking-widest">{label}</div>
              <div className="font-mono text-xs font-bold text-cyber-text mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        {/* APY breakdown */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-cyber-surface/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (vault.feesApy / vault.apy) * 100)}%` }} />
          </div>
          <div className="text-[9px] font-mono text-cyber-dim whitespace-nowrap">
            <span className="text-cyber-green">{vault.feesApy.toFixed(1)}%</span>
            <span className="text-cyber-dim"> fees + </span>
            <span className="text-cyber-cyan">{vault.rewardsApy.toFixed(1)}%</span>
            <span className="text-cyber-dim"> rwds</span>
          </div>
        </div>

        {/* Token prices */}
        <div className="grid grid-cols-2 gap-2">
          {[{ sym: symbolA, data: dataA, change: priceChangeA },
            { sym: symbolB, data: dataB, change: priceChangeB }].map(({ sym, data, change }) => (
            <div key={sym} className="bg-cyber-surface/30 rounded px-2 py-1.5 flex items-center justify-between gap-1">
              <span className="font-mono text-[10px] text-cyber-dim">{sym}</span>
              {data ? (
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] text-cyber-text">
                    {data.price >= 1000 ? `$${data.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                      : data.price >= 1  ? `$${data.price.toFixed(3)}`
                      : `$${data.price.toFixed(6)}`}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${change >= 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {change >= 0 ? '▲' : '▼'}{Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              ) : (
                <span className="text-[9px] text-cyber-dim font-mono">—</span>
              )}
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <div className="flex justify-center mt-3 text-cyber-dim">
          {expanded
            ? <ChevronUp   className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-cyber-border/40 px-4 py-3 bg-cyber-surface/20">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <div className="text-cyber-dim text-[9px] uppercase tracking-widest mb-1">Price Range</div>
              <div className="text-cyber-cyan">
                {vault.priceRange[0] >= 1
                  ? `$${vault.priceRange[0].toLocaleString('en-US', { maximumFractionDigits: 2 })} – $${vault.priceRange[1].toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                  : `${vault.priceRange[0].toFixed(4)} – ${vault.priceRange[1].toFixed(4)}`}
              </div>
            </div>
            <div>
              <div className="text-cyber-dim text-[9px] uppercase tracking-widest mb-1">Current Price</div>
              <div className="text-cyber-text">
                {vault.price >= 1000
                  ? `$${vault.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                  : `$${vault.price.toFixed(4)}`}
              </div>
            </div>
            <div>
              <div className="text-cyber-dim text-[9px] uppercase tracking-widest mb-1">Status</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green glow-pulse" />
                <span className="text-cyber-green">{vault.status}</span>
              </div>
            </div>
            <div>
              <div className="text-cyber-dim text-[9px] uppercase tracking-widest mb-1">Address</div>
              <div className="text-cyber-dim text-[10px] truncate">{vault.address.slice(0, 14)}…</div>
            </div>
          </div>

          {/* Second chart (token B) */}
          {dataB?.history && (
            <div className="mt-3 rounded overflow-hidden bg-cyber-surface/40">
              <div className="text-[9px] font-mono text-cyber-dim px-2 pt-1.5">{symbolB} / USD</div>
              <MiniChart data={dataB.history} symbol={symbolB} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
