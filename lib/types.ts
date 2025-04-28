import type React from "react"

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

export interface DataSource {
  id: string
  name: string
  type: "static" | "api" | "database"
  data: any
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
