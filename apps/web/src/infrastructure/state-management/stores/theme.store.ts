import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as themeActions from "../store/slices/theme.slice";
import type { ThemeConfig } from "@/domain/theme/entities/theme-config.entity";

export const useThemeStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.theme);

  return {
    ...state,
    updateTheme: (updates: Partial<ThemeConfig>) =>
      dispatch(themeActions.updateTheme(updates)),
    setTheme: (theme: ThemeConfig) =>
      dispatch(themeActions.setTheme(theme)),
    toggleDarkMode: () => dispatch(themeActions.toggleDarkMode()),
    resetTheme: () => dispatch(themeActions.resetTheme()),
    saveCustomTheme: (name: string, theme: ThemeConfig) =>
      dispatch(themeActions.saveCustomTheme({ name, theme })),
    loadCustomTheme: (name: string) => state.customThemes[name] || null,
    deleteCustomTheme: (name: string) =>
      dispatch(themeActions.deleteCustomTheme(name)),
    getCustomThemeNames: () => Object.keys(state.customThemes),
  };
};
