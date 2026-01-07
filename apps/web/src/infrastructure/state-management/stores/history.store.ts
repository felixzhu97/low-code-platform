import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Component } from "@/domain/component";
import {
  createHistory,
  addToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  type HistoryState,
} from "@/application/services/history";

interface HistoryStateStore {
  // 历史状态
  componentsHistory: HistoryState<Component[]>;

  // 历史操作
  addToHistory: (components: Component[]) => void;
  undo: () => Component[] | null;
  redo: () => Component[] | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // 获取历史信息
  getHistoryInfo: () => {
    currentIndex: number;
    totalSteps: number;
    canUndo: boolean;
    canRedo: boolean;
  };
}

export const useHistoryStore = create<HistoryStateStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      componentsHistory: createHistory([]),

      // 添加到历史记录
      addToHistory: (components: Component[]) => {
        set(
          (state) => ({
            componentsHistory: addToHistory(
              state.componentsHistory,
              components
            ),
          }),
          false,
          "addToHistory"
        );
      },

      // 撤销
      undo: () => {
        const { componentsHistory } = get();
        if (!canUndo(componentsHistory)) return null;

        const newHistory = undo(componentsHistory);
        set({ componentsHistory: newHistory }, false, "undo");

        return newHistory.present;
      },

      // 重做
      redo: () => {
        const { componentsHistory } = get();
        if (!canRedo(componentsHistory)) return null;

        const newHistory = redo(componentsHistory);
        set({ componentsHistory: newHistory }, false, "redo");

        return newHistory.present;
      },

      // 检查是否可以撤销
      canUndo: () => {
        const { componentsHistory } = get();
        return canUndo(componentsHistory);
      },

      // 检查是否可以重做
      canRedo: () => {
        const { componentsHistory } = get();
        return canRedo(componentsHistory);
      },

      // 清除历史记录
      clearHistory: () => {
        set({ componentsHistory: createHistory([]) }, false, "clearHistory");
      },

      // 获取历史信息
      getHistoryInfo: () => {
        const { componentsHistory } = get();
        return {
          currentIndex: componentsHistory.past.length,
          totalSteps:
            componentsHistory.past.length + componentsHistory.future.length + 1,
          canUndo: canUndo(componentsHistory),
          canRedo: canRedo(componentsHistory),
        };
      },
    }),
    {
      name: "history-store",
    }
  )
);
