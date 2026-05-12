import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useCustomComponentsStore, type CustomComponent } from "../custom-components.store";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

describe("useCustomComponentsStore", () => {
  const createMockCustomComponent = (overrides: Partial<CustomComponent> = {}): CustomComponent => ({
    id: `custom-${Math.random().toString(36).substr(2, 9)}`,
    name: "Test Component",
    type: "custom",
    category: "basic",
    isContainer: false,
    isCustom: true,
    childComponents: [],
    properties: {},
    metadata: {
      description: "Test description",
      tags: ["test"],
      version: "1.0.0",
      author: "Test Author",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...overrides,
  });

  beforeEach(() => {
    useCustomComponentsStore.setState({
      customComponents: [],
      favorites: [],
      searchTerm: "",
      selectedCategory: "all",
      isBuilderOpen: false,
      isLibraryOpen: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      expect(result.current.customComponents).toEqual([]);
      expect(result.current.favorites).toEqual([]);
      expect(result.current.searchTerm).toBe("");
      expect(result.current.selectedCategory).toBe("all");
      expect(result.current.isBuilderOpen).toBe(false);
      expect(result.current.isLibraryOpen).toBe(false);
    });
  });

  describe("addCustomComponent", () => {
    it("should add a custom component", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1", name: "Button" });

      act(() => {
        result.current.addCustomComponent(component);
      });

      expect(result.current.customComponents).toHaveLength(1);
      expect(result.current.customComponents[0]).toEqual(component);
    });

    it("should add multiple custom components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component1 = createMockCustomComponent({ id: "custom-1" });
      const component2 = createMockCustomComponent({ id: "custom-2" });

      act(() => {
        result.current.addCustomComponent(component1);
        result.current.addCustomComponent(component2);
      });

      expect(result.current.customComponents).toHaveLength(2);
    });
  });

  describe("removeCustomComponent", () => {
    it("should remove a custom component by id", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
      });

      expect(result.current.customComponents).toHaveLength(1);

      act(() => {
        result.current.removeCustomComponent("custom-1");
      });

      expect(result.current.customComponents).toHaveLength(0);
    });

    it("should also remove from favorites when deleted", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.toggleFavorite("custom-1");
      });

      expect(result.current.favorites).toContain("custom-1");

      act(() => {
        result.current.removeCustomComponent("custom-1");
      });

      expect(result.current.favorites).not.toContain("custom-1");
    });

    it("should not affect other components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component1 = createMockCustomComponent({ id: "custom-1" });
      const component2 = createMockCustomComponent({ id: "custom-2" });

      act(() => {
        result.current.addCustomComponent(component1);
        result.current.addCustomComponent(component2);
      });

      act(() => {
        result.current.removeCustomComponent("custom-1");
      });

      expect(result.current.customComponents).toHaveLength(1);
      expect(result.current.customComponents[0].id).toBe("custom-2");
    });

    it("should handle removing non-existent component", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.removeCustomComponent("non-existent");
      });

      expect(result.current.customComponents).toHaveLength(1);
    });
  });

  describe("updateCustomComponent", () => {
    it("should update a custom component", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ 
        id: "custom-1", 
        name: "Original Name" 
      });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.updateCustomComponent("custom-1", { name: "Updated Name" });
      });

      expect(result.current.customComponents[0].name).toBe("Updated Name");
    });

    it("should update metadata with updatedAt timestamp", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const originalDate = "2024-01-01T00:00:00.000Z";
      const component = createMockCustomComponent({ 
        id: "custom-1",
        metadata: { 
          ...createMockCustomComponent().metadata!,
          updatedAt: originalDate 
        }
      });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.updateCustomComponent("custom-1", { name: "New Name" });
      });

      expect(result.current.customComponents[0].metadata?.updatedAt).not.toBe(originalDate);
    });

    it("should handle partial updates", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ 
        id: "custom-1",
        category: "basic",
        properties: { color: "blue" }
      });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.updateCustomComponent("custom-1", { category: "advanced" });
      });

      expect(result.current.customComponents[0].category).toBe("advanced");
      expect(result.current.customComponents[0].properties).toEqual({ color: "blue" });
    });

    it("should handle non-existent component", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.updateCustomComponent("non-existent", { name: "New Name" });
      });

      expect(result.current.customComponents[0].name).toBe("Test Component");
    });
  });

  describe("toggleFavorite", () => {
    it("should add component to favorites", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.toggleFavorite("custom-1");
      });

      expect(result.current.favorites).toContain("custom-1");
    });

    it("should remove component from favorites when toggled again", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "custom-1" });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.toggleFavorite("custom-1");
        result.current.toggleFavorite("custom-1");
      });

      expect(result.current.favorites).not.toContain("custom-1");
    });

    it("should handle multiple favorites", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component1 = createMockCustomComponent({ id: "custom-1" });
      const component2 = createMockCustomComponent({ id: "custom-2" });
      const component3 = createMockCustomComponent({ id: "custom-3" });

      act(() => {
        result.current.addCustomComponent(component1);
        result.current.addCustomComponent(component2);
        result.current.addCustomComponent(component3);
        result.current.toggleFavorite("custom-1");
        result.current.toggleFavorite("custom-2");
      });

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.favorites).toContain("custom-1");
      expect(result.current.favorites).toContain("custom-2");
    });
  });

  describe("setSearchTerm", () => {
    it("should set search term", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("button");
      });

      expect(result.current.searchTerm).toBe("button");
    });

    it("should update search term", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("first");
        result.current.setSearchTerm("second");
      });

      expect(result.current.searchTerm).toBe("second");
    });

    it("should handle empty search term", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("");
      });

      expect(result.current.searchTerm).toBe("");
    });
  });

  describe("setSelectedCategory", () => {
    it("should set selected category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSelectedCategory("forms");
      });

      expect(result.current.selectedCategory).toBe("forms");
    });

    it("should update selected category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSelectedCategory("basic");
        result.current.setSelectedCategory("advanced");
      });

      expect(result.current.selectedCategory).toBe("advanced");
    });

    it("should handle 'all' category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSelectedCategory("all");
      });

      expect(result.current.selectedCategory).toBe("all");
    });
  });

  describe("setBuilderOpen", () => {
    it("should set builder open state to true", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setBuilderOpen(true);
      });

      expect(result.current.isBuilderOpen).toBe(true);
    });

    it("should set builder open state to false", () => {
      useCustomComponentsStore.setState({ isBuilderOpen: true });
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setBuilderOpen(false);
      });

      expect(result.current.isBuilderOpen).toBe(false);
    });
  });

  describe("setLibraryOpen", () => {
    it("should set library open state to true", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setLibraryOpen(true);
      });

      expect(result.current.isLibraryOpen).toBe(true);
    });

    it("should set library open state to false", () => {
      useCustomComponentsStore.setState({ isLibraryOpen: true });
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setLibraryOpen(false);
      });

      expect(result.current.isLibraryOpen).toBe(false);
    });
  });

  describe("importCustomComponents", () => {
    it("should import multiple custom components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const componentsToImport = [
        createMockCustomComponent({ id: "import-1" }),
        createMockCustomComponent({ id: "import-2" }),
        createMockCustomComponent({ id: "import-3" }),
      ];

      act(() => {
        result.current.importCustomComponents(componentsToImport);
      });

      expect(result.current.customComponents).toHaveLength(3);
    });

    it("should append to existing components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const existing = createMockCustomComponent({ id: "existing" });
      const toImport = [
        createMockCustomComponent({ id: "import-1" }),
        createMockCustomComponent({ id: "import-2" }),
      ];

      act(() => {
        result.current.addCustomComponent(existing);
        result.current.importCustomComponents(toImport);
      });

      expect(result.current.customComponents).toHaveLength(3);
    });

    it("should handle empty import array", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const existing = createMockCustomComponent({ id: "existing" });

      act(() => {
        result.current.addCustomComponent(existing);
        result.current.importCustomComponents([]);
      });

      expect(result.current.customComponents).toHaveLength(1);
    });
  });

  describe("exportCustomComponents", () => {
    it("should export all custom components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component1 = createMockCustomComponent({ id: "custom-1" });
      const component2 = createMockCustomComponent({ id: "custom-2" });

      act(() => {
        result.current.addCustomComponent(component1);
        result.current.addCustomComponent(component2);
      });

      const exported = result.current.exportCustomComponents();

      expect(exported).toHaveLength(2);
      expect(exported).toContainEqual(component1);
      expect(exported).toContainEqual(component2);
    });

    it("should export empty array when no components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      const exported = result.current.exportCustomComponents();

      expect(exported).toEqual([]);
    });
  });

  describe("clearAllCustomComponents", () => {
    it("should remove all custom components and favorites", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component1 = createMockCustomComponent({ id: "custom-1" });
      const component2 = createMockCustomComponent({ id: "custom-2" });

      act(() => {
        result.current.addCustomComponent(component1);
        result.current.addCustomComponent(component2);
        result.current.toggleFavorite("custom-1");
        result.current.toggleFavorite("custom-2");
        result.current.clearAllCustomComponents();
      });

      expect(result.current.customComponents).toEqual([]);
      expect(result.current.favorites).toEqual([]);
    });
  });

  describe("getFilteredComponents", () => {
    beforeEach(() => {
      const { result } = renderHook(() => useCustomComponentsStore());
      
      const components = [
        createMockCustomComponent({ 
          id: "btn-1", 
          name: "Primary Button",
          category: "buttons",
          metadata: { tags: ["primary", "action"] }
        }),
        createMockCustomComponent({ 
          id: "btn-2", 
          name: "Secondary Button",
          category: "buttons",
          metadata: { tags: ["secondary"] }
        }),
        createMockCustomComponent({ 
          id: "form-1", 
          name: "Login Form",
          category: "forms",
          metadata: { tags: ["auth", "login"] }
        }),
        createMockCustomComponent({ 
          id: "card-1", 
          name: "Product Card",
          category: "cards",
          metadata: { tags: ["product", "display"] }
        }),
      ];

      act(() => {
        components.forEach(c => result.current.addCustomComponent(c));
      });
    });

    it("should return all components when no filter applied", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(4);
    });

    it("should filter by category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSelectedCategory("buttons");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(2);
      expect(filtered.every(c => c.category === "buttons")).toBe(true);
    });

    it("should filter by search term in name", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("Primary");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Primary Button");
    });

    it("should filter by search term in category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("form");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Login Form");
    });

    it("should filter by search term in tags", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("auth");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Login Form");
    });

    it("should combine category and search filters", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSelectedCategory("buttons");
        result.current.setSearchTerm("Primary");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Primary Button");
    });

    it("should handle case-insensitive search", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("PRIMARY");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toHaveLength(1);
    });

    it("should return empty array when no match", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      act(() => {
        result.current.setSearchTerm("nonExistent");
      });

      const filtered = result.current.getFilteredComponents();

      expect(filtered).toEqual([]);
    });
  });

  describe("getComponentsByCategory", () => {
    it("should return components for specific category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const components = [
        createMockCustomComponent({ id: "c1", category: "buttons" }),
        createMockCustomComponent({ id: "c2", category: "buttons" }),
        createMockCustomComponent({ id: "c3", category: "forms" }),
      ];

      act(() => {
        components.forEach(c => result.current.addCustomComponent(c));
      });

      const buttons = result.current.getComponentsByCategory("buttons");

      expect(buttons).toHaveLength(2);
      expect(buttons.every(c => c.category === "buttons")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const { result } = renderHook(() => useCustomComponentsStore());

      const cards = result.current.getComponentsByCategory("cards");

      expect(cards).toEqual([]);
    });
  });

  describe("getFavoriteComponents", () => {
    it("should return only favorited components", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const components = [
        createMockCustomComponent({ id: "c1", name: "Button 1" }),
        createMockCustomComponent({ id: "c2", name: "Button 2" }),
        createMockCustomComponent({ id: "c3", name: "Button 3" }),
      ];

      act(() => {
        components.forEach(c => result.current.addCustomComponent(c));
        result.current.toggleFavorite("c1");
        result.current.toggleFavorite("c3");
      });

      const favorites = result.current.getFavoriteComponents();

      expect(favorites).toHaveLength(2);
      expect(favorites.find(c => c.id === "c1")).toBeDefined();
      expect(favorites.find(c => c.id === "c3")).toBeDefined();
      expect(favorites.find(c => c.id === "c2")).toBeUndefined();
    });

    it("should return empty array when no favorites", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({ id: "c1" });

      act(() => {
        result.current.addCustomComponent(component);
      });

      const favorites = result.current.getFavoriteComponents();

      expect(favorites).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle component with no metadata", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component: CustomComponent = {
        id: "no-meta",
        name: "No Metadata Component",
        type: "custom",
        category: "basic",
        isContainer: false,
        isCustom: true,
      };

      act(() => {
        result.current.addCustomComponent(component);
      });

      expect(result.current.customComponents).toHaveLength(1);
    });

    it("should handle component with empty tags", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const component = createMockCustomComponent({
        id: "empty-tags",
        metadata: { tags: [] }
      });

      act(() => {
        result.current.addCustomComponent(component);
        result.current.setSearchTerm("something");
      });

      const filtered = result.current.getFilteredComponents();
      expect(filtered).toHaveLength(0);
    });

    it("should handle duplicate imports", () => {
      const { result } = renderHook(() => useCustomComponentsStore());
      const duplicate = createMockCustomComponent({ id: "dup" });

      act(() => {
        result.current.addCustomComponent(duplicate);
        result.current.importCustomComponents([duplicate]);
      });

      expect(result.current.customComponents).toHaveLength(2);
    });
  });
});
