import type { Component } from "./types";

/**
 * 根据 ID 查找组件
 *
 * @param components - 组件数组
 * @param id - 组件 ID
 * @returns 找到的组件或 undefined
 */
export function findComponentById(
  components: Component[],
  id: string
): Component | undefined {
  return components.find((comp) => comp.id === id);
}

/**
 * 根据类型查找组件
 *
 * @param components - 组件数组
 * @param type - 组件类型
 * @returns 匹配的组件数组
 */
export function findComponentsByType(
  components: Component[],
  type: string
): Component[] {
  return components.filter((comp) => comp.type === type);
}

/**
 * 根据父组件 ID 查找组件
 *
 * @param components - 组件数组
 * @param parentId - 父组件 ID
 * @returns 匹配的组件数组
 */
export function findComponentsByParentId(
  components: Component[],
  parentId: string | null
): Component[] {
  return components.filter((comp) => (comp.parentId ?? null) === parentId);
}

/**
 * 查找根组件（没有父组件的组件）
 *
 * @param components - 组件数组
 * @returns 根组件数组
 */
export function findRootComponents(components: Component[]): Component[] {
  return findComponentsByParentId(components, null);
}

/**
 * 根据名称查找组件
 *
 * @param components - 组件数组
 * @param name - 组件名称
 * @returns 匹配的组件数组
 */
export function findComponentsByName(
  components: Component[],
  name: string
): Component[] {
  return components.filter((comp) => comp.name === name);
}

/**
 * 根据条件查找组件
 *
 * @param components - 组件数组
 * @param predicate - 判断函数
 * @returns 匹配的组件数组
 */
export function findComponents(
  components: Component[],
  predicate: (component: Component) => boolean
): Component[] {
  return components.filter(predicate);
}
