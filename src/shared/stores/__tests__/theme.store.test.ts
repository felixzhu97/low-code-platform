import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useThemeStore } from "../theme.store";
import type { ThemeConfig } from "@/domain/entities/types";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

describe("useThemeStore", () => {
  const defaultTheme: ThemeConfig = {
    primaryColor: "#0070f3",
    secondaryColor: "#6c757d",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "0.375rem",
    spacing: "1rem",
  };

  const darkTheme: ThemeConfig = {
    primaryColor: "#0070f3",
    secondaryColor: "#6c757d",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "0.375rem",
    spacing: "1rem",
  };

  beforeEach(() => {
    useThemeStore.setState({
      theme: { ...defaultTheme },
      isDarkMode: false,
      customThemes: {},
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toEqual(defaultTheme);
      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.customThemes).toEqual({});
    });
  });

  describe("updateTheme", () => {
    it("should update theme with partial changes", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ primaryColor: "#ff0000" });
      });

      expect(result.current.theme.primaryColor).toBe("#ff0000");
      expect(result.current.theme.secondaryColor).toBe(defaultTheme.secondaryColor);
    });

    it("should update multiple theme properties", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({
          primaryColor: "#ff0000",
          backgroundColor: "#1a1a1a",
          textColor: "#ffffff",
        });
      });

      expect(result.current.theme.primaryColor).toBe("#ff0000");
      expect(result.current.theme.backgroundColor).toBe("#1a1a1a");
      expect(result.current.theme.textColor).toBe("#ffffff");
    });

    it("should preserve unchanged properties", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ borderRadius: "0.5rem" });
      });

      expect(result.current.theme.borderRadius).toBe("0.5rem");
      expect(result.current.theme.fontFamily).toBe(defaultTheme.fontFamily);
      expect(result.current.theme.spacing).toBe(defaultTheme.spacing);
    });

    it("should handle empty updates", () => {
      const { result } = renderHook(() => useThemeStore());
      const originalTheme = { ...result.current.theme };

      act(() => {
        result.current.updateTheme({});
      });

      expect(result.current.theme).toEqual(originalTheme);
    });

    it("should handle color format variations", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ primaryColor: "rgb(255, 0, 0)" });
      });

      expect(result.current.theme.primaryColor).toBe("rgb(255, 0, 0)");
    });
  });

  describe("setTheme", () => {
    it("should set complete theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const newTheme: ThemeConfig = {
        primaryColor: "#00ff00",
        secondaryColor: "#0000ff",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        borderRadius: "1rem",
        spacing: "2rem",
      };

      act(() => {
        result.current.setTheme(newTheme);
      });

      expect(result.current.theme).toEqual(newTheme);
    });

    it("should replace entire theme", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme(darkTheme);
      });

      expect(result.current.theme).toEqual(darkTheme);
      expect(result.current.theme.backgroundColor).toBe(darkTheme.backgroundColor);
      expect(result.current.theme.textColor).toBe(darkTheme.textColor);
    });
  });

  describe("toggleDarkMode", () => {
    it("should toggle from light to dark mode", () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.theme).toEqual(darkTheme);
    });

    it("should toggle from dark to light mode", () => {
      useThemeStore.setState({ isDarkMode: true, theme: { ...darkTheme } });
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.theme).toEqual(defaultTheme);
    });

    it("should toggle multiple times", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.isDarkMode).toBe(true);
    });

    it("should apply correct theme for each mode", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.theme.backgroundColor).toBe(darkTheme.backgroundColor);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.theme.backgroundColor).toBe(defaultTheme.backgroundColor);
    });
  });

  describe("resetTheme", () => {
    it("should reset theme to default values", () => {
      useThemeStore.setState({
        theme: { ...darkTheme },
        isDarkMode: true,
      });
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.resetTheme();
      });

      expect(result.current.theme).toEqual(defaultTheme);
      expect(result.current.isDarkMode).toBe(false);
    });

    it("should reset even after custom theme changes", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ primaryColor: "#ff00ff" });
        result.current.toggleDarkMode();
        result.current.resetTheme();
      });

      expect(result.current.theme).toEqual(defaultTheme);
      expect(result.current.isDarkMode).toBe(false);
    });
  });

  describe("saveCustomTheme", () => {
    it("should save a custom theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const customTheme: ThemeConfig = {
        ...defaultTheme,
        primaryColor: "#ff6600",
        backgroundColor: "#f5f5f5",
      };

      act(() => {
        result.current.saveCustomTheme("corporate", customTheme);
      });

      expect(result.current.customThemes["corporate"]).toEqual(customTheme);
    });

    it("should save multiple custom themes", () => {
      const { result } = renderHook(() => useThemeStore());
      const theme1: ThemeConfig = { ...defaultTheme, primaryColor: "#ff0000" };
      const theme2: ThemeConfig = { ...defaultTheme, primaryColor: "#00ff00" };
      const theme3: ThemeConfig = { ...defaultTheme, primaryColor: "#0000ff" };

      act(() => {
        result.current.saveCustomTheme("red", theme1);
        result.current.saveCustomTheme("green", theme2);
        result.current.saveCustomTheme("blue", theme3);
      });

      expect(Object.keys(result.current.customThemes)).toHaveLength(3);
      expect(result.current.customThemes["red"].primaryColor).toBe("#ff0000");
      expect(result.current.customThemes["green"].primaryColor).toBe("#00ff00");
      expect(result.current.customThemes["blue"].primaryColor).toBe("#0000ff");
    });

    it("should overwrite existing custom theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const original: ThemeConfig = { ...defaultTheme, primaryColor: "#ff0000" };
      const updated: ThemeConfig = { ...defaultTheme, primaryColor: "#00ff00" };

      act(() => {
        result.current.saveCustomTheme("red", original);
        result.current.saveCustomTheme("red", updated);
      });

      expect(result.current.customThemes["red"].primaryColor).toBe("#00ff00");
      expect(Object.keys(result.current.customThemes)).toHaveLength(1);
    });
  });

  describe("loadCustomTheme", () => {
    it("should load an existing custom theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const customTheme: ThemeConfig = {
        ...defaultTheme,
        primaryColor: "#ff6600",
        backgroundColor: "#e0e0e0",
      };

      act(() => {
        result.current.saveCustomTheme("corporate", customTheme);
      });

      const loaded = result.current.loadCustomTheme("corporate");

      expect(loaded).toEqual(customTheme);
    });

    it("should return null for non-existent theme", () => {
      const { result } = renderHook(() => useThemeStore());

      const loaded = result.current.loadCustomTheme("non-existent");

      expect(loaded).toBeNull();
    });

    it("should return null when no custom themes exist", () => {
      const { result } = renderHook(() => useThemeStore());

      const loaded = result.current.loadCustomTheme("any-theme");

      expect(loaded).toBeNull();
    });

    it("should load theme without modifying current theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const customTheme: ThemeConfig = {
        ...defaultTheme,
        primaryColor: "#ff6600",
      };

      act(() => {
        result.current.saveCustomTheme("custom", customTheme);
        result.current.loadCustomTheme("custom");
      });

      expect(result.current.theme.primaryColor).toBe(defaultTheme.primaryColor);
    });
  });

  describe("deleteCustomTheme", () => {
    it("should delete a custom theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const customTheme: ThemeConfig = { ...defaultTheme, primaryColor: "#ff0000" };

      act(() => {
        result.current.saveCustomTheme("red", customTheme);
      });

      expect(result.current.customThemes["red"]).toBeDefined();

      act(() => {
        result.current.deleteCustomTheme("red");
      });

      expect(result.current.customThemes["red"]).toBeUndefined();
    });

    it("should not affect other themes when deleting one", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.saveCustomTheme("red", { ...defaultTheme, primaryColor: "#ff0000" });
        result.current.saveCustomTheme("green", { ...defaultTheme, primaryColor: "#00ff00" });
        result.current.saveCustomTheme("blue", { ...defaultTheme, primaryColor: "#0000ff" });
        result.current.deleteCustomTheme("green");
      });

      expect(result.current.customThemes["red"]).toBeDefined();
      expect(result.current.customThemes["green"]).toBeUndefined();
      expect(result.current.customThemes["blue"]).toBeDefined();
    });

    it("should handle deleting non-existent theme", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.deleteCustomTheme("non-existent");
      });

      expect(Object.keys(result.current.customThemes)).toHaveLength(0);
    });
  });

  describe("getCustomThemeNames", () => {
    it("should return all custom theme names", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.saveCustomTheme("corporate", defaultTheme);
        result.current.saveCustomTheme("dark-mode", darkTheme);
        result.current.saveCustomTheme("high-contrast", { ...defaultTheme, textColor: "#000" });
      });

      const names = result.current.getCustomThemeNames();

      expect(names).toContain("corporate");
      expect(names).toContain("dark-mode");
      expect(names).toContain("high-contrast");
      expect(names).toHaveLength(3);
    });

    it("should return empty array when no custom themes", () => {
      const { result } = renderHook(() => useThemeStore());

      const names = result.current.getCustomThemeNames();

      expect(names).toEqual([]);
    });

    it("should update after adding/removing themes", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.saveCustomTheme("theme1", defaultTheme);
        result.current.saveCustomTheme("theme2", defaultTheme);
      });

      expect(result.current.getCustomThemeNames()).toHaveLength(2);

      act(() => {
        result.current.deleteCustomTheme("theme1");
      });

      expect(result.current.getCustomThemeNames()).toHaveLength(1);
      expect(result.current.getCustomThemeNames()).toContain("theme2");
    });
  });

  describe("Theme Properties", () => {
    it("should handle all color properties", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({
          primaryColor: "#ff0000",
          secondaryColor: "#00ff00",
          backgroundColor: "#0000ff",
          textColor: "#ffff00",
        });
      });

      expect(result.current.theme.primaryColor).toBe("#ff0000");
      expect(result.current.theme.secondaryColor).toBe("#00ff00");
      expect(result.current.theme.backgroundColor).toBe("#0000ff");
      expect(result.current.theme.textColor).toBe("#ffff00");
    });

    it("should handle font family variations", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ fontFamily: "Arial, Helvetica, sans-serif" });
      });

      expect(result.current.theme.fontFamily).toBe("Arial, Helvetica, sans-serif");
    });

    it("should handle border radius variations", () => {
      const { result } = renderHook(() => useThemeStore());

      const borderRadii = ["0", "0.25rem", "0.5rem", "1rem", "50%"];
      const initialTheme = { ...result.current.theme };

      borderRadii.forEach((radius) => {
        act(() => {
          result.current.updateTheme({ borderRadius: radius });
        });
        expect(result.current.theme.borderRadius).toBe(radius);
      });

      act(() => {
        result.current.setTheme(initialTheme);
      });
      expect(result.current.theme.borderRadius).toBe(initialTheme.borderRadius);
    });

    it("should handle spacing variations", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.updateTheme({ spacing: "2rem" });
      });

      expect(result.current.theme.spacing).toBe("2rem");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long font family string", () => {
      const { result } = renderHook(() => useThemeStore());
      const longFontFamily = "Helvetica Neue, Helvetica, Arial, sans-serif, system-ui, -apple-system";

      act(() => {
        result.current.updateTheme({ fontFamily: longFontFamily });
      });

      expect(result.current.theme.fontFamily).toBe(longFontFamily);
    });

    it("should handle special characters in theme names", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.saveCustomTheme("my-theme_v1.0", defaultTheme);
      });

      expect(result.current.customThemes["my-theme_v1.0"]).toBeDefined();
      expect(result.current.getCustomThemeNames()).toContain("my-theme_v1.0");
    });

    it("should handle unicode theme names", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.saveCustomTheme("暗黑主题", defaultTheme);
        result.current.saveCustomTheme("다크 테마", defaultTheme);
      });

      expect(result.current.getCustomThemeNames()).toContain("暗黑主题");
      expect(result.current.getCustomThemeNames()).toContain("다크 테마");
    });

    it("should handle rapid theme toggling", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.toggleDarkMode();
        }
      });

      expect(result.current.isDarkMode).toBe(100 % 2 === 0 ? false : true);
    });

    it("should handle rapid custom theme saves", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.saveCustomTheme(`theme-${i}`, {
            ...defaultTheme,
            primaryColor: `#${i.toString(16).padStart(6, "0")}`,
          });
        }
      });

      expect(Object.keys(result.current.customThemes)).toHaveLength(50);
    });
  });

  describe("Integration Scenarios", () => {
    it("should support full theme customization workflow", () => {
      const { result } = renderHook(() => useThemeStore());

      // Create and save custom theme
      act(() => {
        result.current.saveCustomTheme("brand", {
          ...defaultTheme,
          primaryColor: "#e91e63",
          secondaryColor: "#9c27b0",
        });
      });

      // Apply it
      const customTheme = result.current.loadCustomTheme("brand");
      act(() => {
        result.current.setTheme(customTheme!);
      });

      expect(result.current.theme.primaryColor).toBe("#e91e63");

      // Make temporary changes
      act(() => {
        result.current.updateTheme({ primaryColor: "#00bcd4" });
      });

      expect(result.current.theme.primaryColor).toBe("#00bcd4");

      // Reset back to saved theme
      act(() => {
        result.current.setTheme(customTheme!);
      });

      expect(result.current.theme.primaryColor).toBe("#e91e63");
    });

    it("should support dark mode with custom themes", () => {
      const { result } = renderHook(() => useThemeStore());

      // Enable dark mode
      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(true);

      // Save dark theme
      act(() => {
        result.current.saveCustomTheme("my-dark", { ...result.current.theme });
      });

      // Switch to light
      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(false);

      // Load saved dark theme
      const savedDark = result.current.loadCustomTheme("my-dark");
      act(() => {
        result.current.setTheme(savedDark!);
      });

      expect(result.current.theme.backgroundColor).toBe(darkTheme.backgroundColor);
    });
  });
});
