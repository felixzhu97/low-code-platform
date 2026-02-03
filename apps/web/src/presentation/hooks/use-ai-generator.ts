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
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface UseAIGeneratorReturn {
  loading: boolean;
  error: Error | null;
  isInitialized: boolean;
  provider: AIProvider;
  apiKey: string;
  model: string | undefined;
  baseURL: string | undefined;
  temperature: number | undefined;
  maxTokens: number | undefined;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setBaseURL: (baseURL: string) => void;
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

const OLLAMA_PROVIDER: AIProvider = "ollama";

export function useAIGenerator(
  options: UseAIGeneratorOptions = {}
): UseAIGeneratorReturn {
  const { templateAdapter } = useAdapters();
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
  const [temperature, setTemperature] = useState<number | undefined>(
    options.temperature
  );
  const [maxTokens, setMaxTokens] = useState<number | undefined>(
    options.maxTokens
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const adapter = useMemo(
    () => new AIGeneratorAdapter(templateAdapter),
    [templateAdapter]
  );

  const initialize = useCallback(() => {
    const isOllama = provider === OLLAMA_PROVIDER;
    if (!isOllama && !apiKey) {
      setError(new Error("Please enter an API Key"));
      return;
    }

    try {
      const config: AIGeneratorConfig = {
        provider,
        apiKey: isOllama ? "" : apiKey,
        model,
        baseURL: isOllama ? baseURL : undefined,
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
  }, [adapter, provider, apiKey, model, baseURL, temperature, maxTokens]);

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    isInitialized,
    provider,
    apiKey,
    model,
    baseURL,
    temperature,
    maxTokens,
    setProvider,
    setApiKey,
    setModel,
    setBaseURL,
    setTemperature,
    setMaxTokens,
    initialize,
    generateComponent,
    generatePage,
    applyComponentsToCanvas,
    clearError,
  };
}
