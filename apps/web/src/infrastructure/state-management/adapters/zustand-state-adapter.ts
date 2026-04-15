import type {
  IStateManagementPort,
  ComponentState,
  CanvasState,
  ThemeState,
  DataSourceState,
  UIState,
  HistoryState,
} from "@/application/ports/state-management.port";
import type { Component } from "@/domain/component/entities/component.entity";
import type { DataSource } from "@/domain/datasource/entities/data-source.entity";
import type { ThemeConfig } from "@/domain/theme/entities/theme-config.entity";
import { store } from "../store";
import * as componentActions from "../store/slices/component.slice";
import * as canvasActions from "../store/slices/canvas.slice";
import * as themeActions from "../store/slices/theme.slice";
import * as dataActions from "../store/slices/data.slice";
import * as uiActions from "../store/slices/ui.slice";
import * as historyActions from "../store/slices/history.slice";

export class ZustandStateAdapter implements IStateManagementPort {
  private getState() {
    return store.getState();
  }

  getComponentState(): ComponentState {
    const state = this.getState().component;
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
    store.dispatch(componentActions.updateComponents(components));
  }

  addComponent(component: Component): void {
    store.dispatch(componentActions.addComponent(component));
  }

  updateComponent(id: string, updates: Partial<Component>): void {
    store.dispatch(componentActions.updateComponent({ id, updates }));
  }

  deleteComponent(id: string): void {
    store.dispatch(componentActions.deleteComponent(id));
  }

  selectComponent(component: Component | null): void {
    store.dispatch(componentActions.selectComponent(component));
  }

  clearSelection(): void {
    store.dispatch(componentActions.clearSelection());
  }

  setDragging(isDragging: boolean): void {
    store.dispatch(componentActions.setDragging(isDragging));
  }

  setDragOffset(offset: { x: number; y: number }): void {
    store.dispatch(componentActions.setDragOffset(offset));
  }

  setDropTarget(targetId: string | null): void {
    store.dispatch(componentActions.setDropTarget(targetId));
  }

  getCanvasState(): CanvasState {
    const state = this.getState().canvas;
    return {
      isPreviewMode: state.isPreviewMode,
      showGrid: state.showGrid,
      snapToGrid: state.snapToGrid,
      viewportWidth: state.viewportWidth,
      activeDevice: state.activeDevice,
    };
  }

  setPreviewMode(preview: boolean): void {
    store.dispatch(canvasActions.setPreviewMode(preview));
  }

  toggleGrid(): void {
    store.dispatch(canvasActions.toggleGrid());
  }

  toggleSnapToGrid(): void {
    store.dispatch(canvasActions.toggleSnapToGrid());
  }

  setViewportWidth(width: number): void {
    store.dispatch(canvasActions.setViewportWidth(width));
  }

  setActiveDevice(device: string): void {
    store.dispatch(canvasActions.setActiveDevice(device));
  }

  getThemeState(): ThemeState {
    const state = this.getState().theme;
    return {
      theme: state.theme,
      isDarkMode: state.isDarkMode,
      customThemes: state.customThemes,
    };
  }

  updateTheme(updates: Partial<ThemeConfig>): void {
    store.dispatch(themeActions.updateTheme(updates));
  }

  setTheme(theme: ThemeConfig): void {
    store.dispatch(themeActions.setTheme(theme));
  }

  toggleDarkMode(): void {
    store.dispatch(themeActions.toggleDarkMode());
  }

  resetTheme(): void {
    store.dispatch(themeActions.resetTheme());
  }

  getDataSourceState(): DataSourceState {
    const state = this.getState().data;
    return {
      dataSources: state.dataSources,
      activeDataSource: state.activeDataSource,
      dataBindings: state.dataBindings,
    };
  }

  addDataSource(dataSource: DataSource): void {
    store.dispatch(dataActions.addDataSource(dataSource));
  }

  updateDataSource(id: string, updates: Partial<DataSource>): void {
    store.dispatch(dataActions.updateDataSource({ id, updates }));
  }

  deleteDataSource(id: string): void {
    store.dispatch(dataActions.deleteDataSource(id));
  }

  setActiveDataSource(id: string | null): void {
    store.dispatch(dataActions.setActiveDataSource(id));
  }

  getUIState(): UIState {
    const state = this.getState().ui;
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
    store.dispatch(uiActions.setActiveTab(tab));
  }

  toggleSidebar(): void {
    store.dispatch(uiActions.toggleSidebar());
  }

  toggleRightPanel(): void {
    store.dispatch(uiActions.toggleRightPanel());
  }

  toggleLeftPanel(): void {
    store.dispatch(uiActions.toggleLeftPanel());
  }

  setProjectName(name: string): void {
    store.dispatch(uiActions.setProjectName(name));
  }

  setLoading(loading: boolean): void {
    store.dispatch(uiActions.setLoading(loading));
  }

  getHistoryState(): HistoryState {
    const history = this.getState().history.componentsHistory;
    return {
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      currentIndex: history.past.length,
      totalSteps: history.past.length + history.future.length + 1,
    };
  }

  addToHistory(components: Component[]): void {
    store.dispatch(historyActions.addToComponentsHistory(components));
  }

  undo(): Component[] | null {
    const state = this.getState().history.componentsHistory;
    if (state.past.length === 0) return null;
    const previous = state.past[state.past.length - 1];
    store.dispatch(historyActions.undoComponents());
    return previous;
  }

  redo(): Component[] | null {
    const state = this.getState().history.componentsHistory;
    if (state.future.length === 0) return null;
    const next = state.future[0];
    store.dispatch(historyActions.redoComponents());
    return next;
  }

  canUndo(): boolean {
    return this.getState().history.componentsHistory.past.length > 0;
  }

  canRedo(): boolean {
    return this.getState().history.componentsHistory.future.length > 0;
  }
}
