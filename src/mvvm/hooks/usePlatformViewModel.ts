/**
 * Platform ViewModel Hook
 * React Hook for connecting to PlatformViewModel
 */

import { useEffect, useState, useRef } from 'react';
import { PlatformViewModel } from '../viewmodels/PlatformViewModel';
import { PlatformModel } from '../models/PlatformModel';

// 全局ViewModel实例（单例模式）
let platformViewModelInstance: PlatformViewModel | null = null;

export function usePlatformViewModel() {
  // 确保只有一个ViewModel实例
  if (!platformViewModelInstance) {
    platformViewModelInstance = new PlatformViewModel();
  }

  const viewModel = platformViewModelInstance;
  const [state, setState] = useState<PlatformModel>(viewModel.getState());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // 订阅ViewModel状态变化
    unsubscribeRef.current = viewModel.subscribe(() => {
      setState(viewModel.getState());
    });

    // 初始化状态
    setState(viewModel.getState());

    // 清理订阅
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [viewModel]);

  return {
    // 状态
    state,
    
    // 组件操作
    componentViewModel: viewModel.getComponentViewModel(),
    
    // 历史记录操作
    undo: () => viewModel.undo(),
    redo: () => viewModel.redo(),
    canUndo: () => viewModel.canUndo(),
    canRedo: () => viewModel.canRedo(),
    
    // UI状态操作
    setActiveTab: (tab: 'components' | 'tree' | 'data') => viewModel.setActiveTab(tab),
    setPreviewMode: (previewMode: boolean) => viewModel.setPreviewMode(previewMode),
    
    // 视口操作
    setViewport: (viewport: any) => viewModel.setViewport(viewport),
    
    // 主题操作
    setTheme: (theme: any) => viewModel.setTheme(theme),
    
    // 项目操作
    setProjectName: (name: string) => viewModel.setProjectName(name),
    
    // 数据源操作
    addDataSource: (dataSource: any) => viewModel.addDataSource(dataSource),
    removeDataSource: (id: string) => viewModel.removeDataSource(id),
    updateDataSource: (id: string, updates: any) => viewModel.updateDataSource(id, updates),
    
    // 自定义组件操作
    addCustomComponent: (component: any) => viewModel.addCustomComponent(component),
    removeCustomComponent: (id: string) => viewModel.removeCustomComponent(id),
    importCustomComponents: (components: any[]) => viewModel.importCustomComponents(components),
    
    // 模板操作
    applyTemplate: (templateComponents: any[]) => viewModel.applyTemplate(templateComponents),
    
    // 导入导出
    exportConfiguration: () => viewModel.exportConfiguration(),
    importConfiguration: (config: string) => viewModel.importConfiguration(config),
    
    // 重置
    reset: () => viewModel.reset(),
  };
}

// 获取ViewModel实例（用于非React环境）
export function getPlatformViewModel(): PlatformViewModel {
  if (!platformViewModelInstance) {
    platformViewModelInstance = new PlatformViewModel();
  }
  return platformViewModelInstance;
}