import type { PositionLike } from "./position";
import { Position } from "./position";

/**
 * 对齐到网格
 *
 * @param x - X 坐标
 * @param y - Y 坐标
 * @param gridSize - 网格大小
 * @returns 对齐后的位置
 */
export function snapToGrid(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}

/**
 * 对齐位置对象到网格
 *
 * @param position - 位置对象
 * @param gridSize - 网格大小
 * @returns 对齐后的位置
 */
export function snapPositionToGrid(
  position: PositionLike,
  gridSize: number
): Position {
  return Position.fromObject(snapToGrid(position.x, position.y, gridSize));
}

/**
 * 计算网格对齐的坐标
 *
 * @param value - 原始坐标值
 * @param gridSize - 网格大小
 * @returns 对齐后的坐标值
 */
export function alignToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}
