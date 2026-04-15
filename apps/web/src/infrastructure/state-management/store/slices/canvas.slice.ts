import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

interface CanvasState {
  isPreviewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  viewportWidth: number;
  activeDevice: string;
}

const initialState: CanvasState = {
  isPreviewMode: false,
  showGrid: false,
  snapToGrid: false,
  viewportWidth: 1280,
  activeDevice: "desktop",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    setViewportWidth: (state, action: PayloadAction<number>) => {
      state.viewportWidth = action.payload;
    },
    setActiveDevice: (state, action: PayloadAction<string>) => {
      state.activeDevice = action.payload;
    },
  },
});

export const {
  setPreviewMode,
  toggleGrid,
  toggleSnapToGrid,
  setViewportWidth,
  setActiveDevice,
} = canvasSlice.actions;

export default canvasSlice.reducer;

export const selectIsPreviewMode = (state: { canvas: CanvasState }) =>
  state.canvas.isPreviewMode;
export const selectShowGrid = (state: { canvas: CanvasState }) =>
  state.canvas.showGrid;
export const selectSnapToGrid = (state: { canvas: CanvasState }) =>
  state.canvas.snapToGrid;
export const selectViewportWidth = (state: { canvas: CanvasState }) =>
  state.canvas.viewportWidth;
export const selectActiveDevice = (state: { canvas: CanvasState }) =>
  state.canvas.activeDevice;
export const selectBreakpoints = () => BREAKPOINTS;

export const selectCurrentBreakpoint = (state: { canvas: CanvasState }) => {
  const { viewportWidth } = state.canvas;
  if (viewportWidth >= BREAKPOINTS.xl) return "xl";
  if (viewportWidth >= BREAKPOINTS.lg) return "lg";
  if (viewportWidth >= BREAKPOINTS.md) return "md";
  if (viewportWidth >= BREAKPOINTS.sm) return "sm";
  return "xs";
};
