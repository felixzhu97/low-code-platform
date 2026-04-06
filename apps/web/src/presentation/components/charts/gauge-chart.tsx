"use client";

import { useMemo } from "react";
import styled from "@emotion/styled";

interface GaugeChartProps {
  value?: number;
  min?: number;
  max?: number;
  title?: string;
  height?: number;
  width?: number;
  colors?: string[];
  showValue?: boolean;
  unit?: string;
}

const ChartContainer = styled.div`
  width: 100%;
`;

const ChartTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
`;

const ChartWrapper = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${(p) => p.width || "100%"};
  height: ${(p) => p.height || 300}px;
`;

const ValueDisplay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  transform: translateY(-20%);
  color: hsl(var(--foreground));
`;

const UnitText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
`;

export function GaugeChart({
  value = 88,
  min = 0,
  max = 100,
  title,
  height = 300,
  width = 500,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"],
  showValue = true,
  unit = "%",
}: GaugeChartProps) {
  const percent = useMemo(() => {
    const normalizedValue = Math.max(min, Math.min(max, value));
    return (normalizedValue - min) / (max - min);
  }, [value, min, max]);

  const color = useMemo(() => {
    if (percent <= 0.2) return colors[0];
    if (percent <= 0.4) return colors[1];
    if (percent <= 0.6) return colors[2];
    if (percent <= 0.8) return colors[3];
    return colors[4];
  }, [percent, colors]);

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ChartWrapper width={width} height={height}>
        <svg viewBox="0 0 200 100" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="50%" stopColor={colors[2]} />
              <stop offset="100%" stopColor={colors[4]} />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={color}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={`${percent * 251.2} 251.2`}
          />
        </svg>
        {showValue && (
          <ValueDisplay>
            {value}
            <UnitText>{unit}</UnitText>
          </ValueDisplay>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};
