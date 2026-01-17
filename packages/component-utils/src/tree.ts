import type { Component, ComponentWithChildren } from "./types";

/**
 * 构建组件树结构
 *
 * @param components - 组件数组
 * @param parentId - 父组件 ID（默认为 null，表示根组件）
 * @returns 构建后的组件树
 */
export function buildComponentTree(
  components: Component[],
  parentId: string | null = null
): ComponentWithChildren[] {
  if (!components || components.length === 0) {
    return [];
  }

  return components
    .filter((comp) => {
      const compParentId = comp.parentId ?? null;
      return compParentId === parentId;
    })
    .map((comp) => ({
      ...comp,
      children: buildComponentTree(components, comp.id),
    }));
}

/**
 * 扁平化组件树为数组
 *
 * @param tree - 组件树
 * @returns 扁平化后的组件数组
 */
export function flattenComponentTree(
  tree: ComponentWithChildren[]
): Component[] {
  const result: Component[] = [];

  function traverse(components: ComponentWithChildren[]) {
    for (const component of components) {
      const { children, ...componentWithoutChildren } = component;
      result.push(componentWithoutChildren);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * 获取组件的所有祖先组件
 *
 * @param componentId - 组件 ID
 * @param components - 组件数组
 * @returns 祖先组件数组（从直接父级到根组件）
 */
export function getAncestors(
  componentId: string,
  components: Component[]
): Component[] {
  const ancestors: Component[] = [];
  let currentId: string | null | undefined = componentId;

  while (currentId) {
    const component = components.find((c) => c.id === currentId);
    if (!component || !component.parentId) {
      break;
    }
    currentId = component.parentId;
    const parent = components.find((c) => c.id === currentId);
    if (parent) {
      ancestors.unshift(parent);
    }
  }

  return ancestors;
}

/**
 * 获取组件路径（从根组件到当前组件）
 *
 * @param componentId - 组件 ID
 * @param components - 组件数组
 * @returns 组件路径数组
 */
export function getComponentPath(
  componentId: string,
  components: Component[]
): Component[] {
  const path: Component[] = [];
  const ancestors = getAncestors(componentId, components);
  path.push(...ancestors);

  const component = components.find((c) => c.id === componentId);
  if (component) {
    path.push(component);
  }

  return path;
}
