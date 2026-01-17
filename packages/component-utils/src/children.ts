import type { Component } from "./types";

/**
 * 获取组件的直接子组件
 *
 * @param components - 组件数组
 * @param parentId - 父组件 ID
 * @returns 子组件数组
 */
export function getChildComponents(
  components: Component[],
  parentId: string | null
): Component[] {
  return components.filter((comp) => (comp.parentId ?? null) === parentId);
}

/**
 * 递归获取所有子组件 ID（包括子组件的子组件）
 *
 * @param parentId - 父组件 ID
 * @param components - 组件数组
 * @returns 所有子组件 ID 数组
 */
export function getAllChildIds(
  parentId: string,
  components: Component[]
): string[] {
  const childIds: string[] = [];
  const children = components.filter((comp) => comp.parentId === parentId);

  for (const child of children) {
    childIds.push(child.id);
    childIds.push(...getAllChildIds(child.id, components));
  }

  return childIds;
}

/**
 * 获取组件的所有子组件（包括子组件的子组件）
 *
 * @param parentId - 父组件 ID
 * @param components - 组件数组
 * @returns 所有子组件数组
 */
export function getAllChildComponents(
  parentId: string,
  components: Component[]
): Component[] {
  const childIds = getAllChildIds(parentId, components);
  return components.filter((comp) => childIds.includes(comp.id));
}

/**
 * 检查组件是否有子组件
 *
 * @param components - 组件数组
 * @param componentId - 组件 ID
 * @returns 是否有子组件
 */
export function hasChildren(
  components: Component[],
  componentId: string
): boolean {
  return components.some((comp) => comp.parentId === componentId);
}

/**
 * 获取子组件数量
 *
 * @param components - 组件数组
 * @param componentId - 组件 ID
 * @returns 子组件数量
 */
export function getChildrenCount(
  components: Component[],
  componentId: string
): number {
  return components.filter((comp) => comp.parentId === componentId).length;
}
