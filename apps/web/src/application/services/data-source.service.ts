import type { DataSource, DataSourceConfig } from "@/domain/datasource";
import { getWasmAdapter } from "@/infrastructure/wasm";

/**
 * 数据源管理服务
 * 负责数据源的CRUD操作、数据获取、缓存管理等
 */
export class DataSourceService {
  private static dataSourceCache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  /**
   * 创建数据源
   */
  static createDataSource(
    name: string,
    type: DataSource["type"],
    data: any,
    config?: DataSourceConfig
  ): DataSource {
    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      data,
      config,
      lastUpdated: new Date().toISOString(),
      status: "active",
    };
  }

  /**
   * 更新数据源
   */
  static updateDataSource(
    dataSource: DataSource,
    updates: Partial<DataSource>
  ): DataSource {
    return {
      ...dataSource,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 删除数据源
   */
  static deleteDataSource(
    dataSourceId: string,
    dataSources: DataSource[]
  ): DataSource[] {
    // 清除缓存
    this.dataSourceCache.delete(dataSourceId);
    return dataSources.filter((ds) => ds.id !== dataSourceId);
  }

  /**
   * 获取数据源数据
   */
  static async getDataSourceData(dataSource: DataSource): Promise<any> {
    // 检查缓存
    if (dataSource.config?.cacheEnabled) {
      const cached = this.dataSourceCache.get(dataSource.id);
      if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
        return cached.data;
      }
    }

    try {
      let data: any;

      switch (dataSource.type) {
        case "static":
          data = dataSource.data;
          break;

        case "api":
          data = await this.fetchApiData(dataSource);
          break;

        case "database":
          data = await this.fetchDatabaseData(dataSource);
          break;

        case "file":
          data = await this.fetchFileData(dataSource);
          break;

        case "websocket":
          data = await this.fetchWebSocketData(dataSource);
          break;

        default:
          throw new Error(`不支持的数据源类型: ${dataSource.type}`);
      }

      // 更新缓存
      if (dataSource.config?.cacheEnabled) {
        this.dataSourceCache.set(dataSource.id, {
          data,
          timestamp: Date.now(),
          ttl: dataSource.config.cacheTTL || 300, // 默认5分钟
        });
      }

      return data;
    } catch (error) {
      console.error(`获取数据源 ${dataSource.name} 数据失败:`, error);
      throw error;
    }
  }

  /**
   * 获取API数据
   */
  private static async fetchApiData(dataSource: DataSource): Promise<any> {
    const config = dataSource.config;
    if (!config?.url) {
      throw new Error("API数据源缺少URL配置");
    }

    const requestOptions: RequestInit = {
      method: config.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      signal: AbortSignal.timeout(config.timeout || 10000),
    };

    if (config.body && config.method !== "GET") {
      requestOptions.body =
        typeof config.body === "string"
          ? config.body
          : JSON.stringify(config.body);
    }

    // 构建URL参数
    const url = new URL(config.url);
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    let retryCount = config.retryCount || 0;
    let lastError: Error;

    while (retryCount >= 0) {
      try {
        const response = await fetch(url.toString(), requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        if (retryCount > 0) {
          retryCount--;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒后重试
        } else {
          break;
        }
      }
    }

    throw lastError!;
  }

  /**
   * 获取数据库数据
   */
  private static async fetchDatabaseData(dataSource: DataSource): Promise<any> {
    const config = dataSource.config;
    if (!config?.connectionString || !config?.query) {
      throw new Error("数据库数据源缺少连接字符串或查询语句");
    }

    // 这里应该根据实际的数据库类型进行连接
    // 由于浏览器环境限制，这里返回模拟数据
    console.warn("数据库数据源在浏览器环境中不可用，返回模拟数据");
    return [
      { id: 1, name: "数据库记录1", value: 100 },
      { id: 2, name: "数据库记录2", value: 200 },
    ];
  }

  /**
   * 获取文件数据
   */
  private static async fetchFileData(dataSource: DataSource): Promise<any> {
    const config = dataSource.config;
    if (!config?.filePath) {
      throw new Error("文件数据源缺少文件路径");
    }

    try {
      const response = await fetch(config.filePath);
      if (!response.ok) {
        throw new Error(`文件加载失败: ${response.statusText}`);
      }

      const text = await response.text();

      switch (config.fileType) {
        case "json":
          // 使用 WASM 验证 JSON
          console.log(
            "[DataSourceService] Parsing JSON file, text length:",
            text.length
          );
          try {
            const wasm = getWasmAdapter();
            const isValid = await wasm.dataParser.validateJson(text);
            if (!isValid) {
              throw new Error("Invalid JSON format");
            }
            console.log("[DataSourceService] JSON validation success via WASM");
            return JSON.parse(text);
          } catch (error) {
            console.warn("WASM JSON validation failed, using fallback:", error);
            return JSON.parse(text);
          }
        case "csv":
          return await this.parseCSV(text);
        case "xml":
          return await this.parseXML(text);
        default:
          return text;
      }
    } catch (error) {
      throw new Error(`文件数据源加载失败: ${error}`);
    }
  }

  /**
   * 获取WebSocket数据
   */
  private static async fetchWebSocketData(
    dataSource: DataSource
  ): Promise<any> {
    const config = dataSource.config;
    if (!config?.wsUrl) {
      throw new Error("WebSocket数据源缺少URL配置");
    }

    // WebSocket是实时连接，这里返回连接状态
    return {
      connected: false,
      url: config.wsUrl,
      message: "WebSocket连接需要实时处理",
    };
  }

  /**
   * 解析CSV数据
   */
  private static async parseCSV(csvText: string): Promise<any[]> {
    console.log(
      "[DataSourceService] parseCSV called, text length:",
      csvText.length
    );
    try {
      // 优先使用 WASM 解析
      const wasm = getWasmAdapter();
      const result = await wasm.dataParser.parseCsv(csvText);
      console.log(
        "[DataSourceService] parseCSV success via WASM, rows:",
        Array.isArray(result) ? result.length : "N/A"
      );
      return result;
    } catch (error) {
      console.warn("WASM CSV parsing failed, using fallback:", error);
      // 降级到 JavaScript 实现
      const lines = csvText.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length === headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          data.push(row);
        }
      }

      return data;
    }
  }

  /**
   * 解析XML数据
   */
  private static async parseXML(xmlText: string): Promise<any> {
    console.log(
      "[DataSourceService] parseXML called, text length:",
      xmlText.length
    );
    try {
      // 优先使用 WASM 解析
      const wasm = getWasmAdapter();
      const result = await wasm.dataParser.parseXml(xmlText);
      console.log("[DataSourceService] parseXML success via WASM");
      return result;
    } catch (error) {
      console.warn("WASM XML parsing failed, using fallback:", error);
      // 降级到 JavaScript 实现
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      // 转换为JSON格式
      return this.xmlToJson(xmlDoc.documentElement);
    }
  }

  /**
   * XML转JSON
   */
  private static xmlToJson(xml: Element): any {
    const result: any = {};

    if (xml.nodeType === 1) {
      // 元素节点
      if (xml.attributes.length > 0) {
        result["@attributes"] = {};
        for (let i = 0; i < xml.attributes.length; i++) {
          const attr = xml.attributes[i];
          result["@attributes"][attr.nodeName] = attr.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // 文本节点
      return xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const child = xml.childNodes[i] as Element;
        const nodeName = child.nodeName;

        if (result[nodeName] === undefined) {
          result[nodeName] = this.xmlToJson(child);
        } else {
          if (!Array.isArray(result[nodeName])) {
            result[nodeName] = [result[nodeName]];
          }
          result[nodeName].push(this.xmlToJson(child));
        }
      }
    }

    return result;
  }

  /**
   * 验证数据源配置
   */
  static validateDataSource(dataSource: DataSource): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!dataSource.name.trim()) {
      errors.push("数据源名称不能为空");
    }

    if (!dataSource.type) {
      errors.push("数据源类型不能为空");
    }

    switch (dataSource.type) {
      case "api":
        if (!dataSource.config?.url) {
          errors.push("API数据源必须配置URL");
        }
        break;
      case "database":
        if (!dataSource.config?.connectionString) {
          errors.push("数据库数据源必须配置连接字符串");
        }
        if (!dataSource.config?.query) {
          errors.push("数据库数据源必须配置查询语句");
        }
        break;
      case "file":
        if (!dataSource.config?.filePath) {
          errors.push("文件数据源必须配置文件路径");
        }
        break;
      case "websocket":
        if (!dataSource.config?.wsUrl) {
          errors.push("WebSocket数据源必须配置URL");
        }
        break;
      case "static":
        if (dataSource.data === undefined || dataSource.data === null) {
          errors.push("静态数据源必须提供数据");
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 清除所有缓存
   */
  static clearCache(): void {
    this.dataSourceCache.clear();
  }

  /**
   * 清除指定数据源缓存
   */
  static clearDataSourceCache(dataSourceId: string): void {
    this.dataSourceCache.delete(dataSourceId);
  }

  /**
   * 获取缓存状态
   */
  static getCacheStatus(): {
    size: number;
    entries: Array<{ id: string; age: number; ttl: number }>;
  } {
    const entries = Array.from(this.dataSourceCache.entries()).map(
      ([id, cache]) => ({
        id,
        age: Date.now() - cache.timestamp,
        ttl: cache.ttl,
      })
    );

    return {
      size: this.dataSourceCache.size,
      entries,
    };
  }
}
