export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter" | "radar" | "donut";
  xField: string;
  yField: string;
  seriesField?: string;
  colorField?: string;
  annotations?: any[];
}
