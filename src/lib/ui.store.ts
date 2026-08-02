import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  // UI状态
  activeTab: string;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  leftPanelCollapsed: boolean;
  projectName: string;
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;

  // UI操作
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleLeftPanel: () => void;
  setProjectName: (name: string) => void;
  setLoading: (loading: boolean) => void;

  // 通知操作
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        activeTab: "components",
        sidebarCollapsed: false,
        rightPanelCollapsed: false,
        leftPanelCollapsed: false,
        projectName: "我的低代码项目",
        isLoading: false,
        notifications: [],

        // 设置活动标签
        setActiveTab: (tab: string) => {
          set({ activeTab: tab }, false, "setActiveTab");
        },

        // 切换侧边栏
        toggleSidebar: () => {
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            "toggleSidebar"
          );
        },

        // 切换右侧面板
        toggleRightPanel: () => {
          set(
            (state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed }),
            false,
            "toggleRightPanel"
          );
        },

        // 切换左侧面板
        toggleLeftPanel: () => {
          set(
            (state) => ({ leftPanelCollapsed: !state.leftPanelCollapsed }),
            false,
            "toggleLeftPanel"
          );
        },

        // 设置项目名称
        setProjectName: (name: string) => {
          set({ projectName: name }, false, "setProjectName");
        },

        // 设置加载状态
        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, "setLoading");
        },

        // 添加通知
        addNotification: (notification) => {
          const id = Math.random().toString(36).substr(2, 9);
          const newNotification = {
            ...notification,
            id,
            timestamp: Date.now(),
          };

          set(
            (state) => ({
              notifications: [...state.notifications, newNotification],
            }),
            false,
            "addNotification"
          );

          // 自动移除通知（5秒后）
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        },

        // 移除通知
        removeNotification: (id: string) => {
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            "removeNotification"
          );
        },

        // 清除所有通知
        clearNotifications: () => {
          set({ notifications: [] }, false, "clearNotifications");
        },
      }),
      {
        name: "ui-store",
        partialize: (state) => ({
          activeTab: state.activeTab,
          sidebarCollapsed: state.sidebarCollapsed,
          rightPanelCollapsed: state.rightPanelCollapsed,
          leftPanelCollapsed: state.leftPanelCollapsed,
          projectName: state.projectName,
        }),
      }
    ),
    {
      name: "ui-store",
    }
  )
);
