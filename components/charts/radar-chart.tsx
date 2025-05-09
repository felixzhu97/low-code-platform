"use client"

import { useMemo } from "react"
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface RadarChartProps {
  data: any[]
  nameField: string
  dataFields: string[]
  title?: string
  height?: number
  width?: number
  colors?: string[]
  showLegend?: boolean
}

export function RadarChart({
  data,
  nameField,
  dataFields,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  showLegend = true,
}: RadarChartProps) {
  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || !dataFields || dataFields.length === 0) {
      return []
    }

    return data
  }, [data, dataFields])

  // 生成雷达图的数据系列
  const renderRadars = useMemo(() => {
    return dataFields.map((field, index) => (
      <Radar
        key={field}
        name={field}
        dataKey={field}
        stroke={colors[index % colors.length]}
        fill={colors[index % colors.length]}
        fillOpacity={0.6}
      />
    ))
  }, [dataFields, colors])

  if (!data || data.length === 0 || !dataFields || dataFields.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed p-4 text-center text-muted-foreground"
        style={{ width: width || "100%", height: height || 300 }}
      >
        暂无数据
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && <h3 className="mb-2 text-lg font-medium">{title}</h3>}
      <div style={{ width: width || "100%", height: height || 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey={nameField} />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
            {renderRadars}
            {showLegend && <Legend />}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
