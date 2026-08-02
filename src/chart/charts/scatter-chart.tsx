"use client";

import { useMemo } from "react";
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
} from "recharts";

interface ScatterChartProps {
  data: any[];
  xField: string;
  yField: string;
  sizeField?: string;
  colorField?: string;
  title?: string;
  height?: number;
  width?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  minPointSize?: number;
  maxPointSize?: number;
}

// 默认演示数据
const defaultData = [
  { x: 65, y: 120, z: 180, category: "产品A" },
  { x: 72, y: 135, z: 220, category: "产品A" },
  { x: 78, y: 152, z: 280, category: "产品A" },
  { x: 85, y: 168, z: 320, category: "产品A" },
  { x: 90, y: 185, z: 380, category: "产品A" },
  { x: 95, y: 202, z: 420, category: "产品A" },
  { x: 68, y: 95, z: 150, category: "产品B" },
  { x: 75, y: 108, z: 180, category: "产品B" },
  { x: 82, y: 125, z: 240, category: "产品B" },
  { x: 88, y: 142, z: 290, category: "产品B" },
];

export function ScatterChart({
  data,
  xField = "x",
  yField = "y",
  sizeField = "z",
  colorField = "category",
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
  // 使用传入的数据或默认数据
  const chartData = useMemo(() => {
    return data && Array.isArray(data) && data.length > 0 ? data : defaultData;
  }, [data]);

  // 处理数据，确保格式正确
  const processedData = useMemo(() => {
    if (!chartData || !Array.isArray(chartData)) {
      return [];
    }

    // 如果没有colorField，直接返回单个系列
    if (!colorField) {
      return [
        {
          name: "数据",
          data: chartData.map((item) => ({
            x: item[xField],
            y: item[yField],
            z: sizeField ? item[sizeField] : 1,
          })),
        },
      ];
    }

    // 如果有colorField，按colorField分组
    const groupedData: Record<string, any[]> = {};

    chartData.forEach((item) => {
      const category = item[colorField];
      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      groupedData[category].push({
        x: item[xField],
        y: item[yField],
        z: sizeField ? item[sizeField] : 1,
      });
    });

    return Object.entries(groupedData).map(([category, points]) => ({
      name: category,
      data: points,
    }));
  }, [chartData, xField, yField, sizeField, colorField]);

  return (
    <div className="w-full">
      {title && <h3 className="mb-2 text-lg font-medium">{title}</h3>}
      <div style={{ width: width || "100%", height: height || 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="x"
              type="number"
              name={xField}
              domain={["auto", "auto"]}
              label={{ value: xField, position: "insideBottom", offset: -10 }}
            />
            <YAxis
              dataKey="y"
              type="number"
              name={yField}
              domain={["auto", "auto"]}
              label={{ value: yField, angle: -90, position: "insideLeft" }}
            />
            {sizeField && (
              <ZAxis
                dataKey="z"
                type="number"
                range={[minPointSize, maxPointSize]}
                name={sizeField}
              />
            )}
            {showTooltip && <Tooltip cursor={{ strokeDasharray: "3 3" }} />}
            {showLegend && <Legend />}

            {processedData.map((series, index) => (
              <Scatter
                key={series.name}
                name={series.name}
                data={series.data}
                fill={colors[index % colors.length]}
              />
            ))}
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
