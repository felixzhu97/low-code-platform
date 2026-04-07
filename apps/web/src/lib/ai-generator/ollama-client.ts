import { BaseAIClient } from "./base-client";
import type { AIMessage, AIClientConfig } from "./types";
import { AIClientError } from "./types";

/** 本地推理较慢，整页 JSON 生成常超过 30s；未显式指定时使用更长超时 */
export const OLLAMA_DEFAULT_TIMEOUT_MS = 600_000;

export interface OllamaConfig extends Omit<AIClientConfig, "apiKey"> {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
}

export class OllamaClient extends BaseAIClient {
  private readonly baseURL: string;
  protected readonly ollamaConfig: OllamaConfig;

  constructor(config: OllamaConfig) {
    super({
      ...config,
      apiKey: config.apiKey ?? "",
      timeout: config.timeout ?? OLLAMA_DEFAULT_TIMEOUT_MS,
    });
    this.ollamaConfig = {
      ...config,
      baseURL: config.baseURL || "http://localhost:11434",
      model: config.model || "codellama",
      temperature: config.temperature ?? 0.7,
    };
    this.baseURL = this.ollamaConfig.baseURL || "http://localhost:11434";
  }

  private get model(): string {
    return this.ollamaConfig.model || "codellama";
  }

  private get temperature(): number {
    return this.ollamaConfig.temperature ?? 0.7;
  }

  async generate(messages: AIMessage[]): Promise<string> {
    return this.withRetry(async () => {
      const { system, prompt } = this.convertMessages(messages);

      const response = await this.fetchWithTimeout(
        `${this.baseURL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.model,
            prompt: prompt,
            system: system,
            stream: false,
            options: {
              temperature: this.temperature,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AIClientError(
          error.message || `Ollama API error: ${response.statusText}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      return data.response || "";
    });
  }

  async *stream(messages: AIMessage[]): AsyncGenerator<string> {
    const { system, prompt } = this.convertMessages(messages);

    const response = await this.fetchWithTimeout(
      `${this.baseURL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          system: system,
          stream: true,
          options: {
            temperature: this.temperature,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AIClientError(
        error.message || `Ollama API error: ${response.statusText}`,
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
          if (trimmed === "") continue;

          try {
            const data = JSON.parse(trimmed);
            if (data.response) {
              yield data.response;
            }
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private convertMessages(messages: AIMessage[]): {
    system?: string;
    prompt: string;
  } {
    const systemMessages = messages.filter((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    // 合并对话消息为单个 prompt
    const prompt = conversationMessages
      .map((msg) => {
        const prefix = msg.role === "user" ? "User: " : "Assistant: ";
        return `${prefix}${msg.content}`;
      })
      .join("\n\n") + "\n\nAssistant: ";

    return {
      system:
        systemMessages.length > 0
          ? systemMessages.map((m) => m.content).join("\n\n")
          : undefined,
      prompt,
    };
  }

  private async parseErrorResponse(
    response: Response
  ): Promise<Error & { message: string; code?: string }> {
    try {
      const data = await response.json();
      const error = new Error(
        data.error || response.statusText
      ) as Error & { code?: string };
      return error;
    } catch {
      const error = new Error(response.statusText) as Error & { code?: string };
      return error;
    }
  }
}

/** 规范化 baseURL，移除末尾斜杠 */
function normalizeOllamaBaseURL(baseURL: string): string {
  return baseURL.replace(/\/$/, "");
}

/**
 * 从本地 Ollama 实例拉取模型列表。
 * 若直接请求 localhost:11434 遇到 CORS，可以改用 /api/ollama/tags 代理。
 */
export async function fetchOllamaModelNames(
  baseURL: string,
  signal?: AbortSignal
): Promise<string[]> {
  const normalized = normalizeOllamaBaseURL(baseURL);
  const useProxy = typeof window !== "undefined";

  const response = await fetch(
    useProxy
      ? `/api/ollama/tags?baseURL=${encodeURIComponent(normalized)}`
      : `${normalized}/api/tags`,
    signal ? { signal } : undefined
  );

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`无法获取 Ollama 模型列表 (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { models?: Array<{ name: string }> };

  if (!Array.isArray(data.models)) {
    // 代理返回的可能不是标准格式，直接返回空列表
    return [];
  }

  return data.models.map((m) => m.name).filter(Boolean);
}
