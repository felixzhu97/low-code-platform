/**
 * 数据映射实体
 * 定义数据源字段到组件属性的映射关系
 */
export interface DataMapping {
  field: string;
  sourcePath: string;
  targetPath: string;
  transform?: "string" | "number" | "boolean" | "date" | "json";
  defaultValue?: any;
}

