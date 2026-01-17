/**
 * Component tree manipulation utilities
 */
import type { Component, ComponentWithChildren } from "./types";

/**
 * Build component tree structure
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
 * Flatten component tree to array
 */
export function flattenComponentTree(
  tree: ComponentWithChildren[]
): Component[] {
  const result: Component[] = [];

  function traverse(nodes: ComponentWithChildren[]): void {
    for (const node of nodes) {
      result.push({
        ...node,
        children: node.children?.map((child) => child.id),
      });
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * Traverse component tree
 */
export function traverseComponentTree(
  tree: ComponentWithChildren[],
  callback: (component: ComponentWithChildren) => void
): void {
  for (const node of tree) {
    callback(node);
    if (node.children && node.children.length > 0) {
      traverseComponentTree(node.children, callback);
    }
  }
}
