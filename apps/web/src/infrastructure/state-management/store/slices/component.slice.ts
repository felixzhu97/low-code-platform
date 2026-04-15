import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Component } from "@/domain/component/entities/component.entity";

function getAllChildIds(parentId: string, components: Component[]): string[] {
  const childIds: string[] = [];
  const children = components.filter((comp) => comp.parentId === parentId);

  for (const child of children) {
    childIds.push(child.id);
    childIds.push(...getAllChildIds(child.id, components));
  }

  return childIds;
}

interface ComponentState {
  components: Component[];
  selectedComponent: Component | null;
  selectedComponentId: string | null;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  dropTargetId: string | null;
}

const initialState: ComponentState = {
  components: [],
  selectedComponent: null,
  selectedComponentId: null,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  dropTargetId: null,
};

const componentSlice = createSlice({
  name: "component",
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<Component>) => {
      state.components.push(action.payload);
    },
    updateComponent: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Component> }>
    ) => {
      const { id, updates } = action.payload;
      const index = state.components.findIndex((comp) => comp.id === id);
      if (index !== -1) {
        state.components[index] = { ...state.components[index], ...updates };
      }
      if (state.selectedComponent?.id === id) {
        state.selectedComponent = { ...state.selectedComponent, ...updates };
      }
    },
    deleteComponent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.components = state.components.filter((comp) => comp.id !== id);
      if (state.selectedComponent?.id === id) {
        state.selectedComponent = null;
        state.selectedComponentId = null;
      }
      if (state.selectedComponentId === id) {
        state.selectedComponentId = null;
      }
    },
    deleteComponentAndChildren: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idsToDelete = getAllChildIds(id, state.components);
      idsToDelete.push(id);
      state.components = state.components.filter(
        (comp) => !idsToDelete.includes(comp.id)
      );
      if (idsToDelete.includes(state.selectedComponent?.id || "")) {
        state.selectedComponent = null;
        state.selectedComponentId = null;
      }
      if (idsToDelete.includes(state.selectedComponentId || "")) {
        state.selectedComponentId = null;
      }
    },
    updateComponentPosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      const { id, position } = action.payload;
      const index = state.components.findIndex((comp) => comp.id === id);
      if (index !== -1) {
        state.components[index].position = position;
      }
    },
    selectComponent: (state, action: PayloadAction<Component | null>) => {
      state.selectedComponent = action.payload;
      state.selectedComponentId = action.payload?.id || null;
    },
    clearSelection: (state) => {
      state.selectedComponent = null;
      state.selectedComponentId = null;
    },
    clearAllComponents: (state) => {
      state.components = [];
      state.selectedComponent = null;
      state.selectedComponentId = null;
    },
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setDragOffset: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.dragOffset = action.payload;
    },
    setDropTarget: (state, action: PayloadAction<string | null>) => {
      state.dropTargetId = action.payload;
    },
    updateComponents: (state, action: PayloadAction<Component[]>) => {
      state.components = action.payload;
    },
  },
});

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  deleteComponentAndChildren,
  updateComponentPosition,
  selectComponent,
  clearSelection,
  clearAllComponents,
  setDragging,
  setDragOffset,
  setDropTarget,
  updateComponents,
} = componentSlice.actions;

export default componentSlice.reducer;

export const selectComponents = (state: { component: ComponentState }) =>
  state.component.components;
export const selectSelectedComponent = (state: { component: ComponentState }) =>
  state.component.selectedComponent;
export const selectSelectedComponentId = (state: { component: ComponentState }) =>
  state.component.selectedComponentId;
export const selectIsDragging = (state: { component: ComponentState }) =>
  state.component.isDragging;
export const selectDragOffset = (state: { component: ComponentState }) =>
  state.component.dragOffset;
export const selectDropTargetId = (state: { component: ComponentState }) =>
  state.component.dropTargetId;

export const selectRootComponents = (state: { component: ComponentState }) =>
  state.component.components.filter((comp) => !comp.parentId);

export const selectChildComponents = (
  state: { component: ComponentState },
  parentId: string
) => state.component.components.filter((comp) => comp.parentId === parentId);
