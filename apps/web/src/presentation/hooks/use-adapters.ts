import { useMemo } from "react";
import { AdapterFactory } from "@/presentation/adapters";
import {
  useComponentStore,
  useCanvasStore,
  useThemeStore,
  useDataStore,
  useUIStore,
  useHistoryStore,
  useCustomComponentsStore,
} from "@/infrastructure/state-management/stores";

/**
 * 使用适配器的 Hook
 * 提供统一的适配器访问接口
 */
export function useAdapters() {
  const componentAdapter = useMemo(
    () => AdapterFactory.getComponentAdapter(),
    []
  );
  const canvasAdapter = useMemo(() => AdapterFactory.getCanvasAdapter(), []);
  const templateAdapter = useMemo(
    () => AdapterFactory.getTemplateAdapter(),
    []
  );
  const stateManagement = useMemo(
    () => AdapterFactory.getStateManagement(),
    []
  );

  return {
    componentAdapter,
    canvasAdapter,
    templateAdapter,
    stateManagement,
  };
}

/**
 * 使用组件状态的 Hook
 * 提供组件相关的状态和操作
 */
export function useComponentState() {
  const componentStore = useComponentStore();
  const { componentAdapter } = useAdapters();

  return {
    // 状态
    components: componentStore.components,
    selectedComponent: componentStore.selectedComponent,
    selectedComponentId: componentStore.selectedComponentId,
    isDragging: componentStore.isDragging,
    dragOffset: componentStore.dragOffset,
    dropTargetId: componentStore.dropTargetId,

    // 操作
    createComponent: componentAdapter.createComponent.bind(componentAdapter),
    updateComponent: componentAdapter.updateComponent.bind(componentAdapter),
    deleteComponent: componentAdapter.deleteComponent.bind(componentAdapter),
    getComponents: componentAdapter.getComponents.bind(componentAdapter),
    getComponentById: componentAdapter.getComponentById.bind(componentAdapter),
    getRootComponents:
      componentAdapter.getRootComponents.bind(componentAdapter),
    getComponentsByParentId:
      componentAdapter.getComponentsByParentId.bind(componentAdapter),
    updateComponentPosition:
      componentAdapter.updateComponentPosition.bind(componentAdapter),
    selectComponent: componentStore.selectComponent,
    clearSelection: componentStore.clearSelection,
    setDragging: componentStore.setDragging,
    setDragOffset: componentStore.setDragOffset,
    setDropTarget: componentStore.setDropTarget,
    updateComponents: componentStore.updateComponents,
  };
}

/**
 * 使用画布状态的 Hook
 * 提供画布相关的状态和操作
 */
export function useCanvasState() {
  const canvasStore = useCanvasStore();
  const { canvasAdapter } = useAdapters();

  return {
    // 状态
    isPreviewMode: canvasStore.isPreviewMode,
    showGrid: canvasStore.showGrid,
    snapToGrid: canvasStore.snapToGrid,
    viewportWidth: canvasStore.viewportWidth,
    activeDevice: canvasStore.activeDevice,

    // 操作
    setPreviewMode: canvasAdapter.setPreviewMode.bind(canvasAdapter),
    toggleGrid: canvasAdapter.toggleGrid.bind(canvasAdapter),
    toggleSnapToGrid: canvasAdapter.toggleSnapToGrid.bind(canvasAdapter),
    setViewportWidth: canvasAdapter.setViewportWidth.bind(canvasAdapter),
    setActiveDevice: canvasAdapter.setActiveDevice.bind(canvasAdapter),
  };
}

/**
 * 使用所有状态的 Hook（兼容旧代码）
 * 提供所有 stores 的状态访问
 */
export function useAllStores() {
  const componentStore = useComponentStore();
  const canvasStore = useCanvasStore();
  const themeStore = useThemeStore();
  const dataStore = useDataStore();
  const uiStore = useUIStore();
  const historyStore = useHistoryStore();
  const customComponentsStore = useCustomComponentsStore();

  return {
    // 组件相关
    components: componentStore.components,
    selectedComponent: componentStore.selectedComponent,
    selectedComponentId: componentStore.selectedComponentId,
    isDragging: componentStore.isDragging,
    addComponent: componentStore.addComponent,
    updateComponent: componentStore.updateComponent,
    deleteComponent: componentStore.deleteComponent,
    selectComponent: componentStore.selectComponent,
    clearSelection: componentStore.clearSelection,
    clearAllComponents: componentStore.clearAllComponents,

    // 画布相关
    isPreviewMode: canvasStore.isPreviewMode,
    showGrid: canvasStore.showGrid,
    snapToGrid: canvasStore.snapToGrid,
    viewportWidth: canvasStore.viewportWidth,
    activeDevice: canvasStore.activeDevice,
    setPreviewMode: canvasStore.setPreviewMode,
    toggleGrid: canvasStore.toggleGrid,
    toggleSnapToGrid: canvasStore.toggleSnapToGrid,
    setViewportWidth: canvasStore.setViewportWidth,
    setActiveDevice: canvasStore.setActiveDevice,

    // 主题相关
    theme: themeStore.theme,
    isDarkMode: themeStore.isDarkMode,
    customThemes: themeStore.customThemes,
    updateTheme: themeStore.updateTheme,
    setTheme: themeStore.setTheme,
    toggleDarkMode: themeStore.toggleDarkMode,
    resetTheme: themeStore.resetTheme,

    // 数据相关
    dataSources: dataStore.dataSources,
    activeDataSource: dataStore.activeDataSource,
    dataBindings: dataStore.dataBindings,
    addDataSource: dataStore.addDataSource,
    updateDataSource: dataStore.updateDataSource,
    deleteDataSource: dataStore.deleteDataSource,
    bindComponentToDataSource: dataStore.bindComponentToDataSource,
    unbindComponentFromDataSource: dataStore.unbindComponentFromDataSource,

    // 历史记录相关
    undo: historyStore.undo,
    redo: historyStore.redo,
    canUndo: historyStore.canUndo,
    canRedo: historyStore.canRedo,
    addToHistory: historyStore.addToHistory,
    getHistoryInfo: historyStore.getHistoryInfo,

    // UI相关
    activeTab: uiStore.activeTab,
    sidebarCollapsed: uiStore.sidebarCollapsed,
    rightPanelCollapsed: uiStore.rightPanelCollapsed,
    leftPanelCollapsed: uiStore.leftPanelCollapsed,
    projectName: uiStore.projectName,
    isLoading: uiStore.isLoading,
    notifications: uiStore.notifications,
    setActiveTab: uiStore.setActiveTab,
    toggleSidebar: uiStore.toggleSidebar,
    toggleRightPanel: uiStore.toggleRightPanel,
    toggleLeftPanel: uiStore.toggleLeftPanel,
    setProjectName: uiStore.setProjectName,
    setLoading: uiStore.setLoading,
    addNotification: uiStore.addNotification,
    removeNotification: uiStore.removeNotification,
    clearNotifications: uiStore.clearNotifications,

    // 自定义组件相关
    customComponents: customComponentsStore.customComponents,
    favorites: customComponentsStore.favorites,
    searchTerm: customComponentsStore.searchTerm,
    selectedCategory: customComponentsStore.selectedCategory,
    isBuilderOpen: customComponentsStore.isBuilderOpen,
    isLibraryOpen: customComponentsStore.isLibraryOpen,
    addCustomComponent: customComponentsStore.addCustomComponent,
    removeCustomComponent: customComponentsStore.removeCustomComponent,
    updateCustomComponent: customComponentsStore.updateCustomComponent,
    toggleFavorite: customComponentsStore.toggleFavorite,
    setSearchTerm: customComponentsStore.setSearchTerm,
    setSelectedCategory: customComponentsStore.setSelectedCategory,
    setBuilderOpen: customComponentsStore.setBuilderOpen,
    setLibraryOpen: customComponentsStore.setLibraryOpen,
    importCustomComponents: customComponentsStore.importCustomComponents,
    exportCustomComponents: customComponentsStore.exportCustomComponents,
    clearAllCustomComponents: customComponentsStore.clearAllCustomComponents,
    getFilteredComponents: customComponentsStore.getFilteredComponents,
    getComponentsByCategory: customComponentsStore.getComponentsByCategory,
    getFavoriteComponents: customComponentsStore.getFavoriteComponents,
  };
}
