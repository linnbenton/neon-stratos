import { Home, BarChart3, Layers, ArrowLeftRight, Wallet } from "lucide-react";

const items = [
  { label: "Dashboard", icon: Home },
  { label: "Portfolio", icon: BarChart3 },
  { label: "Swap", icon: ArrowLeftRight },
  { label: "Vaults", icon: Layers },
  { label: "Wallet", icon: Wallet },
];

export default function Sidebar() {
  return (
    <aside
      className="
        hidden md:flex
        w-64 flex-col
        bg-[#0b0f17]
        border-r border-[#1a2332]
      "
    >
      {/* Logo */}
      <div
        className="
          p-5
          text-[#00ffa3]
          font-bold
          text-xl
          border-b border-[#1a2332]
        "
      >
        NEON TERMINAL
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {items.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-lg
              text-sm
              text-slate-400
              hover:bg-[#111827]
              hover:text-[#00ffa3]
            "
          >
            <Icon size={18} />

            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="
          mt-auto
          p-4
          text-xs
          text-slate-600
          border-t border-[#1a2332]
        "
      >
        Solana DeFi Terminal
      </div>
    </aside>
  );
}
