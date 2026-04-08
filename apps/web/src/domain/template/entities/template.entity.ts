import type { Component } from "../../component/entities/component.entity";

/**
 * 模板实体
 * 表示低代码平台中的页面模板
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  components: Component[];
  createdAt?: string;
  updatedAt?: string;
}

