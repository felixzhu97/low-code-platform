import { useMemo } from "react";
import { AdapterFactory } from "@/presentation/adapters";

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
 * 注意：为了保持React响应式，状态读取仍通过stores，但操作通过适配器
 */
export function useComponentState() {
  // 导入stores仅用于响应式状态读取
  // 操作应通过适配器执行以遵循整洁架构
  const {
    useComponentStore,
    useCanvasStore,
    useThemeStore,
    useDataStore,
    useUIStore,
    useHistoryStore,
    useCustomComponentsStore,
  } = require("@/infrastructure/state-management/stores");
  
  const componentStore = useComponentStore();
  const { componentAdapter, stateManagement } = useAdapters();

  return {
    // 状态（通过stores获取响应式）
    components: componentStore.components,
    selectedComponent: componentStore.selectedComponent,
    selectedComponentId: componentStore.selectedComponentId,
    isDragging: componentStore.isDragging,
    dragOffset: componentStore.dragOffset,
    dropTargetId: componentStore.dropTargetId,

    // 操作（通过适配器）
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
    selectComponent: (component: any) => stateManagement.selectComponent(component),
    clearSelection: () => stateManagement.clearSelection(),
    setDragging: (isDragging: boolean) => stateManagement.setDragging(isDragging),
    setDragOffset: (offset: { x: number; y: number }) =>
      stateManagement.setDragOffset(offset),
    setDropTarget: (targetId: string | null) =>
      stateManagement.setDropTarget(targetId),
    updateComponents: (components: any[]) => stateManagement.setComponents(components),
  };
}

/**
 * 使用画布状态的 Hook
 * 提供画布相关的状态和操作
 * 注意：为了保持React响应式，状态读取仍通过stores，但操作通过适配器
 */
export function useCanvasState() {
  const {
    useCanvasStore,
  } = require("@/infrastructure/state-management/stores");
  
  const canvasStore = useCanvasStore();
  const { canvasAdapter } = useAdapters();

  return {
    // 状态（通过stores获取响应式）
    isPreviewMode: canvasStore.isPreviewMode,
    showGrid: canvasStore.showGrid,
    snapToGrid: canvasStore.snapToGrid,
    viewportWidth: canvasStore.viewportWidth,
    activeDevice: canvasStore.activeDevice,

    // 操作（通过适配器）
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
 * 注意：为了保持React响应式和向后兼容，这里仍然直接使用stores
 * 新代码应该使用 useStateManagement 或专门的 hooks
 */
export function useAllStores() {
  // 使用动态导入避免静态依赖，但仍然保持响应式
  const {
    useComponentStore,
    useCanvasStore,
    useThemeStore,
    useDataStore,
    useUIStore,
    useHistoryStore,
    useCustomComponentsStore,
  } = require("@/infrastructure/state-management/stores");
  
  const componentStore = useComponentStore();
  const canvasStore = useCanvasStore();
  const themeStore = useThemeStore();
  const dataStore = useDataStore();
  const uiStore = useUIStore();
  const historyStore = useHistoryStore();
  const customComponentsStore = useCustomComponentsStore();
  
  const { stateManagement } = useAdapters();

  return {
    // 组件相关
    components: componentStore.components,
    selectedComponent: componentStore.selectedComponent,
    selectedComponentId: componentStore.selectedComponentId,
    isDragging: componentStore.isDragging,
    addComponent: (component: any) => stateManagement.addComponent(component),
    updateComponent: (id: string, updates: any) => stateManagement.updateComponent(id, updates),
    deleteComponent: (id: string) => stateManagement.deleteComponent(id),
    selectComponent: (component: any) => stateManagement.selectComponent(component),
    clearSelection: () => stateManagement.clearSelection(),
    clearAllComponents: () => stateManagement.setComponents([]),

    // 画布相关
    isPreviewMode: canvasStore.isPreviewMode,
    showGrid: canvasStore.showGrid,
    snapToGrid: canvasStore.snapToGrid,
    viewportWidth: canvasStore.viewportWidth,
    activeDevice: canvasStore.activeDevice,
    setPreviewMode: (preview: boolean) => stateManagement.setPreviewMode(preview),
    toggleGrid: () => stateManagement.toggleGrid(),
    toggleSnapToGrid: () => stateManagement.toggleSnapToGrid(),
    setViewportWidth: (width: number) => stateManagement.setViewportWidth(width),
    setActiveDevice: (device: string) => stateManagement.setActiveDevice(device),

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

/**
 * 简化的操作hooks
 * 提供常用的组合操作，减少重复代码
 * 从 shared/hooks 移到此位置以符合整洁架构
 */
export function useSimplifiedActions() {
  const {
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    addToHistory,
    components,
  } = useAllStores();

  // 添加组件并记录历史
  const addComponentWithHistory = (component: any) => {
    addComponent(component);
    addToHistory(components);
  };

  // 更新组件并记录历史
  const updateComponentWithHistory = (id: string, updates: any) => {
    updateComponent(id, updates);
    addToHistory(components);
  };

  // 删除组件并记录历史
  const deleteComponentWithHistory = (id: string) => {
    deleteComponent(id);
    addToHistory(components);
  };

  // 批量添加组件并记录历史
  const addComponentsWithHistory = (componentsToAdd: any[]) => {
    componentsToAdd.forEach((component) => {
      addComponent(component);
    });
    addToHistory(components);
  };

  return {
    addComponentWithHistory,
    updateComponentWithHistory,
    deleteComponentWithHistory,
    addComponentsWithHistory,
  };
}
