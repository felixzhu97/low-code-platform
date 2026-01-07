import type { IDataSourceRepository } from "@/domain/datasource";

/**
 * 数据源仓储端口
 * 应用层对数据源仓储的抽象接口
 */
export interface IDataSourceRepositoryPort extends IDataSourceRepository {
  // 可以在这里添加应用层特定的方法
}

