/**
 * AI Client type definitions
 */

import type {
  AIClient,
  AIMessage,
  AIClientConfig,
  RetryConfig,
  JSONSchema,
  OpenAIConfig,
  ClaudeConfig,
  GeminiConfig,
  AzureOpenAIConfig,
  GroqConfig,
  MistralConfig,
  OllamaConfig,
} from "./types";
import { AIClientError } from "./types";

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

export {
  AIClient,
  AIMessage,
  AIClientConfig,
  RetryConfig,
  JSONSchema,
  AIClientError,
};
