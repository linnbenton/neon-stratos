import React from 'react'
import { DollarSign, Percent, BarChart3, TrendingUp, Activity, Layers } from 'lucide-react'

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

export default function StatsPanel({ vaults }) {
  if (!vaults.length) return null

  const totalTvl    = vaults.reduce((s, v) => s + v.tvl, 0)
  const totalVol    = vaults.reduce((s, v) => s + v.volume24h, 0)
  const avgApy      = vaults.reduce((s, v) => s + v.apy, 0) / vaults.length
  const topApy      = Math.max(...vaults.map(v => v.apy))
  const avgUtil     = vaults.reduce((s, v) => s + v.utilizationRate, 0) / vaults.length
  const activeVaults = vaults.filter(v => v.status === 'ACTIVE').length

  const stats = [
    {
      label: 'TOTAL TVL',
      value: fmt(totalTvl),
      icon: DollarSign,
      color: 'cyan',
      sub: `Across ${activeVaults} vaults`,
    },
    {
      label: 'VOLUME 24H',
      value: fmt(totalVol),
      icon: BarChart3,
      color: 'magenta',
      sub: `${fmt(totalVol / 24)} avg/hr`,
    },
    {
      label: 'AVG APY',
      value: `${avgApy.toFixed(2)}%`,
      icon: Percent,
      color: 'green',
      sub: `Fees + rewards`,
    },
    {
      label: 'PEAK APY',
      value: `${topApy.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'yellow',
      sub: vaults.find(v => v.apy === topApy)
        ? `${vaults.find(v => v.apy === topApy).tokenA.symbol}/${vaults.find(v => v.apy === topApy).tokenB.symbol}`
        : '',
    },
    {
      label: 'AVG UTIL',
      value: `${avgUtil.toFixed(1)}%`,
      icon: Activity,
      color: 'purple',
      sub: 'Capital efficiency',
    },
    {
      label: 'ACTIVE VAULTS',
      value: String(activeVaults),
      icon: Layers,
      color: 'cyan',
      sub: `${vaults.length} total tracked`,
    },
  ]

  const colorMap = {
    cyan:    { text: 'text-cyber-cyan',    bg: 'bg-cyber-cyan/10',    border: 'border-cyber-cyan/30'    },
    magenta: { text: 'text-cyber-magenta', bg: 'bg-cyber-magenta/10', border: 'border-cyber-magenta/30' },
    green:   { text: 'text-cyber-green',   bg: 'bg-cyber-green/10',   border: 'border-cyber-green/30'   },
    yellow:  { text: 'text-cyber-yellow',  bg: 'bg-cyber-yellow/10',  border: 'border-cyber-yellow/30'  },
    purple:  { text: 'text-cyber-purple',  bg: 'bg-cyber-purple/10',  border: 'border-cyber-purple/30'  },
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(({ label, value, icon: Icon, color, sub }) => {
        const cls = colorMap[color]
        return (
          <div key={label} className={`glass-card p-3 border ${cls.border} hover:${cls.border} transition-all duration-200 group`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-mono text-cyber-dim uppercase tracking-widest leading-tight">{label}</span>
              <div className={`p-1 rounded ${cls.bg} ${cls.border} border`}>
                <Icon className={`w-2.5 h-2.5 ${cls.text}`} />
              </div>
            </div>
            <div className={`font-display text-lg font-bold ${cls.text} leading-none mb-1`}>{value}</div>
            <div className="text-[9px] font-mono text-cyber-dim/70">{sub}</div>
          </div>
        )
      })}
    </div>
  )
}
