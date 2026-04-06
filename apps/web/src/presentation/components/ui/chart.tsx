"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const ChartContainer = styled.div`
  display: flex;
  aspect-ratio: 16 / 9;
  justify-content: center;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1;

  & [data-chart] {
    color: hsl(var(--chart-1));
  }

  & .recharts-cartesian-axis-tick_text {
    fill: hsl(var(--muted-foreground));
    font-size: 0.75rem;
    line-height: 1;
  }

  & .recharts-cartesian-grid_line[stroke="#ccc"] {
    stroke: hsl(var(--border) / 0.5);
  }

  & .recharts-curve.recharts-tooltip-cursor {
    stroke: hsl(var(--border));
  }

  & .recharts-dot[stroke="#fff"] {
    stroke: transparent;
  }

  & .recharts-layer {
    outline: none;
  }

  & .recharts-polar-grid_[stroke="#ccc"] {
    stroke: hsl(var(--border));
  }

  & .recharts-radial-bar-background-sector {
    fill: hsl(var(--muted));
  }

  & .recharts-rectangle.recharts-tooltip-cursor {
    fill: hsl(var(--muted));
  }

  & .recharts-reference-line_[stroke="#ccc"] {
    stroke: hsl(var(--border));
  }

  & .recharts-sector[stroke="#fff"] {
    stroke: transparent;
  }

  & .recharts-sector {
    outline: none;
  }

  & .recharts-surface {
    outline: none;
  }
`;

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartStyleContainer = styled.div`
  width: 100%;
`;

const ChartContainerWrapper = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <ChartContainer
        data-chart={chartId}
        ref={ref}
        className={className}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </ChartContainer>
    </ChartContext.Provider>
  );
});
ChartContainerWrapper.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <ChartStyleContainer>
      {Object.entries(THEMES).map(
        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
      ).join("")}
    </ChartStyleContainer>
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContentWrapper = styled.div`
  display: grid;
  min-width: 8rem;
  gap: 0.375rem;
  align-items: start;
  padding: 0.625rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border) / 0.5);
  background-color: hsl(var(--background));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const TooltipGrid = styled.div`
  display: grid;
  gap: 0.375rem;
`;

const TooltipLabelStyled = styled.span`
  font-weight: 500;
`;

const TooltipItemStyled = styled.div<{ centered?: boolean }>`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.5rem;

  ${(p) =>
    p.centered &&
    css`
      align-items: center;
    `}

  & > svg {
    height: 0.625rem;
    width: 0.625rem;
    color: hsl(var(--muted-foreground));
  }
`;

const TooltipIndicator = styled.div<{ indicator?: string }>`
  flex-shrink: 0;
  border-radius: 2px;
  border-color: var(--color-border);
  background-color: var(--color-bg);

  ${(p) => {
    switch (p.indicator) {
      case "dot":
        return css`
          height: 0.625rem;
          width: 0.625rem;
        `;
      case "line":
        return css`
          width: 1rem;
        `;
      case "dashed":
        return css`
          width: 0;
          border-width: 1.5px;
          border-style: dashed;
          background-color: transparent;
        `;
      default:
        return css`
          height: 0.625rem;
          width: 0.625rem;
        `;
    }
  }}
`;

const TooltipContentStyled = styled.div<{ nested?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: flex-end;

  ${(p) =>
    !p.nested &&
    css`
      align-items: center;
    `}
`;

const TooltipValueStyled = styled.span`
  font-family: ui-monospace, monospace;
  font-weight: 500;
  tabular-nums: ;
  color: hsl(var(--foreground));
`;

const TooltipItemLabelStyled = styled.span`
  display: grid;
  gap: 0.375rem;
  color: hsl(var(--muted-foreground));
`;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: any[];
    label?: any;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    labelFormatter?: (value: any, name: any, props: any) => React.ReactNode;
    formatter?: (
      value: any,
      name: any,
      props: any,
      index: number,
      payload: any
    ) => React.ReactNode;
    color?: string;
    labelClassName?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <TooltipLabelStyled>
            {labelFormatter(value, label, payload)}
          </TooltipLabelStyled>
        );
      }

      if (!value) {
        return null;
      }

      return <TooltipLabelStyled>{value}</TooltipLabelStyled>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <ChartTooltipContentWrapper
        ref={ref}
        className={className}
      >
        {!nestLabel ? tooltipLabel : null}
        <TooltipGrid>
          {payload.map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <TooltipItemStyled
                key={item.dataKey}
                centered={indicator === "dot"}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {!hideIndicator && (
                      <TooltipIndicator
                        indicator={indicator}
                        style={{
                          "--color-bg": indicatorColor,
                          "--color-border": indicatorColor,
                        } as React.CSSProperties}
                      />
                    )}
                    <TooltipContentStyled nested={nestLabel}>
                      <TooltipItemLabelStyled>
                        {nestLabel ? tooltipLabel : null}
                        <span>{itemConfig?.label || item.name}</span>
                      </TooltipItemLabelStyled>
                      {item.value && (
                        <TooltipValueStyled>
                          {item.value.toLocaleString()}
                        </TooltipValueStyled>
                      )}
                    </TooltipContentStyled>
                  </>
                )}
              </TooltipItemStyled>
            );
          })}
        </TooltipGrid>
      </ChartTooltipContentWrapper>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContentWrapper = styled.div<{ verticalAlign?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  ${(p) =>
    p.verticalAlign === "top"
      ? css`
          padding-bottom: 0.75rem;
        `
      : css`
          padding-top: 0.75rem;
        `}
`;

const LegendItemStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  & > svg {
    height: 0.75rem;
    width: 0.75rem;
    color: hsl(var(--muted-foreground));
  }
`;

const LegendDot = styled.div`
  height: 0.5rem;
  width: 0.5rem;
  flex-shrink: 0;
  border-radius: 2px;
`;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[];
    verticalAlign?: "top" | "bottom";
    hideIcon?: boolean;
    nameKey?: string;
  }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <ChartLegendContentWrapper
        ref={ref}
        className={className}
        verticalAlign={verticalAlign}
      >
        {payload.map((item: any) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <LegendItemStyled key={item.value}>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <LegendDot
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </LegendItemStyled>
          );
        })}
      </ChartLegendContentWrapper>
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainerWrapper as ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
