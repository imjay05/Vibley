import { create } from "zustand";

const getInitialTheme = () => {
  const saved = localStorage.getItem("chat-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("chat-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return { theme: next };
    });
  },
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));