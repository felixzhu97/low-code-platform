import type { DataMapping } from "../../datasource/entities/data-mapping.entity";

/**
 * 组件实体
 * 表示低代码平台中的可拖拽组件
 */
export interface Component {
  id: string;
  type: string;
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties?: Record<string, any>;
  children?: (Component | string)[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: DataMapping[];
}

