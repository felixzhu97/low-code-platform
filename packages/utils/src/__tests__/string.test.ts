import { describe, it, expect } from "vitest";
import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  randomString,
} from "../string";

describe("string", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("camelCase", () => {
    it("should convert to camelCase", () => {
      expect(camelCase("hello-world")).toBe("helloWorld");
      expect(camelCase("hello_world")).toBe("helloWorld");
    });
  });

  describe("kebabCase", () => {
    it("should convert to kebab-case", () => {
      expect(kebabCase("helloWorld")).toBe("hello-world");
      expect(kebabCase("hello_world")).toBe("hello-world");
    });
  });

  describe("truncate", () => {
    it("should truncate string", () => {
      expect(truncate("hello world", 5)).toBe("hello...");
    });

    it("should not truncate if shorter", () => {
      expect(truncate("hi", 5)).toBe("hi");
    });
  });

  describe("randomString", () => {
    it("should generate random string", () => {
      const str = randomString(10);
      expect(str.length).toBe(10);
      expect(typeof str).toBe("string");
    });
  });
});
