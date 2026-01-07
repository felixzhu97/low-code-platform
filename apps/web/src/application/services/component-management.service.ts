import type { Component } from "@/domain/component";
import type { DataSource, DataMapping } from "@/domain/datasource";
import { ComponentFactoryService } from "@/domain/component";
import { DataBindingService } from "./data-binding.service";

/**
 * 组件管理应用层服务
 * 负责组件的增删改查和数据绑定逻辑
 */
export class ComponentManagementService {
  /**
   * 获取组件绑定的数据源
   * @deprecated 使用 DataBindingService.getComponentData 替代
   */
  static getComponentData(component: Component, dataSources: DataSource[]) {
    if (!component.dataSource) return null;

    const dataSource = dataSources.find((ds) => ds.id === component.dataSource);
    if (!dataSource) return null;

    return dataSource.data;
  }

  /**
   * 获取组件绑定的数据（异步版本，支持数据转换）
   */
  static async getComponentDataAsync(
    component: Component,
    dataSources: DataSource[]
  ) {
    return DataBindingService.getComponentData(component, dataSources);
  }

  /**
   * 绑定数据源到组件
   */
  static bindDataSource(
    component: Component,
    dataSourceId: string,
    dataMapping?: DataMapping[]
  ): Component {
    return DataBindingService.bindDataSource(
      component,
      dataSourceId,
      dataMapping
    );
  }

  /**
   * 解绑数据源
   */
  static unbindDataSource(component: Component): Component {
    return DataBindingService.unbindDataSource(component);
  }

  /**
   * 创建数据映射
   */
  static createDataMapping(
    field: string,
    sourcePath: string,
    targetPath: string,
    transform?: "string" | "number" | "boolean" | "date" | "json",
    defaultValue?: any
  ): DataMapping {
    return DataBindingService.createDataMapping(
      field,
      sourcePath,
      targetPath,
      transform,
      defaultValue
    );
  }

  /**
   * 自动生成数据映射
   */
  static generateDataMapping(
    sourceData: any,
    targetStructure: any
  ): DataMapping[] {
    return DataBindingService.generateDataMapping(sourceData, targetStructure);
  }

  /**
   * 预览数据映射结果
   */
  static previewDataMapping(
    sourceData: any,
    mappings: DataMapping[],
    limit: number = 5
  ): any[] {
    return DataBindingService.previewDataMapping(sourceData, mappings, limit);
  }

  /**
   * 删除组件及其所有子组件
   */
  static deleteComponentAndChildren(
    componentId: string,
    components: Component[]
  ): Component[] {
    // 找出所有子组件ID
    const childIds = components
      .filter((comp) => comp.parentId === componentId)
      .map((comp) => comp.id);

    // 递归删除所有子组件
    let updatedComponents = [...components];
    for (const childId of childIds) {
      updatedComponents = this.deleteComponentAndChildren(
        childId,
        updatedComponents
      );
    }

    // 删除当前组件
    return updatedComponents.filter((comp) => comp.id !== componentId);
  }

  /**
   * 更新组件位置
   */
  static updateComponentPosition(
    componentId: string,
    position: { x: number; y: number },
    components: Component[]
  ): Component[] {
    return components.map((component) => {
      if (component.id === componentId) {
        return {
          ...component,
          position,
        };
      }
      return component;
    });
  }

  /**
   * 获取根级组件（没有父组件的组件）
   */
  static getRootComponents(components: Component[]): Component[] {
    return components.filter((comp) => !comp.parentId);
  }

  /**
   * 获取组件的子组件
   */
  static getChildComponents(
    componentId: string,
    components: Component[]
  ): Component[] {
    return components.filter((comp) => comp.parentId === componentId);
  }

  /**
   * 创建新组件
   */
  static createComponent(
    type: string,
    position: { x: number; y: number },
    parentId?: string | null,
    theme?: any
  ): Component {
    return ComponentFactoryService.createComponent(
      type,
      position,
      parentId,
      theme
    );
  }

  /**
   * 应用网格对齐
   */
  static snapToGrid(
    position: { x: number; y: number },
    gridSize: number = 20
  ): { x: number; y: number } {
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }

  /**
   * 检查组件是否为容器
   */
  static isContainer(type: string): boolean {
    return ComponentFactoryService.isContainer(type);
  }
}
