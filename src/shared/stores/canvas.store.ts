import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CanvasState {
  // 画布状态
  isPreviewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  viewportWidth: number;
  activeDevice: string;

  // 画布操作
  setPreviewMode: (preview: boolean) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setViewportWidth: (width: number) => void;
  setActiveDevice: (device: string) => void;

  // 响应式断点
  getResponsiveBreakpoints: () => {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  getCurrentBreakpoint: () => string;
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        isPreviewMode: false,
        showGrid: false,
        snapToGrid: false,
        viewportWidth: 1280,
        activeDevice: "desktop",

        // 设置预览模式
        setPreviewMode: (preview: boolean) => {
          set({ isPreviewMode: preview }, false, "setPreviewMode");
        },

        // 切换网格显示
        toggleGrid: () => {
          set((state) => ({ showGrid: !state.showGrid }), false, "toggleGrid");
        },

        // 切换网格对齐
        toggleSnapToGrid: () => {
          set(
            (state) => ({ snapToGrid: !state.snapToGrid }),
            false,
            "toggleSnapToGrid"
          );
        },

        // 设置视口宽度
        setViewportWidth: (width: number) => {
          set({ viewportWidth: width }, false, "setViewportWidth");
        },

        // 设置活动设备
        setActiveDevice: (device: string) => {
          set({ activeDevice: device }, false, "setActiveDevice");
        },

        // 获取响应式断点
        getResponsiveBreakpoints: () => BREAKPOINTS,

        // 获取当前断点
        getCurrentBreakpoint: () => {
          const { viewportWidth } = get();
          if (viewportWidth >= BREAKPOINTS.xl) return "xl";
          if (viewportWidth >= BREAKPOINTS.lg) return "lg";
          if (viewportWidth >= BREAKPOINTS.md) return "md";
          if (viewportWidth >= BREAKPOINTS.sm) return "sm";
          return "xs";
        },
      }),
      {
        name: "canvas-store",
        partialize: (state) => ({
          showGrid: state.showGrid,
          snapToGrid: state.snapToGrid,
          viewportWidth: state.viewportWidth,
          activeDevice: state.activeDevice,
        }),
      }
    ),
    {
      name: "canvas-store",
    }
  )
);
