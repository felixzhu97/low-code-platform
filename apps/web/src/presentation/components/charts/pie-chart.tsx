"use client";

import { useMemo } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: any[];
  nameField: string;
  valueField: string;
  title?: string;
  height?: number;
  width?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
}

// 默认演示数据
const defaultData = [
  { category: "移动端", value: 45 },
  { category: "桌面端", value: 32 },
  { category: "平板端", value: 18 },
  { category: "其他", value: 5 },
];

export function PieChart({
  data,
  nameField = "category",
  valueField = "value",
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
  // 使用传入的数据或默认数据
  const chartData = useMemo(() => {
    return data && Array.isArray(data) && data.length > 0 ? data : defaultData;
  }, [data]);

  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!chartData || !Array.isArray(chartData)) {
      return [];
    }

    return chartData.map((item) => ({
      name: item[nameField],
      value: item[valueField],
    }));
  }, [chartData, nameField, valueField]);

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
              label={({ name, percent }) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              paddingAngle={paddingAngle}
              dataKey="value"
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
