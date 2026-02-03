import type { Component } from "@/domain/component";
import type { PageSchema } from "@/domain/entities/schema.types";
import {
  AIGenerator,
  AIClientFactory,
  type AIClientError,
  type ParseError,
  type ValidationError,
  type AIProviderType,
} from "@lowcode-platform/ai-generator";
import { TemplateAdapter } from "./template.adapter";

export type AIProvider = AIProviderType;

export interface AIGeneratorConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  resourceName?: string;
  deploymentName?: string;
  apiVersion?: string;
  baseURL?: string;
}

export class AIGeneratorAdapter {
  private generator: AIGenerator | null = null;
  private templateAdapter: TemplateAdapter;

  constructor(templateAdapter: TemplateAdapter) {
    this.templateAdapter = templateAdapter;
  }

  initialize(config: AIGeneratorConfig): void {
    const clientConfig = this.buildClientConfig(config);
    const client = AIClientFactory.createClient(
      config.provider,
      clientConfig as any
    );

    this.generator = new AIGenerator({ client });
  }

  private buildClientConfig(config: AIGeneratorConfig) {
    const baseConfig = {
      apiKey: config.apiKey,
      model: config.model || AIClientFactory.getDefaultModel(config.provider),
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
    };

    switch (config.provider) {
      case "azure-openai":
        if (!config.resourceName || !config.deploymentName) {
          throw new Error(
            "Azure OpenAI requires resourceName and deploymentName"
          );
        }
        return {
          ...baseConfig,
          resourceName: config.resourceName,
          deploymentName: config.deploymentName,
          apiVersion: config.apiVersion || "2023-12-01-preview",
        };
      case "ollama":
        return {
          ...baseConfig,
          apiKey: config.apiKey || "",
          baseURL: config.baseURL || "http://localhost:11434",
          maxTokens: undefined,
        };
      default:
        return baseConfig;
    }
  }

  async generateComponent(
    description: string,
    type?: string,
    position?: { x: number; y: number }
  ): Promise<Component> {
    if (!this.generator) {
      throw new Error("AI generator not initialized. Call initialize() first.");
    }

    try {
      const result = await this.generator.generateComponent({
        description,
        type,
        position: position || { x: 0, y: 0 },
      });

      return result.result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async generatePage(
    description: string,
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ): Promise<Component[]> {
    if (!this.generator) {
      throw new Error("AI generator not initialized. Call initialize() first.");
    }

    try {
      const result = await this.generator.generatePage({
        description,
        layout: layout || "centered",
      });

      // 从 PageSchema 中提取 components
      const pageSchema = result.result as PageSchema;
      return pageSchema.components || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async applyComponentsToCanvas(components: Component[]): Promise<Component[]> {
    if (components.length === 0) {
      return [];
    }
    return await this.templateAdapter.applyTemplateFromComponents(components);
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      if ("statusCode" in error && (error as AIClientError).statusCode === 401) {
        throw new Error("Invalid API key. Please check your API Key.");
      } else if (
        "statusCode" in error &&
        (error as AIClientError).statusCode === 429
      ) {
        throw new Error("API rate limit exceeded. Please try again later.");
      } else if (error instanceof ParseError) {
        throw new Error(`Failed to parse response: ${error.message}`);
      } else if (error instanceof ValidationError) {
        throw new Error(
          `Validation failed: ${error.errors?.join(", ") || error.message}`
        );
      }
    }
  }
}
