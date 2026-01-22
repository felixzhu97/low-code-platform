import type { Component } from "@lowcode-platform/component-utils/types";
import type { PageSchema } from "@lowcode-platform/schema/types";
import { ParseError } from "../types";

/**
 * JSON 解析器
 * 负责解析 AI 返回的 JSON 响应并提取结构化数据
 */
export class JSONParser {
  /**
   * 解析组件 JSON
   */
  parseComponent(jsonString: string): Component {
    try {
      const data = this.parseJSON(jsonString);
      return this.validateAndNormalizeComponent(data);
    } catch (error) {
      throw new ParseError(
        `Failed to parse component: ${error instanceof Error ? error.message : String(error)}`,
        jsonString
      );
    }
  }

  /**
   * 解析页面 JSON
   */
  parsePage(jsonString: string): PageSchema {
    try {
      const data = this.parseJSON(jsonString);
      return this.validateAndNormalizePage(data);
    } catch (error) {
      throw new ParseError(
        `Failed to parse page: ${error instanceof Error ? error.message : String(error)}`,
        jsonString
      );
    }
  }

  /**
   * 解析通用 JSON
   */
  parseJSON<T = unknown>(jsonString: string): T {
    let cleaned = jsonString.trim();

    // 移除可能的 markdown 代码块标记
    if (cleaned.startsWith("```")) {
      const lines = cleaned.split("\n");
      const startIndex = lines[0].includes("json") ? 1 : 0;
      const endIndex =
        lines[lines.length - 1] === "```" ? lines.length - 1 : lines.length;
      cleaned = lines.slice(startIndex, endIndex).join("\n");
    }

    // 尝试提取 JSON 对象
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      return JSON.parse(cleaned) as T;
    } catch (error) {
      // 尝试修复常见的 JSON 格式问题
      cleaned = this.fixCommonJSONIssues(cleaned);
      try {
        return JSON.parse(cleaned) as T;
      } catch {
        throw new ParseError(
          `Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`,
          jsonString
        );
      }
    }
  }

  /**
   * 修复常见的 JSON 格式问题
   */
  private fixCommonJSONIssues(jsonString: string): string {
    let fixed = jsonString;

    // 修复尾随逗号
    fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

    // 修复单引号（在某些情况下）
    fixed = fixed.replace(/'/g, '"');

    // 修复未转义的双引号（简单修复，可能不完美）
    // 这里假设属性名都是有效的，不会包含特殊字符

    return fixed;
  }

  /**
   * 验证和规范化组件
   */
  private validateAndNormalizeComponent(data: unknown): Component {
    if (!data || typeof data !== "object") {
      throw new ParseError("Component data must be an object");
    }

    const obj = data as Record<string, unknown>;

    // 验证必需字段
    if (!obj.id || typeof obj.id !== "string") {
      obj.id = this.generateId();
    }

    if (!obj.type || typeof obj.type !== "string") {
      throw new ParseError("Component must have a 'type' field");
    }

    if (!obj.name || typeof obj.name !== "string") {
      obj.name = obj.type; // 使用 type 作为默认 name
    }

    // 规范化位置
    if (obj.position) {
      if (
        typeof obj.position !== "object" ||
        typeof (obj.position as Record<string, unknown>).x !== "number" ||
        typeof (obj.position as Record<string, unknown>).y !== "number"
      ) {
        delete obj.position;
      }
    }

    // 确保 properties 是对象
    if (obj.properties && typeof obj.properties !== "object") {
      obj.properties = {};
    }

    // 规范化 children
    if (obj.children !== undefined && !Array.isArray(obj.children)) {
      obj.children = [];
    }

    // 规范化 parentId
    if (obj.parentId !== null && obj.parentId !== undefined) {
      if (typeof obj.parentId !== "string") {
        obj.parentId = null;
      }
    }

    return obj as Component;
  }

  /**
   * 验证和规范化页面
   */
  private validateAndNormalizePage(data: unknown): PageSchema {
    if (!data || typeof data !== "object") {
      throw new ParseError("Page data must be an object");
    }

    const obj = data as Record<string, unknown>;

    // 验证版本
    if (!obj.version || typeof obj.version !== "string") {
      obj.version = "1.0.0";
    }

    // 验证和规范化 metadata
    if (!obj.metadata || typeof obj.metadata !== "object") {
      obj.metadata = {
        name: "Generated Page",
        description: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: obj.version as string,
      };
    } else {
      const metadata = obj.metadata as Record<string, unknown>;
      if (!metadata.name || typeof metadata.name !== "string") {
        metadata.name = "Generated Page";
      }
      if (!metadata.createdAt || typeof metadata.createdAt !== "string") {
        metadata.createdAt = new Date().toISOString();
      }
      if (!metadata.updatedAt || typeof metadata.updatedAt !== "string") {
        metadata.updatedAt = new Date().toISOString();
      }
      if (!metadata.version || typeof metadata.version !== "string") {
        metadata.version = obj.version as string;
      }
    }

    // 验证 components 数组
    if (!Array.isArray(obj.components)) {
      obj.components = [];
    } else {
      // 规范化每个组件
      obj.components = obj.components.map((comp) =>
        this.validateAndNormalizeComponent(comp)
      );
    }

    // 验证和规范化 canvas
    if (!obj.canvas || typeof obj.canvas !== "object") {
      obj.canvas = {
        showGrid: false,
        snapToGrid: false,
        viewportWidth: 1920,
        activeDevice: "desktop",
      };
    } else {
      const canvas = obj.canvas as Record<string, unknown>;
      if (typeof canvas.showGrid !== "boolean") {
        canvas.showGrid = false;
      }
      if (typeof canvas.snapToGrid !== "boolean") {
        canvas.snapToGrid = false;
      }
      if (typeof canvas.viewportWidth !== "number") {
        canvas.viewportWidth = 1920;
      }
      if (typeof canvas.activeDevice !== "string") {
        canvas.activeDevice = "desktop";
      }
    }

    // 确保 theme 存在（可以是任意值）
    if (!obj.theme) {
      obj.theme = {};
    }

    // 确保 dataSources 是数组
    if (!Array.isArray(obj.dataSources)) {
      obj.dataSources = [];
    }

    return obj as PageSchema;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    // 简单的 ID 生成（在实际使用中可以考虑使用 nanoid 或 uuid）
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}