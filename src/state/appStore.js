import { create } from "zustand";

export const useAppStore = create((set) => ({
  activeTab: "dashboard",

  setTab: (tab) => set({ activeTab: tab }),
}));
