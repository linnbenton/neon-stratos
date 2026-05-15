import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],

  resolve: {
    alias: {
      buffer: "buffer",
    },
  },

  define: {
    global: "globalThis",
  },

  optimizeDeps: {
    include: ["buffer", "process"],
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],

          charts: ["recharts"],

          motion: ["framer-motion"],

          icons: ["lucide-react"],

          solana: ["@solana/web3.js"],
        },
      },
    },
  },
});
