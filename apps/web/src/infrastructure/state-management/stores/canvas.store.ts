import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as canvasActions from "../store/slices/canvas.slice";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useCanvasStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.canvas);

  return {
    ...state,
    setPreviewMode: (preview: boolean) =>
      dispatch(canvasActions.setPreviewMode(preview)),
    toggleGrid: () => dispatch(canvasActions.toggleGrid()),
    toggleSnapToGrid: () => dispatch(canvasActions.toggleSnapToGrid()),
    setViewportWidth: (width: number) =>
      dispatch(canvasActions.setViewportWidth(width)),
    setActiveDevice: (device: string) =>
      dispatch(canvasActions.setActiveDevice(device)),
    getResponsiveBreakpoints: () => BREAKPOINTS,
    getCurrentBreakpoint: () => {
      if (state.viewportWidth >= BREAKPOINTS.xl) return "xl";
      if (state.viewportWidth >= BREAKPOINTS.lg) return "lg";
      if (state.viewportWidth >= BREAKPOINTS.md) return "md";
      if (state.viewportWidth >= BREAKPOINTS.sm) return "sm";
      return "xs";
    },
  };
};
