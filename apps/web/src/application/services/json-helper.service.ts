/**
 * JSON工具服务
 * 提供JSON验证、格式化、分析等功能
 */

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

/**
 * JSON工具服务类
 */
export class JsonHelperService {
  /**
   * 验证JSON字符串
   */
  static validateJson(jsonString: string): JsonValidationResult {
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
      const errorMessage =
        error instanceof Error ? error.message : "未知错误";
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
    const validation = this.validateJson(jsonString);
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
    const validation = this.validateJson(jsonString);
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
        // 分析第一个元素的结构
        const itemAnalysis = this.analyzeJsonStructure(data[0]);
        itemAnalysis.paths.forEach((path) => {
          paths.push(`[0]${path.startsWith(".") ? path : "." + path}`);
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
    const validation = this.validateJson(jsonString);
    if (!validation.valid || validation.data === undefined) {
      return null;
    }

    return this.analyzeJsonStructure(validation.data);
  }

  /**
   * 提取所有可用路径
   */
  static extractPaths(data: any, prefix: string = ""): string[] {
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
        const firstItemPaths = this.extractPaths(
          data[0],
          `${prefix}[0]`
        );
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
    const validation = this.validateJson(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return Array.isArray(validation.data);
  }

  /**
   * 检查JSON是否为对象格式
   */
  static isObjectFormat(jsonString: string): boolean {
    const validation = this.validateJson(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return typeof validation.data === "object" && !Array.isArray(validation.data);
  }
}
