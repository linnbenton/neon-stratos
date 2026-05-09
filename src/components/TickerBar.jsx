import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function TickerBar({ tokenData }) {
  const tokens = Object.values(tokenData)
  if (!tokens.length) return null

  const items = [...tokens, ...tokens] // duplicate for seamless loop

  return (
    <div className="relative border-b border-cyber-border/40 bg-cyber-bg/80 overflow-hidden h-8">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-cyber-bg to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-cyber-bg to-transparent z-10" />

      <div className="marquee-inner flex items-center h-full whitespace-nowrap">
        {items.map((t, i) => (
          <div key={`${t.symbol}-${i}`} className="inline-flex items-center gap-2 px-5 border-r border-cyber-border/30 h-full">
            <span className="font-display text-[11px] font-bold text-cyber-text">{t.symbol}</span>
            <span className="font-mono text-[11px] text-cyber-text">
              {t.price >= 1000
                ? `$${t.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                : t.price >= 1
                ? `$${t.price.toFixed(4)}`
                : `$${t.price.toFixed(8)}`}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold ${
              t.priceChange >= 0 ? 'text-cyber-green' : 'text-cyber-red'
            }`}>
              {t.priceChange >= 0
                ? <TrendingUp  className="w-2.5 h-2.5" />
                : <TrendingDown className="w-2.5 h-2.5" />}
              {Math.abs(t.priceChange).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
