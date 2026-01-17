/**
 * 组件相关类型定义
 */

/**
 * 组件基础接口
 */
export interface Component {
  id: string;
  type: string;
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties?: Record<string, unknown>;
  children?: (Component | string)[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: Array<{
    source: string;
    target: string;
    transform?: string;
    defaultValue?: unknown;
  }>;
}

/**
 * 带子组件的组件接口
 */
export interface ComponentWithChildren extends Component {
  children?: ComponentWithChildren[];
}
