import { useState, useCallback, useMemo } from "react";
import type { Component } from "@/domain/component";
import {
  AIGeneratorAdapter,
  type AIProvider,
  type AIGeneratorConfig,
} from "@/presentation/adapters";
import { useAdapters } from "./use-adapters";

export interface UseAIGeneratorOptions {
  provider?: AIProvider;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface UseAIGeneratorReturn {
  // 状态
  loading: boolean;
  error: Error | null;
  isInitialized: boolean;

  // 配置
  provider: AIProvider;
  apiKey: string;
  model: string | undefined;
  temperature: number | undefined;
  maxTokens: number | undefined;

  // 方法
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setMaxTokens: (maxTokens: number) => void;
  initialize: () => void;
  generateComponent: (
    description: string,
    type?: string,
    position?: { x: number; y: number }
  ) => Promise<Component>;
  generatePage: (
    description: string,
    layout?: "centered" | "full-width" | "sidebar" | "grid"
  ) => Promise<Component[]>;
  applyComponentsToCanvas: (components: Component[]) => Promise<Component[]>;
  clearError: () => void;
}

/**
 * AI 生成器 Hook
 * 管理 AI 生成器实例和状态
 */
export function useAIGenerator(
  options: UseAIGeneratorOptions = {}
): UseAIGeneratorReturn {
  const { templateAdapter } = useAdapters();

  // 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [provider, setProvider] = useState<AIProvider>(
    options.provider || "openai"
  );
  const [apiKey, setApiKey] = useState<string>(options.apiKey || "");
  const [model, setModel] = useState<string | undefined>(options.model);
  const [temperature, setTemperature] = useState<number | undefined>(
    options.temperature
  );
  const [maxTokens, setMaxTokens] = useState<number | undefined>(
    options.maxTokens
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // 创建适配器实例
  const adapter = useMemo(
    () => new AIGeneratorAdapter(templateAdapter),
    [templateAdapter]
  );

  // 初始化适配器
  const initialize = useCallback(() => {
    if (!apiKey) {
      setError(new Error("请先输入 API Key"));
      return;
    }

    try {
      const config: AIGeneratorConfig = {
        provider,
        apiKey,
        model,
        temperature,
        maxTokens,
      };
      adapter.initialize(config);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsInitialized(false);
    }
  }, [adapter, provider, apiKey, model, temperature, maxTokens]);

  // 生成组件
  const generateComponent = useCallback(
    async (
      description: string,
      type?: string,
      position?: { x: number; y: number }
    ): Promise<Component> => {
      if (!isInitialized) {
        initialize();
      }

      setLoading(true);
      setError(null);

      try {
        const component = await adapter.generateComponent(
          description,
          type,
          position
        );
        return component;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [adapter, isInitialized, initialize]
  );

  // 生成页面
  const generatePage = useCallback(
    async (
      description: string,
      layout?: "centered" | "full-width" | "sidebar" | "grid"
    ): Promise<Component[]> => {
      if (!isInitialized) {
        initialize();
      }

      setLoading(true);
      setError(null);

      try {
        const components = await adapter.generatePage(description, layout);
        return components;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [adapter, isInitialized, initialize]
  );

  // 应用组件到画布
  const applyComponentsToCanvas = useCallback(
    async (components: Component[]): Promise<Component[]> => {
      setLoading(true);
      setError(null);

      try {
        const appliedComponents =
          await adapter.applyComponentsToCanvas(components);
        return appliedComponents;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [adapter]
  );

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    loading,
    error,
    isInitialized,

    // 配置
    provider,
    apiKey,
    model,
    temperature,
    maxTokens,

    // 方法
    setProvider,
    setApiKey,
    setModel,
    setTemperature,
    setMaxTokens,
    initialize,
    generateComponent,
    generatePage,
    applyComponentsToCanvas,
    clearError,
  };
}
