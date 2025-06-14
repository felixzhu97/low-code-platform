"use client"

import { useMemo } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BarChartProps {
  data: any[]
  xField: string
  yField: string
  seriesField?: string
  title?: string
  height?: number
  width?: number
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  isStacked?: boolean
}

export function BarChart({
  data,
  xField,
  yField,
  seriesField,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  isStacked = false,
}: BarChartProps) {
  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    // 如果没有seriesField，直接返回原始数据
    if (!seriesField) {
      return data
    }

    // 如果有seriesField，需要处理数据格式
    const uniqueXValues = Array.from(new Set(data.map((item) => item[xField])))
    const uniqueSeriesValues = Array.from(new Set(data.map((item) => item[seriesField])))

    return uniqueXValues.map((xValue) => {
      const result: any = { [xField]: xValue }

      uniqueSeriesValues.forEach((seriesValue) => {
        const matchingItem = data.find((item) => item[xField] === xValue && item[seriesField] === seriesValue)
        result[seriesValue] = matchingItem ? matchingItem[yField] : 0
      })

      return result
    })
  }, [data, xField, yField, seriesField])

  // 生成图表的bars
  const renderBars = useMemo(() => {
    if (!seriesField) {
      return <Bar dataKey={yField} fill={colors[0]} />
    }

    const uniqueSeriesValues = Array.from(new Set(data.map((item) => item[seriesField])))

    return uniqueSeriesValues.map((seriesValue, index) => (
      <Bar
        key={seriesValue as string}
        dataKey={seriesValue as string}
        fill={colors[index % colors.length]}
        stackId={isStacked ? "stack" : undefined}
      />
    ))
  }, [data, yField, seriesField, colors, isStacked])

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
          <RechartsBarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xField} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {renderBars}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
