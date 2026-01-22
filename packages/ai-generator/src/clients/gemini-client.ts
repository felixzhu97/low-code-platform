import { BaseAIClient } from "./base-client";
import type { AIMessage, AIClientConfig } from "../types";
import { AIClientError } from "../types";

/**
 * Gemini 客户端配置
 */
export interface GeminiConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Google Gemini 客户端实现
 */
export class GeminiClient extends BaseAIClient {
  private readonly baseURL: string;
  protected readonly geminiConfig: GeminiConfig;

  constructor(config: GeminiConfig) {
    super(config);
    this.geminiConfig = {
      ...config,
      model: config.model || "gemini-pro",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
    };
    this.baseURL =
      config.baseURL || "https://generativelanguage.googleapis.com/v1beta";
  }

  private get model(): string {
    return this.geminiConfig.model || "gemini-pro";
  }

  private get temperature(): number {
    return this.geminiConfig.temperature ?? 0.7;
  }

  private get maxTokens(): number {
    return this.geminiConfig.maxTokens ?? 2000;
  }

  /**
   * 生成响应
   */
  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const { systemInstruction, contents } = this.convertMessages(messages);

      const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.config.apiKey}`;

      const response = await this.fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: this.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AIClientError(
          error.message || `Gemini API error: ${response.statusText}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      );
    });
  }

  /**
   * 流式生成响应
   */
  async *stream(messages: AIMessage[]): AsyncGenerator<string> {
    const { systemInstruction, contents } = this.convertMessages(messages);

    const url = `${this.baseURL}/models/${this.model}:streamGenerateContent?key=${this.config.apiKey}`;

    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AIClientError(
        error.message || `Gemini API error: ${response.statusText}`,
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
        // Gemini 流式响应可能包含多个 JSON 对象，用换行分隔
        const chunks = buffer.split("\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const trimmed = chunk.trim();
          if (trimmed === "") continue;

          try {
            const data = JSON.parse(trimmed);
            // Gemini 流式响应的格式
            const text =
              data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield text;
            }
          } catch {
            // 忽略解析错误，可能是部分JSON
          }
        }
      }
      
      // 处理最后剩余的buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            yield text;
          }
        } catch {
          // 忽略解析错误
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 转换消息格式
   * Gemini API 使用不同的消息格式
   */
  private convertMessages(messages: AIMessage[]): {
    systemInstruction?: string;
    contents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }>;
  } {
    const systemMessages = messages.filter((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    const contents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const msg of conversationMessages) {
      const role = msg.role === "assistant" ? "model" : "user";
      contents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }

    return {
      systemInstruction:
        systemMessages.length > 0
          ? systemMessages.map((m) => m.content).join("\n\n")
          : undefined,
      contents,
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
      const error = new Error(
        data.error?.message || response.statusText
      ) as Error & { code?: string };
      error.code = data.error?.code?.toString();
      return error;
    } catch {
      const error = new Error(response.statusText) as Error & { code?: string };
      return error;
    }
  }
}
