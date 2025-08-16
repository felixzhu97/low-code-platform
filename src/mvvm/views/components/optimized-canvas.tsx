import React, { memo, useMemo } from 'react';
import { Canvas } from './canvas';
import type { Component, ThemeConfig } from '@/domain/entities/types';

interface OptimizedCanvasProps {
  components: Component[];
  selectedComponent: Component | null;
  theme: ThemeConfig;
  isPreviewMode: boolean;
  viewportWidth: number;
  activeDevice: string;
  onSelectComponent: (component: Component | null) => void;
  onUpdateComponents: (components: Component[]) => void;
}

export const OptimizedCanvas = memo<OptimizedCanvasProps>(({
  components,
  selectedComponent,
  theme,
  isPreviewMode,
  viewportWidth,
  activeDevice,
  onSelectComponent,
  onUpdateComponents,
}) => {
  // Memoize expensive calculations
  const canvasProps = useMemo(() => ({
    components,
    theme,
    isPreviewMode,
    viewportWidth,
    activeDevice,
    onSelectComponent,
    onUpdateComponents,
  }), [
    components,
    theme,
    isPreviewMode,
    viewportWidth,
    activeDevice,
    onSelectComponent,
    onUpdateComponents,
  ]);

  return <Canvas {...canvasProps} />;
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.components === nextProps.components &&
    prevProps.selectedComponent?.id === nextProps.selectedComponent?.id &&
    prevProps.theme === nextProps.theme &&
    prevProps.isPreviewMode === nextProps.isPreviewMode &&
    prevProps.viewportWidth === nextProps.viewportWidth &&
    prevProps.activeDevice === nextProps.activeDevice
  );
});

OptimizedCanvas.displayName = 'OptimizedCanvas';