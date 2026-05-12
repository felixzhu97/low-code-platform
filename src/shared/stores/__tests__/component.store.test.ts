import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useComponentStore } from "../component.store";
import type { Component } from "@/domain/entities/types";
import { ComponentManagementService } from "@/application/services/component-management.service";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

// Mock ComponentManagementService
vi.mock("@/application/services/component-management.service", () => ({
  ComponentManagementService: {
    deleteComponentAndChildren: vi.fn((id, components) => {
      // Find all IDs to delete (the parent and its children)
      const idsToDelete = new Set([id]);
      
      // Recursively find all child IDs
      const findChildren = (parentId: string) => {
        components.forEach((c: Component) => {
          if (c.parentId === parentId) {
            idsToDelete.add(c.id);
            findChildren(c.id);
          }
        });
      };
      findChildren(id);
      
      // Filter out all components with IDs in the set
      return components.filter((c: Component) => !idsToDelete.has(c.id));
    }),
    updateComponentPosition: vi.fn((id, position, components) =>
      components.map((c: Component) => 
        c.id === id ? { ...c, position } : c
      )
    ),
    getRootComponents: vi.fn((components) =>
      components.filter((c: Component) => !c.parentId)
    ),
    getChildComponents: vi.fn((parentId, components) =>
      components.filter((c: Component) => c.parentId === parentId)
    ),
  },
}));

describe("useComponentStore", () => {
  const createMockComponent = (overrides: Partial<Component> = {}): Component => ({
    id: `comp-${Math.random().toString(36).substr(2, 9)}`,
    type: "button",
    name: "Test Button",
    position: { x: 100, y: 100 },
    properties: {},
    children: [],
    parentId: null,
    dataSource: null,
    dataMapping: [],
    ...overrides,
  });

  beforeEach(() => {
    // Reset store state before each test
    useComponentStore.setState({
      components: [],
      selectedComponent: null,
      selectedComponentId: null,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      dropTargetId: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useComponentStore());

      expect(result.current.components).toEqual([]);
      expect(result.current.selectedComponent).toBe(null);
      expect(result.current.selectedComponentId).toBe(null);
      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
      expect(result.current.dropTargetId).toBe(null);
    });
  });

  describe("addComponent", () => {
    it("should add a component to the store", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1", name: "Button" });

      act(() => {
        result.current.addComponent(component);
      });

      expect(result.current.components).toHaveLength(1);
      expect(result.current.components[0]).toEqual(component);
    });

    it("should add multiple components", () => {
      const { result } = renderHook(() => useComponentStore());
      const component1 = createMockComponent({ id: "comp-1" });
      const component2 = createMockComponent({ id: "comp-2" });
      const component3 = createMockComponent({ id: "comp-3" });

      act(() => {
        result.current.addComponent(component1);
        result.current.addComponent(component2);
        result.current.addComponent(component3);
      });

      expect(result.current.components).toHaveLength(3);
    });

    it("should preserve existing components when adding new one", () => {
      const { result } = renderHook(() => useComponentStore());
      const component1 = createMockComponent({ id: "comp-1" });
      const component2 = createMockComponent({ id: "comp-2" });

      act(() => {
        result.current.addComponent(component1);
      });

      act(() => {
        result.current.addComponent(component2);
      });

      expect(result.current.components).toHaveLength(2);
      expect(result.current.components).toContain(component1);
      expect(result.current.components).toContain(component2);
    });
  });

  describe("updateComponent", () => {
    it("should update a component's properties", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ 
        id: "comp-1", 
        name: "Original Name",
        properties: { color: "blue" }
      });

      act(() => {
        result.current.addComponent(component);
      });

      act(() => {
        result.current.updateComponent("comp-1", { 
          name: "Updated Name",
          properties: { color: "red" }
        });
      });

      expect(result.current.components[0].name).toBe("Updated Name");
      expect(result.current.components[0].properties).toEqual({ color: "red" });
    });

    it("should update selectedComponent when updating selected component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ 
        id: "comp-1", 
        name: "Selected Component" 
      });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
      });

      act(() => {
        result.current.updateComponent("comp-1", { name: "New Name" });
      });

      expect(result.current.selectedComponent?.name).toBe("New Name");
    });

    it("should not update non-existent component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.updateComponent("non-existent", { name: "New Name" });
      });

      expect(result.current.components[0].name).toBe("Test Button");
    });

    it("should handle partial updates", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ 
        id: "comp-1",
        position: { x: 100, y: 200 }
      });

      act(() => {
        result.current.addComponent(component);
        result.current.updateComponent("comp-1", { position: { x: 300, y: 400 } });
      });

      expect(result.current.components[0].position).toEqual({ x: 300, y: 400 });
    });
  });

  describe("deleteComponent", () => {
    it("should delete a component by id", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
      });

      expect(result.current.components).toHaveLength(1);

      act(() => {
        result.current.deleteComponent("comp-1");
      });

      expect(result.current.components).toHaveLength(0);
    });

    it("should clear selection when deleted component is selected", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
      });

      expect(result.current.selectedComponent).not.toBeNull();

      act(() => {
        result.current.deleteComponent("comp-1");
      });

      expect(result.current.selectedComponent).toBeNull();
      expect(result.current.selectedComponentId).toBeNull();
    });

    it("should not affect other components when deleting one", () => {
      const { result } = renderHook(() => useComponentStore());
      const component1 = createMockComponent({ id: "comp-1" });
      const component2 = createMockComponent({ id: "comp-2" });
      const component3 = createMockComponent({ id: "comp-3" });

      act(() => {
        result.current.addComponent(component1);
        result.current.addComponent(component2);
        result.current.addComponent(component3);
      });

      act(() => {
        result.current.deleteComponent("comp-2");
      });

      expect(result.current.components).toHaveLength(2);
      expect(result.current.components.find(c => c.id === "comp-1")).toBeDefined();
      expect(result.current.components.find(c => c.id === "comp-3")).toBeDefined();
    });

    it("should handle deleting non-existent component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.deleteComponent("non-existent");
      });

      expect(result.current.components).toHaveLength(1);
    });
  });

  describe("deleteComponentAndChildren", () => {
    it("should delete component and its children", () => {
      const { result } = renderHook(() => useComponentStore());
      const parent = createMockComponent({ id: "parent" });
      const child1 = createMockComponent({ id: "child1", parentId: "parent" });
      const child2 = createMockComponent({ id: "child2", parentId: "parent" });

      act(() => {
        result.current.addComponent(parent);
        result.current.addComponent(child1);
        result.current.addComponent(child2);
      });

      act(() => {
        result.current.deleteComponentAndChildren("parent");
      });

      expect(result.current.components).toHaveLength(0);
    });

    it("should clear selection when parent is deleted", () => {
      const { result } = renderHook(() => useComponentStore());
      const parent = createMockComponent({ id: "parent" });

      act(() => {
        result.current.addComponent(parent);
        result.current.selectComponent(parent);
      });

      act(() => {
        result.current.deleteComponentAndChildren("parent");
      });

      expect(result.current.selectedComponent).toBeNull();
    });

    it("should preserve unrelated components", () => {
      const { result } = renderHook(() => useComponentStore());
      const parent = createMockComponent({ id: "parent" });
      const unrelated = createMockComponent({ id: "unrelated" });

      act(() => {
        result.current.addComponent(parent);
        result.current.addComponent(unrelated);
      });

      act(() => {
        result.current.deleteComponentAndChildren("parent");
      });

      expect(result.current.components).toHaveLength(1);
      expect(result.current.components[0].id).toBe("unrelated");
    });
  });

  describe("updateComponentPosition", () => {
    it("should update component position", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ 
        id: "comp-1", 
        position: { x: 100, y: 100 } 
      });

      act(() => {
        result.current.addComponent(component);
        result.current.updateComponentPosition("comp-1", { x: 200, y: 300 });
      });

      expect(result.current.components[0].position).toEqual({ x: 200, y: 300 });
    });

    it("should handle position update for non-existent component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.updateComponentPosition("non-existent", { x: 200, y: 300 });
      });

      expect(result.current.components[0].position).toEqual({ x: 100, y: 100 });
    });
  });

  describe("selectComponent", () => {
    it("should select a component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
      });

      expect(result.current.selectedComponent).toEqual(component);
      expect(result.current.selectedComponentId).toBe("comp-1");
    });

    it("should select null to clear selection", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
        result.current.selectComponent(null);
      });

      expect(result.current.selectedComponent).toBeNull();
      expect(result.current.selectedComponentId).toBeNull();
    });

    it("should replace current selection with new component", () => {
      const { result } = renderHook(() => useComponentStore());
      const component1 = createMockComponent({ id: "comp-1" });
      const component2 = createMockComponent({ id: "comp-2" });

      act(() => {
        result.current.addComponent(component1);
        result.current.addComponent(component2);
        result.current.selectComponent(component1);
      });

      expect(result.current.selectedComponentId).toBe("comp-1");

      act(() => {
        result.current.selectComponent(component2);
      });

      expect(result.current.selectedComponentId).toBe("comp-2");
    });
  });

  describe("clearSelection", () => {
    it("should clear component selection", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
        result.current.clearSelection();
      });

      expect(result.current.selectedComponent).toBeNull();
      expect(result.current.selectedComponentId).toBeNull();
    });

    it("should do nothing when no component is selected", () => {
      const { result } = renderHook(() => useComponentStore());

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedComponent).toBeNull();
      expect(result.current.selectedComponentId).toBeNull();
    });
  });

  describe("clearAllComponents", () => {
    it("should remove all components", () => {
      const { result } = renderHook(() => useComponentStore());
      const component1 = createMockComponent({ id: "comp-1" });
      const component2 = createMockComponent({ id: "comp-2" });

      act(() => {
        result.current.addComponent(component1);
        result.current.addComponent(component2);
        result.current.clearAllComponents();
      });

      expect(result.current.components).toEqual([]);
    });

    it("should clear selection when clearing all components", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.selectComponent(component);
        result.current.clearAllComponents();
      });

      expect(result.current.selectedComponent).toBeNull();
      expect(result.current.selectedComponentId).toBeNull();
    });
  });

  describe("Drag State Management", () => {
    describe("setDragging", () => {
      it("should set dragging state to true", () => {
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDragging(true);
        });

        expect(result.current.isDragging).toBe(true);
      });

      it("should set dragging state to false", () => {
        useComponentStore.setState({ isDragging: true });
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDragging(false);
        });

        expect(result.current.isDragging).toBe(false);
      });
    });

    describe("setDragOffset", () => {
      it("should set drag offset", () => {
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDragOffset({ x: 50, y: 100 });
        });

        expect(result.current.dragOffset).toEqual({ x: 50, y: 100 });
      });

      it("should handle zero offset", () => {
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDragOffset({ x: 0, y: 0 });
        });

        expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
      });

      it("should handle negative offset", () => {
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDragOffset({ x: -50, y: -100 });
        });

        expect(result.current.dragOffset).toEqual({ x: -50, y: -100 });
      });
    });

    describe("setDropTarget", () => {
      it("should set drop target id", () => {
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDropTarget("target-1");
        });

        expect(result.current.dropTargetId).toBe("target-1");
      });

      it("should clear drop target with null", () => {
        useComponentStore.setState({ dropTargetId: "target-1" });
        const { result } = renderHook(() => useComponentStore());

        act(() => {
          result.current.setDropTarget(null);
        });

        expect(result.current.dropTargetId).toBeNull();
      });
    });
  });

  describe("updateComponents", () => {
    it("should batch update all components", () => {
      const { result } = renderHook(() => useComponentStore());
      const newComponents = [
        createMockComponent({ id: "new-1" }),
        createMockComponent({ id: "new-2" }),
        createMockComponent({ id: "new-3" }),
      ];

      act(() => {
        result.current.updateComponents(newComponents);
      });

      expect(result.current.components).toEqual(newComponents);
      expect(result.current.components).toHaveLength(3);
    });

    it("should replace existing components", () => {
      const { result } = renderHook(() => useComponentStore());
      const oldComponents = [
        createMockComponent({ id: "old-1" }),
        createMockComponent({ id: "old-2" }),
      ];
      const newComponents = [
        createMockComponent({ id: "new-1" }),
      ];

      act(() => {
        result.current.updateComponents(oldComponents);
      });

      act(() => {
        result.current.updateComponents(newComponents);
      });

      expect(result.current.components).toEqual(newComponents);
      expect(result.current.components).toHaveLength(1);
    });

    it("should handle empty array", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1" });

      act(() => {
        result.current.addComponent(component);
        result.current.updateComponents([]);
      });

      expect(result.current.components).toEqual([]);
    });
  });

  describe("getRootComponents", () => {
    it("should return only root components (no parentId)", () => {
      const { result } = renderHook(() => useComponentStore());
      const root1 = createMockComponent({ id: "root-1", parentId: null });
      const child = createMockComponent({ id: "child-1", parentId: "root-1" });
      const root2 = createMockComponent({ id: "root-2", parentId: null });

      act(() => {
        result.current.addComponent(root1);
        result.current.addComponent(child);
        result.current.addComponent(root2);
      });

      const rootComponents = result.current.getRootComponents();

      expect(rootComponents).toHaveLength(2);
      expect(rootComponents.find(c => c.id === "root-1")).toBeDefined();
      expect(rootComponents.find(c => c.id === "root-2")).toBeDefined();
    });
  });

  describe("getChildComponents", () => {
    it("should return child components for given parent", () => {
      const { result } = renderHook(() => useComponentStore());
      const parent = createMockComponent({ id: "parent" });
      const child1 = createMockComponent({ id: "child-1", parentId: "parent" });
      const child2 = createMockComponent({ id: "child-2", parentId: "parent" });
      const unrelated = createMockComponent({ id: "unrelated", parentId: null });

      act(() => {
        result.current.addComponent(parent);
        result.current.addComponent(child1);
        result.current.addComponent(child2);
        result.current.addComponent(unrelated);
      });

      const children = result.current.getChildComponents("parent");

      expect(children).toHaveLength(2);
      expect(children.find(c => c.id === "child-1")).toBeDefined();
      expect(children.find(c => c.id === "child-2")).toBeDefined();
    });

    it("should return empty array for parent with no children", () => {
      const { result } = renderHook(() => useComponentStore());
      const parent = createMockComponent({ id: "parent" });

      act(() => {
        result.current.addComponent(parent);
      });

      const children = result.current.getChildComponents("parent");

      expect(children).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle component with empty children array", () => {
      const { result } = renderHook(() => useComponentStore());
      const component = createMockComponent({ id: "comp-1", children: [] });

      act(() => {
        result.current.addComponent(component);
      });

      expect(result.current.components).toHaveLength(1);
    });

    it("should handle component with nested children", () => {
      const { result } = renderHook(() => useComponentStore());
      const grandchild = createMockComponent({ id: "grandchild", parentId: "child" });
      const child = createMockComponent({ id: "child", parentId: "parent" });
      const parent = createMockComponent({ id: "parent" });

      act(() => {
        result.current.addComponent(parent);
        result.current.addComponent(child);
        result.current.addComponent(grandchild);
      });

      expect(result.current.components).toHaveLength(3);
    });

    it("should handle rapid add/delete operations", () => {
      const { result } = renderHook(() => useComponentStore());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addComponent(createMockComponent({ id: `comp-${i}` }));
        }
      });

      expect(result.current.components).toHaveLength(100);

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.deleteComponent(`comp-${i}`);
        }
      });

      expect(result.current.components).toHaveLength(50);
    });
  });
});
