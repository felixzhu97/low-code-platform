/**
 * Component ViewModel - 组件视图模型
 * 负责组件相关的业务逻辑和状态管理
 */

import { ComponentModel, ComponentModelFactory, Position, ComponentProperties } from '../models/ComponentModel';

export class ComponentViewModel {
  private components: ComponentModel[] = [];
  private selectedComponentId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor(initialComponents: ComponentModel[] = []) {
    this.components = initialComponents;
  }

  // 订阅状态变化
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // 获取所有组件
  getComponents(): ComponentModel[] {
    return [...this.components];
  }

  // 获取选中的组件
  getSelectedComponent(): ComponentModel | null {
    if (!this.selectedComponentId) return null;
    return this.findComponentById(this.selectedComponentId);
  }

  // 选择组件
  selectComponent(componentId: string | null): void {
    this.selectedComponentId = componentId;
    this.notify();
  }

  // 添加组件
  addComponent(component: ComponentModel): void {
    this.components.push(component);
    this.notify();
  }

  // 删除组件
  deleteComponent(componentId: string): void {
    this.components = this.deleteComponentRecursive(this.components, componentId);
    if (this.selectedComponentId === componentId) {
      this.selectedComponentId = null;
    }
    this.notify();
  }

  private deleteComponentRecursive(components: ComponentModel[], targetId: string): ComponentModel[] {
    return components
      .filter(component => component.id !== targetId)
      .map(component => ({
        ...component,
        children: component.children ? this.deleteComponentRecursive(component.children, targetId) : []
      }));
  }

  // 更新组件属性
  updateComponentProperties(componentId: string, properties: Partial<ComponentProperties>): void {
    this.components = this.updateComponentRecursive(this.components, componentId, properties);
    this.notify();
  }

  private updateComponentRecursive(
    components: ComponentModel[],
    targetId: string,
    properties: Partial<ComponentProperties>
  ): ComponentModel[] {
    return components.map(component => {
      if (component.id === targetId) {
        return ComponentModelFactory.updateProperties(component, properties);
      }
      if (component.children) {
        return {
          ...component,
          children: this.updateComponentRecursive(component.children, targetId, properties)
        };
      }
      return component;
    });
  }

  // 移动组件
  moveComponent(componentId: string, newPosition: Position): void {
    this.updateComponentProperties(componentId, { position: newPosition });
  }

  // 复制组件
  duplicateComponent(componentId: string): ComponentModel | null {
    const component = this.findComponentById(componentId);
    if (!component) return null;

    const duplicated = ComponentModelFactory.clone(component);
    // 稍微偏移位置
    if (duplicated.position) {
      duplicated.position.x += 20;
      duplicated.position.y += 20;
    }

    this.addComponent(duplicated);
    return duplicated;
  }

  // 查找组件
  findComponentById(componentId: string): ComponentModel | null {
    return this.findComponentRecursive(this.components, componentId);
  }

  private findComponentRecursive(components: ComponentModel[], targetId: string): ComponentModel | null {
    for (const component of components) {
      if (component.id === targetId) {
        return component;
      }
      if (component.children) {
        const found = this.findComponentRecursive(component.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  // 获取组件树结构
  getComponentTree(): ComponentModel[] {
    return this.components.filter(component => !component.parentId);
  }

  // 切换组件可见性
  toggleComponentVisibility(componentId: string): void {
    const component = this.findComponentById(componentId);
    if (component) {
      const currentVisibility = component.properties?.visible !== false;
      this.updateComponentProperties(componentId, { visible: !currentVisibility });
    }
  }

  // 分组组件
  groupComponents(componentIds: string[], groupName: string): ComponentModel | null {
    if (componentIds.length < 2) return null;

    const componentsToGroup = componentIds
      .map(id => this.findComponentById(id))
      .filter(Boolean) as ComponentModel[];

    if (componentsToGroup.length < 2) return null;

    // 创建组容器
    const groupContainer = ComponentModelFactory.create('container', groupName);
    groupContainer.properties = {
      ...groupContainer.properties,
      isGroup: true,
      padding: '10px',
      bgColor: 'rgba(0, 0, 0, 0.03)',
    };

    // 计算组的位置
    const firstComponent = componentsToGroup[0];
    if (firstComponent.position) {
      groupContainer.position = { ...firstComponent.position };
    }

    // 调整子组件位置并设置父子关系
    groupContainer.children = componentsToGroup.map(component => ({
      ...component,
      parentId: groupContainer.id,
      position: {
        x: (component.position?.x || 0) - (groupContainer.position?.x || 0),
        y: (component.position?.y || 0) - (groupContainer.position?.y || 0),
      }
    }));

    // 从主组件列表中移除被分组的组件
    this.components = this.components.filter(c => !componentIds.includes(c.id));
    
    // 添加组容器
    this.addComponent(groupContainer);

    return groupContainer;
  }

  // 设置所有组件
  setComponents(components: ComponentModel[], notify: boolean = true): void {
    this.components = components;
    if (notify) {
      this.notify();
    }
  }

  // 清空所有组件
  clearComponents(): void {
    this.components = [];
    this.selectedComponentId = null;
    this.notify();
  }
}