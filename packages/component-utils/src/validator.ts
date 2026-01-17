import type { Component } from "./types";
import { isString, isObject, isArray } from "@lowcode-platform/utils";

/**
 * 验证组件是否有效
 *
 * @param component - 要验证的组件
 * @returns 是否有效
 */
export function isValidComponent(component: unknown): component is Component {
  if (!isObject(component)) {
    return false;
  }

  const comp = component as Record<string, unknown>;

  // 必须有 id、type、name
  if (!isString(comp.id) || !isString(comp.type) || !isString(comp.name)) {
    return false;
  }

  // properties 必须是对象（如果存在）
  if (comp.properties !== undefined && !isObject(comp.properties)) {
    return false;
  }

  // children 必须是数组（如果存在）
  if (comp.children !== undefined && !isArray(comp.children)) {
    return false;
  }

  // parentId 必须是字符串或 null（如果存在）
  if (
    comp.parentId !== undefined &&
    comp.parentId !== null &&
    !isString(comp.parentId)
  ) {
    return false;
  }

  // dataSource 必须是字符串或 null（如果存在）
  if (
    comp.dataSource !== undefined &&
    comp.dataSource !== null &&
    !isString(comp.dataSource)
  ) {
    return false;
  }

  // dataMapping 必须是数组（如果存在）
  if (comp.dataMapping !== undefined && !isArray(comp.dataMapping)) {
    return false;
  }

  return true;
}

/**
 * 验证组件数组是否有效
 *
 * @param components - 要验证的组件数组
 * @returns 是否有效
 */
export function isValidComponentArray(
  components: unknown
): components is Component[] {
  if (!isArray(components)) {
    return false;
  }

  return components.every((comp) => isValidComponent(comp));
}

/**
 * 验证组件树结构是否有效（没有循环引用）
 *
 * @param components - 组件数组
 * @returns 是否有效
 */
export function isValidComponentTree(components: Component[]): boolean {
  if (!isValidComponentArray(components)) {
    return false;
  }

  // 检查是否有循环引用
  const visited = new Set<string>();

  function hasCycle(componentId: string): boolean {
    if (visited.has(componentId)) {
      return true;
    }

    visited.add(componentId);
    const component = components.find((c) => c.id === componentId);

    if (component?.parentId) {
      return hasCycle(component.parentId);
    }

    return false;
  }

  for (const component of components) {
    if (component.parentId && hasCycle(component.id)) {
      return false;
    }
    visited.clear();
  }

  return true;
}
