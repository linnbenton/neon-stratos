import {
  Home,
  BarChart3,
  Layers,
  ArrowLeftRight,
  Wallet,
  Bot,
} from "lucide-react";

import { useAppStore } from "../state/appStore.jsx";
import SystemStatusBar from "../components/ui/SystemStatusBar";

const items = [
  { label: "Dashboard", tab: "dashboard", icon: Home },
  { label: "Portfolio", tab: "portfolio", icon: BarChart3 },
  { label: "Orderbook", tab: "orderbook", icon: ArrowLeftRight },
  { label: "Vaults", tab: "vaults", icon: Layers },
  { label: "Wallet", tab: "wallet", icon: Wallet },
  { label: "AI Agent", tab: "agent", icon: Bot },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <aside
      className="
        hidden md:flex
        w-64
        flex-col

        bg-[#0b0f17]
        border-r border-white/5
      "
    >
      {/* LOGO */}
      <div
        className="
          px-5 py-5

          text-[#00ffa3]
          font-semibold
          text-lg

          border-b border-white/5

          tracking-wide
        "
      >
        NEON TERMINAL
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {items.map(({ label, icon: Icon, tab }) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={label}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-3

                px-3 py-2.5

                rounded-lg

                text-sm

                transition-all duration-200

                ${
                  isActive
                    ? "bg-[#00ffa3] text-black shadow-[0_0_20px_rgba(0,255,163,0.25)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-[#00ffa3]"
                }
              `}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* SYSTEM STATUS (MID-FEEL / OS LAYER) */}
      <div className="px-4 py-3 border-t border-white/5">
        <SystemStatusBar />
      </div>

      {/* FOOTER */}
      <div
        className="
          mt-auto

          px-4 py-4

          border-t border-white/5

          text-[10px]
          text-slate-600

          space-y-1
        "
      >
        <div className="text-slate-500">Solana DeFi Terminal</div>

        <div className="text-slate-600">v1.0 • institutional build</div>
      </div>
    </aside>
  );
}
