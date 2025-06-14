import type React from "react";

export interface DataSource {
  id: string
  name: string
  type: "static" | "api" | "database"
  data: any
}

export interface Component {
  id: string
  type: string
  name: string
  position?: {
    x: number
    y: number
  }
  properties?: Record<string, any>
  children?: Component[]
  parentId?: string | null
  dataSource?: string | null
  dataMapping?: Record<string, string>
}

export interface ComponentCategory {
  id: string
  name: string
  icon: React.ReactNode
  components: {
    id: string
    name: string
    type: string
    isContainer?: boolean
  }[]
}

export interface CanvasState {
  components: Component[]
  selectedId: string | null
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  borderRadius: string
  spacing: string
}

export interface DataField {
  name: string
  type: "string" | "number" | "boolean" | "date" | "object" | "array"
  path: string
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter" | "radar" | "donut"
  xField: string
  yField: string
  seriesField?: string
  colorField?: string
  annotations?: any[]
}

export interface TableColumn {
  title: string
  dataIndex: string
  key: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  render?: string
}
