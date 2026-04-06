/**
 * AI Client type definitions
 */

export interface DeepSeekConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SiliconFlowConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export type AIProviderType =
  | "openai"
  | "claude"
  | "deepseek"
  | "gemini"
  | "azure-openai"
  | "groq"
  | "mistral"
  | "ollama"
  | "siliconflow";

export type AIClientConfigUnion =
  | OpenAIConfig
  | ClaudeConfig
  | DeepSeekConfig
  | GeminiConfig
  | AzureOpenAIConfig
  | GroqConfig
  | MistralConfig
  | OllamaConfig
  | SiliconFlowConfig;

import type { AIClient, AIMessage, AIClientConfig, RetryConfig, JSONSchema } from "../types";
import { AIClientError } from "../types";

export {
  AIClient,
  AIMessage,
  AIClientConfig,
  RetryConfig,
  JSONSchema,
  AIClientError,
};
