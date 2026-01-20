import { BaseAIClient } from "./base-client";
import type { AIMessage, ClaudeConfig } from "../types";
import { AIClientError } from "../types";

/**
 * Claude 客户端实现
 */
export class ClaudeClient extends BaseAIClient {
  private readonly baseURL: string;
  private readonly claudeConfig: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    super(config);
    this.claudeConfig = {
      ...config,
      model: config.model || "claude-3-opus-20240229",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
      anthropicVersion: config.anthropicVersion || "2023-06-01",
    };
    this.baseURL = config.baseURL || "https://api.anthropic.com/v1";
  }

  private get model(): string {
    return this.claudeConfig.model || "claude-3-opus-20240229";
  }

  private get temperature(): number {
    return this.claudeConfig.temperature ?? 0.7;
  }

  private get maxTokens(): number {
    return this.claudeConfig.maxTokens ?? 2000;
  }

  private get anthropicVersion(): string {
    return this.claudeConfig.anthropicVersion || "2023-06-01";
  }

  /**
   * 生成响应
   */
  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const { system, messages: convertedMessages } =
        this.convertMessages(messages);

      const response = await this.fetchWithTimeout(
        `${this.baseURL}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
            "anthropic-version": this.anthropicVersion,
          },
          body: JSON.stringify({
            model: this.model,
            ...(system && { system }),
            messages: convertedMessages,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
          }),
        }
      );

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AIClientError(
          error.message || `Claude API error: ${response.statusText}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      return (
        data.content?.find((c: { type: string }) => c.type === "text")
          ?.text || ""
      );
    });
  }

  /**
   * 流式生成响应
   */
  async *stream(messages: AIMessage[]): AsyncGenerator<string> {
    const { system, messages: convertedMessages } =
      this.convertMessages(messages);

    const response = await this.fetchWithTimeout(
      `${this.baseURL}/messages`,
      {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
            "anthropic-version": this.anthropicVersion,
          },
          body: JSON.stringify({
            model: this.model,
            ...(system && { system }),
            messages: convertedMessages,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AIClientError(
        error.message || `Claude API error: ${response.statusText}`,
        response.status,
        error
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new AIClientError("Response body is null");
    }

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === "" || trimmed.startsWith("event: ping")) continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === "content_block_delta") {
                const text = data.delta?.text;
                if (text) {
                  yield text;
                }
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 转换消息格式
   * Claude API 需要区分系统消息和用户/助手消息
   */
  private convertMessages(messages: AIMessage[]): {
    system?: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  } {
    const systemMessages = messages.filter((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    const converted: Array<{ role: "user" | "assistant"; content: string }> = conversationMessages.map((msg) => ({
      role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: msg.content,
    }));

    // Claude API 的系统消息是单独的字段
    return {
      system:
        systemMessages.length > 0
          ? systemMessages.map((m) => m.content).join("\n\n")
          : undefined,
      messages: converted,
    };
  }

  /**
   * 解析错误响应
   */
  private async parseErrorResponse(
    response: Response
  ): Promise<Error & { message: string; code?: string }> {
    try {
      const data = await response.json();
      const error = new Error(data.error?.message || response.statusText) as Error & { code?: string };
      error.code = data.error?.type;
      return error;
    } catch {
      const error = new Error(response.statusText) as Error & { code?: string };
      return error;
    }
  }
}