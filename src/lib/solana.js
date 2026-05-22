import { Connection } from "@solana/web3.js";

export const RPC_ENDPOINT =
  import.meta.env.VITE_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";

export const connection = new Connection(RPC_ENDPOINT, {
  commitment: "confirmed",
});
