import { Connection } from "@solana/web3.js";

// Ambil dari .env, jika tidak ada baru pakai fallback Ankr
export const RPC_ENDPOINT =
  import.meta.env.VITE_KAMINO_RPC_URL || "https://rpc.ankr.com/solana";

export const connection = new Connection(RPC_ENDPOINT, {
  commitment: "confirmed",
  // Tambahkan timeout lebih lama (60 detik) karena Mainnet sering congest/macet
  confirmTransactionInitialTimeout: 60000,
});
