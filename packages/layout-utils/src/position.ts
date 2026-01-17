/**
 * Position value object
 */
export class Position {
  constructor(public readonly x: number, public readonly y: number) {
    if (x < 0 || y < 0) {
      throw new Error("Position coordinates must be non-negative");
    }
  }

  static create(x: number, y: number): Position {
    return new Position(x, y);
  }

  static fromObject(obj: { x: number; y: number }): Position {
    return new Position(obj.x, obj.y);
  }

  toObject(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  move(deltaX: number, deltaY: number): Position {
    return new Position(this.x + deltaX, this.y + deltaY);
  }

  snapToGrid(gridSize: number): Position {
    return new Position(
      Math.round(this.x / gridSize) * gridSize,
      Math.round(this.y / gridSize) * gridSize
    );
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
