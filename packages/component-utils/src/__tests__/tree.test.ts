import { describe, it, expect } from "vitest";
import { buildComponentTree, flattenComponentTree } from "../tree";
import type { Component } from "../types";

describe("tree", () => {
  const components: Component[] = [
    { id: "1", type: "container", name: "Root", parentId: null },
    { id: "2", type: "button", name: "Button 1", parentId: "1" },
    { id: "3", type: "button", name: "Button 2", parentId: "1" },
    { id: "4", type: "text", name: "Text", parentId: "2" },
  ];

  describe("buildComponentTree", () => {
    it("should build component tree", () => {
      const tree = buildComponentTree(components);
      expect(tree.length).toBe(1);
      expect(tree[0].id).toBe("1");
      expect(tree[0].children?.length).toBe(2);
    });

    it("should handle empty array", () => {
      expect(buildComponentTree([])).toEqual([]);
    });
  });

  describe("flattenComponentTree", () => {
    it("should flatten component tree", () => {
      const tree = buildComponentTree(components);
      const flat = flattenComponentTree(tree);
      expect(flat.length).toBe(components.length);
    });
  });
});
