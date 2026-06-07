import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("fluento-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("fluento-theme", theme);
    set({ theme });
  },
}));