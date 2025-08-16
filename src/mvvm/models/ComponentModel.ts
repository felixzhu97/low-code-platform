/**
 * Component Model - 组件数据模型
 * 负责组件的数据结构定义和基础操作
 */

export interface Position {
  x: number;
  y: number;
}

export interface ComponentProperties {
  [key: string]: any;
  visible?: boolean;
  animation?: any;
}

export interface ComponentModel {
  id: string;
  type: string;
  name: string;
  position?: Position;
  properties?: ComponentProperties;
  children?: ComponentModel[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: Record<string, string>;
}

export class ComponentModelFactory {
  static create(
    type: string,
    name: string,
    position?: Position,
    properties?: ComponentProperties
  ): ComponentModel {
    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      position: position || { x: 0, y: 0 },
      properties: properties || {},
      children: [],
      parentId: null,
    };
  }

  static clone(component: ComponentModel): ComponentModel {
    return {
      ...component,
      id: `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: component.children?.map(child => ComponentModelFactory.clone(child)),
    };
  }

  static updateProperties(
    component: ComponentModel,
    properties: Partial<ComponentProperties>
  ): ComponentModel {
    return {
      ...component,
      properties: {
        ...component.properties,
        ...properties,
      },
    };
  }
}