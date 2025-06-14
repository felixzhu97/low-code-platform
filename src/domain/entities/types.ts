import { Component } from "@/lib/component";

export interface DataSource {
  id: string;
  name: string;
  type: "static" | "api" | "database";
  data: any;
}

export interface CanvasState {
  components: Component[];
  selectedId: string | null;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export interface DataField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  path: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter" | "radar" | "donut";
  xField: string;
  yField: string;
  seriesField?: string;
  colorField?: string;
  annotations?: any[];
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: string;
}
