import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useCanvasStore } from "../canvas.store";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

describe("useCanvasStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCanvasStore.setState({
      isPreviewMode: false,
      showGrid: false,
      snapToGrid: false,
      viewportWidth: 1280,
      activeDevice: "desktop",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.isPreviewMode).toBe(false);
      expect(result.current.showGrid).toBe(false);
      expect(result.current.snapToGrid).toBe(false);
      expect(result.current.viewportWidth).toBe(1280);
      expect(result.current.activeDevice).toBe("desktop");
    });
  });

  describe("setPreviewMode", () => {
    it("should set preview mode to true", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setPreviewMode(true);
      });

      expect(result.current.isPreviewMode).toBe(true);
    });

    it("should set preview mode to false", () => {
      useCanvasStore.setState({ isPreviewMode: true });

      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setPreviewMode(false);
      });

      expect(result.current.isPreviewMode).toBe(false);
    });

    it("should toggle preview mode", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.isPreviewMode).toBe(false);

      act(() => {
        result.current.setPreviewMode(true);
      });
      expect(result.current.isPreviewMode).toBe(true);

      act(() => {
        result.current.setPreviewMode(false);
      });
      expect(result.current.isPreviewMode).toBe(false);
    });
  });

  describe("toggleGrid", () => {
    it("should toggle grid from false to true", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.showGrid).toBe(false);

      act(() => {
        result.current.toggleGrid();
      });

      expect(result.current.showGrid).toBe(true);
    });

    it("should toggle grid from true to false", () => {
      useCanvasStore.setState({ showGrid: true });

      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.toggleGrid();
      });

      expect(result.current.showGrid).toBe(false);
    });

    it("should toggle grid multiple times", () => {
      const { result } = renderHook(() => useCanvasStore());

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.toggleGrid();
        });
        expect(result.current.showGrid).toBe(i % 2 === 0 ? true : false);
      }
    });
  });

  describe("toggleSnapToGrid", () => {
    it("should toggle snap to grid from false to true", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.snapToGrid).toBe(false);

      act(() => {
        result.current.toggleSnapToGrid();
      });

      expect(result.current.snapToGrid).toBe(true);
    });

    it("should toggle snap to grid from true to false", () => {
      useCanvasStore.setState({ snapToGrid: true });

      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.toggleSnapToGrid();
      });

      expect(result.current.snapToGrid).toBe(false);
    });
  });

  describe("setViewportWidth", () => {
    it("should set viewport width to specific value", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(1920);
      });

      expect(result.current.viewportWidth).toBe(1920);
    });

    it("should handle mobile viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(375);
      });

      expect(result.current.viewportWidth).toBe(375);
    });

    it("should handle tablet viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(768);
      });

      expect(result.current.viewportWidth).toBe(768);
    });

    it("should handle large desktop viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(2560);
      });

      expect(result.current.viewportWidth).toBe(2560);
    });

    it("should handle zero viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(0);
      });

      expect(result.current.viewportWidth).toBe(0);
    });

    it("should handle negative viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(-100);
      });

      expect(result.current.viewportWidth).toBe(-100);
    });
  });

  describe("setActiveDevice", () => {
    it("should set active device to desktop", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setActiveDevice("desktop");
      });

      expect(result.current.activeDevice).toBe("desktop");
    });

    it("should set active device to tablet", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setActiveDevice("tablet");
      });

      expect(result.current.activeDevice).toBe("tablet");
    });

    it("should set active device to mobile", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setActiveDevice("mobile");
      });

      expect(result.current.activeDevice).toBe("mobile");
    });

    it("should handle custom device names", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setActiveDevice("large-desktop");
      });

      expect(result.current.activeDevice).toBe("large-desktop");
    });
  });

  describe("getResponsiveBreakpoints", () => {
    it("should return correct breakpoints", () => {
      const { result } = renderHook(() => useCanvasStore());

      const breakpoints = result.current.getResponsiveBreakpoints();

      expect(breakpoints).toEqual({
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      });
    });
  });

  describe("getCurrentBreakpoint", () => {
    it("should return xs for very small viewport", () => {
      useCanvasStore.setState({ viewportWidth: 320 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("xs");
    });

    it("should return sm for small viewport", () => {
      useCanvasStore.setState({ viewportWidth: 640 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("sm");
    });

    it("should return md for medium viewport", () => {
      useCanvasStore.setState({ viewportWidth: 768 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("md");
    });

    it("should return lg for large viewport", () => {
      useCanvasStore.setState({ viewportWidth: 1024 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("lg");
    });

    it("should return xl for extra large viewport", () => {
      useCanvasStore.setState({ viewportWidth: 1280 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("xl");
    });

    it("should return xl for very large viewport", () => {
      useCanvasStore.setState({ viewportWidth: 1920 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("xl");
    });

    it("should return xs for zero viewport width", () => {
      useCanvasStore.setState({ viewportWidth: 0 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("xs");
    });

    it("should return xs for negative viewport width", () => {
      useCanvasStore.setState({ viewportWidth: -1 });
      const { result } = renderHook(() => useCanvasStore());

      const breakpoint = result.current.getCurrentBreakpoint();

      expect(breakpoint).toBe("xs");
    });
  });

  describe("State Persistence", () => {
    it("should persist state correctly via getState", () => {
      act(() => {
        useCanvasStore.getState().setPreviewMode(true);
        useCanvasStore.getState().toggleGrid();
        useCanvasStore.getState().setViewportWidth(1920);
        useCanvasStore.getState().setActiveDevice("tablet");
      });

      const state = useCanvasStore.getState();

      expect(state.isPreviewMode).toBe(true);
      expect(state.showGrid).toBe(true);
      expect(state.viewportWidth).toBe(1920);
      expect(state.activeDevice).toBe("tablet");
    });
  });

  describe("Combined Actions", () => {
    it("should handle multiple actions in sequence", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setPreviewMode(true);
      });
      expect(result.current.isPreviewMode).toBe(true);

      act(() => {
        result.current.toggleGrid();
      });
      expect(result.current.showGrid).toBe(true);

      act(() => {
        result.current.toggleSnapToGrid();
      });
      expect(result.current.snapToGrid).toBe(true);

      act(() => {
        result.current.setViewportWidth(1024);
      });
      expect(result.current.viewportWidth).toBe(1024);

      act(() => {
        result.current.setActiveDevice("mobile");
      });
      expect(result.current.activeDevice).toBe("mobile");
    });

    it("should track multiple state changes", () => {
      // This test verifies the store can handle many sequential updates
      const { result } = renderHook(() => useCanvasStore());

      const initialState = result.current;
      
      // Perform multiple state changes
      act(() => {
        result.current.setPreviewMode(true);
        result.current.toggleGrid();
        result.current.toggleSnapToGrid();
        result.current.setViewportWidth(1920);
        result.current.setActiveDevice("tablet");
      });

      // Verify all changes were applied
      expect(result.current.isPreviewMode).toBe(true);
      expect(result.current.showGrid).toBe(true);
      expect(result.current.snapToGrid).toBe(true);
      expect(result.current.viewportWidth).toBe(1920);
      expect(result.current.activeDevice).toBe("tablet");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large viewport width", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewportWidth(999999);
      });

      expect(result.current.viewportWidth).toBe(999999);
      expect(result.current.getCurrentBreakpoint()).toBe("xl");
    });

    it("should handle viewport width at breakpoint boundaries", () => {
      const { result } = renderHook(() => useCanvasStore());

      // Test at exact breakpoint values
      const breakpoints = [640, 768, 1024, 1280];
      const expectedBreakpoints = ["sm", "md", "lg", "xl"];

      breakpoints.forEach((width, index) => {
        act(() => {
          result.current.setViewportWidth(width);
        });
        expect(result.current.getCurrentBreakpoint()).toBe(expectedBreakpoints[index]);
      });
    });
  });
});
