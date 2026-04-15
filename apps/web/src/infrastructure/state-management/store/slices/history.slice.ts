import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Component } from "@/domain/component/entities/component.entity";
import {
  createHistory,
  addToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  type HistoryState,
} from "@/application/services/history";

interface HistoryStateStore {
  componentsHistory: HistoryState<Component[]>;
}

const initialState: HistoryStateStore = {
  componentsHistory: createHistory([]),
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addToComponentsHistory: (state, action: PayloadAction<Component[]>) => {
      state.componentsHistory = addToHistory(
        state.componentsHistory,
        action.payload
      );
    },
    undoComponents: (state) => {
      if (canUndo(state.componentsHistory)) {
        state.componentsHistory = undo(state.componentsHistory);
      }
    },
    redoComponents: (state) => {
      if (canRedo(state.componentsHistory)) {
        state.componentsHistory = redo(state.componentsHistory);
      }
    },
    clearHistory: (state) => {
      state.componentsHistory = createHistory([]);
    },
  },
});

export const {
  addToComponentsHistory,
  undoComponents,
  redoComponents,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;

export const selectHistoryState = (state: { history: HistoryStateStore }) =>
  state.history.componentsHistory;
export const selectCanUndo = (state: { history: HistoryStateStore }) =>
  canUndo(state.history.componentsHistory);
export const selectCanRedo = (state: { history: HistoryStateStore }) =>
  canRedo(state.history.componentsHistory);
export const selectHistoryInfo = (state: { history: HistoryStateStore }) => ({
  currentIndex: state.history.componentsHistory.past.length,
  totalSteps:
    state.history.componentsHistory.past.length +
    state.history.componentsHistory.future.length +
    1,
  canUndo: canUndo(state.history.componentsHistory),
  canRedo: canRedo(state.history.componentsHistory),
});
export const selectHistoryPresent = (state: { history: HistoryStateStore }) =>
  state.history.componentsHistory.present;
