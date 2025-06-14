"use client"

import { useMemo } from "react"
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts"

interface ScatterChartProps {
  data: any[]
  xField: string
  yField: string
  sizeField?: string
  colorField?: string
  title?: string
  height?: number
  width?: number
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  minPointSize?: number
  maxPointSize?: number
}

export function ScatterChart({
  data,
  xField,
  yField,
  sizeField,
  colorField,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  minPointSize = 10,
  maxPointSize = 60,
}: ScatterChartProps) {
  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    // 如果没有colorField，直接返回单个系列
    if (!colorField) {
      return [
        {
          name: "数据",
          data: data.map((item) => ({
            x: item[xField],
            y: item[yField],
            z: sizeField ? item[sizeField] : 1,
          })),
        },
      ]
    }

    // 如果有colorField，按colorField分组
    const groupedData: Record<string, any[]> = {}

    data.forEach((item) => {
      const category = item[colorField]
      if (!groupedData[category]) {
        groupedData[category] = []
      }

      groupedData[category].push({
        x: item[xField],
        y: item[yField],
        z: sizeField ? item[sizeField] : 1,
      })
    })

    return Object.entries(groupedData).map(([category, points]) => ({
      name: category,
      data: points,
    }))
  }, [data, xField, yField, sizeField, colorField])

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
          <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="x" type="number" name={xField} domain={["auto", "auto"]} />
            <YAxis dataKey="y" type="number" name={yField} domain={["auto", "auto"]} />
            {sizeField && <ZAxis dataKey="z" type="number" range={[minPointSize, maxPointSize]} name={sizeField} />}
            {showTooltip && <Tooltip cursor={{ strokeDasharray: "3 3" }} />}
            {showLegend && <Legend />}

            {processedData.map((series, index) => (
              <Scatter key={series.name} name={series.name} data={series.data} fill={colors[index % colors.length]} />
            ))}
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
