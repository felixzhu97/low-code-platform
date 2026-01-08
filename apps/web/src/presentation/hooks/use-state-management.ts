import { useMemo } from "react";
import { AdapterFactory } from "@/presentation/adapters";

/**
 * 统一的状态管理 Hook
 * 通过适配器访问状态，隐藏基础设施层的实现细节
 */
export function useStateManagement() {
  const stateManagement = useMemo(
    () => AdapterFactory.getStateManagement(),
    []
  );

  return {
    // 组件状态
    getComponentState: () => stateManagement.getComponentState(),
    setComponents: (components: any[]) => stateManagement.setComponents(components),
    addComponent: (component: any) => stateManagement.addComponent(component),
    updateComponent: (id: string, updates: any) =>
      stateManagement.updateComponent(id, updates),
    deleteComponent: (id: string) => stateManagement.deleteComponent(id),
    selectComponent: (component: any) => stateManagement.selectComponent(component),
    clearSelection: () => stateManagement.clearSelection(),
    setDragging: (isDragging: boolean) => stateManagement.setDragging(isDragging),
    setDragOffset: (offset: { x: number; y: number }) =>
      stateManagement.setDragOffset(offset),
    setDropTarget: (targetId: string | null) =>
      stateManagement.setDropTarget(targetId),

    // 画布状态
    getCanvasState: () => stateManagement.getCanvasState(),
    setPreviewMode: (preview: boolean) => stateManagement.setPreviewMode(preview),
    toggleGrid: () => stateManagement.toggleGrid(),
    toggleSnapToGrid: () => stateManagement.toggleSnapToGrid(),
    setViewportWidth: (width: number) => stateManagement.setViewportWidth(width),
    setActiveDevice: (device: string) => stateManagement.setActiveDevice(device),

    // 主题状态
    getThemeState: () => stateManagement.getThemeState(),
    updateTheme: (updates: any) => stateManagement.updateTheme(updates),
    setTheme: (theme: any) => stateManagement.setTheme(theme),
    toggleDarkMode: () => stateManagement.toggleDarkMode(),
    resetTheme: () => stateManagement.resetTheme(),

    // 数据源状态
    getDataSourceState: () => stateManagement.getDataSourceState(),
    addDataSource: (dataSource: any) => stateManagement.addDataSource(dataSource),
    updateDataSource: (id: string, updates: any) =>
      stateManagement.updateDataSource(id, updates),
    deleteDataSource: (id: string) => stateManagement.deleteDataSource(id),
    setActiveDataSource: (id: string | null) =>
      stateManagement.setActiveDataSource(id),

    // UI状态
    getUIState: () => stateManagement.getUIState(),
    setActiveTab: (tab: string) => stateManagement.setActiveTab(tab),
    toggleSidebar: () => stateManagement.toggleSidebar(),
    toggleRightPanel: () => stateManagement.toggleRightPanel(),
    toggleLeftPanel: () => stateManagement.toggleLeftPanel(),
    setProjectName: (name: string) => stateManagement.setProjectName(name),
    setLoading: (loading: boolean) => stateManagement.setLoading(loading),

    // 历史状态
    getHistoryState: () => stateManagement.getHistoryState(),
    addToHistory: (components: any[]) => stateManagement.addToHistory(components),
    undo: () => stateManagement.undo(),
    redo: () => stateManagement.redo(),
    canUndo: () => stateManagement.canUndo(),
    canRedo: () => stateManagement.canRedo(),

    // 原始状态管理实例（用于需要直接访问的场景）
    stateManagement,
  };
}
