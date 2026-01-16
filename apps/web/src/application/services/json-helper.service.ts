/**
 * JSON工具服务
 * 提供JSON验证、格式化、分析等功能
 *
 * 注意：此服务会自动尝试使用 Rust WASM 实现以获得更好的性能，
 * 如果 WASM 模块不可用，会自动降级到 TypeScript 实现。
 */

import { RustJsonProcessor } from "@/infrastructure/wasm";

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  data?: any;
}

export interface JsonAnalysisResult {
  type: "array" | "object" | "primitive" | "null" | "undefined";
  structure: any;
  paths: string[];
  sample?: any;
}

// 缓存 WASM 可用状态和是否已记录日志
let wasmLogRecorded = false;

// 缓存 WASM 可用状态（同步检查）
function checkWasmLoaded(): boolean {
  const loaded = RustJsonProcessor.isLoaded();
  // 首次检测到 WASM 可用时记录日志
  if (loaded && !wasmLogRecorded) {
    console.log("🚀 使用 Rust WASM 性能优化进行 JSON 处理");
    wasmLogRecorded = true;
  }
  return loaded;
}

// 在后台预初始化 WASM 模块（不阻塞）
// 使用 void 运算符避免 top-level await
void RustJsonProcessor.isAvailable().catch(() => {
  // 静默失败，使用 TS 实现
});

/**
 * JSON工具服务类
 */
export class JsonHelperService {
  /**
   * 验证JSON字符串
   */
  static validateJson(jsonString: string): JsonValidationResult {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.validateJson(jsonString);
        if (result) return result;
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM validateJson failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    return this.validateJsonTs(jsonString);
  }

  /**
   * TypeScript 实现的 JSON 验证（内部方法）
   */
  private static validateJsonTs(jsonString: string): JsonValidationResult {
    if (!jsonString || !jsonString.trim()) {
      return {
        valid: false,
        error: "JSON字符串不能为空",
      };
    }

    try {
      const data = JSON.parse(jsonString);
      return {
        valid: true,
        data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return {
        valid: false,
        error: `JSON格式错误: ${errorMessage}`,
      };
    }
  }

  /**
   * 格式化JSON字符串
   */
  static formatJson(jsonString: string, indent: number = 2): string {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.formatJson(jsonString, indent);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM formatJson failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    return this.formatJsonTs(jsonString, indent);
  }

  /**
   * TypeScript 实现的 JSON 格式化（内部方法）
   */
  private static formatJsonTs(jsonString: string, indent: number = 2): string {
    const validation = this.validateJsonTs(jsonString);
    if (!validation.valid || !validation.data) {
      return jsonString;
    }

    try {
      return JSON.stringify(validation.data, null, indent);
    } catch {
      return jsonString;
    }
  }

  /**
   * 压缩JSON字符串（移除空格和换行）
   */
  static minifyJson(jsonString: string): string {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.minifyJson(jsonString);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM minifyJson failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    return this.minifyJsonTs(jsonString);
  }

  /**
   * TypeScript 实现的 JSON 压缩（内部方法）
   */
  private static minifyJsonTs(jsonString: string): string {
    const validation = this.validateJsonTs(jsonString);
    if (!validation.valid || !validation.data) {
      return jsonString;
    }

    try {
      return JSON.stringify(validation.data);
    } catch {
      return jsonString;
    }
  }

  /**
   * 分析JSON数据结构
   */
  static analyzeJsonStructure(data: any): JsonAnalysisResult {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.analyzeJsonStructure(data);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn(
          "WASM analyzeJsonStructure failed, falling back to TS:",
          error
        );
      }
    }

    // TypeScript 实现（fallback）
    return this.analyzeJsonStructureTs(data);
  }

  /**
   * TypeScript 实现的 JSON 结构分析（内部方法）
   */
  private static analyzeJsonStructureTs(data: any): JsonAnalysisResult {
    if (data === null) {
      return {
        type: "null",
        structure: null,
        paths: [],
      };
    }

    if (data === undefined) {
      return {
        type: "undefined",
        structure: undefined,
        paths: [],
      };
    }

    if (Array.isArray(data)) {
      const paths: string[] = ["[]"];
      let sample: any = null;

      if (data.length > 0) {
        sample = data[0];
        // 总是添加 [0] 路径，即使元素是原始类型
        paths.push("[0]");
        // 分析第一个元素的结构
        const itemAnalysis = this.analyzeJsonStructure(data[0]);
        itemAnalysis.paths.forEach((path) => {
          // 避免重复添加 [0]
          if (path !== "[0]" && path !== "[]") {
            paths.push(`[0]${path.startsWith(".") ? path : "." + path}`);
          }
        });
      }

      return {
        type: "array",
        structure: Array.isArray(sample) ? "array[]" : typeof sample,
        paths,
        sample,
      };
    }

    if (typeof data === "object") {
      const paths: string[] = [];
      const structure: Record<string, any> = {};

      for (const [key, value] of Object.entries(data)) {
        paths.push(`.${key}`);
        structure[key] = typeof value;

        // 递归分析嵌套结构
        if (value !== null && typeof value === "object") {
          const nestedAnalysis = this.analyzeJsonStructure(value);
          nestedAnalysis.paths.forEach((path) => {
            paths.push(`.${key}${path}`);
          });
        }
      }

      return {
        type: "object",
        structure,
        paths,
      };
    }

    // 原始类型
    return {
      type: "primitive",
      structure: typeof data,
      paths: [],
      sample: data,
    };
  }

  /**
   * 从JSON字符串分析结构
   */
  static analyzeJsonString(jsonString: string): JsonAnalysisResult | null {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.analyzeJsonString(jsonString);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn(
          "WASM analyzeJsonString failed, falling back to TS:",
          error
        );
      }
    }

    // TypeScript 实现（fallback）
    const validation = this.validateJsonTs(jsonString);
    if (!validation.valid || validation.data === undefined) {
      return null;
    }

    return this.analyzeJsonStructureTs(validation.data);
  }

  /**
   * 提取所有可用路径
   */
  static extractPaths(data: any, prefix: string = ""): string[] {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.extractPaths(data, prefix);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM extractPaths failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    return this.extractPathsTs(data, prefix);
  }

  /**
   * TypeScript 实现的路径提取（内部方法）
   */
  private static extractPathsTs(data: any, prefix: string = ""): string[] {
    const paths: string[] = [];

    if (data === null || data === undefined) {
      return paths;
    }

    if (Array.isArray(data)) {
      if (prefix) {
        paths.push(prefix);
      }

      if (data.length > 0) {
        paths.push(`${prefix}[0]`);
        const firstItemPaths = this.extractPaths(data[0], `${prefix}[0]`);
        paths.push(...firstItemPaths);
      }
    } else if (typeof data === "object") {
      if (prefix && Object.keys(data).length > 0) {
        paths.push(prefix);
      }

      for (const [key, value] of Object.entries(data)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === undefined) {
          paths.push(currentPath);
        } else if (Array.isArray(value)) {
          paths.push(currentPath);
          if (value.length > 0) {
            paths.push(`${currentPath}[0]`);
            const itemPaths = this.extractPaths(value[0], `${currentPath}[0]`);
            paths.push(...itemPaths);
          }
        } else if (typeof value === "object") {
          const nestedPaths = this.extractPaths(value, currentPath);
          paths.push(...nestedPaths);
        } else {
          paths.push(currentPath);
        }
      }
    } else {
      if (prefix) {
        paths.push(prefix);
      }
    }

    return paths;
  }

  /**
   * 检查JSON是否为数组格式
   */
  static isArrayFormat(jsonString: string): boolean {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.isArrayFormat(jsonString);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM isArrayFormat failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    const validation = this.validateJsonTs(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return Array.isArray(validation.data);
  }

  /**
   * 检查JSON是否为对象格式
   */
  static isObjectFormat(jsonString: string): boolean {
    // 尝试使用 WASM 实现（如果已加载）
    if (checkWasmLoaded()) {
      try {
        const result = RustJsonProcessor.isObjectFormat(jsonString);
        if (result !== null) {
          return result;
        }
      } catch (error) {
        // WASM 调用失败，fallback 到 TS 实现
        console.warn("WASM isObjectFormat failed, falling back to TS:", error);
      }
    }

    // TypeScript 实现（fallback）
    const validation = this.validateJsonTs(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return (
      typeof validation.data === "object" && !Array.isArray(validation.data)
    );
  }
}
