// 重定向到新的基础设施层位置
// 为了保持向后兼容，暂时保留此文件
export {
  useComponentStore,
  useCanvasStore,
  useThemeStore,
  useDataStore,
  useHistoryStore,
  useUIStore,
  useCustomComponentsStore,
  PersistenceManager,
  useStores,
} from "@/infrastructure/state-management/stores";

// 导出简化的操作hooks
export { useSimplifiedActions } from "../hooks/use-simplified-actions";
