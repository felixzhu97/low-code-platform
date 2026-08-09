import { useCallback } from "react";
import { useComponentStore } from "@/component/component.store";
import { useHistoryStore } from "@/lib/history.store";

/**
 * Composition helpers that read/write stores via getState so callers
 * do not subscribe to full store snapshots.
 */
export function useSimplifiedActions() {
  const addComponentWithHistory = useCallback((component: unknown) => {
    const { addComponent } = useComponentStore.getState();
    addComponent(component as Parameters<typeof addComponent>[0]);
    useHistoryStore
      .getState()
      .addToHistory(useComponentStore.getState().components);
  }, []);

  const updateComponentWithHistory = useCallback(
    (id: string, updates: unknown) => {
      const { updateComponent } = useComponentStore.getState();
      updateComponent(id, updates as Parameters<typeof updateComponent>[1]);
      useHistoryStore
        .getState()
        .addToHistory(useComponentStore.getState().components);
    },
    []
  );

  const deleteComponentWithHistory = useCallback((id: string) => {
    useComponentStore.getState().deleteComponent(id);
    useHistoryStore
      .getState()
      .addToHistory(useComponentStore.getState().components);
  }, []);

  const addComponentsWithHistory = useCallback((componentsToAdd: unknown[]) => {
    const { addComponent } = useComponentStore.getState();
    componentsToAdd.forEach((component) => {
      addComponent(component as Parameters<typeof addComponent>[0]);
    });
    useHistoryStore
      .getState()
      .addToHistory(useComponentStore.getState().components);
  }, []);

  return {
    addComponentWithHistory,
    updateComponentWithHistory,
    deleteComponentWithHistory,
    addComponentsWithHistory,
  };
}
