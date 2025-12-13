import type { Component, DataSource, ThemeConfig } from "@/domain/entities/types";
import type { Template } from "@/domain/repositories";

/**
 * 组件状态接口
 */
export interface ComponentState {
  components: Component[];
  selectedComponent: Component | null;
  selectedComponentId: string | null;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  dropTargetId: string | null;
}

/**
 * 画布状态接口
 */
export interface CanvasState {
  isPreviewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  viewportWidth: number;
  activeDevice: string;
}

/**
 * 主题状态接口
 */
export interface ThemeState {
  theme: ThemeConfig;
  isDarkMode: boolean;
  customThemes: Record<string, ThemeConfig>;
}

/**
 * 数据源状态接口
 */
export interface DataSourceState {
  dataSources: DataSource[];
  activeDataSource: string | null;
  dataBindings: Record<string, any>;
}

/**
 * UI状态接口
 */
export interface UIState {
  activeTab: string;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  leftPanelCollapsed: boolean;
  projectName: string;
  isLoading: boolean;
  notifications: any[];
}

/**
 * 历史状态接口
 */
export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  currentIndex: number;
  totalSteps: number;
}

/**
 * 状态管理端口
 * 应用层对状态管理的抽象接口
 */
export interface IStateManagementPort {
  // 组件状态操作
  getComponentState(): ComponentState;
  setComponents(components: Component[]): void;
  addComponent(component: Component): void;
  updateComponent(id: string, updates: Partial<Component>): void;
  deleteComponent(id: string): void;
  selectComponent(component: Component | null): void;
  clearSelection(): void;
  setDragging(isDragging: boolean): void;
  setDragOffset(offset: { x: number; y: number }): void;
  setDropTarget(targetId: string | null): void;

  // 画布状态操作
  getCanvasState(): CanvasState;
  setPreviewMode(preview: boolean): void;
  toggleGrid(): void;
  toggleSnapToGrid(): void;
  setViewportWidth(width: number): void;
  setActiveDevice(device: string): void;

  // 主题状态操作
  getThemeState(): ThemeState;
  updateTheme(updates: Partial<ThemeConfig>): void;
  setTheme(theme: ThemeConfig): void;
  toggleDarkMode(): void;
  resetTheme(): void;

  // 数据源状态操作
  getDataSourceState(): DataSourceState;
  addDataSource(dataSource: DataSource): void;
  updateDataSource(id: string, updates: Partial<DataSource>): void;
  deleteDataSource(id: string): void;
  setActiveDataSource(id: string | null): void;

  // UI状态操作
  getUIState(): UIState;
  setActiveTab(tab: string): void;
  toggleSidebar(): void;
  toggleRightPanel(): void;
  toggleLeftPanel(): void;
  setProjectName(name: string): void;
  setLoading(loading: boolean): void;

  // 历史状态操作
  getHistoryState(): HistoryState;
  addToHistory(components: Component[]): void;
  undo(): Component[] | null;
  redo(): Component[] | null;
  canUndo(): boolean;
  canRedo(): boolean;
}

