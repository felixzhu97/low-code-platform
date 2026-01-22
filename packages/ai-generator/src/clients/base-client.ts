import type {
  AIClient,
  AIMessage,
  AIClientConfig,
  RetryConfig,
  JSONSchema,
} from "../types";
import { AIClientError } from "../types";

/**
 * AI 客户端抽象基类
 */
export abstract class BaseAIClient implements AIClient {
  protected readonly config: AIClientConfig;
  protected readonly retryConfig: RetryConfig;

  constructor(config: AIClientConfig) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.retryConfig = {
      maxRetries: this.config.maxRetries || 3,
      retryDelay: this.config.retryDelay || 1000,
      retryableStatusCodes: [429, 500, 502, 503, 504],
    };
  }

  /**
   * 生成响应（抽象方法，由子类实现）
   */
  abstract generate(messages: AIMessage[]): Promise<string>;

  /**
   * 流式生成响应（抽象方法，由子类实现）
   */
  abstract stream(messages: AIMessage[]): AsyncGenerator<string>;

  /**
   * 生成 JSON 格式的响应
   */
  async generateJSON<T = unknown>(
    messages: AIMessage[],
    schema?: JSONSchema
  ): Promise<T> {
    const jsonMessages = this.buildJSONMessages(messages, schema);
    const response = await this.generate(jsonMessages);

    try {
      return this.parseJSONResponse<T>(response);
    } catch (error) {
      throw new AIClientError(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * 构建包含 JSON Schema 的消息
   */
  protected buildJSONMessages(
    messages: AIMessage[],
    schema?: JSONSchema
  ): AIMessage[] {
    if (!schema) {
      return messages;
    }

    const systemMessage: AIMessage = {
      role: "system",
      content: `You must respond with valid JSON only, following this schema:\n${JSON.stringify(schema, null, 2)}\n\nDo not include any markdown formatting, code blocks, or explanatory text. Return only the JSON object.`,
    };

    // 如果已有系统消息，合并它们
    const existingSystemMessage = messages.find((m) => m.role === "system");
    if (existingSystemMessage) {
      existingSystemMessage.content = `${existingSystemMessage.content}\n\n${systemMessage.content}`;
      return messages;
    }

    return [systemMessage, ...messages];
  }

  /**
   * 解析 JSON 响应
   */
  protected parseJSONResponse<T>(response: string): T {
    // 尝试提取 JSON（可能包含在代码块中）
    let jsonString = response.trim();

    // 移除可能的 markdown 代码块标记
    if (jsonString.startsWith("```")) {
      const lines = jsonString.split("\n");
      const startIndex = lines[0].includes("json") ? 1 : 0;
      const endIndex = lines[lines.length - 1] === "```" ? lines.length - 1 : lines.length;
      jsonString = lines.slice(startIndex, endIndex).join("\n");
    }

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      // 尝试查找 JSON 对象
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as T;
        } catch {
          // 继续抛出原始错误
        }
      }
      throw error;
    }
  }

  /**
   * 重试机制
   */
  protected async withRetry<T>(
    fn: () => Promise<T>,
    retryConfig: RetryConfig = this.retryConfig
  ): Promise<T> {
    let lastError: Error | unknown;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // 检查是否应该重试
        if (
          attempt < retryConfig.maxRetries &&
          this.shouldRetry(error, retryConfig)
        ) {
          const delay = retryConfig.retryDelay * Math.pow(2, attempt);
          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  /**
   * 判断是否应该重试
   */
  protected shouldRetry(error: unknown, retryConfig: RetryConfig): boolean {
    if (error instanceof AIClientError && error.statusCode) {
      return (
        retryConfig.retryableStatusCodes?.includes(error.statusCode) ?? false
      );
    }

    // 网络错误通常应该重试
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("network") ||
        message.includes("timeout") ||
        message.includes("fetch")
      );
    }

    return false;
  }

  /**
   * 延迟函数
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 带超时的 fetch 请求
   */
  protected async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = this.config.timeout || 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new AIClientError("Request timeout", 408);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}