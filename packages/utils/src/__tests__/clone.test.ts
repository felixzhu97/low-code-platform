import { describe, it, expect } from "vitest";
import { shallowClone, deepClone } from "../clone";

describe("clone", () => {
  describe("shallowClone", () => {
    it("should clone a simple object", () => {
      const obj = { a: 1, b: 2 };
      const cloned = shallowClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it("should clone an array", () => {
      const arr = [1, 2, 3];
      const cloned = shallowClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it("should return primitives as-is", () => {
      expect(shallowClone(1)).toBe(1);
      expect(shallowClone("string")).toBe("string");
      expect(shallowClone(null)).toBe(null);
    });

    it("should not deep clone nested objects", () => {
      const obj = { a: { b: 1 } };
      const cloned = shallowClone(obj);
      expect(cloned.a).toBe(obj.a);
    });
  });

  describe("deepClone", () => {
    it("should deep clone an object", () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
    });

    it("should clone arrays deeply", () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned[0]).not.toBe(arr[0]);
    });

    it("should clone dates", () => {
      const date = new Date();
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });
});
