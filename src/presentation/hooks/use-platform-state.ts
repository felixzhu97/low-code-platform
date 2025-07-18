import { useState, useCallback } from 'react';
import type { Component, ThemeConfig } from '@/domain/entities/types';
import {
  type HistoryState,
  createHistory,
  addToHistory,
  undo,
  redo,
} from '@/application/services/history';

export interface PlatformState {
  selectedComponent: Component | null;
  activeTab: string;
  componentsHistory: HistoryState<Component[]>;
  previewMode: boolean;
  projectName: string;
  viewportWidth: number;
  activeDevice: string;
  theme: ThemeConfig;
  customComponents: any[];
}

export function usePlatformState() {
  const [state, setState] = useState<PlatformState>({
    selectedComponent: null,
    activeTab: "components",
    componentsHistory: createHistory([]),
    previewMode: false,
    projectName: "我的低代码项目",
    viewportWidth: 1280,
    activeDevice: "desktop",
    theme: {
      primaryColor: "#0070f3",
      secondaryColor: "#6c757d",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "0.375rem",
      spacing: "1rem",
    },
    customComponents: [],
  });

  const updateState = useCallback((updates: Partial<PlatformState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateComponentsHistory = useCallback((components: Component[]) => {
    setState(prev => ({
      ...prev,
      componentsHistory: addToHistory(prev.componentsHistory, components)
    }));
  }, []);

  const handleUndo = useCallback(() => {
    setState(prev => ({
      ...prev,
      componentsHistory: undo(prev.componentsHistory)
    }));
  }, []);

  const handleRedo = useCallback(() => {
    setState(prev => ({
      ...prev,
      componentsHistory: redo(prev.componentsHistory)
    }));
  }, []);

  return {
    state,
    updateState,
    updateComponentsHistory,
    handleUndo,
    handleRedo,
  };
}