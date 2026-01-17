/**
 * @lowcode-platform/i18n
 * i18n configuration and initialization
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import type { I18nConfigOptions, Language } from "./types";

// Import translation resources
import zhCommon from "./locales/zh/common.json";
import enCommon from "./locales/en/common.json";

// Default configuration
const defaultConfig: I18nConfigOptions = {
  defaultLanguage: "zh",
  fallbackLanguage: "en",
  supportedLanguages: ["zh", "en"],
  namespaces: ["common"],
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng",
  },
};

/**
 * Initialize i18n instance
 */
export function initI18n(options?: I18nConfigOptions): typeof i18n {
  const config = { ...defaultConfig, ...options };

  i18n
    // Language detection plugin
    .use(LanguageDetector)
    // React integration plugin
    .use(initReactI18next)
    // Initialize i18next
    .init({
      // Resources
      resources: {
        zh: {
          common: zhCommon,
        },
        en: {
          common: enCommon,
        },
      },
      // Default namespace
      defaultNS: "common",
      // Fallback namespace
      fallbackNS: "common",
      // Supported languages
      supportedLngs: config.supportedLanguages,
      // Default language
      lng: config.defaultLanguage,
      // Fallback language
      fallbackLng: config.fallbackLanguage,
      // Namespaces
      ns: config.namespaces,
      // Detection options
      detection: config.detection,
      // Interpolation options
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      // React options
      react: {
        useSuspense: false,
      },
    });

  return i18n;
}

// Initialize i18n with default configuration
initI18n();

// Export i18n instance
export default i18n;