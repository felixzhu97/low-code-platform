import type { Component } from "../entities/types";

/**
 * 模板接口
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  components: Component[];
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 模板仓储接口
 * 定义模板数据的持久化操作
 */
export interface ITemplateRepository {
  /**
   * 根据ID查找模板
   */
  findById(id: string): Promise<Template | null>;

  /**
   * 查找所有模板
   */
  findAll(): Promise<Template[]>;

  /**
   * 根据分类查找模板
   */
  findByCategory(category: string): Promise<Template[]>;

  /**
   * 根据标签查找模板
   */
  findByTags(tags: string[]): Promise<Template[]>;

  /**
   * 搜索模板
   */
  search(query: string): Promise<Template[]>;

  /**
   * 保存模板（新增或更新）
   */
  save(template: Template): Promise<Template>;

  /**
   * 删除模板
   */
  delete(id: string): Promise<void>;

  /**
   * 清空所有模板
   */
  clear(): Promise<void>;
}

