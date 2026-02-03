import type { AIClient } from "../types";
import type {
  OpenAIConfig,
  ClaudeConfig,
  GeminiConfig,
  AzureOpenAIConfig,
  GroqConfig,
  MistralConfig,
  OllamaConfig,
} from "../types";
import type { DeepSeekConfig } from "./deepseek-client";
import type { SiliconFlowConfig } from "./siliconflow-client";
import { OpenAIClient } from "./openai-client";
import { ClaudeClient } from "./claude-client";
import { DeepSeekClient } from "./deepseek-client";
import { GeminiClient } from "./gemini-client";
import { AzureOpenAIClient } from "./azure-openai-client";
import { GroqClient } from "./groq-client";
import { MistralClient } from "./mistral-client";
import { OllamaClient } from "./ollama-client";
import { SiliconFlowClient } from "./siliconflow-client";

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

export class AIClientFactory {
  static createClient(
    provider: AIProviderType,
    config: AIClientConfigUnion
  ): AIClient {
    switch (provider) {
      case "openai":
        return new OpenAIClient(config as OpenAIConfig);
      case "claude":
        return new ClaudeClient(config as ClaudeConfig);
      case "deepseek":
        return new DeepSeekClient(config as DeepSeekConfig);
      case "gemini":
        return new GeminiClient(config as GeminiConfig);
      case "azure-openai": {
        const azureConfig = config as AzureOpenAIConfig;
        if (!azureConfig.resourceName || !azureConfig.deploymentName) {
          throw new Error(
            "Azure OpenAI requires resourceName and deploymentName"
          );
        }
        return new AzureOpenAIClient(azureConfig);
      }
      case "groq":
        return new GroqClient(config as GroqConfig);
      case "mistral":
        return new MistralClient(config as MistralConfig);
      case "ollama":
        return new OllamaClient(config as OllamaConfig);
      case "siliconflow":
        return new SiliconFlowClient(config as SiliconFlowConfig);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static getDefaultModel(provider: AIProviderType): string {
    switch (provider) {
      case "openai":
        return "gpt-4";
      case "claude":
        return "claude-3-opus-20240229";
      case "deepseek":
        return "deepseek-chat";
      case "gemini":
        return "gemini-pro";
      case "azure-openai":
        return "gpt-4";
      case "groq":
        return "mixtral-8x7b-32768";
      case "mistral":
        return "mistral-medium";
      case "ollama":
        return "codellama";
      case "siliconflow":
        return "Pro/deepseek-ai/DeepSeek-V3.2";
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static getSupportedProviders(): AIProviderType[] {
    return [
      "openai",
      "claude",
      "deepseek",
      "gemini",
      "azure-openai",
      "groq",
      "mistral",
      "ollama",
      "siliconflow",
    ];
  }

  static getProviderDisplayName(provider: AIProviderType): string {
    switch (provider) {
      case "openai":
        return "OpenAI (GPT-4)";
      case "claude":
        return "Claude (Anthropic)";
      case "deepseek":
        return "DeepSeek";
      case "gemini":
        return "Google Gemini";
      case "azure-openai":
        return "Azure OpenAI";
      case "groq":
        return "Groq";
      case "mistral":
        return "Mistral AI";
      case "ollama":
        return "Ollama (Local)";
      case "siliconflow":
        return "SiliconFlow";
      default:
        return provider;
    }
  }
}
