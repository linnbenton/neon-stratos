const activities = [
  {
    type: "SWAP",
    token: "SOL → JUP",
    value: "$1,284",
    time: "2s ago",
  },
  {
    type: "VAULT",
    token: "mSOL Strategy",
    value: "+12.4%",
    time: "12s ago",
  },
  {
    type: "STAKE",
    token: "JTO Pool",
    value: "$8,420",
    time: "1m ago",
  },
  {
    type: "LP",
    token: "SOL/USDC",
    value: "$18,200",
    time: "3m ago",
  },
];

export default function ActivityFeed() {
  return (
    <div
      className="
        bg-[#0b0f17]/80
        backdrop-blur-xl
        border border-[#1a2332]
        rounded-2xl
        p-5
        shadow-[0_0_40px_rgba(168,85,247,0.08)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Live Activity</h2>

          <p className="text-xs text-slate-500 mt-1">
            Real-time protocol execution stream
          </p>
        </div>

        <div
          className="
    flex items-center gap-2

    text-[10px]
    tracking-[0.18em]

    text-[#00ffa3]

    border border-[#00ffa3]/20
    bg-[#00ffa3]/10

    px-3 py-1.5
    rounded-full
  "
        >
          <div className="relative flex h-2 w-2">
            <span
              className="
        animate-ping
        absolute inline-flex h-full w-full rounded-full
        bg-[#00ffa3]
        opacity-75
      "
            />

            <span
              className="
        relative inline-flex rounded-full
        h-2 w-2
        bg-[#00ffa3]
      "
            />
          </div>
          LIVE
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-2">
        {activities.map((item, index) => (
          <div
            key={index}
            className="
              flex items-center justify-between

              bg-[#05060a]
              border border-[#1a2332]
              rounded-xl

              px-4 py-3

              hover:border-[#00ffa3]/30
              hover:bg-[#0b0f17]
              transition
            "
          >
            {/* Left */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {/* Type badge */}
                <div
                  className="
                    text-[10px]
                    px-2 py-0.5
                    rounded-md

                    bg-[#00ffa3]/10
                    text-[#00ffa3]
                    border border-[#00ffa3]/20
                  "
                >
                  {item.type}
                </div>

                <div className="text-sm text-white">{item.token}</div>
              </div>

              <div className="text-[11px] text-slate-500">{item.time}</div>
            </div>

            {/* Right */}
            <div className="text-sm font-semibold text-[#00ffa3]">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
