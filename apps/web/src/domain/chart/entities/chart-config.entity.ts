/**
 * 图表配置实体
 * 表示图表组件的配置信息
 */
export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter" | "radar" | "donut";
  xField: string;
  yField: string;
  seriesField?: string;
  colorField?: string;
  annotations?: any[];
}

