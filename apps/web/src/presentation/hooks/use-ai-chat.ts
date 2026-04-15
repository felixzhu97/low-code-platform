import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type { Component } from "@/domain/component";
import type { AIProvider } from "@/presentation/adapters/ai-generator.adapter";
import { AIGeneratorAdapter } from "@/presentation/adapters/ai-generator.adapter";
import { useAdapters } from "./use-adapters";
import { fetchOllamaModelNames } from "@/lib/ai-generator/ollama-client";
import { store } from "@/infrastructure/state-management/store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface UseAIChatOptions {
  provider?: AIProvider;
  apiKey?: string;
  model?: string;
  baseURL?: string;
}

export interface UseAIChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: Error | null;
  provider: AIProvider;
  apiKey: string;
  model: string | undefined;
  baseURL: string | undefined;
  isInitialized: boolean;
  ollamaModels: string[];
  ollamaModelsLoading: boolean;
  ollamaModelsError: Error | null;
  refreshOllamaModels: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setBaseURL: (baseURL: string) => void;
  switchModel: (provider: AIProvider) => void;
  clearError: () => void;
}

const OLLAMA_PROVIDER: AIProvider = "ollama";

const DEFAULT_PROVIDERS: AIProvider[] = [
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

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI (GPT-4)",
  claude: "Claude (Anthropic)",
  deepseek: "DeepSeek",
  gemini: "Google Gemini",
  "azure-openai": "Azure OpenAI",
  groq: "Groq",
  mistral: "Mistral AI",
  ollama: "Ollama (Local)",
  siliconflow: "SiliconFlow",
};

const WELCOME_MESSAGE = `你好！我是低代码平台的 AI 助手。

我可以帮你：
- 生成完整的页面布局
- 创建单个组件（如按钮、表单、卡片等）
- 回答关于低代码平台的问题

请告诉我你需要什么帮助！`;

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { templateAdapter } = useAdapters();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [provider, setProvider] = useState<AIProvider>(
    options.provider || "openai"
  );
  const [apiKey, setApiKey] = useState<string>(options.apiKey || "");
  const [model, setModel] = useState<string | undefined>(options.model);
  const [baseURL, setBaseURL] = useState<string | undefined>(
    options.baseURL || "http://localhost:11434"
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaModelsLoading, setOllamaModelsLoading] = useState(false);
  const [ollamaModelsError, setOllamaModelsError] = useState<Error | null>(
    null
  );
  const ollamaAbortRef = useRef<AbortController | null>(null);

  const adapterRef = useRef<AIGeneratorAdapter | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const adapter = useMemo(
    () => new AIGeneratorAdapter(templateAdapter),
    [templateAdapter]
  );

  // 获取现有组件
  const getExistingComponents = useCallback((): Component[] => {
    return store.getState().component.components;
  }, []);

  // 检测是否为追加意图
  const isAppendIntent = useCallback((content: string): boolean => {
    const appendPatterns = [
      /添加|追加|再添加|再加|补充/,
      /在.*基础上/,
      /继续.*添加/,
      /再生成|再创建一个/,
      /在.*添加|在.*加入/,
    ];
    return appendPatterns.some((pattern) => pattern.test(content));
  }, []);

  const initialize = useCallback(() => {
    const isOllama = provider === OLLAMA_PROVIDER;
    if (!isOllama && !apiKey) {
      setError(new Error("请输入 API Key"));
      return false;
    }

    try {
      adapter.initialize({
        provider,
        apiKey: isOllama ? "" : apiKey,
        model,
        baseURL: isOllama ? baseURL : undefined,
      });
      adapterRef.current = adapter;
      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsInitialized(false);
      return false;
    }
  }, [adapter, provider, apiKey, model, baseURL]);

  const addAssistantMessage = useCallback(
    (content: string, isStreaming = false) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content,
          timestamp: new Date(),
          isStreaming,
        },
      ]);
    },
    []
  );

  const updateLastAssistantMessage = useCallback(
    (content: string, isStreaming = false) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.findLastIndex(
          (msg) => msg.role === "assistant"
        );
        if (lastIndex !== -1) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content,
            isStreaming,
          };
        }
        return newMessages;
      });
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      if (!isInitialized || !adapterRef.current) {
        if (!initialize()) return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      addAssistantMessage("", true);

      try {
        abortControllerRef.current = new AbortController();

        const currentAdapter = adapterRef.current!;
        let responseContent = "";

        // 仅用语义极窄的规则区分「整页生成」与「组件生成」；其余一律原样交给模型，不做关键词校验与兜底提示
        const isPageGeneration = /生成.*页面|创建.*页面|page/i.test(content);
        const shouldAppend = isAppendIntent(content);

        let components: Component[];
        let appliedComponents: Component[];

        if (isPageGeneration) {
          const layout = "centered" as const;
          components = await currentAdapter.generatePage(content, layout);
          responseContent = `已生成页面，包含 ${components.length} 个组件。`;
          } else {
            components = await currentAdapter.generateComponent(content);
            const root = components.find((c) => !c.parentId);
            responseContent = `已生成 ${components.length} 个组件${
              root ? `（根：${root.name}）` : ""
            }`;
          }

        if (shouldAppend) {
          const existing = getExistingComponents();
          appliedComponents = await currentAdapter.appendComponentsToCanvas(
            components,
            existing
          );
          responseContent += `已追加 ${components.length} 个组件到画布（当前共 ${appliedComponents.length} 个）。`;
        } else {
          appliedComponents =
            await currentAdapter.applyComponentsToCanvas(components);
          responseContent += `已将 ${appliedComponents.length} 个组件添加到画布。`;
        }

        updateLastAssistantMessage(responseContent, false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "生成失败，请重试。";
        updateLastAssistantMessage(`错误：${errorMessage}`, false);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      isInitialized,
      initialize,
      addAssistantMessage,
      updateLastAssistantMessage,
      getExistingComponents,
      isAppendIntent,
    ]
  );

  const switchModel = useCallback(
    (newProvider: AIProvider) => {
      setProvider(newProvider);
      setIsInitialized(false);
      adapterRef.current = null;
    },
    []
  );

  const refreshOllamaModels = useCallback(() => {
    if (provider !== OLLAMA_PROVIDER) return;
    if (ollamaAbortRef.current) {
      ollamaAbortRef.current.abort();
    }
    const controller = new AbortController();
    ollamaAbortRef.current = controller;
    setOllamaModelsLoading(true);
    setOllamaModelsError(null);
    setOllamaModels([]);
    fetchOllamaModelNames(baseURL || "http://localhost:11434", controller.signal)
      .then((models) => {
        setOllamaModels(models);
        if (models.length > 0 && (!model || !models.includes(model))) {
          setModel(models[0]);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setOllamaModelsError(err);
        }
      })
      .finally(() => {
        setOllamaModelsLoading(false);
        ollamaAbortRef.current = null;
      });
  }, [provider, baseURL, model, setModel]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 切换到 Ollama 时自动拉取模型列表
  useEffect(() => {
    if (provider === OLLAMA_PROVIDER) {
      refreshOllamaModels();
    } else {
      setOllamaModels([]);
      setOllamaModelsError(null);
    }
  }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    messages,
    loading,
    error,
    provider,
    apiKey,
    model,
    baseURL,
    isInitialized,
    ollamaModels,
    ollamaModelsLoading,
    ollamaModelsError,
    refreshOllamaModels,
    sendMessage,
    clearMessages,
    setProvider,
    setApiKey,
    setModel,
    setBaseURL,
    switchModel,
    clearError,
  };
}

export const AI_PROVIDERS = DEFAULT_PROVIDERS;
export const AI_PROVIDER_LABELS = PROVIDER_LABELS;
