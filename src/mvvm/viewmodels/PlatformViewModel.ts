/**
 * Platform ViewModel - 平台视图模型
 * 负责整个平台的状态管理和业务逻辑协调
 */

import { PlatformModel, createDefaultPlatformModel, ThemeModel, ViewportModel, DataSourceModel } from '../models/PlatformModel';
import { ComponentModel } from '../models/ComponentModel';
import { ComponentViewModel } from './ComponentViewModel';
import { HistoryViewModel } from './HistoryViewModel';

export class PlatformViewModel {
  private model: PlatformModel;
  private componentViewModel: ComponentViewModel;
  private historyViewModel: HistoryViewModel<ComponentModel[]>;
  private listeners: Set<() => void> = new Set();

  constructor(initialModel?: Partial<PlatformModel>) {
    this.model = { ...createDefaultPlatformModel(), ...initialModel };
    this.componentViewModel = new ComponentViewModel(this.model.components);
    this.historyViewModel = new HistoryViewModel([...this.model.components]);

    // 订阅组件变化
    this.componentViewModel.subscribe(() => {
      const newComponents = this.componentViewModel.getComponents();
      this.model.components = newComponents;
      this.historyViewModel.addState([...newComponents]);
      this.notify();
    });
  }

  // 订阅状态变化
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // 获取完整的平台状态
  getState(): PlatformModel {
    return {
      ...this.model,
      components: this.componentViewModel.getComponents(),
      selectedComponentId: this.componentViewModel.getSelectedComponent()?.id || null,
    };
  }

  // 组件相关操作
  getComponentViewModel(): ComponentViewModel {
    return this.componentViewModel;
  }

  // 历史记录操作
  undo(): boolean {
    if (!this.historyViewModel.canUndo()) {
      return false;
    }
    
    const previousState = this.historyViewModel.undo();
    if (previousState) {
      // 临时取消订阅，避免循环触发
      this.componentViewModel.setComponents(previousState, false);
      this.model.components = previousState;
      this.notify();
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (!this.historyViewModel.canRedo()) {
      return false;
    }
    
    const nextState = this.historyViewModel.redo();
    if (nextState) {
      // 临时取消订阅，避免循环触发
      this.componentViewModel.setComponents(nextState, false);
      this.model.components = nextState;
      this.notify();
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.historyViewModel.canUndo();
  }

  canRedo(): boolean {
    return this.historyViewModel.canRedo();
  }

  // UI状态管理
  setActiveTab(tab: 'components' | 'tree' | 'data'): void {
    this.model.activeTab = tab;
    this.notify();
  }

  getActiveTab(): string {
    return this.model.activeTab;
  }

  setPreviewMode(previewMode: boolean): void {
    this.model.previewMode = previewMode;
    if (previewMode) {
      this.componentViewModel.selectComponent(null);
    }
    this.notify();
  }

  isPreviewMode(): boolean {
    return this.model.previewMode;
  }

  // 视口管理
  setViewport(viewport: Partial<ViewportModel>): void {
    this.model.viewport = { ...this.model.viewport, ...viewport };
    this.notify();
  }

  getViewport(): ViewportModel {
    return this.model.viewport;
  }

  // 主题管理
  setTheme(theme: Partial<ThemeModel>): void {
    this.model.theme = { ...this.model.theme, ...theme };
    this.notify();
  }

  getTheme(): ThemeModel {
    return this.model.theme;
  }

  // 项目管理
  setProjectName(name: string): void {
    this.model.projectName = name;
    this.notify();
  }

  getProjectName(): string {
    return this.model.projectName;
  }

  // 数据源管理
  addDataSource(dataSource: DataSourceModel): void {
    this.model.dataSources.push(dataSource);
    this.notify();
  }

  removeDataSource(dataSourceId: string): void {
    this.model.dataSources = this.model.dataSources.filter(ds => ds.id !== dataSourceId);
    this.notify();
  }

  updateDataSource(dataSourceId: string, updates: Partial<DataSourceModel>): void {
    const index = this.model.dataSources.findIndex(ds => ds.id === dataSourceId);
    if (index !== -1) {
      this.model.dataSources[index] = { ...this.model.dataSources[index], ...updates };
      this.notify();
    }
  }

  getDataSources(): DataSourceModel[] {
    return [...this.model.dataSources];
  }

  // 自定义组件库管理
  addCustomComponent(component: ComponentModel): void {
    this.model.customComponents.push(component);
    this.notify();
  }

  removeCustomComponent(componentId: string): void {
    this.model.customComponents = this.model.customComponents.filter(c => c.id !== componentId);
    this.notify();
  }

  getCustomComponents(): ComponentModel[] {
    return [...this.model.customComponents];
  }

  importCustomComponents(components: ComponentModel[]): void {
    this.model.customComponents.push(...components);
    this.notify();
  }

  // 模板应用
  applyTemplate(templateComponents: ComponentModel[]): void {
    try {
      // 处理模板组件，生成新的ID
      const processedComponents = templateComponents.map(component => 
        this.processTemplateComponent(component)
      );

      // 添加到画布
      processedComponents.forEach(component => {
        this.componentViewModel.addComponent(component);
      });

    } catch (error) {
      console.error('应用模板失败:', error);
      throw new Error('模板应用失败');
    }
  }

  private processTemplateComponent(component: ComponentModel): ComponentModel {
    const processed = {
      ...component,
      id: `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: component.children?.map(child => this.processTemplateComponent(child))
    };

    return processed;
  }

  // 导出配置
  exportConfiguration(): string {
    const config = {
      projectName: this.model.projectName,
      theme: this.model.theme,
      components: this.componentViewModel.getComponents(),
      dataSources: this.model.dataSources,
      customComponents: this.model.customComponents,
    };

    return JSON.stringify(config, null, 2);
  }

  // 导入配置
  importConfiguration(configJson: string): void {
    try {
      const config = JSON.parse(configJson);
      
      if (config.projectName) this.setProjectName(config.projectName);
      if (config.theme) this.setTheme(config.theme);
      if (config.components) this.componentViewModel.setComponents(config.components);
      if (config.dataSources) this.model.dataSources = config.dataSources;
      if (config.customComponents) this.model.customComponents = config.customComponents;

      this.notify();
    } catch (error) {
      console.error('导入配置失败:', error);
      throw new Error('配置文件格式错误');
    }
  }

  // 重置平台状态
  reset(): void {
    this.model = createDefaultPlatformModel();
    this.componentViewModel.clearComponents();
    this.historyViewModel = new HistoryViewModel([]);
    this.notify();
  }
}