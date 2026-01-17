import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("should handle conditional classes", () => {
    expect(cn("a", false && "b", true && "c")).toBe("a c");
  });

  it("should handle arrays", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });

  it("should handle objects", () => {
    expect(cn({ a: true, b: false })).toBe("a");
  });
});
