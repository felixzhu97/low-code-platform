"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface GaugeChartProps {
  value: number
  min?: number
  max?: number
  title?: string
  height?: number
  width?: number
  colors?: string[]
  showValue?: boolean
  unit?: string
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"],
  showValue = true,
  unit = "%",
}: GaugeChartProps) {
  // 计算百分比
  const percent = useMemo(() => {
    const normalizedValue = Math.max(min, Math.min(max, value))
    return (normalizedValue - min) / (max - min)
  }, [value, min, max])

  // 创建仪表盘数据
  const data = useMemo(() => {
    return [
      { name: "value", value: percent },
      { name: "empty", value: 1 - percent },
    ]
  }, [percent])

  // 确定颜色
  const color = useMemo(() => {
    if (percent <= 0.2) return colors[0]
    if (percent <= 0.4) return colors[1]
    if (percent <= 0.6) return colors[2]
    if (percent <= 0.8) return colors[3]
    return colors[4]
  }, [percent, colors])

  return (
    <div className="w-full">
      {title && <h3 className="mb-2 text-lg font-medium">{title}</h3>}
      <div style={{ width: width || "100%", height: height || 300 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#EEEEEE" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {showValue && (
          <div
            className="absolute left-0 right-0 top-1/2 text-center text-3xl font-bold"
            style={{ transform: "translateY(-20%)" }}
          >
            {value}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
        )}
      </div>
    </div>
  )
}
