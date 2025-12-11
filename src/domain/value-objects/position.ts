/**
 * 位置值对象
 * 表示组件在画布上的位置坐标
 */
export class Position {
  constructor(public readonly x: number, public readonly y: number) {
    if (x < 0 || y < 0) {
      throw new Error("Position coordinates must be non-negative");
    }
  }

  /**
   * 创建位置对象
   */
  static create(x: number, y: number): Position {
    return new Position(x, y);
  }

  /**
   * 从对象创建位置
   */
  static fromObject(obj: { x: number; y: number }): Position {
    return new Position(obj.x, obj.y);
  }

  /**
   * 转换为普通对象
   */
  toObject(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * 移动到新位置
   */
  move(deltaX: number, deltaY: number): Position {
    return new Position(this.x + deltaX, this.y + deltaY);
  }

  /**
   * 对齐到网格
   */
  snapToGrid(gridSize: number): Position {
    return new Position(
      Math.round(this.x / gridSize) * gridSize,
      Math.round(this.y / gridSize) * gridSize
    );
  }

  /**
   * 判断是否相等
   */
  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
