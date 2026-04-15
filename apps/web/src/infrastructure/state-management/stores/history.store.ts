import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as historyActions from "../store/slices/history.slice";
import * as componentActions from "../store/slices/component.slice";
import type { Component } from "@/domain/component/entities/component.entity";
import { store } from "../store";

export const useHistoryStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.history);

  const syncComponentsToStore = useCallback((components: Component[]) => {
    store.dispatch(componentActions.updateComponents(components));
  }, []);

  const undo = useCallback(() => {
    const currentState = store.getState();
    const historyState = currentState.history.componentsHistory;
    
    if (historyState.past.length === 0) return null;

    const previous = historyState.past[historyState.past.length - 1];
    dispatch(historyActions.undoComponents());
    syncComponentsToStore(previous);
    return previous;
  }, [dispatch, syncComponentsToStore]);

  const redo = useCallback(() => {
    const currentState = store.getState();
    const historyState = currentState.history.componentsHistory;
    
    if (historyState.future.length === 0) return null;

    const next = historyState.future[0];
    dispatch(historyActions.redoComponents());
    syncComponentsToStore(next);
    return next;
  }, [dispatch, syncComponentsToStore]);

  return {
    ...state,
    addToHistory: (components: Component[]) =>
      dispatch(historyActions.addToComponentsHistory(components)),
    undo,
    redo,
    canUndo: () => state.componentsHistory.past.length > 0,
    canRedo: () => state.componentsHistory.future.length > 0,
    clearHistory: () => dispatch(historyActions.clearHistory()),
    getHistoryInfo: () => ({
      currentIndex: state.componentsHistory.past.length,
      totalSteps:
        state.componentsHistory.past.length +
        state.componentsHistory.future.length +
        1,
      canUndo: state.componentsHistory.past.length > 0,
      canRedo: state.componentsHistory.future.length > 0,
    }),
  };
};
