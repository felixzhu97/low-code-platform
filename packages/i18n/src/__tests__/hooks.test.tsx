import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTranslation, useLanguage, useTranslationReady } from "../hooks";
import i18n from "../config";

describe("hooks", () => {
  beforeEach(async () => {
    // Reset i18n to default state before each test
    await i18n.changeLanguage("zh");
  });

  describe("useTranslation", () => {
    it("should return translation function and i18n instance", () => {
      // Given: default namespace
      // When: useTranslation hook is called
      const { result } = renderHook(() => useTranslation());

      // Then: should return t function, i18n instance and ready flag
      expect(result.current.t).toBeDefined();
      expect(typeof result.current.t).toBe("function");
      expect(result.current.i18n).toBeDefined();
      expect(typeof result.current.ready).toBe("boolean");
    });

    it("should translate text using t function", () => {
      // Given: translation hook is initialized
      const { result } = renderHook(() => useTranslation());

      // When: t function is called with translation key
      const translated = result.current.t("welcome");

      // Then: should return translated text
      expect(typeof translated).toBe("string");
      expect(translated.length).toBeGreaterThan(0);
    });

    it("should accept custom namespace", () => {
      // Given: custom namespace
      const namespace = "common";

      // When: useTranslation is called with namespace
      const { result } = renderHook(() => useTranslation(namespace));

      // Then: should return translation function
      expect(result.current.t).toBeDefined();
      expect(typeof result.current.t).toBe("function");
    });
  });

  describe("useLanguage", () => {
    it("should return current language and change language function", () => {
      // Given: language hook is initialized
      // When: useLanguage hook is called
      const { result } = renderHook(() => useLanguage());

      // Then: should return current language, changeLanguage function and available languages
      expect(result.current.language).toBeDefined();
      expect(typeof result.current.language).toBe("string");
      expect(result.current.changeLanguage).toBeDefined();
      expect(typeof result.current.changeLanguage).toBe("function");
      expect(Array.isArray(result.current.availableLanguages)).toBe(true);
    });

    it("should change language when changeLanguage is called", async () => {
      // Given: language hook is initialized with current language
      const { result } = renderHook(() => useLanguage());
      const initialLanguage = result.current.language;

      // When: changeLanguage is called with different language
      await act(async () => {
        await result.current.changeLanguage("en");
      });

      // Then: language should be changed
      await waitFor(() => {
        expect(result.current.language).toBe("en");
        expect(result.current.language).not.toBe(initialLanguage);
      });
    });

    it("should return available languages", () => {
      // Given: language hook is initialized
      // When: useLanguage hook is called
      const { result } = renderHook(() => useLanguage());

      // Then: should return array of available languages
      expect(Array.isArray(result.current.availableLanguages)).toBe(true);
      expect(result.current.availableLanguages.length).toBeGreaterThan(0);
    });
  });

  describe("useTranslationReady", () => {
    it("should return ready status for default namespace", () => {
      // Given: translation ready hook with default namespace
      // When: useTranslationReady hook is called
      const { result } = renderHook(() => useTranslationReady());

      // Then: should return boolean ready status
      expect(typeof result.current).toBe("boolean");
    });

    it("should return ready status for custom namespace", () => {
      // Given: translation ready hook with custom namespace
      const namespace = "common";

      // When: useTranslationReady is called with namespace
      const { result } = renderHook(() => useTranslationReady(namespace));

      // Then: should return boolean ready status
      expect(typeof result.current).toBe("boolean");
    });
  });
});