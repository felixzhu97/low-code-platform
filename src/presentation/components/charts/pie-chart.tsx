"use client"

import { useMemo } from "react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PieChartProps {
  data: any[]
  nameField: string
  valueField: string
  title?: string
  height?: number
  width?: number
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  innerRadius?: number
  outerRadius?: number
  paddingAngle?: number
}

export function PieChart({
  data,
  nameField,
  valueField,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0,
}: PieChartProps) {
  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item) => ({
      name: item[nameField],
      value: item[valueField],
    }))
  }, [data, nameField, valueField])

  if (!data || data.length === 0) {
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
          <RechartsPieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              paddingAngle={paddingAngle}
              dataKey="value"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
