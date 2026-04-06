"use client";

import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { useState, createContext, useContext, useEffect, type ReactNode } from "react";
import { theme, type ThemeMode, DEFAULT_THEME_MODE } from "./theme";

/** Strip `hsl(...)` so CSS vars match Tailwind `hsl(var(--token))` */
function hslInner(value: string): string {
  const m = value.trim().match(/^hsl\(\s*(.+?)\s*\)$/i);
  return m ? m[1].trim() : value.trim();
}

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggleMode: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultMode = DEFAULT_THEME_MODE,
  enableSystem = false,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setMode(e.matches ? "dark" : "light");
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem]);

  useEffect(() => {
    const colors = mode === "light" ? theme.colors.light : theme.colors.dark;
    const root = document.documentElement;

    root.style.setProperty("--background", hslInner(colors.background));
    root.style.setProperty("--foreground", hslInner(colors.foreground));
    root.style.setProperty("--card", hslInner(colors.card));
    root.style.setProperty("--card-foreground", hslInner(colors.cardForeground));
    root.style.setProperty("--popover", hslInner(colors.popover));
    root.style.setProperty("--popover-foreground", hslInner(colors.popoverForeground));
    root.style.setProperty("--primary", hslInner(colors.primary));
    root.style.setProperty("--primary-foreground", hslInner(colors.primaryForeground));
    root.style.setProperty("--secondary", hslInner(colors.secondary));
    root.style.setProperty("--secondary-foreground", hslInner(colors.secondaryForeground));
    root.style.setProperty("--muted", hslInner(colors.muted));
    root.style.setProperty("--muted-foreground", hslInner(colors.mutedForeground));
    root.style.setProperty("--accent", hslInner(colors.accent));
    root.style.setProperty("--accent-foreground", hslInner(colors.accentForeground));
    root.style.setProperty("--destructive", hslInner(colors.destructive));
    root.style.setProperty("--destructive-foreground", hslInner(colors.destructiveForeground));
    root.style.setProperty("--border", hslInner(colors.border));
    root.style.setProperty("--input", hslInner(colors.input));
    root.style.setProperty("--ring", hslInner(colors.ring));
    root.style.setProperty("--radius", colors.radius);

    root.setAttribute("data-theme", mode);
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.foreground;
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const currentColors =
    mode === "light" ? theme.colors.light : theme.colors.dark;

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      <EmotionThemeProvider theme={{ mode, colors: currentColors }}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
}