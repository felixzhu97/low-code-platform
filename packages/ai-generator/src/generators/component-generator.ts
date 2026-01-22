import type { Component } from "@lowcode-platform/component-utils/types";
import type {
  GenerateComponentOptions,
  AIClient,
  AIMessage,
} from "../types";
import { ComponentPromptBuilder } from "../prompts";
import { JSONParser } from "../parsers";

/**
 * 组件生成器
 * 负责将 AI 响应转换为 Component 实体
 */
export class ComponentGenerator {
  private promptBuilder: ComponentPromptBuilder;
  private parser: JSONParser;

  constructor(private client: AIClient) {
    this.promptBuilder = new ComponentPromptBuilder();
    this.parser = new JSONParser();
  }

  /**
   * 生成组件
   */
  async generate(options: GenerateComponentOptions): Promise<Component> {
    const messages = this.buildMessages(options);
    const response = await this.client.generateJSON<Component>(messages, {
      type: "object",
      properties: {
        id: { type: "string" },
        type: { type: "string" },
        name: { type: "string" },
        position: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
          },
        },
        properties: { type: "object" },
        children: {
          type: "array",
          items: { type: "object" },
        },
        parentId: { type: ["string", "null"] },
        dataSource: { type: ["string", "null"] },
        dataMapping: { type: "array" },
      },
      required: ["id", "type", "name"],
    });

    // 应用用户提供的选项
    if (options.position) {
      response.position = options.position;
    }
    if (options.parentId !== undefined) {
      response.parentId = options.parentId;
    }

    // 确保 ID 存在
    if (!response.id) {
      response.id = this.generateId();
    }

    return response;
  }

  /**
   * 流式生成组件
   */
  async *stream(
    options: GenerateComponentOptions
  ): AsyncGenerator<Partial<Component>> {
    const messages = this.buildMessages(options);

    let accumulatedResponse = "";
    for await (const chunk of this.client.stream(messages)) {
      accumulatedResponse += chunk;
      // 尝试解析部分响应（可能不完整）
      try {
        const partial = this.parser.parseJSON<Partial<Component>>(
          accumulatedResponse
        );
        yield partial;
      } catch {
        // 忽略解析错误，继续累积
      }
    }

    // 最终解析完整响应
    try {
      const final = this.parser.parseComponent(accumulatedResponse);
      yield final;
    } catch (error) {
      // 如果最终解析也失败，返回已累积的内容
      yield { type: "error", name: String(error) } as Partial<Component>;
    }
  }

  /**
   * 构建消息列表
   */
  private buildMessages(options: GenerateComponentOptions): AIMessage[] {
    const systemPrompt = this.promptBuilder.buildSystemPrompt();
    const userPrompt = this.promptBuilder.buildComponentPrompt(options);

    return [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}