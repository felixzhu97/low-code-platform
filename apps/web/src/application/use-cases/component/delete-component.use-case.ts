import type {
  IComponentRepositoryPort,
  IStateManagementPort,
} from "@/application/ports";
import { ComponentManagementService } from "@/application/services/component-management.service";

/**
 * 删除组件用例
 */
export class DeleteComponentUseCase {
  constructor(
    private readonly componentRepository: IComponentRepositoryPort,
    private readonly stateManagement: IStateManagementPort
  ) {}

  /**
   * 执行删除组件用例（包括子组件）
   */
  async execute(id: string, includeChildren: boolean = true): Promise<void> {
    // 获取所有组件
    const allComponents = await this.componentRepository.findAll();

    if (includeChildren) {
      // 找出所有需要删除的组件ID（包括子组件）
      const idsToDelete = this.getAllChildIds(id, allComponents);
      idsToDelete.push(id);

      // 批量删除
      await this.componentRepository.deleteAll(idsToDelete);

      // 更新状态管理
      idsToDelete.forEach((componentId) => {
        this.stateManagement.deleteComponent(componentId);
      });
    } else {
      // 只删除当前组件
      await this.componentRepository.delete(id);
      this.stateManagement.deleteComponent(id);
    }
  }

  /**
   * 递归获取所有子组件ID
   */
  private getAllChildIds(parentId: string, components: any[]): string[] {
    const childIds: string[] = [];
    const children = components.filter((comp) => comp.parentId === parentId);

    for (const child of children) {
      childIds.push(child.id);
      childIds.push(...this.getAllChildIds(child.id, components));
    }

    return childIds;
  }
}
