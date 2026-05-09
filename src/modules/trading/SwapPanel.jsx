import { ArrowDown, Settings2 } from "lucide-react";

export default function SwapPanel() {
  return (
    <div
      className="
        relative overflow-hidden
        bg-[#0b0f17]/80
        backdrop-blur-xl
        border border-orange-500/20
        rounded-2xl
        p-6
        shadow-[0_0_40px_rgba(255,140,0,0.12)]
      "
    >
      {/* orange orb */}
      <div
        className="
          absolute
          -top-12
          -right-12
          w-40
          h-40
          bg-orange-500/10
          blur-3xl
          rounded-full
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="
                text-xl font-bold
                text-orange-400
                drop-shadow-[0_0_12px_rgba(255,140,0,0.8)]
              "
            >
              Instant Swap
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Jupiter Aggregator Route
            </p>
          </div>

          <button
            className="
              w-10 h-10
              rounded-xl
              border border-orange-500/20
              bg-orange-500/10
              flex items-center justify-center
              text-orange-400
              hover:bg-orange-500/20
              transition
            "
          >
            <Settings2 size={18} />
          </button>
        </div>

        {/* FROM */}
        <div
          className="
            bg-[#05060a]
            border border-[#1a2332]
            rounded-2xl
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">From</div>

              <input
                type="text"
                defaultValue="1.25"
                className="
                  bg-transparent
                  outline-none
                  text-3xl
                  font-bold
                  text-slate-100
                  mt-2
                  w-full
                "
              />
            </div>

            <button
              className="
                bg-orange-500/10
                border border-orange-500/20
                text-orange-400
                px-4 py-2
                rounded-xl
                font-medium
              "
            >
              SOL
            </button>
          </div>
        </div>

        {/* swap icon */}
        <div className="flex justify-center my-4">
          <button
            className="
              w-12 h-12
              rounded-2xl
              bg-orange-500/10
              border border-orange-500/20
              text-orange-400
              flex items-center justify-center
              hover:rotate-180
              transition duration-500
            "
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* TO */}
        <div
          className="
            bg-[#05060a]
            border border-[#1a2332]
            rounded-2xl
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">To</div>

              <div className="text-3xl font-bold text-slate-100 mt-2">
                218.42
              </div>
            </div>

            <button
              className="
                bg-pink-500/10
                border border-pink-500/20
                text-pink-400
                px-4 py-2
                rounded-xl
                font-medium
              "
            >
              JUP
            </button>
          </div>
        </div>

        {/* details */}
        <div
          className="
            mt-5
            rounded-xl
            border border-[#1a2332]
            bg-[#05060a]
            p-4
            space-y-2
            text-sm
          "
        >
          <div className="flex justify-between">
            <span className="text-slate-500">Slippage</span>

            <span className="text-orange-400">0.5%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Route</span>

            <span className="text-[#00ffa3]">Jupiter Ultra</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="
            w-full mt-6
            py-4 rounded-2xl
            bg-gradient-to-r
            from-orange-500
            to-pink-500
            text-white
            font-bold
            text-lg
            shadow-[0_0_30px_rgba(255,140,0,0.35)]
            hover:scale-[1.02]
            transition
          "
        >
          Execute Swap
        </button>
      </div>
    </div>
  );
}
