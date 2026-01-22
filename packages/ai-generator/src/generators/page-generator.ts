import type { PageSchema } from "@lowcode-platform/schema/types";
import type { GeneratePageOptions, AIClient, AIMessage } from "../types";
import { PagePromptBuilder } from "../prompts";
import { JSONParser } from "../parsers";

const SCHEMA_VERSION = "1.0.0";

/**
 * 页面生成器
 * 负责生成完整的 PageSchema
 */
export class PageGenerator {
  private promptBuilder: PagePromptBuilder;
  private parser: JSONParser;

  constructor(private client: AIClient) {
    this.promptBuilder = new PagePromptBuilder();
    this.parser = new JSONParser();
  }

  /**
   * 生成页面
   */
  async generate(options: GeneratePageOptions): Promise<PageSchema> {
    const messages = this.buildMessages(options);
    const response = await this.client.generateJSON<PageSchema>(messages, {
      type: "object",
      properties: {
        version: { type: "string" },
        metadata: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            version: { type: "string" },
          },
          required: ["name", "createdAt", "updatedAt", "version"],
        },
        components: {
          type: "array",
          items: { type: "object" },
        },
        canvas: {
          type: "object",
          properties: {
            showGrid: { type: "boolean" },
            snapToGrid: { type: "boolean" },
            viewportWidth: { type: "number" },
            activeDevice: { type: "string" },
          },
          required: ["showGrid", "snapToGrid", "viewportWidth", "activeDevice"],
        },
        theme: { type: "object" },
        dataSources: { type: "array" },
        settings: { type: "object" },
      },
      required: ["version", "metadata", "components", "canvas", "theme", "dataSources"],
    });

    // 确保版本正确
    response.version = SCHEMA_VERSION;

    // 应用用户提供的选项
    if (options.theme) {
      response.theme = options.theme;
    }

    // 确保 metadata 的时间戳是最新的
    const now = new Date().toISOString();
    if (!response.metadata.createdAt) {
      response.metadata.createdAt = now;
    }
    response.metadata.updatedAt = now;

    // 确保 metadata 版本正确
    response.metadata.version = SCHEMA_VERSION;

    // 如果没有提供名称，根据描述生成
    if (!response.metadata.name || response.metadata.name === "Generated Page") {
      response.metadata.name = this.generatePageName(options.description);
      if (!response.metadata.description) {
        response.metadata.description = options.description;
      }
    }

    return response;
  }

  /**
   * 流式生成页面
   */
  async *stream(
    options: GeneratePageOptions
  ): AsyncGenerator<Partial<PageSchema>> {
    const messages = this.buildMessages(options);

    let accumulatedResponse = "";
    for await (const chunk of this.client.stream(messages)) {
      accumulatedResponse += chunk;
      // 尝试解析部分响应
      try {
        const partial = this.parser.parseJSON<Partial<PageSchema>>(
          accumulatedResponse
        );
        yield partial;
      } catch {
        // 忽略解析错误，继续累积
      }
    }

    // 最终解析完整响应
    try {
      const final = await this.generate(options);
      yield final;
    } catch (error) {
      yield {
        version: SCHEMA_VERSION,
        metadata: {
          name: "Error",
          description: String(error),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: SCHEMA_VERSION,
        },
        components: [],
        canvas: {
          showGrid: false,
          snapToGrid: false,
          viewportWidth: 1920,
          activeDevice: "desktop",
        },
        theme: {},
        dataSources: [],
      } as Partial<PageSchema>;
    }
  }

  /**
   * 构建消息列表
   */
  private buildMessages(options: GeneratePageOptions): AIMessage[] {
    const systemPrompt = this.promptBuilder.buildSystemPrompt();
    const userPrompt = this.promptBuilder.buildPagePrompt(options);

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
   * 根据描述生成页面名称
   */
  private generatePageName(description: string): string {
    // 简单的名称提取逻辑
    const words = description.split(/\s+/).slice(0, 5);
    return words.join(" ") || "Generated Page";
  }
}