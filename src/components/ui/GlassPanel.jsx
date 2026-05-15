export default function GlassPanel({ children, className = "", glow = true }) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden

        rounded-3xl

        border border-white/10

        bg-white/[0.04]

        backdrop-blur-2xl

        shadow-[0_8px_40px_rgba(0,0,0,0.45)]

        transition-all
        duration-500

        hover:border-cyan-400/20
        hover:shadow-[0_0_60px_rgba(0,255,255,0.08)]

        ${className}
      `}
    >
      {/* TOP LIGHT EDGE */}
      <div
        className="
          absolute
          top-0
          left-0
          h-px
          w-full

          bg-gradient-to-r
          from-transparent
          via-cyan-300/80
          to-transparent

          opacity-80
        "
      />

      {/* INNER LIGHT */}
      <div
        className="
          absolute
          inset-0

          bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08),transparent_35%)]

          pointer-events-none
        "
      />

      {/* CORNER GLOW */}
      {glow && (
        <div
          className="
            absolute
            -top-24
            -right-24

            w-48
            h-48

            bg-cyan-400/10

            blur-3xl
            rounded-full

            opacity-0
            group-hover:opacity-100

            transition-all
            duration-700
          "
        />
      )}

      {/* DEPTH BORDER */}
      <div
        className="
          absolute
          inset-[1px]

          rounded-3xl

          border border-white/[0.04]

          pointer-events-none
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
