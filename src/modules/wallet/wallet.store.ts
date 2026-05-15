import { create } from "zustand";

type WalletState = {
  publicKey: string | null;
  connected: boolean;

  setWallet: (data: { publicKey: string | null; connected: boolean }) => void;

  reset: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  connected: false,

  setWallet: (data) =>
    set({
      publicKey: data.publicKey,
      connected: data.connected,
    }),

  reset: () =>
    set({
      publicKey: null,
      connected: false,
    }),
}));
