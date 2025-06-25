"use client";

import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
  data?: Array<Record<string, any>>;
  width?: number;
  height?: number;
  dataKeys?: string[];
  colors?: string[];
  title?: string;
}

// 默认数据
const defaultData = [
  { subject: "数学", A: 120, B: 110, fullMark: 150 },
  { subject: "语文", A: 98, B: 130, fullMark: 150 },
  { subject: "英语", A: 86, B: 130, fullMark: 150 },
  { subject: "地理", A: 99, B: 100, fullMark: 150 },
  { subject: "物理", A: 85, B: 90, fullMark: 150 },
  { subject: "历史", A: 65, B: 85, fullMark: 150 },
];

export function RadarChart({
  data,
  width = 400,
  height = 300,
  title,
}: RadarChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart
          data={chartData}
          margin={{
            top: 20,
            right: 80,
            bottom: 20,
            left: 80,
          }}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="学生A"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="学生B"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
