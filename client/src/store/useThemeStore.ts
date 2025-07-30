import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("sochat-theme") || "forest",
  setTheme: (theme: string) => {
    localStorage.setItem("sochat-theme", theme)
    set({ theme });
  },
}));
