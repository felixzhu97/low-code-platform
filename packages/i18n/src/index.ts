/**
 * @lowcode-platform/i18n
 * Internationalization utilities for low-code platform
 */

// Export i18n instance (default export)
export { default, initI18n } from "./config";

// Export types
export type {
  Language,
  LanguageInfo,
  TranslationNamespace,
  ResourceBundle,
  I18nConfigOptions,
  TFunction,
  LanguageChangeHandler,
} from "./types";

// Export hooks
export {
  useTranslation,
  useLanguage,
  useTranslationReady,
} from "./hooks";

// Export utilities
export {
  detectLanguage,
  getAvailableLanguages,
  getLanguageInfo,
  formatDate,
  formatNumber,
  formatCurrency,
  loadTranslations,
} from "./utils";

// Export components
export { LanguageSwitcher } from "./components/language-switcher";
export type { LanguageSwitcherProps } from "./components/language-switcher";