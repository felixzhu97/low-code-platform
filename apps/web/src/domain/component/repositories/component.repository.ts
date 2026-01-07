import type { Component } from "../entities/component.entity";

/**
 * 组件仓储接口
 * 定义组件数据的持久化操作
 */
export interface IComponentRepository {
  /**
   * 根据ID查找组件
   */
  findById(id: string): Promise<Component | null>;

  /**
   * 查找所有组件
   */
  findAll(): Promise<Component[]>;

  /**
   * 保存组件（新增或更新）
   */
  save(component: Component): Promise<Component>;

  /**
   * 批量保存组件
   */
  saveAll(components: Component[]): Promise<Component[]>;

  /**
   * 删除组件
   */
  delete(id: string): Promise<void>;

  /**
   * 批量删除组件
   */
  deleteAll(ids: string[]): Promise<void>;

  /**
   * 清空所有组件
   */
  clear(): Promise<void>;

  /**
   * 根据父组件ID查找子组件
   */
  findByParentId(parentId: string): Promise<Component[]>;

  /**
   * 查找根级组件（没有父组件的组件）
   */
  findRootComponents(): Promise<Component[]>;
}

