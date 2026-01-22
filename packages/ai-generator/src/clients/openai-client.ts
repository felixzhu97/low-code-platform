import { BaseAIClient } from "./base-client";
import type { AIMessage, OpenAIConfig } from "../types";
import { AIClientError } from "../types";

/**
 * OpenAI 客户端实现
 */
export class OpenAIClient extends BaseAIClient {
  private readonly baseURL: string;
  protected readonly openaiConfig: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    super(config);
    this.openaiConfig = {
      ...config,
      model: config.model || "gpt-4",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
    };
    this.baseURL = config.baseURL || "https://api.openai.com/v1";
  }

  private get model(): string {
    return this.openaiConfig.model || "gpt-4";
  }

  private get temperature(): number {
    return this.openaiConfig.temperature ?? 0.7;
  }

  private get maxTokens(): number {
    return this.openaiConfig.maxTokens ?? 2000;
  }

  private get organization(): string | undefined {
    return this.openaiConfig.organization;
  }

  /**
   * 生成响应
   */
  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
            ...(this.organization && {
              "OpenAI-Organization": this.organization,
            }),
          },
          body: JSON.stringify({
            model: this.model,
            messages: this.convertMessages(messages),
            temperature: this.temperature,
            max_tokens: this.maxTokens,
          }),
        }
      );

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AIClientError(
          error.message || `OpenAI API error: ${response.statusText}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    });
  }

  /**
   * 流式生成响应
   */
  async *stream(messages: AIMessage[]): AsyncGenerator<string> {
    const response = await this.fetchWithTimeout(
      `${this.baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
            ...(this.organization && {
              "OpenAI-Organization": this.organization,
            }),
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.convertMessages(messages),
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AIClientError(
        error.message || `OpenAI API error: ${response.statusText}`,
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
          if (trimmed === "" || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const content = data.choices[0]?.delta?.content;
              if (content) {
                yield content;
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
   */
  private convertMessages(messages: AIMessage[]) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
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
      error.code = data.error?.code;
      return error;
    } catch {
      const error = new Error(response.statusText) as Error & { code?: string };
      return error;
    }
  }
}