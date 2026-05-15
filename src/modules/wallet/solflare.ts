import Solflare from "@solflare-wallet/sdk";

export const solflare = new Solflare();
export async function connectWallet() {}

export async function connectSolflare() {
  try {
    await solflare.connect();

    return {
      publicKey: solflare.publicKey?.toString(),
    };
  } catch (err) {
    console.error("Solflare connect error:", err);
    return null;
  }
}

export function disconnectSolflare() {
  solflare.disconnect();
}
