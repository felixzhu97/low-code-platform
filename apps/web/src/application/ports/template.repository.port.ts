import type { ITemplateRepository } from "@/domain/repositories";

/**
 * 模板仓储端口
 * 应用层对模板仓储的抽象接口
 */
export interface ITemplateRepositoryPort extends ITemplateRepository {
  // 可以在这里添加应用层特定的方法
}

