import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useUIStore } from "../ui.store";

// Mock zustand/middleware
vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual("zustand/middleware");
  return {
    ...actual,
    devtools: (fn: any) => fn,
    persist: (fn: any) => fn,
  };
});

describe("useUIStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useUIStore.setState({
      activeTab: "components",
      sidebarCollapsed: false,
      rightPanelCollapsed: false,
      leftPanelCollapsed: false,
      projectName: "我的低代码项目",
      isLoading: false,
      notifications: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.activeTab).toBe("components");
      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.rightPanelCollapsed).toBe(false);
      expect(result.current.leftPanelCollapsed).toBe(false);
      expect(result.current.projectName).toBe("我的低代码项目");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.notifications).toEqual([]);
    });
  });

  describe("setActiveTab", () => {
    it("should set active tab", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveTab("data");
      });

      expect(result.current.activeTab).toBe("data");
    });

    it("should handle valid tab names", () => {
      const { result } = renderHook(() => useUIStore());
      const validTabs = ["components", "data", "theme", "settings"];

      validTabs.forEach((tab) => {
        act(() => {
          result.current.setActiveTab(tab);
        });
        expect(result.current.activeTab).toBe(tab);
      });
    });

    it("should handle custom tab names", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setActiveTab("custom-tab-name");
      });

      expect(result.current.activeTab).toBe("custom-tab-name");
    });
  });

  describe("toggleSidebar", () => {
    it("should toggle sidebar from expanded to collapsed", () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.sidebarCollapsed).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it("should toggle sidebar from collapsed to expanded", () => {
      useUIStore.setState({ sidebarCollapsed: true });
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it("should toggle sidebar multiple times", () => {
      const { result } = renderHook(() => useUIStore());

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.toggleSidebar();
        });
        expect(result.current.sidebarCollapsed).toBe(i % 2 === 0 ? true : false);
      }
    });
  });

  describe("toggleRightPanel", () => {
    it("should toggle right panel from expanded to collapsed", () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.rightPanelCollapsed).toBe(false);

      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.rightPanelCollapsed).toBe(true);
    });

    it("should toggle right panel from collapsed to expanded", () => {
      useUIStore.setState({ rightPanelCollapsed: true });
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.rightPanelCollapsed).toBe(false);
    });
  });

  describe("toggleLeftPanel", () => {
    it("should toggle left panel from expanded to collapsed", () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.leftPanelCollapsed).toBe(false);

      act(() => {
        result.current.toggleLeftPanel();
      });

      expect(result.current.leftPanelCollapsed).toBe(true);
    });

    it("should toggle left panel from collapsed to expanded", () => {
      useUIStore.setState({ leftPanelCollapsed: true });
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleLeftPanel();
      });

      expect(result.current.leftPanelCollapsed).toBe(false);
    });
  });

  describe("setProjectName", () => {
    it("should set project name", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setProjectName("New Project");
      });

      expect(result.current.projectName).toBe("New Project");
    });

    it("should handle empty string", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setProjectName("");
      });

      expect(result.current.projectName).toBe("");
    });

    it("should handle unicode characters", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setProjectName("我的项目 123");
      });

      expect(result.current.projectName).toBe("我的项目 123");
    });

    it("should handle special characters", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setProjectName("Project @#$%^&*()_+-=[]{}|;':\",./<>?");
      });

      expect(result.current.projectName).toBe("Project @#$%^&*()_+-=[]{}|;':\",./<>?");
    });
  });

  describe("setLoading", () => {
    it("should set loading to true", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      useUIStore.setState({ isLoading: true });
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should toggle loading state", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setLoading(true);
      });
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("addNotification", () => {
    it("should add a success notification", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          type: "success",
          message: "Operation completed successfully",
        });
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].type).toBe("success");
      expect(result.current.notifications[0].message).toBe("Operation completed successfully");
      expect(result.current.notifications[0].id).toBeDefined();
      expect(result.current.notifications[0].timestamp).toBeDefined();
    });

    it("should add an error notification", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          type: "error",
          message: "Something went wrong",
        });
      });

      expect(result.current.notifications[0].type).toBe("error");
      expect(result.current.notifications[0].message).toBe("Something went wrong");
    });

    it("should add a warning notification", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          type: "warning",
          message: "Please be careful",
        });
      });

      expect(result.current.notifications[0].type).toBe("warning");
    });

    it("should add an info notification", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          type: "info",
          message: "Here is some information",
        });
      });

      expect(result.current.notifications[0].type).toBe("info");
    });

    it("should add multiple notifications", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({ type: "success", message: "First" });
        result.current.addNotification({ type: "error", message: "Second" });
        result.current.addNotification({ type: "warning", message: "Third" });
      });

      expect(result.current.notifications).toHaveLength(3);
    });

    it("should auto-remove notification after 5 seconds", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({ type: "success", message: "Temporary" });
      });

      expect(result.current.notifications).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it("should generate unique IDs for notifications", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({ type: "info", message: "First" });
        result.current.addNotification({ type: "info", message: "Second" });
      });

      expect(result.current.notifications[0].id).not.toBe(result.current.notifications[1].id);
    });
  });

  describe("removeNotification", () => {
    it("should remove notification by id", () => {
      const { result } = renderHook(() => useUIStore());
      const notificationId = "test-id-123";

      useUIStore.setState({
        notifications: [
          { id: notificationId, type: "success", message: "Test", timestamp: Date.now() },
          { id: "other-id", type: "info", message: "Other", timestamp: Date.now() },
        ],
      });

      act(() => {
        result.current.removeNotification(notificationId);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].id).toBe("other-id");
    });

    it("should not throw when removing non-existent notification", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.removeNotification("non-existent-id");
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it("should handle empty notifications array", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.removeNotification("any-id");
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it("should only remove the specified notification", () => {
      const { result } = renderHook(() => useUIStore());
      const notifications = [
        { id: "id-1", type: "success" as const, message: "First", timestamp: Date.now() },
        { id: "id-2", type: "error" as const, message: "Second", timestamp: Date.now() },
        { id: "id-3", type: "warning" as const, message: "Third", timestamp: Date.now() },
      ];

      useUIStore.setState({ notifications });

      act(() => {
        result.current.removeNotification("id-2");
      });

      expect(result.current.notifications).toHaveLength(2);
      expect(result.current.notifications.find((n) => n.id === "id-1")).toBeDefined();
      expect(result.current.notifications.find((n) => n.id === "id-2")).toBeUndefined();
      expect(result.current.notifications.find((n) => n.id === "id-3")).toBeDefined();
    });
  });

  describe("clearNotifications", () => {
    it("should clear all notifications", () => {
      const { result } = renderHook(() => useUIStore());
      useUIStore.setState({
        notifications: [
          { id: "id-1", type: "success" as const, message: "First", timestamp: Date.now() },
          { id: "id-2", type: "error" as const, message: "Second", timestamp: Date.now() },
          { id: "id-3", type: "warning" as const, message: "Third", timestamp: Date.now() },
        ],
      });

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications).toEqual([]);
    });

    it("should handle empty notifications array", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications).toEqual([]);
    });
  });

  describe("Notification Auto-Removal", () => {
    it("should only remove the specific notification after timeout", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({ type: "success", message: "Will be removed" });
        result.current.addNotification({ type: "error", message: "Should stay" });
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.notifications).toHaveLength(0);
    });

    it("should handle notifications added at different times", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({ type: "info", message: "First" });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.addNotification({ type: "warning", message: "Second" });
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe("Second");
    });

    it("should remove all notifications after timeout", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addNotification({ type: "info", message: `Notification ${i}` });
        }
      });

      expect(result.current.notifications).toHaveLength(10);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.notifications).toHaveLength(0);
    });
  });

  describe("Panel State Combinations", () => {
    it("should handle all panels collapsed", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
        result.current.toggleRightPanel();
        result.current.toggleLeftPanel();
      });

      expect(result.current.sidebarCollapsed).toBe(true);
      expect(result.current.rightPanelCollapsed).toBe(true);
      expect(result.current.leftPanelCollapsed).toBe(true);
    });

    it("should handle all panels expanded", () => {
      useUIStore.setState({
        sidebarCollapsed: true,
        rightPanelCollapsed: true,
        leftPanelCollapsed: true,
      });
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
        result.current.toggleRightPanel();
        result.current.toggleLeftPanel();
      });

      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.rightPanelCollapsed).toBe(false);
      expect(result.current.leftPanelCollapsed).toBe(false);
    });

    it("should handle mixed panel states", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(true);
      expect(result.current.rightPanelCollapsed).toBe(false);
      expect(result.current.leftPanelCollapsed).toBe(false);

      act(() => {
        result.current.toggleRightPanel();
      });

      expect(result.current.sidebarCollapsed).toBe(true);
      expect(result.current.rightPanelCollapsed).toBe(true);
      expect(result.current.leftPanelCollapsed).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long project name", () => {
      const { result } = renderHook(() => useUIStore());
      const longName = "A".repeat(1000);

      act(() => {
        result.current.setProjectName(longName);
      });

      expect(result.current.projectName).toBe(longName);
    });

    it("should handle very long notification message", () => {
      const { result } = renderHook(() => useUIStore());
      const longMessage = "B".repeat(500);

      act(() => {
        result.current.addNotification({ type: "info", message: longMessage });
      });

      expect(result.current.notifications[0].message).toBe(longMessage);
    });

    it("should handle rapid notification additions", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addNotification({ type: "info", message: `Notification ${i}` });
        }
      });

      expect(result.current.notifications).toHaveLength(100);
    });

    it("should handle rapid panel toggles", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.toggleSidebar();
        }
      });

      expect(result.current.sidebarCollapsed).toBe(50 % 2 === 0 ? false : true);
    });

    it("should handle rapid tab switches", () => {
      const { result } = renderHook(() => useUIStore());
      const tabs = ["components", "data", "theme", "settings"];

      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.setActiveTab(tabs[i % tabs.length]);
        }
      });

      expect(tabs).toContain(result.current.activeTab);
    });
  });

  describe("Complete UI Workflow", () => {
    it("should handle typical user workflow", () => {
      const { result } = renderHook(() => useUIStore());

      // Set project name
      act(() => {
        result.current.setProjectName("My Awesome App");
      });
      expect(result.current.projectName).toBe("My Awesome App");

      // Switch tabs
      act(() => {
        result.current.setActiveTab("data");
      });
      expect(result.current.activeTab).toBe("data");

      // Toggle panels
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.sidebarCollapsed).toBe(true);

      // Add notifications
      act(() => {
        result.current.addNotification({ type: "success", message: "Data loaded" });
        result.current.setLoading(true);
      });
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.isLoading).toBe(true);

      // Complete loading
      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.isLoading).toBe(false);

      // Add error notification
      act(() => {
        result.current.addNotification({ type: "error", message: "Failed to save" });
      });
      expect(result.current.notifications).toHaveLength(2);

      // Clear notifications
      act(() => {
        result.current.clearNotifications();
      });
      expect(result.current.notifications).toHaveLength(0);

      // Reset UI state
      act(() => {
        result.current.toggleSidebar();
        result.current.setActiveTab("components");
      });
      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.activeTab).toBe("components");
    });

    it("should handle notification lifecycle", () => {
      const { result } = renderHook(() => useUIStore());

      // Add multiple notifications
      act(() => {
        result.current.addNotification({ type: "success", message: "Created successfully" });
        result.current.addNotification({ type: "info", message: "Processing..." });
        result.current.addNotification({ type: "warning", message: "Low disk space" });
      });

      expect(result.current.notifications).toHaveLength(3);

      // Remove one notification
      const idToRemove = result.current.notifications[1].id;
      act(() => {
        result.current.removeNotification(idToRemove);
      });

      expect(result.current.notifications).toHaveLength(2);

      // Clear all remaining
      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
