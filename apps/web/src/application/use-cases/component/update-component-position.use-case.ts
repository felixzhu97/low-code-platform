import type { IComponentRepositoryPort, IStateManagementPort } from "@/application/ports";
import { ComponentManagementService } from "@/application/services/component-management.service";

/**
 * 更新组件位置用例
 */
export class UpdateComponentPositionUseCase {
  constructor(
    private readonly componentRepository: IComponentRepositoryPort,
    private readonly stateManagement: IStateManagementPort
  ) {}

  /**
   * 执行更新组件位置用例
   */
  async execute(
    id: string,
    position: { x: number; y: number },
    snapToGrid: boolean = false,
    gridSize: number = 20
  ): Promise<void> {
    // 获取所有组件
    const allComponents = await this.componentRepository.findAll();

    // 应用网格对齐（如果需要）
    const finalPosition = snapToGrid
      ? ComponentManagementService.snapToGrid(position, gridSize)
      : position;

    // 更新组件位置
    await this.updateComponent(id, finalPosition, allComponents);
  }

  /**
   * 更新组件位置
   */
  private async updateComponent(
    id: string,
    position: { x: number; y: number },
    allComponents: any[]
  ): Promise<void> {
    const updatedComponents = ComponentManagementService.updateComponentPosition(
      id,
      position,
      allComponents
    );

    // 批量保存
    await this.componentRepository.saveAll(updatedComponents);

    // 更新状态管理
    this.stateManagement.setComponents(updatedComponents);
  }
}

