import type { Component, ThemeConfig } from "@/domain/entities/types";
import type { IComponentRepositoryPort, IStateManagementPort } from "@/application/ports";
import { ComponentFactoryService } from "@/domain/services/component-factory.service";

/**
 * 创建组件用例
 */
export class CreateComponentUseCase {
  constructor(
    private readonly componentRepository: IComponentRepositoryPort,
    private readonly stateManagement: IStateManagementPort
  ) {}

  /**
   * 执行创建组件用例
   */
  async execute(
    type: string,
    position: { x: number; y: number },
    parentId?: string | null,
    theme?: ThemeConfig
  ): Promise<Component> {
    // 使用领域服务创建组件
    const component = ComponentFactoryService.createComponent(
      type,
      position,
      parentId,
      theme
    );

    // 保存到仓储
    const savedComponent = await this.componentRepository.save(component);

    // 更新状态管理
    this.stateManagement.addComponent(savedComponent);

    return savedComponent;
  }
}

