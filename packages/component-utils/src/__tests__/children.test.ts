import { describe, it, expect } from "vitest";
import {
  getChildComponents,
  getAllChildIds,
  hasChildren,
} from "../children";
import type { Component } from "../types";

describe("children", () => {
  const components: Component[] = [
    { id: "1", type: "container", name: "Root", parentId: null },
    { id: "2", type: "button", name: "Button 1", parentId: "1" },
    { id: "3", type: "text", name: "Text", parentId: "2" },
  ];

  describe("getChildComponents", () => {
    it("should get direct children", () => {
      const children = getChildComponents(components, "1");
      expect(children.length).toBe(1);
      expect(children[0].id).toBe("2");
    });
  });

  describe("getAllChildIds", () => {
    it("should get all child ids recursively", () => {
      const childIds = getAllChildIds("1", components);
      expect(childIds).toContain("2");
      expect(childIds).toContain("3");
    });
  });

  describe("hasChildren", () => {
    it("should check if component has children", () => {
      expect(hasChildren(components, "1")).toBe(true);
      expect(hasChildren(components, "2")).toBe(true);
      expect(hasChildren(components, "3")).toBe(false);
    });
  });
});
