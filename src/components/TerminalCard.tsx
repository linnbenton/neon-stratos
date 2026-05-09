"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string;
  trend: number;
  type: "cyan" | "pink";
}

export const TerminalCard = ({ title, value, trend, type }: Props) => {
  const isCyan = type === "cyan";

  // Mapping class agar JSX lebih bersih
  const themeClasses = isCyan
    ? "border-cyber-cyan shadow-neon-cyan"
    : "border-cyber-pink shadow-neon-pink";

  const accentClasses = isCyan ? "border-cyber-cyan" : "border-cyber-pink";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 bg-black/60 border-2 backdrop-blur-xl rounded-none overflow-hidden transition-all duration-300 ${themeClasses}`}
    >
      {/* Corner Accents - Top Right */}
      <div
        className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${accentClasses}`}
      />

      {/* Decorative Identifier (Small tag in corner) */}
      <div
        className={`absolute bottom-0 left-0 px-1 text-[8px] font-bold ${isCyan ? "bg-cyber-cyan text-black" : "bg-cyber-pink text-black"}`}
      >
        {isCyan ? "SECURED" : "HIGH_VOL"}
      </div>

      {/* Label & Value */}
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1 font-mono">
          {title}
        </p>
        <h3 className="text-3xl font-black text-white font-mono tracking-tighter">
          {value}
        </h3>
      </div>

      {/* Analytics Footer */}
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${trend > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">
            Live_Signal
          </span>
        </div>

        {/* Visual Bit-graph (Small decor) */}
        <div className="flex gap-0.5 h-3 items-end">
          {[0.4, 0.7, 0.5, 0.9].map((h, i) => (
            <div
              key={i}
              className={`w-1 ${accentClasses} bg-current`}
              style={{ height: `${h * 100}%`, opacity: 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Moving Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none h-[1px] animate-scanline" />
    </motion.div>
  );
};
