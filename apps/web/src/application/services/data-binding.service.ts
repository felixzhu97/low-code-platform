import type { Component } from "@/domain/component";
import type { DataSource, DataMapping } from "@/domain/datasource";
import { DataSourceService } from "./data-source.service";

/**
 * 数据绑定服务
 * 负责组件与数据源的绑定、数据映射、数据转换等
 */
export class DataBindingService {
  /**
   * 绑定数据源到组件
   */
  static bindDataSource(
    component: Component,
    dataSourceId: string,
    dataMapping?: DataMapping[]
  ): Component {
    return {
      ...component,
      dataSource: dataSourceId,
      dataMapping: dataMapping || [],
    };
  }

  /**
   * 解绑数据源
   */
  static unbindDataSource(component: Component): Component {
    const { dataSource, dataMapping, ...rest } = component;
    return rest;
  }

  /**
   * 获取组件绑定的数据
   */
  static async getComponentData(
    component: Component,
    dataSources: DataSource[]
  ): Promise<any> {
    if (!component.dataSource) {
      return null;
    }

    const dataSource = dataSources.find((ds) => ds.id === component.dataSource);
    if (!dataSource) {
      console.warn(`数据源 ${component.dataSource} 不存在`);
      return null;
    }

    try {
      const rawData = await DataSourceService.getDataSourceData(dataSource);

      // 如果没有数据映射，直接返回原始数据
      if (!component.dataMapping || component.dataMapping.length === 0) {
        return rawData;
      }

      // 应用数据映射
      return this.applyDataMapping(rawData, component.dataMapping);
    } catch (error) {
      console.error(`获取组件 ${component.id} 数据失败:`, error);
      return null;
    }
  }

  /**
   * 应用数据映射
   */
  private static applyDataMapping(data: any, mappings: DataMapping[]): any {
    if (!mappings || mappings.length === 0) {
      return data;
    }

    const result: any = {};

    for (const mapping of mappings) {
      try {
        const sourceValue = this.getNestedValue(data, mapping.sourcePath);
        const transformedValue = this.transformValue(
          sourceValue,
          mapping.transform,
          mapping.defaultValue
        );
        this.setNestedValue(result, mapping.targetPath, transformedValue);
      } catch (error) {
        console.warn(
          `数据映射失败 ${mapping.sourcePath} -> ${mapping.targetPath}:`,
          error
        );
        if (mapping.defaultValue !== undefined) {
          this.setNestedValue(result, mapping.targetPath, mapping.defaultValue);
        }
      }
    }

    return result;
  }

  /**
   * 获取嵌套对象的值
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => {
      if (current === null || current === undefined) {
        return undefined;
      }

      // 处理数组索引
      if (key.includes("[") && key.includes("]")) {
        const arrayKey = key.substring(0, key.indexOf("["));
        const index = parseInt(
          key.substring(key.indexOf("[") + 1, key.indexOf("]"))
        );

        if (arrayKey) {
          const array = current[arrayKey];
          return Array.isArray(array) ? array[index] : undefined;
        } else {
          return Array.isArray(current) ? current[index] : undefined;
        }
      }

      return current[key];
    }, obj);
  }

  /**
   * 设置嵌套对象的值
   */
  private static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    const lastKey = keys.pop()!;

    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);

    target[lastKey] = value;
  }

  /**
   * 转换数据值
   */
  private static transformValue(
    value: any,
    transform?: string,
    defaultValue?: any
  ): any {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    if (!transform) {
      return value;
    }

    try {
      switch (transform) {
        case "string":
          return String(value);
        case "number":
          const num = Number(value);
          return isNaN(num) ? defaultValue : num;
        case "boolean":
          if (typeof value === "boolean") return value;
          if (typeof value === "string") {
            return value.toLowerCase() === "true" || value === "1";
          }
          return Boolean(value);
        case "date":
          const date = new Date(value);
          return isNaN(date.getTime()) ? defaultValue : date;
        case "json":
          if (typeof value === "string") {
            return JSON.parse(value);
          }
          return value;
        default:
          return value;
      }
    } catch (error) {
      console.warn(`数据转换失败:`, error);
      return defaultValue;
    }
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
    return {
      field,
      sourcePath,
      targetPath,
      transform,
      defaultValue,
    };
  }

  /**
   * 自动生成数据映射
   */
  static generateDataMapping(
    sourceData: any,
    targetStructure: any
  ): DataMapping[] {
    const mappings: DataMapping[] = [];

    if (Array.isArray(sourceData) && sourceData.length > 0) {
      // 处理数组数据
      const sampleItem = sourceData[0];
      this.generateMappingForObject(sampleItem, targetStructure, mappings);
    } else if (typeof sourceData === "object" && sourceData !== null) {
      // 处理对象数据
      this.generateMappingForObject(sourceData, targetStructure, mappings);
    }

    return mappings;
  }

  /**
   * 为对象生成映射
   */
  private static generateMappingForObject(
    sourceObj: any,
    targetObj: any,
    mappings: DataMapping[],
    prefix: string = ""
  ): void {
    for (const [key, value] of Object.entries(targetObj)) {
      const sourcePath = prefix ? `${prefix}.${key}` : key;
      const targetPath = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        // 递归处理嵌套对象
        this.generateMappingForObject(sourceObj, value, mappings, sourcePath);
      } else {
        // 检查源数据中是否存在对应字段
        if (sourceObj.hasOwnProperty(key)) {
          mappings.push({
            field: key,
            sourcePath,
            targetPath,
            transform: this.inferTransform(sourceObj[key]),
          });
        }
      }
    }
  }

  /**
   * 推断数据类型转换
   */
  private static inferTransform(
    value: any
  ): "string" | "number" | "boolean" | "date" | "json" {
    if (typeof value === "string") {
      // 检查是否为日期格式
      if (!isNaN(Date.parse(value))) {
        return "date";
      }
      // 检查是否为JSON格式
      try {
        JSON.parse(value);
        return "json";
      } catch {
        return "string";
      }
    } else if (typeof value === "number") {
      return "number";
    } else if (typeof value === "boolean") {
      return "boolean";
    } else {
      return "string";
    }
  }

  /**
   * 验证数据映射
   */
  static validateDataMapping(
    mapping: DataMapping,
    sourceData: any
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mapping.field.trim()) {
      errors.push("字段名不能为空");
    }

    if (!mapping.sourcePath.trim()) {
      errors.push("源路径不能为空");
    }

    if (!mapping.targetPath.trim()) {
      errors.push("目标路径不能为空");
    }

    // 检查源路径是否存在
    try {
      const value = this.getNestedValue(sourceData, mapping.sourcePath);
      if (value === undefined) {
        errors.push(`源路径 ${mapping.sourcePath} 在数据中不存在`);
      }
    } catch (error) {
      errors.push(`源路径 ${mapping.sourcePath} 格式不正确`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 预览数据映射结果
   */
  static previewDataMapping(
    sourceData: any,
    mappings: DataMapping[],
    limit: number = 5
  ): any[] {
    if (!Array.isArray(sourceData)) {
      return [this.applyDataMapping(sourceData, mappings)];
    }

    return sourceData
      .slice(0, limit)
      .map((item) => this.applyDataMapping(item, mappings));
  }
}
