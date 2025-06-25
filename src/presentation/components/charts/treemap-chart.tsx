"use client";

import React from "react";
import { Treemap, ResponsiveContainer } from "recharts";

interface TreemapChartProps {
  data?: Array<Record<string, any>>;
  width?: number;
  height?: number;
  dataKey?: string;
  title?: string;
}

// 默认数据
const defaultData = [
  { name: "A", size: 24593, fill: "#8884d8" },
  { name: "B", size: 19747, fill: "#83a6ed" },
  { name: "C", size: 12384, fill: "#8dd1e1" },
  { name: "D", size: 9800, fill: "#82ca9d" },
  { name: "E", size: 7532, fill: "#a4de6c" },
  { name: "F", size: 5421, fill: "#ffc658" },
  { name: "G", size: 3912, fill: "#ffb347" },
  { name: "H", size: 2864, fill: "#ff8c69" },
  { name: "I", size: 1953, fill: "#ff7f7f" },
  { name: "J", size: 1247, fill: "#d084d0" },
];

const COLORS = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#ffc658",
];

const CustomizedContent = (props: any) => {
  const {
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    payload,
    colors,
    rank,
    name,
  } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? colors[Math.floor((index / root.children.length) * 6)]
              : "#ffffff00",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null}
    </g>
  );
};

export function TreemapChart({
  data,
  width = 400,
  height = 300,
  dataKey = "size",
  title,
}: TreemapChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={chartData}
          dataKey={dataKey}
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS} />}
        />
      </ResponsiveContainer>
    </div>
  );
}

export default TreemapChart;
