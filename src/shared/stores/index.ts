// 统一导出所有 stores
export { useComponentStore } from "./component.store";
export { useCanvasStore } from "./canvas.store";
export { useThemeStore } from "./theme.store";
export { useDataStore } from "./data.store";
export { useHistoryStore } from "./history.store";
export { useUIStore } from "./ui.store";

// 创建组合 hooks 用于简化使用
export { useStores } from "./use-stores";
