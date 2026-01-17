/**
 * Component search utilities
 */
import type { Component } from "./types";

/**
 * Find component by ID
 */
export function findComponentById(
  components: Component[],
  id: string
): Component | undefined {
  return components.find((comp) => comp.id === id);
}

/**
 * Find components by type
 */
export function findComponentsByType(
  components: Component[],
  type: string
): Component[] {
  return components.filter((comp) => comp.type === type);
}

/**
 * Find root components (no parentId)
 */
export function findRootComponents(components: Component[]): Component[] {
  return components.filter((comp) => !comp.parentId);
}

/**
 * Find component and its ancestors
 */
export function findComponentAncestors(
  components: Component[],
  id: string
): Component[] {
  const ancestors: Component[] = [];
  let current = findComponentById(components, id);

  while (current?.parentId) {
    const parent = findComponentById(components, current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }

  return ancestors;
}
