"use client";

import React from "react";
import styled from "@emotion/styled";
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

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

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
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
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
            label={{
              position: "insideStart",
              fill: "#fff",
              fontSize: 12,
              fontWeight: "bold",
            }}
            background
            dataKey="uv"
          />
          <Legend
            iconSize={12}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          />
        </RechartsRadialBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default RadialBarChart;
