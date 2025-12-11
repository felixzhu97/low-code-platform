import { ComponentAdapter } from "./component.adapter";
import { CanvasAdapter } from "./canvas.adapter";
import { TemplateAdapter } from "./template.adapter";
import type {
  IComponentRepositoryPort,
  ITemplateRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";
import {
  ComponentRepositoryImpl,
  TemplateRepositoryImpl,
  DataSourceRepositoryImpl,
} from "@/infrastructure/persistence/repositories";
import { ZustandStateAdapter } from "@/infrastructure/state-management/adapters";

/**
 * 适配器工厂
 * 创建并配置所有适配器实例
 */
export class AdapterFactory {
  private static componentRepository: IComponentRepositoryPort | null = null;
  private static templateRepository: ITemplateRepositoryPort | null = null;
  private static stateManagement: IStateManagementPort | null = null;

  /**
   * 初始化适配器工厂
   */
  static initialize() {
    // 创建仓储实例
    this.componentRepository = new ComponentRepositoryImpl();
    this.templateRepository = new TemplateRepositoryImpl();

    // 创建状态管理适配器
    this.stateManagement = new ZustandStateAdapter();
  }

  /**
   * 获取组件适配器
   */
  static getComponentAdapter(): ComponentAdapter {
    if (!this.componentRepository || !this.stateManagement) {
      this.initialize();
    }
    return new ComponentAdapter(
      this.componentRepository!,
      this.stateManagement!
    );
  }

  /**
   * 获取画布适配器
   */
  static getCanvasAdapter(): CanvasAdapter {
    if (!this.stateManagement) {
      this.initialize();
    }
    return new CanvasAdapter(this.stateManagement!);
  }

  /**
   * 获取模板适配器
   */
  static getTemplateAdapter(): TemplateAdapter {
    if (!this.templateRepository || !this.stateManagement) {
      this.initialize();
    }
    return new TemplateAdapter(this.templateRepository!, this.stateManagement!);
  }

  /**
   * 获取状态管理实例
   */
  static getStateManagement(): IStateManagementPort {
    if (!this.stateManagement) {
      this.initialize();
    }
    return this.stateManagement!;
  }
}

