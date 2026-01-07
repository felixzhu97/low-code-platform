/**
 * 样式值对象
 * 表示组件的样式配置
 */
export interface StyleProperties {
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
  backgroundColor?: string;
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  borderRadius?: string | number;
  border?: string;
  boxShadow?: string;
  opacity?: number;
  zIndex?: number;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string | number;
}

/**
 * 样式值对象
 */
export class Style {
  constructor(private readonly properties: StyleProperties) {}

  /**
   * 创建样式对象
   */
  static create(properties: StyleProperties): Style {
    return new Style(properties);
  }

  /**
   * 从对象创建样式
   */
  static fromObject(obj: StyleProperties): Style {
    return new Style(obj);
  }

  /**
   * 获取样式属性
   */
  getProperties(): Readonly<StyleProperties> {
    return { ...this.properties };
  }

  /**
   * 获取特定属性
   */
  getProperty<K extends keyof StyleProperties>(
    key: K
  ): StyleProperties[K] | undefined {
    return this.properties[key];
  }

  /**
   * 合并样式
   */
  merge(other: StyleProperties): Style {
    return new Style({ ...this.properties, ...other });
  }

  /**
   * 转换为CSS对象
   */
  toCSS(): Record<string, string | number> {
    const css: Record<string, string | number> = {};

    if (this.properties.width !== undefined) {
      css.width =
        typeof this.properties.width === "number"
          ? `${this.properties.width}px`
          : this.properties.width;
    }
    if (this.properties.height !== undefined) {
      css.height =
        typeof this.properties.height === "number"
          ? `${this.properties.height}px`
          : this.properties.height;
    }
    if (this.properties.padding !== undefined) {
      css.padding =
        typeof this.properties.padding === "number"
          ? `${this.properties.padding}px`
          : this.properties.padding;
    }
    if (this.properties.margin !== undefined) {
      css.margin =
        typeof this.properties.margin === "number"
          ? `${this.properties.margin}px`
          : this.properties.margin;
    }
    if (this.properties.backgroundColor) {
      css.backgroundColor = this.properties.backgroundColor;
    }
    if (this.properties.color) {
      css.color = this.properties.color;
    }
    if (this.properties.fontSize !== undefined) {
      css.fontSize =
        typeof this.properties.fontSize === "number"
          ? `${this.properties.fontSize}px`
          : this.properties.fontSize;
    }
    if (this.properties.fontWeight !== undefined) {
      css.fontWeight = this.properties.fontWeight;
    }
    if (this.properties.fontFamily) {
      css.fontFamily = this.properties.fontFamily;
    }
    if (this.properties.borderRadius !== undefined) {
      css.borderRadius =
        typeof this.properties.borderRadius === "number"
          ? `${this.properties.borderRadius}px`
          : this.properties.borderRadius;
    }
    if (this.properties.border) {
      css.border = this.properties.border;
    }
    if (this.properties.boxShadow) {
      css.boxShadow = this.properties.boxShadow;
    }
    if (this.properties.opacity !== undefined) {
      css.opacity = this.properties.opacity;
    }
    if (this.properties.zIndex !== undefined) {
      css.zIndex = this.properties.zIndex;
    }
    if (this.properties.display) {
      css.display = this.properties.display;
    }
    if (this.properties.flexDirection) {
      css.flexDirection = this.properties.flexDirection;
    }
    if (this.properties.justifyContent) {
      css.justifyContent = this.properties.justifyContent;
    }
    if (this.properties.alignItems) {
      css.alignItems = this.properties.alignItems;
    }
    if (this.properties.gap !== undefined) {
      css.gap =
        typeof this.properties.gap === "number"
          ? `${this.properties.gap}px`
          : this.properties.gap;
    }

    return css;
  }

  /**
   * 判断是否相等
   */
  equals(other: Style): boolean {
    return JSON.stringify(this.properties) === JSON.stringify(other.properties);
  }
}

