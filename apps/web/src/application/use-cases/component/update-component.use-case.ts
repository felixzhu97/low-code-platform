import type { Component } from "@/domain/component";
import type { IComponentRepositoryPort, IStateManagementPort } from "@/application/ports";

/**
 * 更新组件用例
 */
export class UpdateComponentUseCase {
  constructor(
    private readonly componentRepository: IComponentRepositoryPort,
    private readonly stateManagement: IStateManagementPort
  ) {}

  /**
   * 执行更新组件用例
   */
  async execute(id: string, updates: Partial<Component>): Promise<Component> {
    // 查找现有组件
    const existingComponent = await this.componentRepository.findById(id);
    if (!existingComponent) {
      throw new Error(`Component with id ${id} not found`);
    }

    // 合并更新
    const updatedComponent: Component = {
      ...existingComponent,
      ...updates,
      id, // 确保ID不被覆盖
    };

    // 保存到仓储
    const savedComponent = await this.componentRepository.save(updatedComponent);

    // 更新状态管理
    this.stateManagement.updateComponent(id, updates);

    return savedComponent;
  }
}

