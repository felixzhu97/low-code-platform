import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import {
  CreateComponentUseCase,
  UpdateComponentUseCase,
  DeleteComponentUseCase,
  GetComponentsUseCase,
  UpdateComponentPositionUseCase,
} from "@/application/use-cases";
import type {
  IComponentRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";

/**
 * 组件适配器
 * 表现层与应用层用例之间的适配器
 */
export class ComponentAdapter {
  private createComponentUseCase: CreateComponentUseCase;
  private updateComponentUseCase: UpdateComponentUseCase;
  private deleteComponentUseCase: DeleteComponentUseCase;
  private getComponentsUseCase: GetComponentsUseCase;
  private updateComponentPositionUseCase: UpdateComponentPositionUseCase;

  constructor(
    componentRepository: IComponentRepositoryPort,
    stateManagement: IStateManagementPort
  ) {
    this.createComponentUseCase = new CreateComponentUseCase(
      componentRepository,
      stateManagement
    );
    this.updateComponentUseCase = new UpdateComponentUseCase(
      componentRepository,
      stateManagement
    );
    this.deleteComponentUseCase = new DeleteComponentUseCase(
      componentRepository,
      stateManagement
    );
    this.getComponentsUseCase = new GetComponentsUseCase(componentRepository);
    this.updateComponentPositionUseCase = new UpdateComponentPositionUseCase(
      componentRepository,
      stateManagement
    );
  }

  /**
   * 创建组件
   */
  async createComponent(
    type: string,
    position: { x: number; y: number },
    parentId?: string | null,
    theme?: ThemeConfig
  ): Promise<Component> {
    return await this.createComponentUseCase.execute(
      type,
      position,
      parentId,
      theme
    );
  }

  /**
   * 更新组件
   */
  async updateComponent(
    id: string,
    updates: Partial<Component>
  ): Promise<Component> {
    return await this.updateComponentUseCase.execute(id, updates);
  }

  /**
   * 删除组件
   */
  async deleteComponent(
    id: string,
    includeChildren: boolean = true
  ): Promise<void> {
    return await this.deleteComponentUseCase.execute(id, includeChildren);
  }

  /**
   * 获取所有组件
   */
  async getComponents(): Promise<Component[]> {
    return await this.getComponentsUseCase.execute();
  }

  /**
   * 根据ID获取组件
   */
  async getComponentById(id: string): Promise<Component | null> {
    return await this.getComponentsUseCase.executeById(id);
  }

  /**
   * 获取根级组件
   */
  async getRootComponents(): Promise<Component[]> {
    return await this.getComponentsUseCase.executeRootComponents();
  }

  /**
   * 根据父组件ID获取子组件
   */
  async getComponentsByParentId(parentId: string): Promise<Component[]> {
    return await this.getComponentsUseCase.executeByParentId(parentId);
  }

  /**
   * 更新组件位置
   */
  async updateComponentPosition(
    id: string,
    position: { x: number; y: number },
    snapToGrid: boolean = false,
    gridSize: number = 20
  ): Promise<void> {
    return await this.updateComponentPositionUseCase.execute(
      id,
      position,
      snapToGrid,
      gridSize
    );
  }
}
