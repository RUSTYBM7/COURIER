import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "airpak-theme";

function getResolved(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyTheme(theme: Theme) {
  const resolved = getResolved(theme);
  document.documentElement.setAttribute("data-theme", resolved);
  document.body.setAttribute("data-theme", resolved);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
    applyTheme(newTheme);
  }, []);

  const toggle = useCallback(() => {
    const resolved = getResolved(theme);
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const resolvedTheme = getResolved(theme);

  return { theme, setTheme, toggle, resolvedTheme };
}
