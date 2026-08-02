import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createHistory,
  undo,
  redo,
  addToHistory,
  canUndo,
  canRedo,
  type HistoryState,
} from "../history";

describe("history module", () => {
  describe("createHistory", () => {
    it("should create a history state with initial state", () => {
      const initialState = { count: 0 };
      const history = createHistory(initialState);

      expect(history.past).toEqual([]);
      expect(history.present).toEqual({ count: 0 });
      expect(history.future).toEqual([]);
    });

    it("should handle different types of initial state", () => {
      expect(createHistory(42).present).toBe(42);
      expect(createHistory("string").present).toBe("string");
      expect(createHistory(null).present).toBe(null);
      expect(createHistory([1, 2, 3]).present).toEqual([1, 2, 3]);
    });

    it("should handle complex objects", () => {
      const complexState = {
        components: [{ id: "1", type: "button" }],
        selectedId: "1",
      };
      const history = createHistory(complexState);
      expect(history.present).toEqual(complexState);
    });
  });

  describe("undo", () => {
    it("should return previous state when past is not empty", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [4, 5],
      };

      const result = undo(history);

      expect(result.past).toEqual([1]);
      expect(result.present).toBe(2);
      expect(result.future).toEqual([3, 4, 5]);
    });

    it("should return same state when past is empty", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 1,
        future: [2, 3],
      };

      const result = undo(history);

      expect(result).toBe(history);
      expect(result.past).toEqual([]);
      expect(result.present).toBe(1);
    });

    it("should handle single item in past", () => {
      const history: HistoryState<number> = {
        past: [1],
        present: 2,
        future: [],
      };

      const result = undo(history);

      expect(result.past).toEqual([]);
      expect(result.present).toBe(1);
      expect(result.future).toEqual([2]);
    });

    it("should handle object states", () => {
      const history: HistoryState<{ value: number }> = {
        past: [{ value: 1 }],
        present: { value: 2 },
        future: [],
      };

      const result = undo(history);

      expect(result.present).toEqual({ value: 1 });
      expect(result.future).toContainEqual({ value: 2 });
    });

    it("should not mutate original history", () => {
      const history: HistoryState<number> = {
        past: [1],
        present: 2,
        future: [3],
      };
      const originalPastLength = history.past.length;

      undo(history);

      expect(history.past).toHaveLength(originalPastLength);
    });
  });

  describe("redo", () => {
    it("should return next state when future is not empty", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [4, 5],
      };

      const result = redo(history);

      expect(result.past).toEqual([1, 2, 3]);
      expect(result.present).toBe(4);
      expect(result.future).toEqual([5]);
    });

    it("should return same state when future is empty", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [],
      };

      const result = redo(history);

      expect(result).toBe(history);
      expect(result.present).toBe(3);
    });

    it("should handle single item in future", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [4],
      };

      const result = redo(history);

      expect(result.past).toEqual([1, 2, 3]);
      expect(result.present).toBe(4);
      expect(result.future).toEqual([]);
    });

    it("should handle object states", () => {
      const history: HistoryState<{ value: number }> = {
        past: [{ value: 1 }],
        present: { value: 2 },
        future: [{ value: 3 }],
      };

      const result = redo(history);

      expect(result.present).toEqual({ value: 3 });
      expect(result.past).toContainEqual({ value: 2 });
    });

    it("should not mutate original history", () => {
      const history: HistoryState<number> = {
        past: [1],
        present: 2,
        future: [3],
      };
      const originalFutureLength = history.future.length;

      redo(history);

      expect(history.future).toHaveLength(originalFutureLength);
    });
  });

  describe("addToHistory", () => {
    it("should add current state to past and set new present", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [4, 5],
      };

      const result = addToHistory(history, 10);

      expect(result.past).toEqual([1, 2, 3]);
      expect(result.present).toBe(10);
      expect(result.future).toEqual([]);
    });

    it("should clear future when adding new state", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 1,
        future: [2, 3, 4, 5],
      };

      const result = addToHistory(history, 6);

      expect(result.past).toEqual([1]);
      expect(result.present).toBe(6);
      expect(result.future).toEqual([]);
    });

    it("should handle empty history", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 1,
        future: [],
      };

      const result = addToHistory(history, 2);

      expect(result.past).toEqual([1]);
      expect(result.present).toBe(2);
      expect(result.future).toEqual([]);
    });

    it("should handle object states", () => {
      const history: HistoryState<{ value: number }> = {
        past: [],
        present: { value: 1 },
        future: [],
      };

      const result = addToHistory(history, { value: 2 });

      expect(result.past).toHaveLength(1);
      expect(result.present).toEqual({ value: 2 });
    });

    it("should not mutate original history", () => {
      const history: HistoryState<number> = {
        past: [1],
        present: 2,
        future: [3],
      };

      addToHistory(history, 4);

      expect(history.present).toBe(2);
      expect(history.future).toHaveLength(1);
    });
  });

  describe("canUndo", () => {
    it("should return true when past has items", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [],
      };

      expect(canUndo(history)).toBe(true);
    });

    it("should return false when past is empty", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 3,
        future: [4, 5],
      };

      expect(canUndo(history)).toBe(false);
    });

    it("should return false for single-item history", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 1,
        future: [],
      };

      expect(canUndo(history)).toBe(false);
    });
  });

  describe("canRedo", () => {
    it("should return true when future has items", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [4, 5],
      };

      expect(canRedo(history)).toBe(true);
    });

    it("should return false when future is empty", () => {
      const history: HistoryState<number> = {
        past: [1, 2],
        present: 3,
        future: [],
      };

      expect(canRedo(history)).toBe(false);
    });

    it("should return false for single-item history", () => {
      const history: HistoryState<number> = {
        past: [],
        present: 1,
        future: [],
      };

      expect(canRedo(history)).toBe(false);
    });
  });

  describe("multiple operations", () => {
    it("should handle undo/redo workflow", () => {
      let history = createHistory(0);

      history = addToHistory(history, 1);
      history = addToHistory(history, 2);
      history = addToHistory(history, 3);

      expect(history.present).toBe(3);
      expect(history.past).toEqual([0, 1, 2]);

      history = undo(history);
      expect(history.present).toBe(2);

      history = undo(history);
      expect(history.present).toBe(1);

      history = redo(history);
      expect(history.present).toBe(2);

      history = redo(history);
      expect(history.present).toBe(3);
    });

    it("should clear future on new action after undo", () => {
      let history = createHistory(0);
      history = addToHistory(history, 1);
      history = addToHistory(history, 2);
      history = undo(history);

      expect(history.present).toBe(1);
      expect(history.future).toEqual([2]);

      history = addToHistory(history, 3);

      expect(history.present).toBe(3);
      expect(history.future).toEqual([]);
      expect(history.past).toEqual([0, 1]);
    });
  });
});
