import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
}

interface UIState {
  activeTab: string;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  leftPanelCollapsed: boolean;
  projectName: string;
  isLoading: boolean;
  notifications: Notification[];
}

const initialState: UIState = {
  activeTab: "components",
  sidebarCollapsed: false,
  rightPanelCollapsed: false,
  leftPanelCollapsed: false,
  projectName: "我的低代码项目",
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleRightPanel: (state) => {
      state.rightPanelCollapsed = !state.rightPanelCollapsed;
    },
    toggleLeftPanel: (state) => {
      state.leftPanelCollapsed = !state.leftPanelCollapsed;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setActiveTab,
  toggleSidebar,
  toggleRightPanel,
  toggleLeftPanel,
  setProjectName,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectActiveTab = (state: { ui: UIState }) => state.ui.activeTab;
export const selectSidebarCollapsed = (state: { ui: UIState }) =>
  state.ui.sidebarCollapsed;
export const selectRightPanelCollapsed = (state: { ui: UIState }) =>
  state.ui.rightPanelCollapsed;
export const selectLeftPanelCollapsed = (state: { ui: UIState }) =>
  state.ui.leftPanelCollapsed;
export const selectProjectName = (state: { ui: UIState }) => state.ui.projectName;
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading;
export const selectNotifications = (state: { ui: UIState }) =>
  state.ui.notifications;
