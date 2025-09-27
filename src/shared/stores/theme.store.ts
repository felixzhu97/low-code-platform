import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ThemeConfig } from "@/domain/entities/types";

interface ThemeState {
  // 主题状态
  theme: ThemeConfig;
  isDarkMode: boolean;
  customThemes: Record<string, ThemeConfig>;

  // 主题操作
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  setTheme: (theme: ThemeConfig) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;

  // 自定义主题管理
  saveCustomTheme: (name: string, theme: ThemeConfig) => void;
  loadCustomTheme: (name: string) => ThemeConfig | null;
  deleteCustomTheme: (name: string) => void;
  getCustomThemeNames: () => string[];
}

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#0070f3",
  secondaryColor: "#6c757d",
  backgroundColor: "#ffffff",
  textColor: "#000000",
  fontFamily: "system-ui, sans-serif",
  borderRadius: "0.375rem",
  spacing: "1rem",
};

const DARK_THEME: ThemeConfig = {
  primaryColor: "#0070f3",
  secondaryColor: "#6c757d",
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
  fontFamily: "system-ui, sans-serif",
  borderRadius: "0.375rem",
  spacing: "1rem",
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        theme: DEFAULT_THEME,
        isDarkMode: false,
        customThemes: {},

        // 更新主题
        updateTheme: (updates: Partial<ThemeConfig>) => {
          set(
            (state) => ({
              theme: { ...state.theme, ...updates },
            }),
            false,
            "updateTheme"
          );
        },

        // 设置完整主题
        setTheme: (theme: ThemeConfig) => {
          set({ theme }, false, "setTheme");
        },

        // 切换深色模式
        toggleDarkMode: () => {
          const { isDarkMode } = get();
          set(
            {
              isDarkMode: !isDarkMode,
              theme: !isDarkMode ? DARK_THEME : DEFAULT_THEME,
            },
            false,
            "toggleDarkMode"
          );
        },

        // 重置主题
        resetTheme: () => {
          set(
            {
              theme: DEFAULT_THEME,
              isDarkMode: false,
            },
            false,
            "resetTheme"
          );
        },

        // 保存自定义主题
        saveCustomTheme: (name: string, theme: ThemeConfig) => {
          set(
            (state) => ({
              customThemes: {
                ...state.customThemes,
                [name]: theme,
              },
            }),
            false,
            "saveCustomTheme"
          );
        },

        // 加载自定义主题
        loadCustomTheme: (name: string) => {
          const { customThemes } = get();
          return customThemes[name] || null;
        },

        // 删除自定义主题
        deleteCustomTheme: (name: string) => {
          set(
            (state) => {
              const newCustomThemes = { ...state.customThemes };
              delete newCustomThemes[name];
              return { customThemes: newCustomThemes };
            },
            false,
            "deleteCustomTheme"
          );
        },

        // 获取自定义主题名称列表
        getCustomThemeNames: () => {
          const { customThemes } = get();
          return Object.keys(customThemes);
        },
      }),
      {
        name: "theme-store",
        partialize: (state) => ({
          theme: state.theme,
          isDarkMode: state.isDarkMode,
          customThemes: state.customThemes,
        }),
      }
    ),
    {
      name: "theme-store",
    }
  )
);
