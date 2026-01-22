import { BaseAIClient } from "./base-client";
import type { AIMessage, AIClientConfig } from "../types";
import { AIClientError } from "../types";

/**
 * Azure OpenAI 客户端配置
 */
export interface AzureOpenAIConfig extends AIClientConfig {
  resourceName: string;
  deploymentName: string;
  apiVersion?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Azure OpenAI 客户端实现
 * Azure OpenAI 使用 OpenAI 兼容的 API
 */
export class AzureOpenAIClient extends BaseAIClient {
  private readonly baseURL: string;
  protected readonly azureConfig: AzureOpenAIConfig;

  constructor(config: AzureOpenAIConfig) {
    super(config);
    this.azureConfig = {
      ...config,
      apiVersion: config.apiVersion || "2023-12-01-preview",
      model: config.model || config.deploymentName,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
    };
    // Azure OpenAI 端点格式: https://{resourceName}.openai.azure.com/openai/deployments/{deploymentName}
    this.baseURL = `https://${config.resourceName}.openai.azure.com/openai/deployments/${config.deploymentName}`;
  }

  private get apiVersion(): string {
    return this.azureConfig.apiVersion || "2023-12-01-preview";
  }

  private get model(): string {
    return this.azureConfig.model || this.azureConfig.deploymentName;
  }

  private get temperature(): number {
    return this.azureConfig.temperature ?? 0.7;
  }

  private get maxTokens(): number {
    return this.azureConfig.maxTokens ?? 2000;
  }

  /**
   * 生成响应
   */
  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const url = `${this.baseURL}/chat/completions?api-version=${this.apiVersion}`;

      const response = await this.fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.config.apiKey,
        },
        body: JSON.stringify({
          messages: this.convertMessages(messages),
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AIClientError(
          error.message || `Azure OpenAI API error: ${response.statusText}`,
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
    const url = `${this.baseURL}/chat/completions?api-version=${this.apiVersion}`;

    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.config.apiKey,
      },
      body: JSON.stringify({
        messages: this.convertMessages(messages),
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AIClientError(
        error.message || `Azure OpenAI API error: ${response.statusText}`,
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
