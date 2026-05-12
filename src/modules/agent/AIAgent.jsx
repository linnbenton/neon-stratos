import { useEffect, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

import GlassPanel from "../../components/ui/GlassPanel";

const prompts = [
  "Analyzing Solana market...",
  "Scanning liquidity pools...",
  "Generating alpha...",
  "Monitoring whale wallets...",
  "Building trading strategy...",
  "Tracking smart money...",
];

export default function AIAgent() {
  const [displayText, setDisplayText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const current = prompts[promptIndex];

    let i = 0;

    const interval = setInterval(() => {
      setDisplayText(current.slice(0, i));

      i++;

      if (i > current.length) {
        clearInterval(interval);

        setTimeout(() => {
          setPromptIndex((prev) =>
            prev === prompts.length - 1 ? 0 : prev + 1,
          );
        }, 1400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [promptIndex]);

  return (
    <div className="h-full flex flex-col gap-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#00ffa3]">AI Agent</h1>

          <p className="text-slate-400 text-sm mt-1">
            Institutional AI trading assistant
          </p>
        </div>

        <div
          className="
            flex items-center gap-2

            px-3 py-2

            rounded-xl

            border border-cyan-500/20

            bg-cyan-500/5
          "
        >
          <Sparkles size={16} className="text-cyan-400" />

          <span className="text-cyan-300 text-sm">ONLINE</span>
        </div>
      </div>

      {/* CHAT PANEL */}
      <GlassPanel
        className="
          flex
          flex-col

          h-[78vh]
        "
      >
        {/* CHAT AREA */}
        <div
          className="
            flex-1
            overflow-auto

            p-6

            space-y-5
          "
        >
          {/* AI MESSAGE */}
          <div className="flex gap-4">
            <div
              className="
                w-10 h-10

                rounded-xl

                bg-cyan-500/10

                border border-cyan-500/20

                flex items-center justify-center
              "
            >
              <Bot size={20} className="text-cyan-400" />
            </div>

            <div
              className="
                max-w-[80%]

                rounded-2xl

                bg-[#0f172a]

                border border-[#1a2332]

                p-4
              "
            >
              <div className="text-white leading-relaxed">
                Welcome to Neon AI Terminal.
                <br />
                <br />
                I can help with:
                <br />
                • market analysis
                <br />
                • DeFi opportunities
                <br />
                • portfolio optimization
                <br />
                • Solana ecosystem intelligence
                <br />• automated trading workflows
              </div>
            </div>
          </div>
        </div>

        {/* INPUT AREA */}
        <div
          className="
            border-t border-[#1a2332]

            p-4
          "
        >
          <div
            className="
              flex items-center gap-3

              rounded-2xl

              border border-cyan-500/20

              bg-[#0b0f17]

              px-4 py-3
            "
          >
            <input
              type="text"
              value=""
              placeholder={displayText + "▋"}
              className="
                flex-1

                bg-transparent

                outline-none

                text-white

                caret-cyan-400

                placeholder:text-slate-500
                placeholder:tracking-wide

                text-sm
              "
            />

            <button
              className="
                w-11 h-11

                rounded-xl

                bg-cyan-500/10

                border border-cyan-500/20

                flex items-center justify-center

                hover:bg-cyan-500/20

                transition-all
              "
            >
              <Send size={18} className="text-cyan-400" />
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
