import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Component } from "@/domain/component";
import { ComponentManagementService } from "@/application/services/component-management.service";

interface ComponentState {
  // 状态
  components: Component[];
  selectedComponent: Component | null;
  selectedComponentId: string | null;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  dropTargetId: string | null;

  // 操作
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  deleteComponentAndChildren: (id: string) => void;
  updateComponentPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  selectComponent: (component: Component | null) => void;
  clearSelection: () => void;
  clearAllComponents: () => void;

  // 拖拽相关
  setDragging: (isDragging: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
  setDropTarget: (targetId: string | null) => void;

  // 批量操作
  updateComponents: (components: Component[]) => void;
  getRootComponents: () => Component[];
  getChildComponents: (parentId: string) => Component[];
}

export const useComponentStore = create<ComponentState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        components: [],
        selectedComponent: null,
        selectedComponentId: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        dropTargetId: null,

        // 添加组件
        addComponent: (component: Component) => {
          set(
            (state) => ({
              components: [...state.components, component],
            }),
            false,
            "addComponent"
          );
        },

        // 更新组件
        updateComponent: (id: string, updates: Partial<Component>) => {
          set(
            (state) => ({
              components: state.components.map((comp) =>
                comp.id === id ? { ...comp, ...updates } : comp
              ),
              selectedComponent:
                state.selectedComponent?.id === id
                  ? { ...state.selectedComponent, ...updates }
                  : state.selectedComponent,
            }),
            false,
            "updateComponent"
          );
        },

        // 删除组件
        deleteComponent: (id: string) => {
          set(
            (state) => ({
              components: state.components.filter((comp) => comp.id !== id),
              selectedComponent:
                state.selectedComponent?.id === id
                  ? null
                  : state.selectedComponent,
              selectedComponentId:
                state.selectedComponentId === id
                  ? null
                  : state.selectedComponentId,
            }),
            false,
            "deleteComponent"
          );
        },

        // 删除组件及其子组件
        deleteComponentAndChildren: (id: string) => {
          const { components } = get();
          const newComponents =
            ComponentManagementService.deleteComponentAndChildren(
              id,
              components
            );

          set(
            (state) => ({
              components: newComponents,
              selectedComponent:
                state.selectedComponent?.id === id
                  ? null
                  : state.selectedComponent,
              selectedComponentId:
                state.selectedComponentId === id
                  ? null
                  : state.selectedComponentId,
            }),
            false,
            "deleteComponentAndChildren"
          );
        },

        // 更新组件位置
        updateComponentPosition: (
          id: string,
          position: { x: number; y: number }
        ) => {
          const { components } = get();
          const updatedComponents =
            ComponentManagementService.updateComponentPosition(
              id,
              position,
              components
            );

          set(
            {
              components: updatedComponents,
            },
            false,
            "updateComponentPosition"
          );
        },

        // 选择组件
        selectComponent: (component: Component | null) => {
          set(
            {
              selectedComponent: component,
              selectedComponentId: component?.id || null,
            },
            false,
            "selectComponent"
          );
        },

        // 清除选择
        clearSelection: () => {
          set(
            {
              selectedComponent: null,
              selectedComponentId: null,
            },
            false,
            "clearSelection"
          );
        },

        // 清空所有组件
        clearAllComponents: () => {
          set(
            {
              components: [],
              selectedComponent: null,
              selectedComponentId: null,
            },
            false,
            "clearAllComponents"
          );
        },

        // 设置拖拽状态
        setDragging: (isDragging: boolean) => {
          set({ isDragging }, false, "setDragging");
        },

        // 设置拖拽偏移
        setDragOffset: (dragOffset: { x: number; y: number }) => {
          set({ dragOffset }, false, "setDragOffset");
        },

        // 设置拖拽目标
        setDropTarget: (dropTargetId: string | null) => {
          set({ dropTargetId }, false, "setDropTarget");
        },

        // 批量更新组件
        updateComponents: (components: Component[]) => {
          set({ components }, false, "updateComponents");
        },

        // 获取根级组件
        getRootComponents: () => {
          const { components } = get();
          return ComponentManagementService.getRootComponents(components);
        },

        // 获取子组件
        getChildComponents: (parentId: string) => {
          const { components } = get();
          return ComponentManagementService.getChildComponents(
            parentId,
            components
          );
        },
      }),
      {
        name: "component-store",
        partialize: (state) => ({
          components: state.components,
          selectedComponent: state.selectedComponent,
          selectedComponentId: state.selectedComponentId,
        }),
      }
    ),
    {
      name: "component-store",
    }
  )
);
