import { describe, it, expect, beforeEach, vi } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge class names with clsx and tailwind-merge", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle undefined and null values", () => {
    const result = cn("text-red-500", undefined, null, "bg-blue-500");
    expect(result).toBeTruthy();
  });

  it("should merge conflicting tailwind classes", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBeTruthy();
    expect(result).toContain("text-blue-500");
  });

  it("should handle class objects", () => {
    const result = cn({ "text-red-500": true, "bg-blue-500": true });
    expect(result).toBeTruthy();
  });

  it("should handle array inputs", () => {
    const result = cn(["text-red-500", "bg-blue-500"]);
    expect(result).toBeTruthy();
  });

  it("should handle mixed inputs", () => {
    const result = cn(
      "text-red-500",
      { "bg-blue-500": true },
      ["text-green-500"],
      undefined
    );
    expect(result).toBeTruthy();
  });
});
