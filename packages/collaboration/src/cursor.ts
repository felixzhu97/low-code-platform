/**
 * Collaborative cursor management
 */

export interface Cursor {
  userId: string;
  x: number;
  y: number;
  color?: string;
}

/**
 * Cursor manager
 */
export class CursorManager {
  private cursors = new Map<string, Cursor>();

  updateCursor(cursor: Cursor): void {
    this.cursors.set(cursor.userId, cursor);
  }

  removeCursor(userId: string): void {
    this.cursors.delete(userId);
  }

  getCursor(userId: string): Cursor | undefined {
    return this.cursors.get(userId);
  }

  getAllCursors(): Cursor[] {
    return Array.from(this.cursors.values());
  }

  clear(): void {
    this.cursors.clear();
  }
}
