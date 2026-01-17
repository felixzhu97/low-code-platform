/**
 * @lowcode-platform/i18n
 * TypeScript type definitions for internationalization
 */

/**
 * Supported language codes
 */
export type Language = "zh" | "en" | "zh-TW" | "ja" | "ko" | string;

/**
 * Language metadata
 */
export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag?: string;
}

/**
 * Translation namespace
 */
export type TranslationNamespace = "common" | string;

/**
 * Resource bundle structure
 */
export interface ResourceBundle {
  [namespace: string]: Record<string, string | ResourceBundle>;
}

/**
 * i18n configuration options
 */
export interface I18nConfigOptions {
  defaultLanguage?: Language;
  fallbackLanguage?: Language;
  supportedLanguages?: Language[];
  namespaces?: TranslationNamespace[];
  detection?: {
    order?: string[];
    caches?: string[];
    lookupLocalStorage?: string;
    lookupSessionStorage?: string;
  };
}

/**
 * Translation function type
 */
export type TFunction = (
  key: string,
  options?: Record<string, unknown>
) => string;

/**
 * Language change handler
 */
export type LanguageChangeHandler = (language: Language) => void;