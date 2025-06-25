"use client";

import React from "react";
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RadialBarChartProps {
  data?: Array<Record<string, any>>;
  width?: number;
  height?: number;
  innerRadius?: string | number;
  outerRadius?: string | number;
  title?: string;
}

// 默认数据
const defaultData = [
  { name: "18-24", uv: 31.47, pv: 2400, fill: "#8884d8" },
  { name: "25-29", uv: 26.69, pv: 4567, fill: "#83a6ed" },
  { name: "30-34", uv: 15.69, pv: 1398, fill: "#8dd1e1" },
  { name: "35-39", uv: 8.22, pv: 9800, fill: "#82ca9d" },
  { name: "40-49", uv: 8.63, pv: 3908, fill: "#a4de6c" },
  { name: "50+", uv: 2.63, pv: 4800, fill: "#ffc658" },
];

export function RadialBarChart({
  data,
  width = 400,
  height = 300,
  innerRadius = "10%",
  outerRadius = "80%",
  title,
}: RadialBarChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          data={chartData}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="uv"
          />
          <Legend
            iconSize={18}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              width: "50%",
              textAlign: "left",
              paddingLeft: "20px",
            }}
          />
        </RechartsRadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadialBarChart;
