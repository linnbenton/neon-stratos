import { useWallet } from "@solana/wallet-adapter-react";
import { Search } from "lucide-react";

export default function Topbar({ search, setSearch }) {
  const { select, wallets, connect, disconnect, connected, publicKey } =
    useWallet();

  const handleConnect = async () => {
    try {
      if (connected) {
        await disconnect();
        return;
      }

      const phantom = wallets.find((w) => w.adapter.name === "Phantom");

      if (!phantom) {
        alert("Phantom wallet not installed");
        return;
      }

      select(phantom.adapter.name);

      setTimeout(async () => {
        try {
          await connect();
        } catch (err) {
          console.error(err);
        }
      }, 500);
    } catch (e) {
      console.error("Wallet error:", e);
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-[#1a2332] bg-[#05060a]/70 backdrop-blur-xl">
      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-[#0b0f17] px-3 py-2 rounded-lg border border-[#1a2332] w-full max-w-md">
        <Search size={16} className="text-slate-500" />

        <input
          type="text"
          placeholder="Search token, vault, address..."
          value={search || ""}
          onChange={(e) => setSearch?.(e.target.value)}
          className="bg-transparent outline-none text-sm text-white placeholder:text-slate-500 flex-1"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-xs">
        <div className="text-slate-400">
          Network: <span className="text-[#00ffa3]">Solana</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse" />
          <span className="text-slate-400">Live</span>
        </div>

        {/* WALLET BUTTON (FIXED) */}
        <button
          onClick={handleConnect}
          disabled={connected}
          className="
            px-3 py-1 
            rounded-md 
            bg-[#00ffa3]/10 
            text-[#00ffa3] 
            border border-[#00ffa3]/20 
            hover:bg-[#00ffa3]/20
            transition
            max-w-[160px]
            truncate
          "
          title={publicKey?.toBase58()}
        >
          {connected && publicKey
            ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
