import { describe, it, expect } from "vitest";
import {
  findComponentById,
  findComponentsByType,
  findRootComponents,
} from "../find";
import type { Component } from "../types";

describe("find", () => {
  const components: Component[] = [
    { id: "1", type: "container", name: "Root", parentId: null },
    { id: "2", type: "button", name: "Button 1", parentId: "1" },
    { id: "3", type: "button", name: "Button 2", parentId: "1" },
  ];

  describe("findComponentById", () => {
    it("should find component by id", () => {
      const component = findComponentById(components, "1");
      expect(component).toBeDefined();
      expect(component?.id).toBe("1");
    });

    it("should return undefined if not found", () => {
      expect(findComponentById(components, "999")).toBeUndefined();
    });
  });

  describe("findComponentsByType", () => {
    it("should find components by type", () => {
      const buttons = findComponentsByType(components, "button");
      expect(buttons.length).toBe(2);
    });
  });

  describe("findRootComponents", () => {
    it("should find root components", () => {
      const roots = findRootComponents(components);
      expect(roots.length).toBe(1);
      expect(roots[0].id).toBe("1");
    });
  });
});
