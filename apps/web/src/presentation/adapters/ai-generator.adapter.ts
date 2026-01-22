import type { Component } from "@/domain/component";
import type { PageSchema } from "@/domain/entities/schema.types";
import {
  AIGenerator,
  OpenAIClient,
  ClaudeClient,
  DeepSeekClient,
  type AIClientError,
  type ParseError,
  type ValidationError,
} from "@lowcode-platform/ai-generator";
import { TemplateAdapter } from "./template.adapter";

export type AIProvider = "openai" | "claude" | "deepseek";

export interface AIGeneratorConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI 生成器适配器
 * 封装 AI 生成器调用逻辑，处理生成的组件/页面到画布的转换
 */
export class AIGeneratorAdapter {
  private generator: AIGenerator | null = null;
  private templateAdapter: TemplateAdapter;

  constructor(templateAdapter: TemplateAdapter) {
    this.templateAdapter = templateAdapter;
  }

  /**
   * 初始化 AI 生成器
   */
  initialize(config: AIGeneratorConfig): void {
    let client;

    switch (config.provider) {
      case "openai":
        client = new OpenAIClient({
          apiKey: config.apiKey,
          model: config.model || "gpt-4",
          temperature: config.temperature ?? 0.7,
          maxTokens: config.maxTokens ?? 2000,
        });
        break;
      case "claude":
        client = new ClaudeClient({
          apiKey: config.apiKey,
          model: config.model || "claude-3-opus-20240229",
          temperature: config.temperature ?? 0.7,
          maxTokens: config.maxTokens ?? 2000,
        });
        break;
      case "deepseek":
        client = new DeepSeekClient({
          apiKey: config.apiKey,
          model: config.model || "deepseek-chat",
          temperature: config.temperature ?? 0.7,
          maxTokens: config.maxTokens ?? 2000,
        });
        break;
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }

    this.generator = new AIGenerator({ client });
  }

  /**
   * 生成组件
   */
  async generateComponent(
    description: string,
    type?: string,
    position?: { x: number; y: number }
  ): Promise<Component> {
    if (!this.generator) {
      throw new Error("AI generator not initialized. Call initialize() first.");
    }

    try {
      const result = await this.generator.generateComponent({
        description,
        type,
        position: position || { x: 0, y: 0 },
      });

      return result.result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 生成页面
   */
  async generatePage(
    description: string,
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): Promise<Component[]> {
    if (!this.generator) {
      throw new Error("AI generator not initialized. Call initialize() first.");
    }

    try {
      const result = await this.generator.generatePage({
        description,
        layout: layout || "centered",
      });

      // 从 PageSchema 中提取 components
      const pageSchema = result.result as PageSchema;
      return pageSchema.components || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 应用生成的组件到画布
   */
  async applyComponentsToCanvas(components: Component[]): Promise<Component[]> {
    if (components.length === 0) {
      return [];
    }

    // 使用 TemplateAdapter 处理组件 ID 和引用关系
    return await this.templateAdapter.applyTemplateFromComponents(components);
  }

  /**
   * 处理错误
   */
  private handleError(error: unknown): void {
    if (error instanceof Error) {
      if ("statusCode" in error && (error as AIClientError).statusCode === 401) {
        throw new Error("API 密钥无效，请检查您的 API Key");
      } else if (
        "statusCode" in error &&
        (error as AIClientError).statusCode === 429
      ) {
        throw new Error("API 速率限制，请稍后重试");
      } else if (error instanceof ParseError) {
        throw new Error(`解析响应失败: ${error.message}`);
      } else if (error instanceof ValidationError) {
        throw new Error(
          `验证失败: ${error.errors?.join(", ") || error.message}`
        );
      }
    }
  }
}
