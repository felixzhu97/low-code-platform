import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  detectLanguage,
  getAvailableLanguages,
  getLanguageInfo,
  formatDate,
  formatNumber,
  formatCurrency,
} from "../utils";

describe("utils", () => {
  describe("detectLanguage", () => {
    describe("when localStorage has language preference", () => {
      beforeEach(() => {
        // Mock localStorage
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: vi.fn(() => "en"),
            setItem: vi.fn(),
            removeItem: vi.fn(),
          },
          writable: true,
        });
      });

      it("should return language from localStorage", () => {
        // Given: localStorage has language preference
        // When: detectLanguage is called
        const language = detectLanguage();

        // Then: should return language from localStorage
        expect(language).toBe("en");
      });
    });

    describe("when localStorage has no preference", () => {
      beforeEach(() => {
        // Mock localStorage to return null
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
            removeItem: vi.fn(),
          },
          writable: true,
        });

        // Mock navigator.language
        Object.defineProperty(navigator, "language", {
          value: "zh-CN",
          writable: true,
        });
      });

      it("should detect language from navigator", () => {
        // Given: localStorage has no preference but navigator has language
        // When: detectLanguage is called
        const language = detectLanguage();

        // Then: should return detected language from navigator
        expect(language).toBe("zh");
      });
    });

    describe("when localStorage has invalid language", () => {
      beforeEach(() => {
        // Mock localStorage to return invalid language code
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: vi.fn(() => "invalid-lang"),
            setItem: vi.fn(),
            removeItem: vi.fn(),
          },
          writable: true,
          configurable: true,
        });
      });

      it("should return detected language from navigator or default", () => {
        // Given: localStorage has invalid language but navigator may have language
        // When: detectLanguage is called
        const language = detectLanguage();

        // Then: should return detected language from navigator or default
        expect(typeof language).toBe("string");
        expect(["zh", "en"]).toContain(language);
      });
    });
  });

  describe("getAvailableLanguages", () => {
    it("should return array of supported languages", () => {
      // Given: supported languages are defined
      // When: getAvailableLanguages is called
      const languages = getAvailableLanguages();

      // Then: should return array with language info
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages[0]).toHaveProperty("code");
      expect(languages[0]).toHaveProperty("name");
      expect(languages[0]).toHaveProperty("nativeName");
    });

    it("should include Chinese and English", () => {
      // Given: supported languages include zh and en
      // When: getAvailableLanguages is called
      const languages = getAvailableLanguages();

      // Then: should include zh and en
      const codes = languages.map((l) => l.code);
      expect(codes).toContain("zh");
      expect(codes).toContain("en");
    });
  });

  describe("getLanguageInfo", () => {
    describe("when language code exists", () => {
      it("should return language information for zh", () => {
        // Given: language code zh exists
        // When: getLanguageInfo is called with zh
        const info = getLanguageInfo("zh");

        // Then: should return language info
        expect(info).toBeDefined();
        expect(info?.code).toBe("zh");
        expect(info?.name).toBeDefined();
        expect(info?.nativeName).toBeDefined();
      });

      it("should return language information for en", () => {
        // Given: language code en exists
        // When: getLanguageInfo is called with en
        const info = getLanguageInfo("en");

        // Then: should return language info
        expect(info).toBeDefined();
        expect(info?.code).toBe("en");
      });
    });

    describe("when language code does not exist", () => {
      it("should return undefined", () => {
        // Given: language code does not exist
        // When: getLanguageInfo is called with invalid code
        const info = getLanguageInfo("invalid" as any);

        // Then: should return undefined
        expect(info).toBeUndefined();
      });
    });
  });

  describe("formatDate", () => {
    it("should format date for Chinese locale", () => {
      // Given: a date and Chinese locale
      const date = new Date("2024-01-01");

      // When: formatDate is called with zh locale
      const formatted = formatDate(date, "zh");

      // Then: should return formatted date string
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });

    it("should format date for English locale", () => {
      // Given: a date and English locale
      const date = new Date("2024-01-01");

      // When: formatDate is called with en locale
      const formatted = formatDate(date, "en");

      // Then: should return formatted date string
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });

    it("should accept Date object", () => {
      // Given: a Date object
      const date = new Date("2024-01-01");

      // When: formatDate is called with Date object
      const formatted = formatDate(date);

      // Then: should format successfully
      expect(typeof formatted).toBe("string");
    });

    it("should accept timestamp number", () => {
      // Given: a timestamp number
      const timestamp = new Date("2024-01-01").getTime();

      // When: formatDate is called with timestamp
      const formatted = formatDate(timestamp);

      // Then: should format successfully
      expect(typeof formatted).toBe("string");
    });

    it("should accept date string", () => {
      // Given: a date string
      const dateString = "2024-01-01";

      // When: formatDate is called with date string
      const formatted = formatDate(dateString);

      // Then: should format successfully
      expect(typeof formatted).toBe("string");
    });
  });

  describe("formatNumber", () => {
    it("should format number for Chinese locale", () => {
      // Given: a number and Chinese locale
      const number = 1234.56;

      // When: formatNumber is called with zh locale
      const formatted = formatNumber(number, "zh");

      // Then: should return formatted number string
      expect(typeof formatted).toBe("string");
      expect(formatted).toContain("1");
      expect(formatted).toContain("2");
    });

    it("should format number for English locale", () => {
      // Given: a number and English locale
      const number = 1234.56;

      // When: formatNumber is called with en locale
      const formatted = formatNumber(number, "en");

      // Then: should return formatted number string
      expect(typeof formatted).toBe("string");
    });

    it("should use default locale when not specified", () => {
      // Given: a number without locale
      const number = 1234.56;

      // When: formatNumber is called without locale
      const formatted = formatNumber(number);

      // Then: should format with default locale
      expect(typeof formatted).toBe("string");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency for Chinese locale with CNY", () => {
      // Given: an amount, CNY currency and Chinese locale
      const amount = 1234.56;

      // When: formatCurrency is called
      const formatted = formatCurrency(amount, "CNY", "zh");

      // Then: should return formatted currency string
      expect(typeof formatted).toBe("string");
      expect(formatted).toContain("1");
    });

    it("should format currency for English locale with USD", () => {
      // Given: an amount, USD currency and English locale
      const amount = 1234.56;

      // When: formatCurrency is called
      const formatted = formatCurrency(amount, "USD", "en");

      // Then: should return formatted currency string
      expect(typeof formatted).toBe("string");
    });

    it("should use default currency and locale when not specified", () => {
      // Given: an amount without currency and locale
      const amount = 1234.56;

      // When: formatCurrency is called without parameters
      const formatted = formatCurrency(amount);

      // Then: should format with default values
      expect(typeof formatted).toBe("string");
    });
  });
});