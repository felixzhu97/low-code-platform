"use client";

import React from "react";
import styled from "@emotion/styled";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data?: Array<Record<string, any>>;
  width?: number;
  height?: number;
  xAxisKey?: string;
  dataKeys?: string[];
  colors?: string[];
  title?: string;
  xField?: string;
  seriesField?: string;
  yField?: string;
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
  { name: "1月", sales: 8500, revenue: 6200 },
  { name: "2月", sales: 9200, revenue: 7300 },
  { name: "3月", sales: 10800, revenue: 8600 },
  { name: "4月", sales: 9800, revenue: 7900 },
  { name: "5月", sales: 10200, revenue: 8100 },
  { name: "6月", sales: 9500, revenue: 7600 },
];

export function BarChart({
  data,
  width = 400,
  height = 300,
  xAxisKey = "name",
  title,
}: BarChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" name="销售额" />
          <Bar dataKey="revenue" fill="#82ca9d" name="收入" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default BarChart;
