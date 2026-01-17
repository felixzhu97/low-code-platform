/**
 * Component children manipulation utilities
 */
import type { Component } from "./types";

/**
 * Get all child components of a parent
 */
export function getChildComponents(
  components: Component[],
  parentId: string
): Component[] {
  return components.filter((comp) => comp.parentId === parentId);
}

/**
 * Get all child component IDs recursively
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
 * Check if component has children
 */
export function hasChildren(
  components: Component[],
  componentId: string
): boolean {
  return components.some((comp) => comp.parentId === componentId);
}

/**
 * Get component depth in tree
 */
export function getComponentDepth(
  components: Component[],
  componentId: string
): number {
  let depth = 0;
  let current = components.find((comp) => comp.id === componentId);

  while (current?.parentId) {
    depth++;
    current = components.find((comp) => comp.id === current?.parentId);
  }

  return depth;
}
