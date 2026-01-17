import type { ComponentBounds } from "./collision";

/**
 * 响应式布局计算选项
 */
export interface ResponsiveLayoutOptions {
  viewportWidth: number;
  baseWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * 计算响应式宽度
 *
 * @param width - 原始宽度
 * @param options - 响应式布局选项
 * @returns 调整后的宽度
 */
export function calculateResponsiveWidth(
  width: number,
  options: ResponsiveLayoutOptions
): number {
  const { viewportWidth, baseWidth = 1920, minWidth, maxWidth } = options;

  // 计算缩放比例
  const scale = viewportWidth / baseWidth;
  let responsiveWidth = width * scale;

  // 应用最小宽度限制
  if (minWidth !== undefined && responsiveWidth < minWidth) {
    responsiveWidth = minWidth;
  }

  // 应用最大宽度限制
  if (maxWidth !== undefined && responsiveWidth > maxWidth) {
    responsiveWidth = maxWidth;
  }

  return Math.round(responsiveWidth);
}

/**
 * 计算响应式位置
 *
 * @param x - 原始 X 坐标
 * @param options - 响应式布局选项
 * @returns 调整后的 X 坐标
 */
export function calculateResponsiveX(
  x: number,
  options: ResponsiveLayoutOptions
): number {
  const { viewportWidth, baseWidth = 1920 } = options;
  const scale = viewportWidth / baseWidth;
  return Math.round(x * scale);
}

/**
 * 计算响应式位置
 *
 * @param y - 原始 Y 坐标
 * @param options - 响应式布局选项
 * @returns 调整后的 Y 坐标
 */
export function calculateResponsiveY(
  y: number,
  options: ResponsiveLayoutOptions
): number {
  // Y 坐标通常不需要响应式调整，除非有特殊需求
  return y;
}

/**
 * 计算组件的响应式布局
 *
 * @param component - 组件边界
 * @param options - 响应式布局选项
 * @returns 调整后的组件边界
 */
export function calculateResponsiveLayout(
  component: ComponentBounds,
  options: ResponsiveLayoutOptions
): ComponentBounds {
  return {
    x: calculateResponsiveX(component.x, options),
    y: calculateResponsiveY(component.y, options),
    width: calculateResponsiveWidth(component.width, options),
    height: component.height, // 高度通常保持原样
  };
}

/**
 * 计算响应式缩放比例
 *
 * @param viewportWidth - 视口宽度
 * @param baseWidth - 基准宽度（默认 1920）
 * @returns 缩放比例
 */
export function calculateScale(
  viewportWidth: number,
  baseWidth: number = 1920
): number {
  return viewportWidth / baseWidth;
}
