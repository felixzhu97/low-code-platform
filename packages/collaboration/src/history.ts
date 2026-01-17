/**
 * Operation history merging utilities
 */

export interface HistoryEntry {
  operation: unknown;
  userId: string;
  timestamp: number;
}

/**
 * Merge operation histories
 */
export function mergeHistories(
  localHistory: HistoryEntry[],
  remoteHistory: HistoryEntry[]
): HistoryEntry[] {
  const merged = [...localHistory, ...remoteHistory];
  return merged.sort((a, b) => a.timestamp - b.timestamp);
}
