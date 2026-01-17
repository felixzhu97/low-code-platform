import { describe, it, expect } from "vitest";
import { pick, omit, merge, get, set } from "../object";

describe("object", () => {
  const obj = { a: 1, b: 2, c: 3 };

  describe("pick", () => {
    it("should pick specified keys", () => {
      expect(pick(obj, ["a", "b"])).toEqual({ a: 1, b: 2 });
    });
  });

  describe("omit", () => {
    it("should omit specified keys", () => {
      expect(omit(obj, ["a"])).toEqual({ b: 2, c: 3 });
    });
  });

  describe("merge", () => {
    it("should merge objects", () => {
      expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it("should deep merge objects", () => {
      expect(merge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({
        a: { b: 1, c: 2 },
      });
    });
  });

  describe("get", () => {
    it("should get nested value", () => {
      expect(get({ a: { b: { c: 1 } } }, "a.b.c")).toBe(1);
    });

    it("should return default value if path not found", () => {
      expect(get({ a: { b: 1 } }, "a.b.c", "default")).toBe("default");
    });
  });

  describe("set", () => {
    it("should set nested value", () => {
      const obj: Record<string, unknown> = {};
      set(obj, "a.b.c", 1);
      expect(get(obj, "a.b.c")).toBe(1);
    });
  });
});
