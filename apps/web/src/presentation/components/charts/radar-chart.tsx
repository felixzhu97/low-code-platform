"use client";

import React from "react";
import styled from "@emotion/styled";
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
  nameField?: string;
  dataFields?: string[];
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
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
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
    </ChartContainer>
  );
}

export default RadarChart;
