import type React from "react";
import type { Component } from "@/domain/component";
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  RadarChart,
  ScatterChart,
  GaugeChart,
  RadialBarChart,
  TreemapChart,
} from "@/presentation/components/charts";

interface ChartComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  componentData: any;
  animationStyle: React.CSSProperties;
}

export function ChartComponentRenderer({
  component,
  props,
  componentData,
  animationStyle,
}: ChartComponentRendererProps) {
  const commonProps = {
    width: props.width || 500,
    height: props.height || 300,
    title: props.title,
    data: componentData || [],
  };

  switch (component.type) {
    case "bar-chart":
      return (
        <div style={{ ...animationStyle }}>
          <BarChart {...commonProps} xAxisKey={props.xField || "name"} />
        </div>
      );

    case "line-chart":
      return (
        <div style={{ ...animationStyle }}>
          <LineChart {...commonProps} xAxisKey={props.xField || "name"} />
        </div>
      );

    case "pie-chart":
      return (
        <div style={{ ...animationStyle }}>
          <PieChart
            {...commonProps}
            nameField={props.colorField || "category"}
            valueField={props.valueField || "value"}
            showLegend={props.legend !== false}
            showTooltip={true}
          />
        </div>
      );

    case "area-chart":
      return (
        <div style={{ ...animationStyle }}>
          <AreaChart {...commonProps} xAxisKey={props.xField || "name"} />
        </div>
      );

    case "scatter-chart":
      return (
        <div style={{ ...animationStyle }}>
          <ScatterChart
            {...commonProps}
            xField={props.xField || "x"}
            yField={props.yField || "y"}
            sizeField={props.sizeField}
            colorField={props.colorField}
            showGrid={true}
            showLegend={props.legend !== false}
            showTooltip={true}
          />
        </div>
      );

    case "radar-chart":
      return (
        <div style={{ ...animationStyle }}>
          <RadarChart {...commonProps} />
        </div>
      );

    case "gauge":
      return (
        <div style={{ ...animationStyle }}>
          <GaugeChart
            value={props.percent ? props.percent * 100 : 88}
            title={props.title}
            width={props.width || 300}
            height={props.height || 300}
            showValue={true}
            unit="%"
          />
        </div>
      );

    case "radial-bar-chart":
      return (
        <div style={{ ...animationStyle }}>
          <RadialBarChart
            {...commonProps}
            height={props.height || 350}
            innerRadius={props.innerRadius || "10%"}
            outerRadius={props.outerRadius || "80%"}
          />
        </div>
      );

    case "treemap-chart":
      return (
        <div style={{ ...animationStyle }}>
          <TreemapChart
            {...commonProps}
            height={props.height || 350}
            dataKey={props.dataKey || "size"}
          />
        </div>
      );

    default:
      return (
        <div className="rounded border p-2" style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
