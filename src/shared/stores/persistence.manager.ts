import { useComponentStore } from "./component.store";
import { useCanvasStore } from "./canvas.store";
import { useThemeStore } from "./theme.store";
import { useDataStore } from "./data.store";
import { useUIStore } from "./ui.store";
import type { Component } from "@/domain/entities/types";

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  components: Component[];
  canvas: {
    showGrid: boolean;
    snapToGrid: boolean;
    viewportWidth: number;
    activeDevice: string;
  };
  theme: any;
  dataSources: any[];
  settings: {
    activeTab: string;
    sidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    leftPanelCollapsed: boolean;
  };
}

class PersistenceManager {
  private static readonly STORAGE_KEY = "lowcode-projects";
  private static readonly CURRENT_PROJECT_KEY = "lowcode-current-project";

  /**
   * 保存当前项目
   */
  static saveCurrentProject(projectId: string, projectName: string): void {
    const projectData = this.exportProjectData(projectId, projectName);
    this.saveProject(projectData);
    this.setCurrentProjectId(projectId);
  }

  /**
   * 导出当前项目数据
   */
  static exportProjectData(
    projectId: string,
    projectName: string
  ): ProjectData {
    const componentStore = useComponentStore.getState();
    const canvasStore = useCanvasStore.getState();
    const themeStore = useThemeStore.getState();
    const dataStore = useDataStore.getState();
    const uiStore = useUIStore.getState();

    return {
      id: projectId,
      name: projectName,
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      components: componentStore.components,
      canvas: {
        showGrid: canvasStore.showGrid,
        snapToGrid: canvasStore.snapToGrid,
        viewportWidth: canvasStore.viewportWidth,
        activeDevice: canvasStore.activeDevice,
      },
      theme: themeStore.theme,
      dataSources: dataStore.dataSources,
      settings: {
        activeTab: uiStore.activeTab,
        sidebarCollapsed: uiStore.sidebarCollapsed,
        rightPanelCollapsed: uiStore.rightPanelCollapsed,
        leftPanelCollapsed: uiStore.leftPanelCollapsed,
      },
    };
  }

  /**
   * 保存项目到本地存储
   */
  static saveProject(projectData: ProjectData): void {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex((p) => p.id === projectData.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = {
          ...projectData,
          updatedAt: new Date().toISOString(),
        };
      } else {
        projects.push(projectData);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("保存项目失败:", error);
      throw new Error("保存项目失败");
    }
  }

  /**
   * 加载项目
   */
  static loadProject(projectId: string): ProjectData | null {
    try {
      const projects = this.getAllProjects();
      const project = projects.find((p) => p.id === projectId);
      return project || null;
    } catch (error) {
      console.error("加载项目失败:", error);
      return null;
    }
  }

  /**
   * 导入项目数据到stores
   */
  static importProjectData(projectData: ProjectData): void {
    try {
      // 导入组件数据
      useComponentStore.getState().updateComponents(projectData.components);

      // 导入画布设置
      const canvasStore = useCanvasStore.getState();
      if (projectData.canvas.showGrid !== undefined) {
        canvasStore.showGrid = projectData.canvas.showGrid;
      }
      if (projectData.canvas.snapToGrid !== undefined) {
        canvasStore.snapToGrid = projectData.canvas.snapToGrid;
      }
      if (projectData.canvas.viewportWidth !== undefined) {
        canvasStore.viewportWidth = projectData.canvas.viewportWidth;
      }
      if (projectData.canvas.activeDevice !== undefined) {
        canvasStore.activeDevice = projectData.canvas.activeDevice;
      }

      // 导入主题
      useThemeStore.getState().setTheme(projectData.theme);

      // 导入数据源
      const dataStore = useDataStore.getState();
      projectData.dataSources.forEach((ds) => {
        dataStore.addDataSource(ds);
      });

      // 导入UI设置
      const uiStore = useUIStore.getState();
      if (projectData.settings.activeTab) {
        uiStore.setActiveTab(projectData.settings.activeTab);
      }
      if (projectData.settings.sidebarCollapsed !== undefined) {
        uiStore.sidebarCollapsed = projectData.settings.sidebarCollapsed;
      }
      if (projectData.settings.rightPanelCollapsed !== undefined) {
        uiStore.rightPanelCollapsed = projectData.settings.rightPanelCollapsed;
      }
      if (projectData.settings.leftPanelCollapsed !== undefined) {
        uiStore.leftPanelCollapsed = projectData.settings.leftPanelCollapsed;
      }
    } catch (error) {
      console.error("导入项目数据失败:", error);
      throw new Error("导入项目数据失败");
    }
  }

  /**
   * 获取所有项目
   */
  static getAllProjects(): ProjectData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("获取项目列表失败:", error);
      return [];
    }
  }

  /**
   * 删除项目
   */
  static deleteProject(projectId: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter((p) => p.id !== projectId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));

      // 如果删除的是当前项目，清除当前项目ID
      if (this.getCurrentProjectId() === projectId) {
        this.clearCurrentProjectId();
      }

      return true;
    } catch (error) {
      console.error("删除项目失败:", error);
      return false;
    }
  }

  /**
   * 设置当前项目ID
   */
  static setCurrentProjectId(projectId: string): void {
    localStorage.setItem(this.CURRENT_PROJECT_KEY, projectId);
  }

  /**
   * 获取当前项目ID
   */
  static getCurrentProjectId(): string | null {
    return localStorage.getItem(this.CURRENT_PROJECT_KEY);
  }

  /**
   * 清除当前项目ID
   */
  static clearCurrentProjectId(): void {
    localStorage.removeItem(this.CURRENT_PROJECT_KEY);
  }

  /**
   * 导出项目为JSON文件
   */
  static exportToFile(projectData: ProjectData, filename?: string): void {
    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = filename || `${projectData.name}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("导出文件失败:", error);
      throw new Error("导出文件失败");
    }
  }

  /**
   * 从文件导入项目
   */
  static async importFromFile(file: File): Promise<ProjectData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target?.result as string);

          // 验证项目数据格式
          if (!this.validateProjectData(projectData)) {
            throw new Error("无效的项目文件格式");
          }

          resolve(projectData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("读取文件失败"));
      };

      reader.readAsText(file);
    });
  }

  /**
   * 验证项目数据格式
   */
  private static validateProjectData(data: any): data is ProjectData {
    return (
      data &&
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      Array.isArray(data.components) &&
      data.canvas &&
      data.theme &&
      Array.isArray(data.dataSources)
    );
  }

  /**
   * 自动保存当前项目（定时器）
   */
  static startAutoSave(intervalMs: number = 30000): () => void {
    const interval = setInterval(() => {
      const currentProjectId = this.getCurrentProjectId();
      if (currentProjectId) {
        const projectName = useUIStore.getState().projectName;
        this.saveCurrentProject(currentProjectId, projectName);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

export { PersistenceManager };
