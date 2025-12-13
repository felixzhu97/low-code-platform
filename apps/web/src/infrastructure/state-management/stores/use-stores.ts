import { useComponentStore } from "./component.store";
import { useCanvasStore } from "./canvas.store";
import { useThemeStore } from "./theme.store";
import { useDataStore } from "./data.store";
import { useHistoryStore } from "./history.store";
import { useUIStore } from "./ui.store";
import { useCustomComponentsStore } from "./custom-components.store";

/**
 * 组合所有 stores 的 hook
 * 提供统一的状态访问接口
 */
export function useStores() {
  const componentStore = useComponentStore();
  const canvasStore = useCanvasStore();
  const themeStore = useThemeStore();
  const dataStore = useDataStore();
  const historyStore = useHistoryStore();
  const uiStore = useUIStore();
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
