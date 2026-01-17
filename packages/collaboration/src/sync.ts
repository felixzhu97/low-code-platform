/**
 * Real-time operation synchronization
 */

export interface SyncOperation {
  type: string;
  path: string;
  value?: unknown;
  timestamp: number;
  userId: string;
}

/**
 * Operation synchronizer
 */
export class OperationSynchronizer {
  private operations: SyncOperation[] = [];

  addOperation(operation: SyncOperation): void {
    this.operations.push(operation);
  }

  getOperations(): SyncOperation[] {
    return [...this.operations];
  }

  clear(): void {
    this.operations = [];
  }
}
