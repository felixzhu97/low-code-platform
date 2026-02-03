import type { Component } from "@lowcode-platform/component-utils/types";
import type { PageSchema } from "@lowcode-platform/schema/types";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface OpenAIConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  organization?: string;
}

export interface ClaudeConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  anthropicVersion?: string;
}

export interface GeminiConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AzureOpenAIConfig extends AIClientConfig {
  resourceName: string;
  deploymentName: string;
  apiVersion?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GroqConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MistralConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OllamaConfig extends AIClientConfig {
  baseURL?: string;
  model?: string;
  temperature?: number;
}

export interface AIGeneratorConfig {
  client: AIClient;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateComponentOptions {
  description: string;
  type?: string;
  position?: { x: number; y: number };
  parentId?: string | null;
  context?: ComponentContext;
}

export interface GeneratePageOptions {
  description: string;
  layout?: "centered" | "full-width" | "sidebar" | "grid";
  theme?: unknown;
  context?: PageContext;
}

export interface ComponentContext {
  existingComponents?: Component[];
  theme?: unknown;
  dataSources?: unknown[];
}

export interface PageContext {
  existingPages?: PageSchema[];
  theme?: unknown;
  dataSources?: unknown[];
}

export interface AIResponse<T = unknown> {
  content: string;
  data?: T;
  metadata?: {
    model?: string;
    tokens?: number;
    finishReason?: string;
  };
}

export interface GenerateResult<T> {
  result: T;
  metadata?: {
    model?: string;
    tokens?: number;
    duration?: number;
    retries?: number;
  };
}

export interface AIClient {
  generate(messages: AIMessage[]): Promise<string>;
  stream(messages: AIMessage[]): AsyncGenerator<string>;
  generateJSON<T = unknown>(
    messages: AIMessage[],
    schema?: JSONSchema
  ): Promise<T>;
}

export interface JSONSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export class AIGeneratorError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "AIGeneratorError";
  }
}

export class AIClientError extends AIGeneratorError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    cause?: Error
  ) {
    super(message, "AI_CLIENT_ERROR", cause);
    this.name = "AIClientError";
  }
}

export class ParseError extends AIGeneratorError {
  constructor(message: string, public readonly rawResponse?: string) {
    super(message, "PARSE_ERROR");
    this.name = "ParseError";
  }
}

export class ValidationError extends AIGeneratorError {
  constructor(
    message: string,
    public readonly errors?: string[]
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes?: number[];
}

export interface GeneratorOptions {
  validate?: boolean;
  retryOnError?: boolean;
  timeout?: number;
}
