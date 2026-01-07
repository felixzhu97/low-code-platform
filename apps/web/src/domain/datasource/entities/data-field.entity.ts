/**
 * 数据字段实体
 * 表示数据源中的字段定义
 */
export interface DataField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  path: string;
}

