import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as componentActions from "../store/slices/component.slice";
import type { Component } from "@/domain/component/entities/component.entity";

export const useComponentStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.component);

  return {
    ...state,
    addComponent: (component: Component) =>
      dispatch(componentActions.addComponent(component)),
    updateComponent: (id: string, updates: Partial<Component>) =>
      dispatch(componentActions.updateComponent({ id, updates })),
    deleteComponent: (id: string) =>
      dispatch(componentActions.deleteComponent(id)),
    deleteComponentAndChildren: (id: string) =>
      dispatch(componentActions.deleteComponentAndChildren(id)),
    updateComponentPosition: (
      id: string,
      position: { x: number; y: number }
    ) =>
      dispatch(
        componentActions.updateComponentPosition({ id, position })
      ),
    selectComponent: (component: Component | null) =>
      dispatch(componentActions.selectComponent(component)),
    clearSelection: () => dispatch(componentActions.clearSelection()),
    clearAllComponents: () =>
      dispatch(componentActions.clearAllComponents()),
    setDragging: (isDragging: boolean) =>
      dispatch(componentActions.setDragging(isDragging)),
    setDragOffset: (offset: { x: number; y: number }) =>
      dispatch(componentActions.setDragOffset(offset)),
    setDropTarget: (targetId: string | null) =>
      dispatch(componentActions.setDropTarget(targetId)),
    updateComponents: (components: Component[]) =>
      dispatch(componentActions.updateComponents(components)),
  };
};
