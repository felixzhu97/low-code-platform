import { store } from "../store";
import * as componentActions from "../store/slices/component.slice";
import * as canvasActions from "../store/slices/canvas.slice";
import * as themeActions from "../store/slices/theme.slice";
import * as dataActions from "../store/slices/data.slice";
import * as uiActions from "../store/slices/ui.slice";
import type { Component } from "@/domain/component/entities/component.entity";
import {
  PageSchema,
  validateSchema,
  validateSchemaAsync,
  migrateSchema,
  migrateSchemaAsync,
  schemaToProjectData,
  schemaJsonToProjectData,
} from "@/domain/entities/schema.types";

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
    activeTab?: string;
    sidebarCollapsed?: boolean;
    rightPanelCollapsed?: boolean;
    leftPanelCollapsed?: boolean;
  };
}

class PersistenceManager {
  private static readonly STORAGE_KEY = "lowcode-projects";
  private static readonly CURRENT_PROJECT_KEY = "lowcode-current-project";

  private static getState() {
    return store.getState();
  }

  static saveCurrentProject(projectId: string, projectName: string): void {
    const projectData = this.exportProjectData(projectId, projectName);
    this.saveProject(projectData);
    this.setCurrentProjectId(projectId);
  }

  static exportProjectData(
    projectId: string,
    projectName: string
  ): ProjectData {
    const state = this.getState();

    return {
      id: projectId,
      name: projectName,
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      components: state.component.components,
      canvas: {
        showGrid: state.canvas.showGrid,
        snapToGrid: state.canvas.snapToGrid,
        viewportWidth: state.canvas.viewportWidth,
        activeDevice: state.canvas.activeDevice,
      },
      theme: state.theme.theme,
      dataSources: state.data.dataSources,
      settings: {
        activeTab: state.ui.activeTab,
        sidebarCollapsed: state.ui.sidebarCollapsed,
        rightPanelCollapsed: state.ui.rightPanelCollapsed,
        leftPanelCollapsed: state.ui.leftPanelCollapsed,
      },
    };
  }

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

  static importProjectData(projectData: ProjectData | PageSchema): void {
    try {
      let data: ProjectData;
      if (this.isSchemaFormat(projectData)) {
        const migratedSchema = migrateSchema(projectData);
        data = schemaToProjectData(migratedSchema);
      } else {
        data = projectData as ProjectData;
      }

      if (data.components && Array.isArray(data.components)) {
        store.dispatch(componentActions.updateComponents(data.components));
      } else {
        store.dispatch(componentActions.updateComponents([]));
      }

      if (data.canvas) {
        if (data.canvas.showGrid !== undefined) {
          store.dispatch(canvasActions.toggleGrid());
        }
        if (data.canvas.snapToGrid !== undefined) {
          store.dispatch(canvasActions.toggleSnapToGrid());
        }
        if (data.canvas.viewportWidth !== undefined) {
          store.dispatch(canvasActions.setViewportWidth(data.canvas.viewportWidth));
        }
        if (data.canvas.activeDevice !== undefined) {
          store.dispatch(canvasActions.setActiveDevice(data.canvas.activeDevice));
        }
      }

      if (data.theme) {
        store.dispatch(themeActions.setTheme(data.theme));
      }

      if (data.dataSources && Array.isArray(data.dataSources)) {
        data.dataSources.forEach((ds) => {
          store.dispatch(dataActions.addDataSource(ds));
        });
      }

      if (data.settings?.activeTab) {
        store.dispatch(uiActions.setActiveTab(data.settings.activeTab));
      }
      if (data.settings?.sidebarCollapsed !== undefined) {
        const current = this.getState().ui.sidebarCollapsed;
        if (current !== data.settings.sidebarCollapsed) {
          store.dispatch(uiActions.toggleSidebar());
        }
      }
      if (data.settings?.rightPanelCollapsed !== undefined) {
        const current = this.getState().ui.rightPanelCollapsed;
        if (current !== data.settings.rightPanelCollapsed) {
          store.dispatch(uiActions.toggleRightPanel());
        }
      }
      if (data.settings?.leftPanelCollapsed !== undefined) {
        const current = this.getState().ui.leftPanelCollapsed;
        if (current !== data.settings.leftPanelCollapsed) {
          store.dispatch(uiActions.toggleLeftPanel());
        }
      }

      if (data.name) {
        store.dispatch(uiActions.setProjectName(data.name));
      }
    } catch (error) {
      console.error("导入项目数据失败:", error);
      throw new Error("导入项目数据失败");
    }
  }

  static getAllProjects(): ProjectData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("获取项目列表失败:", error);
      return [];
    }
  }

  static deleteProject(projectId: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter((p) => p.id !== projectId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));

      if (this.getCurrentProjectId() === projectId) {
        this.clearCurrentProjectId();
      }

      return true;
    } catch (error) {
      console.error("删除项目失败:", error);
      return false;
    }
  }

  static setCurrentProjectId(projectId: string): void {
    localStorage.setItem(this.CURRENT_PROJECT_KEY, projectId);
  }

  static getCurrentProjectId(): string | null {
    return localStorage.getItem(this.CURRENT_PROJECT_KEY);
  }

  static clearCurrentProjectId(): void {
    localStorage.removeItem(this.CURRENT_PROJECT_KEY);
  }

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

  static async importFromFile(file: File): Promise<ProjectData> {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonText = e.target?.result as string;
          const data = JSON.parse(jsonText);

          if (this.isSchemaFormat(data)) {
            try {
              const validation = await validateSchemaAsync(jsonText);
              if (!validation.valid) {
                throw new Error(
                  `Schema 验证失败: ${validation.errors.join(", ")}`
                );
              }

              const schemaVersion = data.version || "1.0.0";
              const migratedJson = await migrateSchemaAsync(
                jsonText,
                schemaVersion,
                "1.0.0"
              );

              const projectData = await schemaJsonToProjectData(migratedJson);
              resolve(projectData);
            } catch (error) {
              console.warn(
                "WASM schema processing failed, using fallback:",
                error
              );
              const migratedSchema = migrateSchema(data);
              if (!validateSchema(migratedSchema)) {
                throw new Error("无效的 Schema 格式");
              }
              const projectData = schemaToProjectData(migratedSchema);
              resolve(projectData);
            }
          } else {
            if (!this.validateProjectData(data)) {
              throw new Error("无效的项目文件格式");
            }
            resolve(data);
          }
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

  private static isSchemaFormat(data: any): boolean {
    return (
      data &&
      typeof data === "object" &&
      typeof data.version === "string" &&
      data.metadata &&
      typeof data.metadata === "object"
    );
  }

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

  static startAutoSave(intervalMs: number = 30000): () => void {
    const interval = setInterval(() => {
      const currentProjectId = this.getCurrentProjectId();
      if (currentProjectId) {
        const projectName = this.getState().ui.projectName;
        this.saveCurrentProject(currentProjectId, projectName);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

export { PersistenceManager };
