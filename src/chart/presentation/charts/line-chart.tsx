"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
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

// 默认数据
const defaultData = [
  { name: "1月", visits: 12500, sales: 8400 },
  { name: "2月", visits: 18900, sales: 12600 },
  { name: "3月", visits: 25600, sales: 16800 },
  { name: "4月", visits: 28400, sales: 19200 },
  { name: "5月", visits: 32100, sales: 22500 },
  { name: "6月", visits: 29800, sales: 20100 },
  { name: "7月", visits: 35400, sales: 26300 },
];

export function LineChart({
  data,
  width = 400,
  height = 300,
  xAxisKey = "name",
  title,
}: LineChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
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
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#8884d8"
            name="访问量"
          />
          <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="销售" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
