/**
 * @lowcode-platform/i18n
 * Utility functions for internationalization
 */

import type { Language, LanguageInfo } from "../types";

/**
 * Supported languages metadata
 */
const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "zh", name: "Chinese", nativeName: "简体中文" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh-TW", name: "Traditional Chinese", nativeName: "繁體中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];

/**
 * Default language
 */
const DEFAULT_LANGUAGE: Language = "zh";

/**
 * Detect browser language
 * @returns Detected language code or default language
 */
export function detectLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  // Try to get from localStorage first
  const storedLanguage = localStorage.getItem("i18nextLng");
  if (storedLanguage && isValidLanguage(storedLanguage)) {
    return storedLanguage as Language;
  }

  // Try to detect from navigator
  const navigatorLanguage = navigator.language || navigator.languages?.[0];
  if (navigatorLanguage) {
    // Extract language code (e.g., "zh-CN" -> "zh", "en-US" -> "en")
    const languageCode = navigatorLanguage.split("-")[0];
    if (isValidLanguage(languageCode)) {
      return languageCode as Language;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Check if a language code is valid
 */
function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.some((l) => l.code === lang || l.code.startsWith(lang));
}

/**
 * Get available languages
 * @returns Array of supported language information
 */
export function getAvailableLanguages(): LanguageInfo[] {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Get language information by code
 * @param code Language code
 * @returns Language information or undefined
 */
export function getLanguageInfo(code: Language): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Format date based on locale
 * @param date Date to format
 * @param locale Locale code
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | number | string,
  locale: Language = "zh",
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const localeMap: Record<Language, string> = {
    zh: "zh-CN",
    "zh-TW": "zh-TW",
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
  };

  const intlLocale = localeMap[locale] || locale;
  return new Intl.DateTimeFormat(intlLocale, options).format(dateObj);
}

/**
 * Format number based on locale
 * @param number Number to format
 * @param locale Locale code
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: Language = "zh",
  options?: Intl.NumberFormatOptions
): string {
  const localeMap: Record<Language, string> = {
    zh: "zh-CN",
    "zh-TW": "zh-TW",
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
  };

  const intlLocale = localeMap[locale] || locale;
  return new Intl.NumberFormat(intlLocale, options).format(number);
}

/**
 * Format currency based on locale
 * @param amount Amount to format
 * @param currency Currency code (e.g., "CNY", "USD")
 * @param locale Locale code
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "CNY",
  locale: Language = "zh"
): string {
  return formatNumber(amount, locale, {
    style: "currency",
    currency,
  });
}

/**
 * Load translations dynamically
 * @param language Language code
 * @param namespace Namespace
 * @returns Promise that resolves when translations are loaded
 */
export async function loadTranslations(
  language: Language,
  namespace: string = "common"
): Promise<void> {
  try {
    const module = await import(`../locales/${language}/${namespace}.json`);
    return Promise.resolve(module.default);
  } catch (error) {
    console.error(`Failed to load translations for ${language}/${namespace}:`, error);
    return Promise.reject(error);
  }
}