import React, { memo } from 'react';
import { Canvas } from './canvas';

/**
 * OptimizedCanvas 组件
 * 现在 Canvas 组件从 store 获取状态，不再需要 props
 * 此组件保留作为向后兼容的包装器
 */
export const OptimizedCanvas = memo(() => {
  return <Canvas />;
});

OptimizedCanvas.displayName = 'OptimizedCanvas';
