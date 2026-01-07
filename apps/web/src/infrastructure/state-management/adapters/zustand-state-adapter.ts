import type {
  IStateManagementPort,
  ComponentState,
  CanvasState,
  ThemeState,
  DataSourceState,
  UIState,
  HistoryState,
} from "@/application/ports/state-management.port";
import type { Component } from "@/domain/component";
import type { DataSource } from "@/domain/datasource";
import type { ThemeConfig } from "@/domain/theme";
import { useComponentStore } from "../stores/component.store";
import { useCanvasStore } from "../stores/canvas.store";
import { useThemeStore } from "../stores/theme.store";
import { useDataStore } from "../stores/data.store";
import { useUIStore } from "../stores/ui.store";
import { useHistoryStore } from "../stores/history.store";

/**
 * Zustand 状态管理适配器
 * 实现 IStateManagementPort 接口，将 Zustand stores 适配为应用层端口
 */
export class ZustandStateAdapter implements IStateManagementPort {
  // 组件状态操作
  getComponentState(): ComponentState {
    const state = useComponentStore.getState();
    return {
      components: state.components,
      selectedComponent: state.selectedComponent,
      selectedComponentId: state.selectedComponentId,
      isDragging: state.isDragging,
      dragOffset: state.dragOffset,
      dropTargetId: state.dropTargetId,
    };
  }

  setComponents(components: Component[]): void {
    useComponentStore.getState().updateComponents(components);
  }

  addComponent(component: Component): void {
    useComponentStore.getState().addComponent(component);
  }

  updateComponent(id: string, updates: Partial<Component>): void {
    useComponentStore.getState().updateComponent(id, updates);
  }

  deleteComponent(id: string): void {
    useComponentStore.getState().deleteComponent(id);
  }

  selectComponent(component: Component | null): void {
    useComponentStore.getState().selectComponent(component);
  }

  clearSelection(): void {
    useComponentStore.getState().clearSelection();
  }

  setDragging(isDragging: boolean): void {
    useComponentStore.getState().setDragging(isDragging);
  }

  setDragOffset(offset: { x: number; y: number }): void {
    useComponentStore.getState().setDragOffset(offset);
  }

  setDropTarget(targetId: string | null): void {
    useComponentStore.getState().setDropTarget(targetId);
  }

  // 画布状态操作
  getCanvasState(): CanvasState {
    const state = useCanvasStore.getState();
    return {
      isPreviewMode: state.isPreviewMode,
      showGrid: state.showGrid,
      snapToGrid: state.snapToGrid,
      viewportWidth: state.viewportWidth,
      activeDevice: state.activeDevice,
    };
  }

  setPreviewMode(preview: boolean): void {
    useCanvasStore.getState().setPreviewMode(preview);
  }

  toggleGrid(): void {
    useCanvasStore.getState().toggleGrid();
  }

  toggleSnapToGrid(): void {
    useCanvasStore.getState().toggleSnapToGrid();
  }

  setViewportWidth(width: number): void {
    useCanvasStore.getState().setViewportWidth(width);
  }

  setActiveDevice(device: string): void {
    useCanvasStore.getState().setActiveDevice(device);
  }

  // 主题状态操作
  getThemeState(): ThemeState {
    const state = useThemeStore.getState();
    return {
      theme: state.theme,
      isDarkMode: state.isDarkMode,
      customThemes: state.customThemes,
    };
  }

  updateTheme(updates: Partial<ThemeConfig>): void {
    useThemeStore.getState().updateTheme(updates);
  }

  setTheme(theme: ThemeConfig): void {
    useThemeStore.getState().setTheme(theme);
  }

  toggleDarkMode(): void {
    useThemeStore.getState().toggleDarkMode();
  }

  resetTheme(): void {
    useThemeStore.getState().resetTheme();
  }

  // 数据源状态操作
  getDataSourceState(): DataSourceState {
    const state = useDataStore.getState();
    return {
      dataSources: state.dataSources,
      activeDataSource: state.activeDataSource,
      dataBindings: state.dataBindings,
    };
  }

  addDataSource(dataSource: DataSource): void {
    useDataStore.getState().addDataSource(dataSource);
  }

  updateDataSource(id: string, updates: Partial<DataSource>): void {
    useDataStore.getState().updateDataSource(id, updates);
  }

  deleteDataSource(id: string): void {
    useDataStore.getState().deleteDataSource(id);
  }

  setActiveDataSource(id: string | null): void {
    useDataStore.getState().setActiveDataSource(id);
  }

  // UI状态操作
  getUIState(): UIState {
    const state = useUIStore.getState();
    return {
      activeTab: state.activeTab,
      sidebarCollapsed: state.sidebarCollapsed,
      rightPanelCollapsed: state.rightPanelCollapsed,
      leftPanelCollapsed: state.leftPanelCollapsed,
      projectName: state.projectName,
      isLoading: state.isLoading,
      notifications: state.notifications,
    };
  }

  setActiveTab(tab: string): void {
    useUIStore.getState().setActiveTab(tab);
  }

  toggleSidebar(): void {
    useUIStore.getState().toggleSidebar();
  }

  toggleRightPanel(): void {
    useUIStore.getState().toggleRightPanel();
  }

  toggleLeftPanel(): void {
    useUIStore.getState().toggleLeftPanel();
  }

  setProjectName(name: string): void {
    useUIStore.getState().setProjectName(name);
  }

  setLoading(loading: boolean): void {
    useUIStore.getState().setLoading(loading);
  }

  // 历史状态操作
  getHistoryState(): HistoryState {
    const info = useHistoryStore.getState().getHistoryInfo();
    return {
      canUndo: info.canUndo,
      canRedo: info.canRedo,
      currentIndex: info.currentIndex,
      totalSteps: info.totalSteps,
    };
  }

  addToHistory(components: Component[]): void {
    useHistoryStore.getState().addToHistory(components);
  }

  undo(): Component[] | null {
    return useHistoryStore.getState().undo();
  }

  redo(): Component[] | null {
    return useHistoryStore.getState().redo();
  }

  canUndo(): boolean {
    return useHistoryStore.getState().canUndo();
  }

  canRedo(): boolean {
    return useHistoryStore.getState().canRedo();
  }
}

