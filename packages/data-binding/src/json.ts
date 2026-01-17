/**
 * JSON 工具函数
 * 提取自 json-helper.service.ts
 */

/**
 * JSON 验证结果
 */
export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  data?: unknown;
}

/**
 * JSON 工具类
 */
export class JsonHelper {
  /**
   * 验证 JSON 字符串
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
   * 格式化 JSON 字符串
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
   * 压缩 JSON 字符串（移除空格和换行）
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
   * 检查 JSON 是否为数组格式
   */
  static isArrayFormat(jsonString: string): boolean {
    const validation = this.validateJson(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return Array.isArray(validation.data);
  }

  /**
   * 检查 JSON 是否为对象格式
   */
  static isObjectFormat(jsonString: string): boolean {
    const validation = this.validateJson(jsonString);
    if (!validation.valid || !validation.data) {
      return false;
    }
    return (
      typeof validation.data === "object" && !Array.isArray(validation.data)
    );
  }
}
