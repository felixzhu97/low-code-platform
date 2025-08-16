/**
 * History ViewModel - 历史记录视图模型
 * 负责撤销/重做功能的状态管理
 */

export class HistoryViewModel<T> {
  private past: T[] = [];
  private present: T;
  private future: T[] = [];
  private maxHistorySize: number;

  constructor(initialState: T, maxHistorySize: number = 50) {
    this.present = initialState;
    this.maxHistorySize = maxHistorySize;
    // 初始状态不算作历史记录
  }

  // 添加新状态
  addState(newState: T): void {
    // 如果新状态与当前状态相同，不添加到历史记录
    if (JSON.stringify(newState) === JSON.stringify(this.present)) {
      return;
    }

    // 将当前状态添加到过去（深拷贝）
    this.past.push(JSON.parse(JSON.stringify(this.present)));
    
    // 限制历史记录大小
    if (this.past.length > this.maxHistorySize) {
      this.past.shift();
    }

    // 设置新的当前状态（深拷贝）
    this.present = JSON.parse(JSON.stringify(newState));
    
    // 清空未来状态（因为添加了新状态）
    this.future = [];
  }

  // 撤销操作
  undo(): T | null {
    if (this.past.length === 0) {
      return null;
    }

    const previous = this.past.pop()!;
    this.future.unshift(JSON.parse(JSON.stringify(this.present)));
    this.present = JSON.parse(JSON.stringify(previous));

    return this.present;
  }

  // 重做操作
  redo(): T | null {
    if (this.future.length === 0) {
      return null;
    }

    const next = this.future.shift()!;
    this.past.push(JSON.parse(JSON.stringify(this.present)));
    this.present = JSON.parse(JSON.stringify(next));

    return this.present;
  }

  // 检查是否可以撤销
  canUndo(): boolean {
    return this.past.length > 0;
  }

  // 检查是否可以重做
  canRedo(): boolean {
    return this.future.length > 0;
  }

  // 获取当前状态
  getCurrentState(): T {
    return this.present;
  }

  // 获取历史记录信息
  getHistoryInfo(): {
    pastCount: number;
    futureCount: number;
    canUndo: boolean;
    canRedo: boolean;
  } {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  // 清空历史记录
  clearHistory(): void {
    this.past = [];
    this.future = [];
  }

  // 重置到指定状态
  resetTo(state: T): void {
    this.past = [];
    this.future = [];
    this.present = state;
  }
}