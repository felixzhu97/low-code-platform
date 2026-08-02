import { describe, it, expect, beforeEach, vi } from "vitest";
import { PersistenceManager, type ProjectData } from "../persistence.manager";
import type { Component } from "@/component/domain/types";

// Store the original localStorage
const originalLocalStorage = window.localStorage;

// Create a fresh mock for each test
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => {
      store = { ...newStore };
    },
  };
};

// Create mock for document.createElement
const createClickMock = vi.fn();
const mockCreateElement = vi.fn(() => ({
  setAttribute: vi.fn(),
  click: createClickMock,
}));

describe("PersistenceManager", () => {
  const createMockComponent = (id: string): Component => ({
    id,
    type: "button",
    name: `Component ${id}`,
    position: { x: 100, y: 100 },
    properties: {},
    children: [],
    parentId: null,
    dataSource: null,
    dataMapping: [],
  });

  const createMockProjectData = (overrides: Partial<ProjectData> = {}): ProjectData => ({
    id: "project-1",
    name: "Test Project",
    description: "A test project",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    components: [createMockComponent("comp-1")],
    canvas: {
      showGrid: false,
      snapToGrid: false,
      viewportWidth: 1280,
      activeDevice: "desktop",
    },
    theme: {
      primaryColor: "#0070f3",
      secondaryColor: "#6c757d",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "0.375rem",
      spacing: "1rem",
    },
    dataSources: [],
    settings: {
      activeTab: "components",
      sidebarCollapsed: false,
      rightPanelCollapsed: false,
      leftPanelCollapsed: false,
    },
    ...overrides,
  });

  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    createClickMock.mockClear();
    localStorageMock = createLocalStorageMock();
    
    // Replace localStorage with our mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    // Replace document.createElement
    Object.defineProperty(document, "createElement", {
      value: mockCreateElement,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  describe("exportProjectData", () => {
    it("should export project data with correct structure", () => {
      const projectData = PersistenceManager.exportProjectData("project-123", "My Project");

      expect(projectData).toBeDefined();
      expect(projectData.id).toBe("project-123");
      expect(projectData.name).toBe("My Project");
      expect(projectData.components).toBeDefined();
      expect(Array.isArray(projectData.components)).toBe(true);
      expect(projectData.canvas).toBeDefined();
      expect(projectData.theme).toBeDefined();
      expect(projectData.settings).toBeDefined();
    });

    it("should export canvas settings", () => {
      const projectData = PersistenceManager.exportProjectData("p1", "Test");

      expect(projectData.canvas.showGrid).toBeDefined();
      expect(projectData.canvas.snapToGrid).toBeDefined();
      expect(projectData.canvas.viewportWidth).toBeDefined();
      expect(projectData.canvas.activeDevice).toBeDefined();
    });

    it("should export theme settings", () => {
      const projectData = PersistenceManager.exportProjectData("p1", "Test");

      expect(projectData.theme.primaryColor).toBeDefined();
      expect(projectData.theme.backgroundColor).toBeDefined();
    });
  });

  describe("saveProject", () => {
    it("should save project to localStorage", () => {
      const projectData = createMockProjectData();

      PersistenceManager.saveProject(projectData);

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("should create new project if not exists", () => {
      const projectData = createMockProjectData({ id: "new-project" });

      PersistenceManager.saveProject(projectData);

      const storedData = localStorageMock.getItem("lowcode-projects");
      const projects = JSON.parse(storedData || "[]");

      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe("new-project");
    });

    it("should update existing project", () => {
      const existingProject = createMockProjectData({ id: "existing" });
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify([existingProject]),
      });

      const updatedProject = createMockProjectData({
        id: "existing",
        name: "Updated Name",
      });

      PersistenceManager.saveProject(updatedProject);

      const storedData = localStorageMock.getItem("lowcode-projects");
      const projects = JSON.parse(storedData || "[]");

      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe("Updated Name");
    });

    it("should handle saveProject errors", () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("Storage full");
      });

      expect(() => PersistenceManager.saveProject(createMockProjectData())).toThrow("保存项目失败");
    });
  });

  describe("loadProject", () => {
    it("should load existing project", () => {
      const project = createMockProjectData({ id: "test-project" });
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify([project]),
      });

      const loaded = PersistenceManager.loadProject("test-project");

      expect(loaded).toBeDefined();
      expect(loaded?.id).toBe("test-project");
    });

    it("should return null for non-existent project", () => {
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify([]),
      });

      const loaded = PersistenceManager.loadProject("non-existent");

      expect(loaded).toBeNull();
    });

    it("should return null when no projects stored", () => {
      localStorageMock._setStore({});

      const loaded = PersistenceManager.loadProject("any-id");

      expect(loaded).toBeNull();
    });

    it("should handle corrupted JSON data", () => {
      localStorageMock._setStore({
        "lowcode-projects": "invalid json {",
      });

      const loaded = PersistenceManager.loadProject("any-id");

      expect(loaded).toBeNull();
    });
  });

  describe("getAllProjects", () => {
    it("should return all projects", () => {
      const projects = [
        createMockProjectData({ id: "project-1" }),
        createMockProjectData({ id: "project-2" }),
        createMockProjectData({ id: "project-3" }),
      ];
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify(projects),
      });

      const allProjects = PersistenceManager.getAllProjects();

      expect(allProjects).toHaveLength(3);
    });

    it("should return empty array when no projects", () => {
      localStorageMock._setStore({});

      const allProjects = PersistenceManager.getAllProjects();

      expect(allProjects).toEqual([]);
    });

    it("should return empty array on error", () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const allProjects = PersistenceManager.getAllProjects();

      expect(allProjects).toEqual([]);
    });
  });

  describe("deleteProject", () => {
    it("should delete existing project", () => {
      const projects = [
        createMockProjectData({ id: "project-1" }),
        createMockProjectData({ id: "project-2" }),
      ];
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify(projects),
      });

      const result = PersistenceManager.deleteProject("project-1");

      expect(result).toBe(true);
      const storedData = localStorageMock.getItem("lowcode-projects");
      const remainingProjects = JSON.parse(storedData || "[]");
      expect(remainingProjects).toHaveLength(1);
      expect(remainingProjects[0].id).toBe("project-2");
    });

    it("should clear current project ID when deleted", () => {
      const projects = [createMockProjectData({ id: "current" })];
      localStorageMock._setStore({
        "lowcode-projects": JSON.stringify(projects),
        "lowcode-current-project": "current",
      });

      PersistenceManager.deleteProject("current");

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("lowcode-current-project");
    });

    it("should not clear current project ID when different project deleted", () => {
      localStorageMock._setStore({
        "lowcode-current-project": "other-project",
      });

      PersistenceManager.deleteProject("project-to-delete");

      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });

    it("should handle delete error gracefully", () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const result = PersistenceManager.deleteProject("any-id");

      expect(result).toBe(false);
    });
  });

  describe("Current Project ID Management", () => {
    describe("setCurrentProjectId", () => {
      it("should set current project ID", () => {
        PersistenceManager.setCurrentProjectId("project-123");

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "lowcode-current-project",
          "project-123"
        );
      });
    });

    describe("getCurrentProjectId", () => {
      it("should return current project ID", () => {
        localStorageMock._setStore({
          "lowcode-current-project": "current-project-id",
        });

        const currentId = PersistenceManager.getCurrentProjectId();

        expect(currentId).toBe("current-project-id");
      });

      it("should return null when no current project", () => {
        localStorageMock._setStore({});

        const currentId = PersistenceManager.getCurrentProjectId();

        expect(currentId).toBeNull();
      });
    });

    describe("clearCurrentProjectId", () => {
      it("should clear current project ID", () => {
        PersistenceManager.clearCurrentProjectId();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith("lowcode-current-project");
      });
    });
  });

  describe("saveCurrentProject", () => {
    it("should save and set current project", () => {
      const mockExport = vi.spyOn(PersistenceManager, "exportProjectData");
      mockExport.mockReturnValue(createMockProjectData());

      PersistenceManager.saveCurrentProject("project-id", "Project Name");

      expect(mockExport).toHaveBeenCalledWith("project-id", "Project Name");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "lowcode-current-project",
        "project-id"
      );
    });
  });

  describe("exportToFile", () => {
    it("should create download link", () => {
      const projectData = createMockProjectData();

      PersistenceManager.exportToFile(projectData);

      expect(mockCreateElement).toHaveBeenCalledWith("a");
    });

    it("should call click on link element", () => {
      const projectData = createMockProjectData();

      PersistenceManager.exportToFile(projectData);

      expect(createClickMock).toHaveBeenCalled();
    });

    it("should set download attribute with custom filename", () => {
      const projectData = createMockProjectData({ name: "My Project" });

      PersistenceManager.exportToFile(projectData, "custom-filename.json");

      const link = mockCreateElement.mock.results[0].value;
      expect(link.setAttribute).toHaveBeenCalledWith("download", "custom-filename.json");
    });

    it("should use project name as default filename", () => {
      const projectData = createMockProjectData({ name: "Test Project" });

      PersistenceManager.exportToFile(projectData);

      const link = mockCreateElement.mock.results[0].value;
      expect(link.setAttribute).toHaveBeenCalledWith("download", "Test Project.json");
    });
  });

  describe("validateProjectData", () => {
    it("should validate correct project data", () => {
      const validProject = createMockProjectData();

      const isValid = (PersistenceManager as any).validateProjectData(validProject);

      expect(isValid).toBe(true);
    });

    it("should reject missing id", () => {
      const invalidProject = createMockProjectData();
      delete (invalidProject as any).id;

      const isValid = (PersistenceManager as any).validateProjectData(invalidProject);

      expect(isValid).toBeFalsy();
    });

    it("should reject missing name", () => {
      const invalidProject = createMockProjectData();
      delete (invalidProject as any).name;

      const isValid = (PersistenceManager as any).validateProjectData(invalidProject);

      expect(isValid).toBeFalsy();
    });

    it("should reject invalid components array", () => {
      const invalidProject = createMockProjectData();
      (invalidProject as any).components = "not an array";

      const isValid = (PersistenceManager as any).validateProjectData(invalidProject);

      expect(isValid).toBeFalsy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty project name", () => {
      const projectData = createMockProjectData({ name: "" });

      expect(() => PersistenceManager.saveProject(projectData)).not.toThrow();
    });

    it("should handle project with no components", () => {
      const projectData = createMockProjectData({ components: [] });

      expect(() => PersistenceManager.saveProject(projectData)).not.toThrow();
    });

    it("should handle project with complex components", () => {
      const complexComponent: Component = {
        id: "complex",
        type: "container",
        name: "Complex Container",
        position: { x: 100, y: 200 },
        properties: {
          styles: { background: "#fff", padding: "16px" },
          config: { expandable: true },
        },
        children: ["child-1", "child-2"],
        parentId: null,
        dataSource: "ds-1",
        dataMapping: [
          { field: "title", sourcePath: "data.title", targetPath: "props.title" },
        ],
      };

      const projectData = createMockProjectData({
        components: [complexComponent],
      });

      PersistenceManager.saveProject(projectData);

      const stored = localStorageMock.getItem("lowcode-projects");
      const parsed = JSON.parse(stored || "[]");

      expect(parsed[0].components[0].properties).toBeDefined();
    });

    it("should handle rapid save operations", () => {
      for (let i = 0; i < 50; i++) {
        PersistenceManager.saveProject(
          createMockProjectData({ id: `project-${i}`, name: `Project ${i}` })
        );
      }

      const stored = localStorageMock.getItem("lowcode-projects");
      const projects = JSON.parse(stored || "[]");

      expect(projects).toHaveLength(50);
    });

    it("should handle localStorage quota exceeded", () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

      expect(() => PersistenceManager.saveProject(createMockProjectData())).toThrow();
    });
  });
});
