// 统一导出所有 stores
export { useComponentStore } from "./component.store";
export { useCanvasStore } from "./canvas.store";
export { useThemeStore } from "./theme.store";
export { useDataStore } from "./data.store";
export { useHistoryStore } from "./history.store";
export { useUIStore } from "./ui.store";
export { useCustomComponentsStore } from "./custom-components.store";
export { PersistenceManager } from "./persistence.manager";

// 创建组合 hooks 用于简化使用
export { useStores } from "./use-stores";

// 为了向后兼容，也导出 useStores 作为 useAllStores 的别名
// 注意：建议使用 @/presentation/hooks 中的 useAllStores
export { useStores as useAllStores } from "./use-stores";
