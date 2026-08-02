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

  // 只在足够大的区域显示文字
  const showText = width > 40 && height > 20;
  const showIndex = width > 60 && height > 40;

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
      {depth === 1 && showText ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={Math.min(14, width / 4, height / 3)}
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {name}
        </text>
      ) : null}
      {depth === 1 && showIndex ? (
        <text
          x={x + 6}
          y={y + 16}
          fill="#fff"
          fontSize={Math.min(12, width / 6, height / 4)}
          fillOpacity={0.8}
          fontWeight="bold"
        >
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
