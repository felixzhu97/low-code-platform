import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ThemeConfig } from "@/domain/theme/entities/theme-config.entity";

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

interface ThemeState {
  theme: ThemeConfig;
  isDarkMode: boolean;
  customThemes: Record<string, ThemeConfig>;
}

const initialState: ThemeState = {
  theme: DEFAULT_THEME,
  isDarkMode: false,
  customThemes: {},
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    setTheme: (state, action: PayloadAction<ThemeConfig>) => {
      state.theme = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.theme = state.isDarkMode ? DARK_THEME : DEFAULT_THEME;
    },
    resetTheme: (state) => {
      state.theme = DEFAULT_THEME;
      state.isDarkMode = false;
    },
    saveCustomTheme: (
      state,
      action: PayloadAction<{ name: string; theme: ThemeConfig }>
    ) => {
      state.customThemes[action.payload.name] = action.payload.theme;
    },
    deleteCustomTheme: (state, action: PayloadAction<string>) => {
      delete state.customThemes[action.payload];
    },
  },
});

export const {
  updateTheme,
  setTheme,
  toggleDarkMode,
  resetTheme,
  saveCustomTheme,
  deleteCustomTheme,
} = themeSlice.actions;

export default themeSlice.reducer;

export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export const selectIsDarkMode = (state: { theme: ThemeState }) =>
  state.theme.isDarkMode;
export const selectCustomThemes = (state: { theme: ThemeState }) =>
  state.theme.customThemes;

export const selectCustomThemeByName = (
  state: { theme: ThemeState },
  name: string
) => state.theme.customThemes[name] || null;

export const selectCustomThemeNames = (state: { theme: ThemeState }) =>
  Object.keys(state.theme.customThemes);
