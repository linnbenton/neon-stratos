import { useWallet } from "@solana/wallet-adapter-react";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { useEffect, useState } from "react";

import { connection } from "../../lib/solana";

export default function Portfolio() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hitung total saldo secara dinamis
  const totalValue = assets.reduce((acc, curr) => acc + Number(curr.value), 0);

  useEffect(() => {
    if (!publicKey) {
      setAssets([]);
      return;
    }

    // Ganti bagian loadPortfolio kamu dengan logika ini
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        // Pastikan connection tersedia
        if (!connection) throw new Error("Koneksi RPC tidak ditemukan");

        // 1. Ambil saldo SOL
        const solLamports = await connection.getBalance(publicKey);
        const solBalance = solLamports / 1e9;

        const portfolio = [
          {
            symbol: "SOL",
            balance: solBalance,
            value: solBalance, // Di sini kamu bisa mengalikan dengan harga asli jika ada API harga
          },
        ];

        // 2. Ambil SPL Tokens
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID },
        );

        tokenAccounts.value.forEach((item) => {
          const info = item.account.data.parsed.info;
          const amount = info.tokenAmount.uiAmount;
          if (amount > 0) {
            portfolio.push({
              symbol: info.mint.slice(0, 4) + "..." + info.mint.slice(-4),
              balance: amount,
              value: amount, // Placeholder
            });
          }
        });

        setAssets(portfolio);
      } catch (err) {
        console.error("portfolio error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [publicKey]);

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-[#00ffa3]">Portfolio</h1>

        {/* TOTAL ASSET BOX - Sekarang Muncul di Atas */}
        {publicKey && !loading && (
          <div className="bg-[#00ffa3]/10 border border-[#00ffa3]/20 p-5 rounded-2xl mt-4 mb-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Total Estimated Value
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-white">
                {totalValue.toFixed(4)}
              </h2>
              <span className="text-[#00ffa3] text-sm font-bold">SOL</span>
            </div>
          </div>
        )}

        <p className="text-slate-400 text-sm mt-1">Asset overview</p>
      </div>

      {/* CONTAINER ASSET DENGAN SCROLL - Agar tidak jebol ke bawah */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="bg-[#0f172a] border border-[#1a2332] rounded-xl p-4 text-slate-500 text-sm">
            Loading mainnet assets...
          </div>
        ) : !publicKey ? (
          <div className="bg-[#0f172a] border border-[#1a2332] rounded-xl p-4 text-slate-500 text-sm">
            Connect wallet to view assets
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-[#0f172a] border border-[#1a2332] rounded-xl p-4 text-slate-500 text-sm">
            No assets detected on Mainnet
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.symbol}
              className="bg-[#0f172a] border border-[#1a2332] rounded-xl p-4 flex items-center justify-between hover:border-[#00ffa3]/20 transition"
            >
              <div>
                <div className="text-white font-semibold">{asset.symbol}</div>
                <div className="text-slate-500 text-sm mt-1">
                  {Number(asset.balance).toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[#00ffa3] font-bold">
                  {Number(asset.value).toFixed(4)}
                </div>
                {/* Ganti ke MAINNET */}
                <div className="text-slate-400 text-[10px] mt-1 font-bold">
                  MAINNET-BETA
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
