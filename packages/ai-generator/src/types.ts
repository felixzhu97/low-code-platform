import type { Component } from "@lowcode-platform/component-utils/types";
import type { PageSchema } from "@lowcode-platform/schema/types";

/**
 * AI 消息接口
 */
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * AI 客户端配置基类
 */
export interface AIClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * OpenAI 客户端配置
 */
export interface OpenAIConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  organization?: string;
}

/**
 * Claude 客户端配置
 */
export interface ClaudeConfig extends AIClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  anthropicVersion?: string;
}

/**
 * AI 生成器配置
 */
export interface AIGeneratorConfig {
  client: AIClient;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 组件生成选项
 */
export interface GenerateComponentOptions {
  description: string;
  type?: string;
  position?: { x: number; y: number };
  parentId?: string | null;
  context?: ComponentContext;
}

/**
 * 页面生成选项
 */
export interface GeneratePageOptions {
  description: string;
  layout?: "centered" | "full-width" | "sidebar" | "grid";
  theme?: unknown;
  context?: PageContext;
}

/**
 * 组件上下文信息
 */
export interface ComponentContext {
  existingComponents?: Component[];
  theme?: unknown;
  dataSources?: unknown[];
}

/**
 * 页面上下文信息
 */
export interface PageContext {
  existingPages?: PageSchema[];
  theme?: unknown;
  dataSources?: unknown[];
}

/**
 * AI 响应结果
 */
export interface AIResponse<T = unknown> {
  content: string;
  data?: T;
  metadata?: {
    model?: string;
    tokens?: number;
    finishReason?: string;
  };
}

/**
 * 生成结果
 */
export interface GenerateResult<T> {
  result: T;
  metadata?: {
    model?: string;
    tokens?: number;
    duration?: number;
    retries?: number;
  };
}

/**
 * AI 客户端接口
 */
export interface AIClient {
  /**
   * 生成响应
   */
  generate(messages: AIMessage[]): Promise<string>;

  /**
   * 流式生成响应
   */
  stream(messages: AIMessage[]): AsyncGenerator<string>;

  /**
   * 生成 JSON 格式的响应
   */
  generateJSON<T = unknown>(
    messages: AIMessage[],
    schema?: JSONSchema
  ): Promise<T>;
}

/**
 * JSON Schema 定义
 */
export interface JSONSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * 错误类型
 */
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

/**
 * AI 客户端错误
 */
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

/**
 * 解析错误
 */
export class ParseError extends AIGeneratorError {
  constructor(message: string, public readonly rawResponse?: string) {
    super(message, "PARSE_ERROR");
    this.name = "ParseError";
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AIGeneratorError {
  constructor(
    message: string,
    public readonly errors?: string[]
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/**
 * 重试配置
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes?: number[];
}

/**
 * 生成器选项
 */
export interface GeneratorOptions {
  validate?: boolean;
  retryOnError?: boolean;
  timeout?: number;
}