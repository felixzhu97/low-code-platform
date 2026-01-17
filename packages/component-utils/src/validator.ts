/**
 * Component validation utilities
 */
import type { Component } from "./types";

/**
 * Validate component structure
 */
export function validateComponent(component: unknown): component is Component {
  if (!component || typeof component !== "object") {
    return false;
  }

  const comp = component as Record<string, unknown>;

  if (typeof comp.id !== "string" || !comp.id) {
    return false;
  }

  if (typeof comp.type !== "string" || !comp.type) {
    return false;
  }

  if (typeof comp.name !== "string" || !comp.name) {
    return false;
  }

  return true;
}

/**
 * Validate component array
 */
export function validateComponents(
  components: unknown
): components is Component[] {
  if (!Array.isArray(components)) {
    return false;
  }

  return components.every((comp) => validateComponent(comp));
}
