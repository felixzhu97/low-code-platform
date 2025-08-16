/**
 * Component ViewModel Hook
 * React Hook for component-specific operations
 */

import { useCallback } from 'react';
import { usePlatformViewModel } from './usePlatformViewModel';
import { ComponentModel, Position, ComponentProperties } from '../models/ComponentModel';

export function useComponentViewModel() {
  const { componentViewModel, state } = usePlatformViewModel();

  // 组件选择
  const selectComponent = useCallback((componentId: string | null) => {
    componentViewModel.selectComponent(componentId);
  }, [componentViewModel]);

  const getSelectedComponent = useCallback(() => {
    return componentViewModel.getSelectedComponent();
  }, [componentViewModel]);

  // 组件CRUD操作
  const addComponent = useCallback((component: ComponentModel) => {
    componentViewModel.addComponent(component);
  }, [componentViewModel]);

  const deleteComponent = useCallback((componentId: string) => {
    componentViewModel.deleteComponent(componentId);
  }, [componentViewModel]);

  const updateComponentProperties = useCallback((
    componentId: string, 
    properties: Partial<ComponentProperties>
  ) => {
    componentViewModel.updateComponentProperties(componentId, properties);
  }, [componentViewModel]);

  const duplicateComponent = useCallback((componentId: string) => {
    return componentViewModel.duplicateComponent(componentId);
  }, [componentViewModel]);

  // 组件移动
  const moveComponent = useCallback((componentId: string, newPosition: Position) => {
    componentViewModel.moveComponent(componentId, newPosition);
  }, [componentViewModel]);

  // 组件查找
  const findComponentById = useCallback((componentId: string) => {
    return componentViewModel.findComponentById(componentId);
  }, [componentViewModel]);

  // 组件树操作
  const getComponentTree = useCallback(() => {
    return componentViewModel.getComponentTree();
  }, [componentViewModel]);

  const toggleComponentVisibility = useCallback((componentId: string) => {
    componentViewModel.toggleComponentVisibility(componentId);
  }, [componentViewModel]);

  // 组件分组
  const groupComponents = useCallback((componentIds: string[], groupName: string) => {
    return componentViewModel.groupComponents(componentIds, groupName);
  }, [componentViewModel]);

  // 批量操作
  const setComponents = useCallback((components: ComponentModel[]) => {
    componentViewModel.setComponents(components);
  }, [componentViewModel]);

  const clearComponents = useCallback(() => {
    componentViewModel.clearComponents();
  }, [componentViewModel]);

  return {
    // 状态
    components: state.components,
    selectedComponent: componentViewModel.getSelectedComponent(),
    selectedComponentId: state.selectedComponentId,
    
    // 操作方法
    selectComponent,
    getSelectedComponent,
    addComponent,
    deleteComponent,
    updateComponentProperties,
    duplicateComponent,
    moveComponent,
    findComponentById,
    getComponentTree,
    toggleComponentVisibility,
    groupComponents,
    setComponents,
    clearComponents,
  };
}