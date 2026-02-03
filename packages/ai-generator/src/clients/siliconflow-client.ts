import { BaseAIClient } from "./base-client";
import type { AIMessage, AIClientConfig } from "../types";
import { AIClientError } from "../types";

export interface SiliconFlowConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_BASE_URL = "https://api.siliconflow.com/v1";
const DEFAULT_MODEL = "Pro/deepseek-ai/DeepSeek-V3.2";

export class SiliconFlowClient extends BaseAIClient {
  private readonly baseURL: string;
  protected readonly siliconFlowConfig: SiliconFlowConfig;

  constructor(config: SiliconFlowConfig) {
    super(config);
    this.siliconFlowConfig = {
      ...config,
      model: config.model || DEFAULT_MODEL,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
    };
    this.baseURL = config.baseURL || DEFAULT_BASE_URL;
  }

  private get model(): string {
    return this.siliconFlowConfig.model || DEFAULT_MODEL;
  }

  private get temperature(): number {
    return this.siliconFlowConfig.temperature ?? 0.7;
  }

  private get maxTokens(): number {
    return this.siliconFlowConfig.maxTokens ?? 2000;
  }

  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
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
          error.message || `SiliconFlow API error: ${response.statusText}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    });
  }

  async *stream(messages: AIMessage[]): AsyncGenerator<string> {
    const response = await this.fetchWithTimeout(
      `${this.baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
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
        error.message || `SiliconFlow API error: ${response.statusText}`,
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
              // skip parse errors
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private convertMessages(messages: AIMessage[]) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  private async parseErrorResponse(
    response: Response
  ): Promise<Error & { message: string; code?: string }> {
    try {
      const data = await response.json();
      const error = new Error(
        data.error?.message || response.statusText
      ) as Error & { code?: string };
      error.code = data.error?.code;
      return error;
    } catch {
      const error = new Error(response.statusText) as Error & { code?: string };
      return error;
    }
  }
}
