export default function CinematicBackground() {
  return (
    <>
      {/* BASE */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050816]" />

      {/* RADIAL GLOW */}
      <div
        className="
          fixed inset-0 -z-40
          bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.10),transparent_35%)]
        "
      />

      <div
        className="
          fixed inset-0 -z-40
          bg-[radial-gradient(circle_at_bottom_right,rgba(0,140,255,0.12),transparent_40%)]
        "
      />

      {/* GRID */}
      <div
        className="
          fixed inset-0 -z-30
          opacity-[0.07]
          [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
          [background-size:80px_80px]
        "
      />

      {/* SCANLINES */}
      <div
        className="
          fixed inset-0 -z-20
          opacity-[0.03]
          pointer-events-none
          [background:linear-gradient(to_bottom,transparent,rgba(255,255,255,0.05),transparent)]
          [background-size:100%_6px]
        "
      />

      {/* NOISE */}
      <div className="noise-layer fixed inset-0 -z-10 pointer-events-none" />

      {/* AURORA */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
    </>
  );
}
