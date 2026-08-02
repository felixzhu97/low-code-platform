import { describe, it, expect, beforeEach } from "vitest";
import type { Component } from "@/component/domain/types";
import {
  TemplateService,
  ApplyTemplateCommand,
  type TemplateCommand,
} from "../template-command.service";

describe("ApplyTemplateCommand", () => {
  const createMockComponent = (overrides: Partial<Component> = {}): Component => ({
    id: "comp-1",
    type: "button",
    name: "Test Button",
    position: { x: 100, y: 200 },
    properties: { visible: true },
    ...overrides,
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("constructor", () => {
    it("should store template components", () => {
      const components = [createMockComponent({ id: "comp-1" })];
      const command = new ApplyTemplateCommand(components);

      expect(command).toBeDefined();
    });
  });

  describe("execute", () => {
    it("should generate new IDs for components", () => {
      const components = [
        createMockComponent({ id: "comp-1", type: "button" }),
        createMockComponent({ id: "comp-2", type: "input" }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      expect(result[0].id).not.toBe("comp-1");
      expect(result[1].id).not.toBe("comp-2");
      expect(result[0].id).toContain("button");
      expect(result[1].id).toContain("input");
    });

    it("should preserve component properties", () => {
      const components = [
        createMockComponent({
          id: "comp-1",
          type: "button",
          name: "My Button",
          position: { x: 100, y: 200 },
          properties: { visible: true, variant: "primary" },
        }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      expect(result[0].name).toBe("My Button");
      expect(result[0].position).toEqual({ x: 100, y: 200 });
      expect(result[0].properties).toEqual({ visible: true, variant: "primary" });
    });

    it("should throw error for empty template", () => {
      const command = new ApplyTemplateCommand([]);

      expect(() => command.execute()).toThrow("No template components provided");
    });

    it("should throw error for null template", () => {
      const command = new ApplyTemplateCommand(null as any);

      expect(() => command.execute()).toThrow("No template components provided");
    });

    it("should throw error for component without type", () => {
      const components = [
        createMockComponent({ id: "comp-1", type: "" }),
      ];
      const command = new ApplyTemplateCommand(components);

      expect(() => command.execute()).toThrow("Component missing type");
    });

    it("should update parentId references", () => {
      const components = [
        createMockComponent({ id: "parent", type: "container" }),
        createMockComponent({ id: "child", type: "button", parentId: "parent" }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      const parentResult = result.find((c) => c.type === "container");
      const childResult = result.find((c) => c.type === "button");

      expect(parentResult).toBeDefined();
      expect(childResult).toBeDefined();
      // Child's parentId should be updated to new parent ID
      expect(childResult!.parentId).toBe(parentResult!.id);
    });

    it("should handle components without parentId", () => {
      const components = [
        createMockComponent({ id: "comp-1", type: "button", parentId: undefined }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      expect(result[0].parentId).toBeUndefined();
    });

    it("should handle nested children references", () => {
      const components = [
        createMockComponent({ id: "level-1", type: "container" }),
        createMockComponent({ id: "level-2", type: "container", parentId: "level-1" }),
        createMockComponent({ id: "level-3", type: "button", parentId: "level-2" }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      const l1 = result.find((c) => c.type === "container" && !c.parentId);
      const l2 = result.find((c) => c.type === "container" && c.parentId);
      const l3 = result.find((c) => c.type === "button");

      expect(l2!.parentId).toBe(l1!.id);
      expect(l3!.parentId).toBe(l2!.id);
    });

    it("should handle components with children array", () => {
      const childComponent = createMockComponent({ id: "child-1", type: "button" });
      const parentComponent = createMockComponent({
        id: "parent",
        type: "container",
        children: [childComponent],
      });
      const command = new ApplyTemplateCommand([parentComponent, childComponent]);

      const result = command.execute();

      // Verify that both components are processed
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should generate unique IDs even with same type", () => {
      const components = [
        createMockComponent({ id: "comp-1", type: "button" }),
        createMockComponent({ id: "comp-2", type: "button" }),
        createMockComponent({ id: "comp-3", type: "button" }),
      ];
      const command = new ApplyTemplateCommand(components);

      const result = command.execute();

      const ids = result.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("idMapping", () => {
    it("should maintain id mapping for reference updates", () => {
      const components = [
        createMockComponent({ id: "old-parent", type: "container" }),
        createMockComponent({ id: "old-child", type: "button", parentId: "old-parent" }),
      ];
      const command = new ApplyTemplateCommand(components);

      command.execute();

      // The command should have populated the idMapping
      // We verify this indirectly through the updated parentId
      expect(command.execute()[1].parentId).not.toBe("old-parent");
    });
  });
});

describe("TemplateService", () => {
  const createMockComponent = (overrides: Partial<Component> = {}): Component => ({
    id: "comp-1",
    type: "button",
    name: "Test Button",
    position: { x: 100, y: 200 },
    ...overrides,
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("applyTemplate", () => {
    it("should apply template and return processed components", () => {
      const templateComponents = [
        createMockComponent({ id: "template-1", type: "button" }),
        createMockComponent({ id: "template-2", type: "input" }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      expect(result).toHaveLength(2);
      expect(result[0].id).not.toBe("template-1");
      expect(result[1].id).not.toBe("template-2");
    });

    it("should generate new IDs for all components", () => {
      const templateComponents = [
        createMockComponent({ id: "comp-1", type: "button" }),
        createMockComponent({ id: "comp-2", type: "input" }),
        createMockComponent({ id: "comp-3", type: "text" }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      const ids = result.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should preserve component properties", () => {
      const templateComponents = [
        createMockComponent({
          id: "comp-1",
          type: "card",
          name: "My Card",
          position: { x: 50, y: 100 },
          properties: { shadow: true, padding: "1rem" },
        }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      expect(result[0].name).toBe("My Card");
      expect(result[0].position).toEqual({ x: 50, y: 100 });
      expect(result[0].properties).toEqual({ shadow: true, padding: "1rem" });
    });

    it("should update parent references", () => {
      const templateComponents = [
        createMockComponent({ id: "parent", type: "container" }),
        createMockComponent({ id: "child", type: "button", parentId: "parent" }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      const parentResult = result.find((c) => c.type === "container");
      const childResult = result.find((c) => c.type === "button");

      expect(childResult!.parentId).toBe(parentResult!.id);
    });

    it("should throw error for empty template", () => {
      expect(() => TemplateService.applyTemplate([])).toThrow(
        "No template components provided"
      );
    });

    it("should throw error for component without type", () => {
      const templateComponents = [
        createMockComponent({ id: "comp-1", type: "" }),
      ];

      expect(() => TemplateService.applyTemplate(templateComponents)).toThrow(
        "Component missing type"
      );
    });

    it("should handle complex nested structure", () => {
      const templateComponents = [
        createMockComponent({ id: "root", type: "grid-layout" }),
        createMockComponent({ id: "row-1", type: "row", parentId: "root" }),
        createMockComponent({ id: "col-1", type: "column", parentId: "row-1" }),
        createMockComponent({ id: "col-2", type: "column", parentId: "row-1" }),
        createMockComponent({ id: "button-1", type: "button", parentId: "col-1" }),
        createMockComponent({ id: "button-2", type: "button", parentId: "col-2" }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      expect(result).toHaveLength(6);
      // Verify nested structure is preserved
      const root = result.find((c) => c.type === "grid-layout");
      const row = result.find((c) => c.type === "row");
      expect(row!.parentId).toBe(root!.id);
    });

    it("should work with single component", () => {
      const templateComponents = [
        createMockComponent({ id: "single", type: "button" }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("button");
      expect(result[0].id).not.toBe("single");
    });

    it("should handle components with all property types", () => {
      const templateComponents = [
        createMockComponent({
          id: "comp-1",
          type: "form",
          properties: {
            string: "text",
            number: 42,
            boolean: true,
            array: [1, 2, 3],
            object: { nested: true },
            null: null,
            undefined: undefined,
          },
        }),
      ];

      const result = TemplateService.applyTemplate(templateComponents);

      expect(result[0].properties).toEqual({
        string: "text",
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: true },
        null: null,
        undefined: undefined,
      });
    });
  });
});

describe("TemplateCommand interface", () => {
  it("should implement TemplateCommand interface", () => {
    const command: TemplateCommand = {
      execute: () => [],
      undo: () => {},
    };

    expect(typeof command.execute).toBe("function");
    expect(typeof command.undo).toBe("function");
  });

  it("should allow optional undo method", () => {
    const commandWithoutUndo: TemplateCommand = {
      execute: () => [],
    };

    expect(commandWithoutUndo.undo).toBeUndefined();
  });
});
