import type { DataSource } from "../entities/types";

/**
 * 数据源仓储接口
 * 定义数据源数据的持久化操作
 */
export interface IDataSourceRepository {
  /**
   * 根据ID查找数据源
   */
  findById(id: string): Promise<DataSource | null>;

  /**
   * 查找所有数据源
   */
  findAll(): Promise<DataSource[]>;

  /**
   * 根据类型查找数据源
   */
  findByType(type: DataSource["type"]): Promise<DataSource[]>;

  /**
   * 保存数据源（新增或更新）
   */
  save(dataSource: DataSource): Promise<DataSource>;

  /**
   * 批量保存数据源
   */
  saveAll(dataSources: DataSource[]): Promise<DataSource[]>;

  /**
   * 删除数据源
   */
  delete(id: string): Promise<void>;

  /**
   * 批量删除数据源
   */
  deleteAll(ids: string[]): Promise<void>;

  /**
   * 清空所有数据源
   */
  clear(): Promise<void>;
}

