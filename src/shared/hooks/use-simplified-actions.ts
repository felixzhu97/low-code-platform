import { useStores } from "../stores";

/**
 * 简化的操作hooks
 * 提供常用的组合操作，减少重复代码
 */
export function useSimplifiedActions() {
  const {
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    addToHistory,
    components,
  } = useStores();

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
