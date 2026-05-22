// D:\projects\neon-stratos\src\lib\solana.js
import { Connection } from "@solana/web3.js";

// Endpoint ini menggunakan cluster resmi dari ankr yang sangat ramah terhadap ISP Indonesia
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_URL;

export const connection = new Connection(RPC_ENDPOINT, {
  commitment: "confirmed",
});

console.log("🚨 RPC Berhasil Dipasang ke Node Stabil:", RPC_ENDPOINT);
