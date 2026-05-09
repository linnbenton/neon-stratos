import React, { useState, useMemo } from 'react'
import { useKamino } from './hooks/useKamino'
import { useBirdeye, KNOWN_TOKENS } from './hooks/useBirdeye'
import Header         from './components/Header'
import TickerBar      from './components/TickerBar'
import StatsPanel     from './components/StatsPanel'
import VaultCard      from './components/VaultCard'
import PositionsTable from './components/PositionsTable'
import TokenGrid      from './components/TokenGrid'
import AlertBanner    from './components/AlertBanner'
import { Search, SlidersHorizontal, TrendingUp, Layers, BarChart3, X } from 'lucide-react'

// Tokens shown in Birdeye ticker
const TICKER_TOKENS = ['SOL','USDC','USDT','BTC','mSOL','JTO','WIF','BONK','JUP'].map(sym => ({
  symbol: sym,
  mint:   KNOWN_TOKENS[sym],
}))

const SORT_OPTIONS = [
  { key: 'apy',    label: 'APY'    },
  { key: 'tvl',    label: 'TVL'    },
  { key: 'volume24h', label: 'VOL' },
  { key: 'utilizationRate', label: 'UTIL' },
]

const NAV_TABS = [
  { key: 'vaults',    label: 'VAULTS',    icon: Layers    },
  { key: 'positions', label: 'POSITIONS',  icon: TrendingUp },
  { key: 'market',    label: 'MARKET',     icon: BarChart3 },
]

export default function App() {
  const { vaults, positions, loading: kaminoLoading, error: kaminoError, isMock: vaultsMock, lastUpdate, refresh } = useKamino()
  const { tokenData, loading: priceLoading, isMock: priceMock } = useBirdeye(TICKER_TOKENS)

  const [tab,     setTab]     = useState('vaults')
  const [search,  setSearch]  = useState('')
  const [sortKey, setSortKey] = useState('apy')
  const [dexFilter, setDexFilter] = useState('ALL')
  const [minApy, setMinApy] = useState(0)

  const allDexes = useMemo(() => ['ALL', ...new Set(vaults.map(v => v.dex))], [vaults])

  const filteredVaults = useMemo(() => {
    return vaults
      .filter(v => {
        const q = search.toLowerCase()
        if (q && !`${v.tokenA.symbol}/${v.tokenB.symbol}`.toLowerCase().includes(q)) return false
        if (dexFilter !== 'ALL' && v.dex !== dexFilter) return false
        if (v.apy < minApy) return false
        return true
      })
      .sort((a, b) => b[sortKey] - a[sortKey])
  }, [vaults, search, sortKey, dexFilter, minApy])

  const loading = kaminoLoading || priceLoading

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col grid-line">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none z-50 opacity-30" />

      {/* Header */}
      <Header lastUpdate={lastUpdate} onRefresh={refresh} loading={loading} isMock={vaultsMock || priceMock} />

      {/* Ticker */}
      {Object.keys(tokenData).length > 0 && <TickerBar tokenData={tokenData} />}

      {/* Main content */}
      <main className="flex-1 px-4 md:px-6 py-5 space-y-5 max-w-[1600px] mx-auto w-full">

        {/* Alert */}
        {kaminoError && <AlertBanner message={kaminoError} type="warn" />}

        {/* Stats Panel */}
        {vaults.length > 0 && <StatsPanel vaults={vaults} />}

        {/* Nav Tabs */}
        <div className="flex items-center gap-1 border-b border-cyber-border/40">
          {NAV_TABS.map(({ key, label, icon: Icon }) => (
            <button key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest
                border-b-2 transition-all duration-200 -mb-px
                ${tab === key
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-transparent text-cyber-dim hover:text-cyber-text hover:border-cyber-border/60'}`}>
              <Icon className="w-3 h-3" />
              {label}
              {key === 'vaults'    && <span className="bg-cyber-surface/60 px-1 py-0.5 rounded text-[9px] border border-cyber-border/40">{filteredVaults.length}</span>}
              {key === 'positions' && <span className="bg-cyber-surface/60 px-1 py-0.5 rounded text-[9px] border border-cyber-border/40">{positions.length}</span>}
            </button>
          ))}
        </div>

        {/* --- VAULTS TAB --- */}
        {tab === 'vaults' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-cyber-dim" />
                <input
                  type="text"
                  placeholder="Search pair..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-7 py-2 bg-cyber-card/60 border border-cyber-border/60 rounded text-xs font-mono
                    text-cyber-text placeholder-cyber-dim/50 focus:outline-none focus:border-cyber-cyan/60 focus:ring-1
                    focus:ring-cyber-cyan/20 transition-all" />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyber-dim hover:text-cyber-text">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* DEX filter */}
              <div className="flex items-center gap-1">
                {allDexes.map(dex => (
                  <button key={dex}
                    onClick={() => setDexFilter(dex)}
                    className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all
                      ${dexFilter === dex
                        ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                        : 'border-cyber-border/40 bg-cyber-card/40 text-cyber-dim hover:border-cyber-border/70 hover:text-cyber-text'}`}>
                    {dex}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1 ml-auto">
                <SlidersHorizontal className="w-3 h-3 text-cyber-dim" />
                {SORT_OPTIONS.map(({ key, label }) => (
                  <button key={key}
                    onClick={() => setSortKey(key)}
                    className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all
                      ${sortKey === key
                        ? 'border-cyber-magenta bg-cyber-magenta/10 text-cyber-magenta'
                        : 'border-cyber-border/40 bg-cyber-card/40 text-cyber-dim hover:border-cyber-border/70 hover:text-cyber-text'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Min APY */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-dim">
                <span>APY ≥</span>
                <input
                  type="range" min="0" max="50" step="5" value={minApy}
                  onChange={e => setMinApy(Number(e.target.value))}
                  className="w-20 accent-cyber-cyan" />
                <span className="text-cyber-cyan w-8">{minApy}%</span>
              </div>
            </div>

            {/* Vault grid */}
            {kaminoLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card h-72 animate-pulse bg-cyber-card/40" />
                ))}
              </div>
            ) : filteredVaults.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="font-display text-cyber-dim text-sm">NO VAULTS MATCH FILTERS</div>
                <button onClick={() => { setSearch(''); setDexFilter('ALL'); setMinApy(0) }}
                  className="mt-3 text-[11px] font-mono text-cyber-cyan hover:underline">
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVaults.map((vault, i) => (
                  <VaultCard key={vault.address} vault={vault} tokenData={tokenData} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* --- POSITIONS TAB --- */}
        {tab === 'positions' && (
          <PositionsTable positions={positions} />
        )}

        {/* --- MARKET TAB --- */}
        {tab === 'market' && (
          <TokenGrid tokenData={tokenData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border/30 px-6 py-3 flex items-center justify-between text-[9px] font-mono text-cyber-dim/50">
        <span>KASM // SOLANA DEFI TERMINAL // {vaultsMock ? 'SIMULATED DATA' : 'LIVE DATA'}</span>
        <span>Not financial advice. DYOR.</span>
      </footer>
    </div>
  )
}
