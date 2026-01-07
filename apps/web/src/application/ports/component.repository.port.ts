import type { IComponentRepository } from "@/domain/component";

/**
 * 组件仓储端口
 * 应用层对组件仓储的抽象接口
 */
export interface IComponentRepositoryPort extends IComponentRepository {
  // 可以在这里添加应用层特定的方法
}

