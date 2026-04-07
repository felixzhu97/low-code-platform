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
   * 增强容错：处理多行 JSON、markdown 代码块、边缘情况
   */
  parseJSON<T = unknown>(jsonString: string): T {
    // 步骤1：提取并清理 JSON 内容
    let cleaned = this.extractAndCleanJSON(jsonString);

    // 步骤2：尝试直接解析
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // 步骤3：尝试修复常见问题
      cleaned = this.fixCommonJSONIssues(cleaned);
      try {
        return JSON.parse(cleaned) as T;
      } catch (error) {
        // 步骤4：最后尝试深度清理（处理 Ollama 返回的特殊情况）
        cleaned = this.deepCleanJSON(cleaned);
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
  }

  /**
   * 提取并清理 JSON 内容
   * 处理 markdown 代码块、多行 JSON、边缘情况
   */
  private extractAndCleanJSON(input: string): string {
    let cleaned = input.trim();

    // 移除 ```json 或 ``` 等 markdown 代码块标记
    cleaned = this.stripMarkdownCodeBlocks(cleaned);

    // 移除可能的 "json" 或其他前缀文字
    cleaned = this.stripLeadingText(cleaned);

    // 提取第一个 { 到最后一个 } 之间的内容
    cleaned = this.extractJSONObject(cleaned);

    return cleaned;
  }

  /**
   * 移除 markdown 代码块（包括带语言标识的 ```json）
   */
  private stripMarkdownCodeBlocks(text: string): string {
    // 检查是否以 ``` 开头
    if (text.startsWith("```")) {
      const lines = text.split("\n");
      // 找到第一个 ``` 之后的开始索引
      let startIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "```" || line === "```json" || line === "```json ") {
          startIndex = i + 1;
          break;
        }
        if (!line.startsWith("```")) {
          startIndex = i;
          break;
        }
      }
      // 找到最后一个 ``` 之前的结束索引
      let endIndex = lines.length;
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line === "```") {
          endIndex = i;
          break;
        }
      }
      return lines.slice(startIndex, endIndex).join("\n");
    }
    return text;
  }

  /**
   * 移除开头的非 JSON 文本（如 "Here's the JSON:" 等）
   */
  private stripLeadingText(text: string): string {
    // 查找第一个 { 的位置
    const firstBrace = text.indexOf("{");
    if (firstBrace > 0) {
      // 提取从 { 开始的内容
      return text.substring(firstBrace);
    }
    return text;
  }

  /**
   * 提取 JSON 对象
   * 查找第一个 { 和最后一个 } 之间的内容，处理嵌套情况
   */
  private extractJSONObject(text: string): string {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      return text;
    }

    let extracted = text.substring(firstBrace, lastBrace + 1);

    // 清理可能的空行或多余空白
    extracted = extracted.replace(/^\s+|\s+$/g, "");

    return extracted;
  }

  /**
   * 修复常见的 JSON 格式问题
   */
  private fixCommonJSONIssues(jsonString: string): string {
    let fixed = jsonString;

    // 修复尾随逗号（包括数组中的）
    fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

    // 修复单引号为双引号
    fixed = fixed.replace(/'/g, '"');

    // 移除注释（如果存在）
    fixed = fixed.replace(/\/\/.*$/gm, "");
    fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, "");

    return fixed;
  }

  /**
   * 深度清理 JSON（处理 Ollama 返回的特殊边缘情况）
   */
  private deepCleanJSON(jsonString: string): string {
    let cleaned = jsonString;

    // 处理可能的换行问题
    cleaned = cleaned.replace(/\n/g, " ");
    cleaned = cleaned.replace(/\r/g, "");

    // 处理可能的制表符
    cleaned = cleaned.replace(/\t/g, " ");

    // 移除多余的空格
    cleaned = cleaned.replace(/\s+/g, " ");
    cleaned = cleaned.replace(/\s*([{},:])\s*/g, "$1");

    // 处理中文引号
    cleaned = cleaned.replace(/"/g, '"').replace(/"/g, '"');
    cleaned = cleaned.replace(/'/g, '"');

    // 处理可能的 undefined
    cleaned = cleaned.replace(/undefined/g, "null");

    // 处理可能的 trailing comma（再次检查）
    cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

    // 确保以 { 开头，以 } 结尾
    cleaned = cleaned.trim();
    if (!cleaned.startsWith("{")) {
      const firstBrace = cleaned.indexOf("{");
      if (firstBrace !== -1) {
        cleaned = cleaned.substring(firstBrace);
      }
    }
    if (!cleaned.endsWith("}")) {
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace !== -1) {
        cleaned = cleaned.substring(0, lastBrace + 1);
      }
    }

    return cleaned;
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

    return obj as unknown as Component;
  }

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

    // 验证 components 数组（AI 常返回嵌套 children 对象，需展平为 parentId 扁平列表）
    if (!Array.isArray(obj.components)) {
      obj.components = [];
    } else {
      obj.components = this.flattenPageComponents(obj.components);
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

    return obj as unknown as PageSchema;
  }

  /**
   * 将 AI 返回的嵌套 children（完整对象）展平为平台使用的扁平 components 列表。
   * 子节点通过 parentId 关联；父节点的 children 仅保留子 id 字符串。
   */
  flattenPageComponents(components: unknown[]): Component[] {
    if (!Array.isArray(components) || components.length === 0) {
      return [];
    }

    const flat: Component[] = [];

    const visit = (raw: unknown, parentId: string | null) => {
      if (raw === null || raw === undefined || typeof raw !== "object") {
        return;
      }

      const node = raw as Record<string, unknown>;
      const rawChildren = node.children;
      const nestedObjects: unknown[] = [];
      const childIdRefs: string[] = [];

      if (Array.isArray(rawChildren)) {
        for (const ch of rawChildren) {
          if (typeof ch === "string") {
            childIdRefs.push(ch);
          } else if (
            ch !== null &&
            typeof ch === "object" &&
            "id" in ch &&
            "type" in ch
          ) {
            nestedObjects.push(ch);
            const cid = (ch as Record<string, unknown>).id;
            if (typeof cid === "string") {
              childIdRefs.push(cid);
            }
          }
        }
      }

      const normalized = this.validateAndNormalizeComponent({
        ...node,
        children: childIdRefs,
        parentId,
      });
      flat.push(normalized);

      for (const child of nestedObjects) {
        visit(child, normalized.id);
      }
    };

    for (const root of components) {
      visit(root, null);
    }

    return flat;
  }

  private generateId(): string {
    // 简单的 ID 生成（在实际使用中可以考虑使用 nanoid 或 uuid）
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
