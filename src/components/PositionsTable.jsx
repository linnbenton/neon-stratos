import React, { useState } from 'react'
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react'

function fmt(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

const COLS = [
  { key: 'vault',    label: 'VAULT PAIR',   align: 'left'  },
  { key: 'valueUSD', label: 'VALUE',         align: 'right' },
  { key: 'deposited',label: 'DEPOSITED',     align: 'right' },
  { key: 'earned',   label: 'EARNED',        align: 'right' },
  { key: 'pnlPct',   label: 'P&L %',         align: 'right' },
]

export default function PositionsTable({ positions }) {
  const [sortKey, setSortKey]   = useState('valueUSD')
  const [sortDir, setSortDir]   = useState(-1)
  const [hovered, setHovered]   = useState(null)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => -d)
    else { setSortKey(key); setSortDir(-1) }
  }

  const sorted = [...positions].sort((a, b) => {
    const av = sortKey === 'vault' ? a[sortKey] : a[sortKey]
    const bv = sortKey === 'vault' ? b[sortKey] : b[sortKey]
    return sortDir * (av < bv ? -1 : av > bv ? 1 : 0)
  })

  const totalValue  = positions.reduce((s, p) => s + p.valueUSD,  0)
  const totalEarned = positions.reduce((s, p) => s + p.earned,    0)
  const totalPnl    = totalEarned / (totalValue - totalEarned) * 100

  if (!positions.length) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="font-display text-cyber-dim text-sm">NO POSITIONS DETECTED</div>
        <div className="text-[11px] font-mono text-cyber-dim/60 mt-2">Connect wallet to view live positions</div>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-cyber-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-magenta glow-pulse" />
          <span className="font-display text-xs font-bold text-cyber-text tracking-widest uppercase">Active Positions</span>
          <span className="font-mono text-[10px] text-cyber-dim bg-cyber-surface/60 px-1.5 py-0.5 rounded border border-cyber-border/40">
            {positions.length} OPEN
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="text-cyber-dim">PORTFOLIO: <span className="text-cyber-cyan font-bold">{fmt(totalValue)}</span></span>
          <span className={`font-bold ${totalEarned >= 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
            {totalEarned >= 0 ? '+' : ''}{fmt(totalEarned)}
            <span className="ml-1 opacity-70">({totalPnl.toFixed(2)}%)</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-border/30 bg-cyber-surface/20">
              {COLS.map(col => (
                <th key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-4 py-2.5 text-[9px] font-mono font-bold text-cyber-dim uppercase tracking-widest cursor-pointer
                    hover:text-cyber-cyan transition-colors select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === -1
                        ? <ChevronDown className="w-2.5 h-2.5 text-cyber-cyan" />
                        : <ChevronUp   className="w-2.5 h-2.5 text-cyber-cyan" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((pos, i) => {
              const isUp = pos.pnl >= 0
              return (
                <tr key={pos.vault}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`border-b border-cyber-border/20 transition-all duration-150 cursor-default
                    ${hovered === i ? 'bg-cyber-cyan/5' : 'hover:bg-cyber-surface/20'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {[pos.tokenA, pos.tokenB].map(sym => (
                          <div key={sym}
                            className="w-5 h-5 rounded-full border border-cyber-bg bg-cyber-card flex items-center justify-center
                              font-display text-[7px] font-bold text-cyber-cyan">
                            {sym.slice(0, 2)}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="font-display text-xs font-bold text-cyber-text">
                          {pos.tokenA}<span className="text-cyber-dim">/</span>{pos.tokenB}
                        </div>
                        <div className="text-[9px] font-mono text-cyber-dim truncate max-w-[100px]">
                          {pos.vault.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-cyber-text font-bold">{fmt(pos.valueUSD)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-cyber-dim">{fmt(pos.deposited)}</td>
                  <td className={`px-4 py-3 text-right font-mono text-xs font-bold ${isUp ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {isUp ? '+' : ''}{fmt(pos.earned)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded
                      ${isUp
                        ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
                        : 'bg-cyber-red/10  text-cyber-red  border border-cyber-red/30'}`}>
                      {isUp
                        ? <TrendingUp   className="w-2.5 h-2.5" />
                        : <TrendingDown className="w-2.5 h-2.5" />}
                      {isUp ? '+' : ''}{pos.pnlPct.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* PnL bar */}
      <div className="px-5 py-3 border-t border-cyber-border/40 bg-cyber-surface/10">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-cyber-dim uppercase tracking-widest">Allocation</span>
          <div className="flex-1 h-1 bg-cyber-surface/60 rounded-full overflow-hidden flex">
            {sorted.map(pos => (
              <div key={pos.vault}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(pos.valueUSD / totalValue) * 100}%`,
                  backgroundColor: pos.pnl >= 0 ? '#00ff88' : '#ff3366',
                  opacity: 0.7,
                }}
                title={`${pos.tokenA}/${pos.tokenB}: ${((pos.valueUSD / totalValue) * 100).toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
