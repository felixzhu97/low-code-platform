import type { CSSProperties } from "react";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  sidebar: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
  };
  radius: string;
}

export interface Theme {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  borderRadius: {
    lg: string;
    md: string;
    sm: string;
  };
  animations: {
    accordionDown: string;
    accordionUp: string;
  };
}

const lightColors: ThemeColors = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(0 0% 3.9%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(0 0% 3.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(0 0% 3.9%)",
  primary: "hsl(0 0% 9%)",
  primaryForeground: "hsl(0 0% 98%)",
  secondary: "hsl(0 0% 96.1%)",
  secondaryForeground: "hsl(0 0% 9%)",
  muted: "hsl(0 0% 96.1%)",
  mutedForeground: "hsl(0 0% 45.1%)",
  accent: "hsl(0 0% 96.1%)",
  accentForeground: "hsl(0 0% 9%)",
  destructive: "hsl(0 84.2% 60.2%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(0 0% 89.8%)",
  input: "hsl(0 0% 89.8%)",
  ring: "hsl(0 0% 3.9%)",
  chart: {
    1: "hsl(12 76% 61%)",
    2: "hsl(173 58% 39%)",
    3: "hsl(197 37% 24%)",
    4: "hsl(43 74% 66%)",
    5: "hsl(27 87% 67%)",
  },
  sidebar: {
    background: "hsl(0 0% 98%)",
    foreground: "hsl(240 5.3% 26.1%)",
    primary: "hsl(240 5.9% 10%)",
    primaryForeground: "hsl(0 0% 98%)",
    accent: "hsl(240 4.8% 95.9%)",
    accentForeground: "hsl(240 5.9% 10%)",
    border: "hsl(220 13% 91%)",
    ring: "hsl(217.2 91.2% 59.8%)",
  },
  radius: "0.5rem",
};

const darkColors: ThemeColors = {
  background: "hsl(0 0% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  card: "hsl(0 0% 3.9%)",
  cardForeground: "hsl(0 0% 98%)",
  popover: "hsl(0 0% 3.9%)",
  popoverForeground: "hsl(0 0% 98%)",
  primary: "hsl(0 0% 98%)",
  primaryForeground: "hsl(0 0% 9%)",
  secondary: "hsl(0 0% 14.9%)",
  secondaryForeground: "hsl(0 0% 98%)",
  muted: "hsl(0 0% 14.9%)",
  mutedForeground: "hsl(0 0% 63.9%)",
  accent: "hsl(0 0% 14.9%)",
  accentForeground: "hsl(0 0% 98%)",
  destructive: "hsl(0 62.8% 30.6%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(0 0% 14.9%)",
  input: "hsl(0 0% 14.9%)",
  ring: "hsl(0 0% 83.1%)",
  chart: {
    1: "hsl(220 70% 50%)",
    2: "hsl(160 60% 45%)",
    3: "hsl(30 80% 55%)",
    4: "hsl(280 65% 60%)",
    5: "hsl(340 75% 55%)",
  },
  sidebar: {
    background: "hsl(240 5.9% 10%)",
    foreground: "hsl(240 4.8% 95.9%)",
    primary: "hsl(224.3 76.3% 48%)",
    primaryForeground: "hsl(0 0% 100%)",
    accent: "hsl(240 3.7% 15.9%)",
    accentForeground: "hsl(240 4.8% 95.9%)",
    border: "hsl(240 3.7% 15.9%)",
    ring: "hsl(217.2 91.2% 59.8%)",
  },
  radius: "0.5rem",
};

export const theme: Theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
  animations: {
    accordionDown: "accordion-down 0.2s ease-out",
    accordionUp: "accordion-up 0.2s ease-out",
  },
};

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
};

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const createTheme = (
  mode: "light" | "dark"
): Record<string, CSSProperties> => {
  const colors = mode === "light" ? lightColors : darkColors;

  return {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--card": colors.card,
    "--card-foreground": colors.cardForeground,
    "--popover": colors.popover,
    "--popover-foreground": colors.popoverForeground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--destructive": colors.destructive,
    "--destructive-foreground": colors.destructiveForeground,
    "--border": colors.border,
    "--input": colors.input,
    "--ring": colors.ring,
    "--radius": colors.radius,
  } as Record<string, CSSProperties>;
};

export type ThemeMode = "light" | "dark";

/** Initial mode for SSR / root layout `data-theme`; must match ThemeProvider `defaultMode`. */
export const DEFAULT_THEME_MODE: ThemeMode = "light";