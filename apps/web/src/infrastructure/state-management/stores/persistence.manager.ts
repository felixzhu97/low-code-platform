import { useComponentStore } from "./component.store";
import { useCanvasStore } from "./canvas.store";
import { useThemeStore } from "./theme.store";
import { useDataStore } from "./data.store";
import { useUIStore } from "./ui.store";
import type { Component } from "@/domain/component";
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
   * 支持 ProjectData 和 PageSchema 两种格式
   */
  static importProjectData(projectData: ProjectData | PageSchema): void {
    try {
      // 如果是 Schema 格式，转换为 ProjectData
      let data: ProjectData;
      if (this.isSchemaFormat(projectData)) {
        const migratedSchema = migrateSchema(projectData);
        data = schemaToProjectData(migratedSchema);
      } else {
        data = projectData as ProjectData;
      }

      // 导入组件数据
      if (data.components && Array.isArray(data.components)) {
        useComponentStore.getState().updateComponents(data.components);
      } else {
        useComponentStore.getState().updateComponents([]);
      }

      // 导入画布设置
      const canvasStore = useCanvasStore.getState();
      if (data.canvas) {
        if (data.canvas.showGrid !== undefined) {
          canvasStore.showGrid = data.canvas.showGrid;
        }
        if (data.canvas.snapToGrid !== undefined) {
          canvasStore.snapToGrid = data.canvas.snapToGrid;
        }
        if (data.canvas.viewportWidth !== undefined) {
          canvasStore.viewportWidth = data.canvas.viewportWidth;
        }
        if (data.canvas.activeDevice !== undefined) {
          canvasStore.activeDevice = data.canvas.activeDevice;
        }
      } else {
        // 如果没有 canvas 数据，使用默认值
        console.warn(
          "[PersistenceManager] Canvas data is missing, using defaults"
        );
        canvasStore.showGrid = false;
        canvasStore.snapToGrid = false;
        canvasStore.viewportWidth = 1920;
        canvasStore.activeDevice = "desktop";
      }

      // 导入主题
      if (data.theme) {
        useThemeStore.getState().setTheme(data.theme);
      }

      // 导入数据源
      const dataStore = useDataStore.getState();
      // 先删除所有现有数据源
      const existingDataSourceIds = [
        ...dataStore.dataSources.map((ds) => ds.id),
      ];
      existingDataSourceIds.forEach((id) => {
        dataStore.deleteDataSource(id);
      });
      // 然后添加新的数据源
      if (data.dataSources && Array.isArray(data.dataSources)) {
        data.dataSources.forEach((ds) => {
          dataStore.addDataSource(ds);
        });
      }

      // 导入UI设置
      const uiStore = useUIStore.getState();
      if (data.settings?.activeTab) {
        uiStore.setActiveTab(data.settings.activeTab);
      }
      if (data.settings?.sidebarCollapsed !== undefined) {
        uiStore.sidebarCollapsed = data.settings.sidebarCollapsed;
      }
      if (data.settings?.rightPanelCollapsed !== undefined) {
        uiStore.rightPanelCollapsed = data.settings.rightPanelCollapsed;
      }
      if (data.settings?.leftPanelCollapsed !== undefined) {
        uiStore.leftPanelCollapsed = data.settings.leftPanelCollapsed;
      }

      // 更新项目名称
      if (data.name) {
        uiStore.setProjectName(data.name);
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
   * 支持 ProjectData 和 PageSchema 两种格式
   */
  static async importFromFile(file: File): Promise<ProjectData> {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonText = e.target?.result as string;
          const data = JSON.parse(jsonText);

          // 检查是否是 Schema 格式
          if (this.isSchemaFormat(data)) {
            // 使用 WASM 异步版本验证和迁移 Schema
            try {
              // 先验证 Schema
              const validation = await validateSchemaAsync(jsonText);
              if (!validation.valid) {
                throw new Error(
                  `Schema 验证失败: ${validation.errors.join(", ")}`
                );
              }

              // 迁移 Schema（如果需要）
              const schemaVersion = data.version || "1.0.0";
              const migratedJson = await migrateSchemaAsync(
                jsonText,
                schemaVersion,
                "1.0.0"
              );

              // 使用 WASM 反序列化
              const projectData = await schemaJsonToProjectData(migratedJson);
              resolve(projectData);
            } catch (error) {
              console.warn(
                "WASM schema processing failed, using fallback:",
                error
              );
              // 降级到同步版本
              const migratedSchema = migrateSchema(data);
              if (!validateSchema(migratedSchema)) {
                throw new Error("无效的 Schema 格式");
              }
              const projectData = schemaToProjectData(migratedSchema);
              resolve(projectData);
            }
          } else {
            // 验证项目数据格式
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

  /**
   * 检查数据是否是 Schema 格式
   */
  private static isSchemaFormat(data: any): boolean {
    return (
      data &&
      typeof data === "object" &&
      typeof data.version === "string" &&
      data.metadata &&
      typeof data.metadata === "object"
    );
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
