/**
 * Conflict resolution utilities
 */

export interface Conflict {
  path: string;
  localValue: unknown;
  remoteValue: unknown;
  timestamp: number;
}

/**
 * Resolve conflicts by merging values
 */
export function resolveConflict(conflict: Conflict): unknown {
  // Simple conflict resolution: prefer remote value
  return conflict.remoteValue;
}
