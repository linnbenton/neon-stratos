import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection } from "../../lib/solana";
import { TOKENS, fetchPrices } from "../../lib/tokens";
import { TrendingUp, Wallet, Zap } from "lucide-react";

export default function Portfolio() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalNetWorth, setTotalNetWorth] = useState(0);

  const loadPortfolio = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const priceData = await fetchPrices();
      const lamports = await connection.getBalance(publicKey, "confirmed");
      const solAmount = lamports / 1e9;

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
      );

      const userAssets = TOKENS.map((token) => {
        let balance = 0;
        if (token.symbol === "SOL") {
          balance = solAmount;
        } else {
          const account = tokenAccounts.value.find(
            (t) => t.account.data.parsed.info.mint === token.mint,
          );
          balance = account?.account.data.parsed.info.tokenAmount.uiAmount || 0;
        }
        const price = priceData?.[token.mint]?.price || 0;
        return { ...token, balance, price, value: balance * price };
      }).filter((asset) => asset.balance > 0);

      setAssets(userAssets);
      setTotalNetWorth(userAssets.reduce((acc, curr) => acc + curr.value, 0));
    } catch (err) {
      console.error("Portfolio Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 30000); // Auto-refresh setiap 30 detik
    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans">
      {/* HEADER: TOTAL VALUATION (KASM STYLE) */}
      <div className="relative overflow-hidden rounded-lg border border-[#1a2332] bg-[#0a0e14]/90 p-6">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#00ffa3] to-transparent opacity-60" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_8px_#00ffa3]" />
              <p className="text-[#00ffa3] text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">
                Portfolio Net Worth
              </p>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,163,0.3)]">
              $
              {totalNetWorth.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-slate-400 bg-[#05060b] px-3 py-1.5 rounded border border-[#1a2332] font-mono text-[10px]">
              <Wallet size={12} className="text-slate-500" />
              {publicKey?.toBase58().slice(0, 4)}...
              {publicKey?.toBase58().slice(-4)}
            </div>
            <div className="flex items-center gap-2 text-[#00ffa3] bg-[#00ffa3]/5 px-3 py-1.5 rounded border border-[#00ffa3]/20 font-bold text-[10px] tracking-widest">
              <TrendingUp size={12} />
              SOLANA MAINNET
            </div>
          </div>
        </div>
      </div>

      {/* ASSET LIST SECTION */}
      <div className="grid gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase">
            Detected Assets
          </h3>
          <span className="text-slate-600 text-[9px] font-mono uppercase tracking-widest">
            Sync: OK | 12ms
          </span>
        </div>

        {loading && assets.length === 0 ? (
          <div className="py-20 text-center text-slate-600 font-mono text-xs animate-pulse tracking-widest">
            {">"} SCANNING BLOCKCHAIN...
          </div>
        ) : assets.length === 0 ? (
          <div className="py-20 text-center rounded-lg border border-[#1a2332] bg-[#0a0e14]/50 text-slate-600 font-mono text-xs uppercase tracking-widest">
            {">"} No secure assets detected on chain
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.symbol}
              className="group relative flex items-center justify-between bg-[#0a0e14]/60 border border-[#1a2332] p-4 rounded-md transition-all duration-200 hover:border-[#00ffa3]/50 hover:bg-[#1a2332]/20"
            >
              {/* Left Side: Token Info */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded bg-[#05060b] border border-[#1a2332] flex items-center justify-center font-black text-[#00ffa3] text-sm shadow-inner group-hover:border-[#00ffa3]/30 transition-colors">
                  {asset.symbol.slice(0, 2)}
                </div>

                <div>
                  <div className="text-white font-bold text-sm tracking-wide group-hover:text-[#00ffa3] transition-colors uppercase">
                    {asset.name}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">
                      {asset.balance.toFixed(4)}
                    </span>
                    <span className="text-slate-600">{asset.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Valuation */}
              <div className="text-right relative z-10">
                <div className="text-white font-bold text-lg tracking-tighter font-mono">
                  $
                  {asset.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-[#00ffa3] font-mono text-[10px] opacity-60 group-hover:opacity-100">
                  @ ${asset.price.toLocaleString()}
                </div>
              </div>

              {/* Sublte Scanline Effect on Hover */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
