/**
 * 图标配置
 * 用于表示组件分类的图标，不依赖React框架
 */
export interface IconConfig {
  type: "svg" | "image" | "emoji" | "text" | "icon";
  value: string;
}

/**
 * 组件分类实体
 * 表示组件库中的分类，包含该分类下的所有组件
 */
export interface ComponentCategory {
  id: string;
  name: string;
  icon: IconConfig | string; // 支持字符串（图标标识符）或IconConfig对象
  components: {
    id: string;
    name: string;
    type: string;
    isContainer?: boolean;
  }[];
}

