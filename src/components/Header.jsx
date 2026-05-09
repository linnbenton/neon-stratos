import React, { useState, useEffect } from 'react'
import { Activity, Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react'

export default function Header({ lastUpdate, onRefresh, loading, isMock }) {
  const [time, setTime] = useState(new Date())
  const [ping, setPing] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const check = () => {
      const start = performance.now()
      fetch('/api/health').then(() => {
        setPing(Math.round(performance.now() - start))
      }).catch(() => setPing(null))
    }
    check()
    const t = setInterval(check, 30_000)
    return () => clearInterval(t)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <header className="relative z-20 border-b border-cyber-border/50 bg-cyber-surface/60 backdrop-blur-md">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 border-2 border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <Zap className="w-4 h-4 text-cyber-cyan" />
            </div>
            <div className="absolute -inset-1 border border-cyber-cyan/30 animate-ping rounded-full opacity-30" />
          </div>
          <div>
            <div className="font-display text-lg font-bold neon-text-cyan tracking-widest">KASM</div>
            <div className="text-[10px] text-cyber-dim tracking-[0.3em] uppercase">DeFi Terminal v2.4.1</div>
          </div>
        </div>

        {/* Center — Network chips */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {[
            { label: 'SOLANA', color: 'cyan',    dot: 'bg-cyber-cyan'    },
            { label: 'KAMINO', color: 'magenta', dot: 'bg-cyber-magenta' },
            { label: 'BIRDEYE', color: 'cyan',   dot: 'bg-cyber-green'  },
          ].map(({ label, dot }) => (
            <div key={label}
              className="flex items-center gap-1.5 px-3 py-1 border border-cyber-border/60 bg-cyber-card/60 rounded text-[10px] font-mono text-cyber-dim hover:border-cyber-cyan/40 transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full ${dot} glow-pulse`} />
              {label}
            </div>
          ))}
        </div>

        {/* Right — Status */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Connection status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono">
            {isMock
              ? <><WifiOff className="w-3 h-3 text-cyber-yellow" /><span className="text-cyber-yellow">SIMULATED</span></>
              : <><Wifi     className="w-3 h-3 text-cyber-green" /><span className="text-cyber-green">LIVE</span></>
            }
            {ping !== null && <span className="text-cyber-dim">• {ping}ms</span>}
          </div>

          {/* Last update */}
          {lastUpdate && (
            <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-cyber-dim">
              <Activity className="w-3 h-3" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          )}

          {/* Clock */}
          <div className="text-right">
            <div className="font-mono text-sm font-bold neon-text-cyan tabular-nums">{timeStr}</div>
            <div className="text-[10px] text-cyber-dim font-mono">{dateStr}</div>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 border border-cyber-border/60 bg-cyber-card/60 text-cyber-dim hover:text-cyber-cyan hover:border-cyber-cyan/60 transition-all rounded disabled:opacity-40"
            title="Refresh data">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-px w-full bg-gradient-to-r from-cyber-magenta/20 via-transparent to-cyber-cyan/20" />
    </header>
  )
}
