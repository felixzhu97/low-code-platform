import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useHistoryStore } from "../history.store";
import type { Component } from "@/component/types";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
  };
});

// Mock history functions
vi.mock("@/lib/history", () => ({
  createHistory: vi.fn((initial) => ({
    past: [],
    present: initial,
    future: [],
  })),
  addToHistory: vi.fn((history, newPresent) => ({
    past: [...history.past, history.present],
    present: newPresent,
    future: [],
  })),
  undo: vi.fn((history) => {
    if (history.past.length === 0) return history;
    const previous = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, history.past.length - 1),
      present: previous,
      future: [history.present, ...history.future],
    };
  }),
  redo: vi.fn((history) => {
    if (history.future.length === 0) return history;
    const next = history.future[0];
    return {
      past: [...history.past, history.present],
      present: next,
      future: history.future.slice(1),
    };
  }),
  canUndo: vi.fn((history) => history.past.length > 0),
  canRedo: vi.fn((history) => history.future.length > 0),
}));

describe("useHistoryStore", () => {
  const createMockComponent = (id: string): Component => ({
    id,
    type: "button",
    name: `Component ${id}`,
    position: { x: 0, y: 0 },
    properties: {},
    children: [],
    parentId: null,
    dataSource: null,
    dataMapping: [],
  });

  const createMockComponents = (count: number): Component[] => {
    return Array.from({ length: count }, (_, i) => createMockComponent(`comp-${i}`));
  };

  beforeEach(() => {
    useHistoryStore.setState({
      componentsHistory: {
        past: [],
        present: [],
        future: [],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useHistoryStore());

      expect(result.current.componentsHistory).toEqual({
        past: [],
        present: [],
        future: [],
      });
    });
  });

  describe("addToHistory", () => {
    it("should add components to history", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components = createMockComponents(3);

      act(() => {
        result.current.addToHistory(components);
      });

      expect(result.current.componentsHistory.present).toEqual(components);
    });

    it("should replace current state in history", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(2);
      const components2 = createMockComponents(3);

      act(() => {
        result.current.addToHistory(components1);
      });

      act(() => {
        result.current.addToHistory(components2);
      });

      expect(result.current.componentsHistory.present).toEqual(components2);
    });

    it("should handle empty components array", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.addToHistory([]);
      });

      expect(result.current.componentsHistory.present).toEqual([]);
    });

    it("should handle single component", () => {
      const { result } = renderHook(() => useHistoryStore());
      const component = [createMockComponent("single")];

      act(() => {
        result.current.addToHistory(component);
      });

      expect(result.current.componentsHistory.present).toEqual(component);
    });
  });

  describe("undo", () => {
    it("should return null when no history to undo", () => {
      const { result } = renderHook(() => useHistoryStore());

      const returned = result.current.undo();

      expect(returned).toBeNull();
    });

    it("should return components after undo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components);
      });

      const returned = result.current.undo();

      expect(returned).toBeDefined();
    });

    it("should update history state after undo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.componentsHistory).toBeDefined();
    });
  });

  describe("redo", () => {
    it("should return null when no history to redo", () => {
      const { result } = renderHook(() => useHistoryStore());

      const returned = result.current.redo();

      expect(returned).toBeNull();
    });

    it("should return components after redo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.undo();
      });

      const returned = result.current.redo();

      expect(returned).toBeDefined();
    });

    it("should update history state after redo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.componentsHistory).toBeDefined();
    });
  });

  describe("canUndo", () => {
    it("should return false when no history", () => {
      const { result } = renderHook(() => useHistoryStore());

      const canUndo = result.current.canUndo();

      expect(canUndo).toBe(false);
    });

    it("should return true when history exists", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components = createMockComponents(1);

      act(() => {
        result.current.addToHistory(components);
      });

      const canUndo = result.current.canUndo();

      expect(canUndo).toBe(true);
    });

    it("should return false after undo clears history", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components = createMockComponents(1);

      act(() => {
        result.current.addToHistory(components);
        result.current.undo();
      });

      const canUndo = result.current.canUndo();

      expect(canUndo).toBe(false);
    });
  });

  describe("canRedo", () => {
    it("should return false when no future history", () => {
      const { result } = renderHook(() => useHistoryStore());

      const canRedo = result.current.canRedo();

      expect(canRedo).toBe(false);
    });

    it("should return true after undo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.undo();
      });

      const canRedo = result.current.canRedo();

      expect(canRedo).toBe(true);
    });

    it("should return false after redo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.undo();
        result.current.redo();
      });

      const canRedo = result.current.canRedo();

      expect(canRedo).toBe(false);
    });
  });

  describe("clearHistory", () => {
    it("should clear all history", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components);
        result.current.addToHistory(createMockComponents(3));
        result.current.clearHistory();
      });

      expect(result.current.componentsHistory).toEqual({
        past: [],
        present: [],
        future: [],
      });
    });

    it("should reset to initial state", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.addToHistory(createMockComponents(5));
        result.current.clearHistory();
      });

      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(false);
    });
  });

  describe("getHistoryInfo", () => {
    it("should return correct info for empty history", () => {
      const { result } = renderHook(() => useHistoryStore());

      const info = result.current.getHistoryInfo();

      expect(info).toEqual({
        currentIndex: 0,
        totalSteps: 1,
        canUndo: false,
        canRedo: false,
      });
    });

    it("should return correct info after adding history", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
      });

      const info = result.current.getHistoryInfo();

      expect(info.currentIndex).toBe(2);
      expect(info.totalSteps).toBe(3);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(false);
    });

    it("should return correct info after undo", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.undo();
      });

      const info = result.current.getHistoryInfo();

      expect(info.currentIndex).toBe(1);
      expect(info.totalSteps).toBe(3);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(true);
    });

    it("should return correct info after multiple undos", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addToHistory(createMockComponents(i + 1));
        }
      });

      // Undo twice
      act(() => {
        result.current.undo();
        result.current.undo();
      });

      const info = result.current.getHistoryInfo();

      expect(info.currentIndex).toBe(3);
      expect(info.totalSteps).toBe(6);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(true);
    });

    it("should reflect redo in history info", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.addToHistory(createMockComponents(1));
        result.current.addToHistory(createMockComponents(2));
        result.current.undo();
        result.current.redo();
      });

      const info = result.current.getHistoryInfo();

      expect(info.currentIndex).toBe(2);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(false);
    });
  });

  describe("Undo/Redo Workflow", () => {
    it("should support multiple sequential undos", () => {
      const { result } = renderHook(() => useHistoryStore());
      const components1 = createMockComponents(1);
      const components2 = createMockComponents(2);
      const components3 = createMockComponents(3);

      act(() => {
        result.current.addToHistory(components1);
        result.current.addToHistory(components2);
        result.current.addToHistory(components3);
      });

      act(() => {
        result.current.undo();
      });
      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.undo();
      });
      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.undo();
      });
      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(true);
    });

    it("should support multiple sequential redos", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.addToHistory(createMockComponents(1));
        result.current.addToHistory(createMockComponents(2));
        result.current.addToHistory(createMockComponents(3));
        result.current.undo();
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.redo();
      });
      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.redo();
      });
      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.redo();
      });
      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(false);
    });

    it("should clear redo history when new action is taken", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.addToHistory(createMockComponents(1));
        result.current.addToHistory(createMockComponents(2));
        result.current.undo();
      });

      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.addToHistory(createMockComponents(3));
      });

      expect(result.current.canRedo()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large components array", () => {
      const { result } = renderHook(() => useHistoryStore());
      const largeComponents = createMockComponents(1000);

      act(() => {
        result.current.addToHistory(largeComponents);
      });

      expect(result.current.componentsHistory.present).toHaveLength(1000);
    });

    it("should handle components with complex nested structures", () => {
      const { result } = renderHook(() => useHistoryStore());
      const complexComponents: Component[] = [
        {
          id: "complex-1",
          type: "container",
          name: "Complex Container",
          position: { x: 100, y: 200 },
          properties: {
            styles: { background: "#fff", padding: "16px" },
            config: { expandable: true, defaultExpanded: false },
          },
          children: ["child-1", "child-2"],
          parentId: null,
          dataSource: "ds-1",
          dataMapping: [
            { field: "title", sourcePath: "data.title", targetPath: "props.title" },
          ],
        },
      ];

      act(() => {
        result.current.addToHistory(complexComponents);
      });

      expect(result.current.componentsHistory.present[0]).toEqual(complexComponents[0]);
    });

    it("should handle rapid history operations", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addToHistory(createMockComponents(i + 1));
        }
      });

      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(false);

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.undo();
        }
      });

      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);

      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.redo();
        }
      });

      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(true);
    });

    it("should handle clearing history at any point", () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addToHistory(createMockComponents(i + 1));
        }
        result.current.undo();
        result.current.undo();
        result.current.clearHistory();
      });

      expect(result.current.componentsHistory.past).toEqual([]);
      expect(result.current.componentsHistory.future).toEqual([]);
      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(false);
    });
  });
});
