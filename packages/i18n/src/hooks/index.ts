/**
 * @lowcode-platform/i18n
 * React Hooks for internationalization
 */

import { useTranslation as useReactI18nextTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import type { TFunction, Language } from "../types";
import i18n from "../config";

/**
 * Translation hook
 * @param namespace Translation namespace
 * @returns Translation function and i18n instance
 */
export function useTranslation(
  namespace: string = "common"
): {
  t: TFunction;
  i18n: typeof i18n;
  ready: boolean;
} {
  const { t, i18n: i18nInstance, ready } = useReactI18nextTranslation(namespace);

  return {
    t,
    i18n: i18nInstance,
    ready: ready || false,
  };
}

/**
 * Language hook
 * @returns Current language and change language function
 */
export function useLanguage(): {
  language: Language;
  changeLanguage: (language: Language) => Promise<void>;
  availableLanguages: Language[];
} {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(i18n.language as Language);

  useEffect(() => {
    const updateLanguage = () => {
      setLanguage(i18n.language as Language);
    };

    updateLanguage();
    i18n.on("languageChanged", updateLanguage);

    return () => {
      i18n.off("languageChanged", updateLanguage);
    };
  }, [i18n]);

  const changeLanguage = useCallback(
    async (lang: Language) => {
      await i18n.changeLanguage(lang);
      setLanguage(lang);
    },
    [i18n]
  );

  const availableLanguages = i18n.options.supportedLngs as Language[] || [];

  return {
    language,
    changeLanguage,
    availableLanguages,
  };
}

/**
 * Translation ready hook
 * @param namespace Translation namespace
 * @returns Whether translations are ready
 */
export function useTranslationReady(namespace?: string): boolean {
  const { ready } = useTranslation(namespace);
  return ready;
}