import type { DataSource } from "@/domain/datasource";
import { DataSourceService } from "./data-source.service";

/**
 * 数据源结构解析服务
 * 负责解析数据源的数据结构,提取所有可用的路径
 */
export class DataSourceStructureService {
  /**
   * 解析数据源结构,返回所有可用的路径
   */
  static async parseDataSourceStructure(
    dataSource: DataSource
  ): Promise<string[]> {
    try {
      const data = await DataSourceService.getDataSourceData(dataSource);
      return this.extractPaths(data);
    } catch (error) {
      console.error(`解析数据源 ${dataSource.id} 结构失败:`, error);
      // 如果无法获取数据,尝试解析静态数据
      if (dataSource.data) {
        return this.extractPaths(dataSource.data);
      }
      return [];
    }
  }

  /**
   * 从数据中提取所有路径
   */
  private static extractPaths(data: any, prefix: string = ""): string[] {
    const paths: string[] = [];

    if (data === null || data === undefined) {
      return paths;
    }

    if (Array.isArray(data)) {
      // 数组类型: 添加数组本身和第一个元素的路径
      if (prefix) {
        paths.push(prefix);
      }

      if (data.length > 0) {
        // 添加数组索引路径
        paths.push(`${prefix}[0]`);
        // 递归处理第一个元素(作为示例)
        const firstItemPaths = this.extractPaths(data[0], `${prefix}[0]`);
        paths.push(...firstItemPaths);
      }
    } else if (typeof data === "object") {
      // 对象类型: 添加当前路径(如果不是空对象)
      if (prefix && Object.keys(data).length > 0) {
        paths.push(prefix);
      }

      // 递归处理每个属性
      for (const [key, value] of Object.entries(data)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === undefined) {
          // 空值也添加路径
          paths.push(currentPath);
        } else if (Array.isArray(value)) {
          // 数组属性
          paths.push(currentPath);
          if (value.length > 0) {
            paths.push(`${currentPath}[0]`);
            const itemPaths = this.extractPaths(value[0], `${currentPath}[0]`);
            paths.push(...itemPaths);
          }
        } else if (typeof value === "object") {
          // 嵌套对象
          const nestedPaths = this.extractPaths(value, currentPath);
          paths.push(...nestedPaths);
        } else {
          // 原始值
          paths.push(currentPath);
        }
      }
    } else {
      // 原始值类型
      if (prefix) {
        paths.push(prefix);
      }
    }

    return paths;
  }

  /**
   * 获取路径的数据类型
   */
  static async getPathType(
    dataSource: DataSource,
    path: string
  ): Promise<string> {
    try {
      const data = await DataSourceService.getDataSourceData(dataSource);
      const value = this.getPathValue(data, path);

      if (Array.isArray(value)) {
        return "array";
      } else if (value === null) {
        return "null";
      } else {
        return typeof value;
      }
    } catch (error) {
      console.error(`获取路径 ${path} 类型失败:`, error);
      return "unknown";
    }
  }

  /**
   * 获取路径的值
   */
  static async getPathValue(
    dataSource: DataSource,
    path: string
  ): Promise<any> {
    try {
      const data = await DataSourceService.getDataSourceData(dataSource);
      return this.getPathValueFromData(data, path);
    } catch (error) {
      console.error(`获取路径 ${path} 值失败:`, error);
      return undefined;
    }
  }

  /**
   * 从数据中获取路径的值
   */
  private static getPathValueFromData(data: any, path: string): any {
    if (!path) {
      return data;
    }

    const parts = path.split(".");
    let current = data;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // 处理数组索引
      if (part.includes("[") && part.includes("]")) {
        const arrayKey = part.substring(0, part.indexOf("["));
        const index = parseInt(
          part.substring(part.indexOf("[") + 1, part.indexOf("]"))
        );

        if (arrayKey) {
          current = current?.[arrayKey];
        }

        if (Array.isArray(current)) {
          current = current[index];
        } else {
          return undefined;
        }
      } else {
        current = current?.[part];
      }

      if (current === undefined || current === null) {
        return undefined;
      }
    }

    return current;
  }

  /**
   * 验证路径是否有效
   */
  static async validatePath(
    dataSource: DataSource,
    path: string
  ): Promise<boolean> {
    try {
      const value = await this.getPathValue(dataSource, path);
      return value !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * 获取路径的示例值(用于预览)
   */
  static async getPathSample(
    dataSource: DataSource,
    path: string,
    maxLength: number = 50
  ): Promise<string> {
    try {
      const value = await this.getPathValue(dataSource, path);
      if (value === undefined || value === null) {
        return "null";
      }

      if (typeof value === "string") {
        return value.length > maxLength
          ? `${value.substring(0, maxLength)}...`
          : value;
      }

      if (Array.isArray(value)) {
        return `[Array(${value.length})]`;
      }

      if (typeof value === "object") {
        return `{Object}`;
      }

      return String(value);
    } catch (error) {
      return "N/A";
    }
  }
}
