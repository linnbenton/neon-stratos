export default function GlassPanel({ children, className = "" }) {
  return (
    <div
      className={`
  group

  relative

  overflow-hidden

  rounded-3xl

  border
  border-cyan-400/10

  bg-[#050816]/72

  backdrop-blur-2xl

  shadow-[0_0_80px_rgba(0,255,170,0.05)]

  transition-all
  duration-300

  hover:border-cyan-400/20

  hover:shadow-[0_0_120px_rgba(0,255,170,0.10)]

  before:absolute
  before:inset-0

  before:bg-[radial-gradient(circle_at_top_left,rgba(0,255,170,0.12),transparent_35%)]

  before:opacity-80

  after:absolute
  after:inset-0

  after:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02))]

  ${className}
`}
    >
      {/* glow */}
      <div
        className="
          absolute
          inset-0

          bg-gradient-to-br
          from-cyan-400/5
          via-transparent
          to-emerald-400/5

          pointer-events-none
        "
      />

      {/* top highlight */}
      <div
        className="
          absolute
          top-0
          left-0
          right-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-cyan-400/40
          to-transparent
        "
      />

      {/* inner border */}
      <div
        className="
          absolute
          inset-[1px]

          rounded-2xl

          border
          border-white/[0.03]

          pointer-events-none
        "
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
