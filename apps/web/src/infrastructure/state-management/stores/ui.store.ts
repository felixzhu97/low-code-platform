import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as uiActions from "../store/slices/ui.slice";

export const useUIStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.ui);

  return {
    ...state,
    setActiveTab: (tab: string) => dispatch(uiActions.setActiveTab(tab)),
    toggleSidebar: () => dispatch(uiActions.toggleSidebar()),
    toggleRightPanel: () => dispatch(uiActions.toggleRightPanel()),
    toggleLeftPanel: () => dispatch(uiActions.toggleLeftPanel()),
    setProjectName: (name: string) =>
      dispatch(uiActions.setProjectName(name)),
    setLoading: (loading: boolean) => dispatch(uiActions.setLoading(loading)),
    addNotification: (
      notification: { type: "success" | "error" | "warning" | "info"; message: string }
    ) => dispatch(uiActions.addNotification(notification)),
    removeNotification: (id: string) =>
      dispatch(uiActions.removeNotification(id)),
    clearNotifications: () => dispatch(uiActions.clearNotifications()),
  };
};
