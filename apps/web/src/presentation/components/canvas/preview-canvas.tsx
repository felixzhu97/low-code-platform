"use client";

import type React from "react";

import { useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import type { PageSchema } from "@/domain/entities/schema.types";
import { SchemaRenderer } from "./schema-renderer";

const SchemaWrap = styled.div<{ $width: number }>`
  width: ${(p) => p.$width}px;
  overflow: auto;
`;

const PreviewEmptyOuter = styled.div<{ $width: number }>`
  display: flex;
  height: 100%;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 2px dashed hsl(var(--border));
  width: ${(p) => p.$width}px;
`;

const PreviewEmptyInner = styled.div`
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

const PreviewButton = styled.button<{ $outline?: boolean; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  width: ${(p) => (p.$fullWidth ? "100%" : "auto")};
  ${(p) =>
    p.$outline
      ? css`
          border: 1px solid hsl(var(--input));
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          &:hover {
            background-color: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
          }
        `
      : css`
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          &:hover {
            background-color: hsl(var(--primary) / 0.9);
          }
        `}
`;

const PreviewImage = styled.img<{ $rounded?: boolean; $shadow?: boolean; $border?: boolean }>`
  object-fit: cover;
  ${(p) => p.$rounded && "border-radius: 0.5rem;"}
  ${(p) => p.$shadow && "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"}
  ${(p) => p.$border && "border: 1px solid hsl(var(--border));"}
`;

const Caption = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const PreviewDivider = styled.hr<{ $vertical?: boolean }>`
  ${(p) => (p.$vertical ? "height: 100%; width: auto;" : "width: 100%;")}
  border: none;
`;

const CardRoot = styled.div<{
  $shadow?: boolean;
  $rounded?: boolean;
  $border?: boolean;
}>`
  ${(p) => p.$shadow && "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"}
  ${(p) => p.$rounded && "border-radius: 0.5rem;"}
  ${(p) =>
    p.$border
      ? "border: 1px solid hsl(var(--border));"
      : "border: none;"}
`;

const CardTitleRow = styled.div`
  border-bottom: 1px solid hsl(var(--border));
  padding: 1rem;
  font-weight: 500;
`;

const MutedPlaceholder = styled.div`
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const ChildSlot = styled.div`
  position: relative;
`;

const GridLayoutRoot = styled.div`
  display: grid;
  min-height: 10rem;
  min-width: 10rem;
  border-radius: 0.25rem;
  padding: 1rem;
`;

const DefaultFallback = styled.div`
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  padding: 0.5rem;
`;

interface PreviewCanvasProps {
  readonly components?: Component[];
  readonly width: number;
  readonly theme?: ThemeConfig;
  readonly isAnimating?: boolean;
  readonly schema?: PageSchema | string;
}

export function PreviewCanvas({
  components,
  width,
  theme,
  isAnimating = false,
  schema,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  if (schema) {
    return (
      <SchemaWrap $width={width}>
        <SchemaRenderer schema={schema} isReadOnly={true} />
      </SchemaWrap>
    );
  }

  if (!components || components.length === 0) {
    return (
      <PreviewEmptyOuter $width={width}>
        <PreviewEmptyInner>
          <p>没有组件可预览</p>
        </PreviewEmptyInner>
      </PreviewEmptyOuter>
    );
  }

  const renderComponent = (
    component: Component,
    parentComponent: Component | null = null
  ) => {
    if (component.properties?.visible === false) {
      return null;
    }

    const props = component.properties || {};
    const animation = props.animation;

    let animationStyle = {};
    if (animation && isAnimating) {
      animationStyle = {
        animation: `${animation.type} ${animation.duration}ms ${
          animation.easing
        } ${animation.delay}ms ${
          animation.repeat === 0 ? "infinite" : animation.repeat
        } ${animation.direction}`,
      };
    }

    const themeStyle = {
      fontFamily: theme?.fontFamily || "system-ui, sans-serif",
      "--border-radius": theme?.borderRadius || "0.375rem",
      "--primary": theme?.primaryColor || "#0070f3",
      "--secondary": theme?.secondaryColor || "#6c757d",
    } as React.CSSProperties;

    const childComponents = components.filter(
      (comp) => comp.parentId === component.id
    );

    const renderComponentContent = () => {
      switch (component.type) {
        case "text":
          return (
            <div
              style={{
                fontSize: `${props.fontSize || 14}px`,
                fontWeight: props.fontWeight || "normal",
                color: props.color || "#1f2937",
                textAlign: (props.alignment as React.CSSProperties["textAlign"]) || "left",
                lineHeight: props.lineHeight || "normal",
                letterSpacing: props.letterSpacing || "normal",
                textTransform: (props.textTransform as React.CSSProperties["textTransform"]) || "none",
                textDecoration: (props.textDecoration as React.CSSProperties["textDecoration"]) || "none",
                margin: props.margin || "0",
                marginTop: props.marginTop || "0",
                marginBottom: props.marginBottom || "0",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {props.content || "示例文本"}
            </div>
          );
        case "button":
          return (
            <PreviewButton
              type="button"
              $outline={props.variant === "outline"}
              $fullWidth={!!props.fullWidth}
              disabled={props.disabled}
              style={{ ...themeStyle, ...animationStyle }}
            >
              {props.text || "按钮"}
            </PreviewButton>
          );
        case "image":
          return (
            <div style={{ ...animationStyle }}>
              <PreviewImage
                src={props.src || "/placeholder.svg?height=200&width=300"}
                alt={props.alt || "示例图片"}
                width={props.width || 300}
                height={props.height || 200}
                $rounded={!!props.rounded}
                $shadow={!!props.shadow}
                $border={!!props.border}
                style={{ objectFit: (props.objectFit as React.CSSProperties["objectFit"]) || "cover" }}
              />
              {props.caption && <Caption>{props.caption}</Caption>}
            </div>
          );
        case "divider":
          return (
            <PreviewDivider
              $vertical={props.orientation === "vertical"}
              style={{
                margin: props.margin || "1rem 0",
                borderStyle: props.style || "solid",
                borderColor: props.color || "#e2e8f0",
                borderWidth:
                  props.orientation === "horizontal"
                    ? `${props.thickness || 1}px 0 0 0`
                    : `0 0 0 ${props.thickness || 1}px`,
                ...animationStyle,
              }}
            />
          );
        case "card":
          return (
            <CardRoot
              $shadow={!!props.shadow}
              $rounded={!!props.rounded}
              $border={!!props.border}
              style={{
                padding: props.padding || "1rem",
                backgroundColor: props.bgColor || "#ffffff",
                borderRadius:
                  props.borderRadius || (props.rounded ? "0.5rem" : "0"),
                border: props.border
                  ? `1px solid ${props.borderColor || "#e5e7eb"}`
                  : "none",
                display: props.display || "block",
                flexDirection: props.flexDirection || "column",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {props.title && <CardTitleRow>{props.title}</CardTitleRow>}
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <ChildSlot
                    key={child.id}
                    style={{
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor:
                        child.properties?.bgColor || "transparent",
                    }}
                  >
                    {renderComponent(child, component)}
                  </ChildSlot>
                ))
              ) : (
                <MutedPlaceholder>卡片内容</MutedPlaceholder>
              )}
            </CardRoot>
          );
        case "grid-layout":
          return (
            <GridLayoutRoot
              style={{
                gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
                gap: props.gap ? `${props.gap * 0.25}rem` : "0.5rem",
                gridTemplateRows: props.autoRows
                  ? `repeat(auto-fill, ${
                      props.rowHeight || "minmax(100px, auto)"
                    })`
                  : "auto",
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <ChildSlot
                    key={child.id}
                    style={{
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor:
                        child.properties?.bgColor || "transparent",
                    }}
                  >
                    {renderComponent(child, component)}
                  </ChildSlot>
                ))
              ) : (
                <MutedPlaceholder>网格布局</MutedPlaceholder>
              )}
            </GridLayoutRoot>
          );
        case "flex-layout":
          return (
            <div
              style={{
                display: "flex",
                flexDirection: props.direction === "column" ? "column" : "row",
                flexWrap: props.wrap ? "wrap" : "nowrap",
                justifyContent: props.justifyContent || "flex-start",
                alignItems: props.alignItems || "center",
                gap: props.gap ? `${props.gap * 0.25}rem` : "0.5rem",
                padding: "1rem",
                width: props.width || "100%",
                height: props.height || "auto",
                minHeight: "40px",
                minWidth: "40px",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <ChildSlot
                    key={child.id}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor:
                        child.properties?.bgColor || "transparent",
                    }}
                  >
                    {renderComponent(child, component)}
                  </ChildSlot>
                ))
              ) : (
                <MutedPlaceholder>弹性布局</MutedPlaceholder>
              )}
            </div>
          );
        case "container":
          return (
            <ChildSlot
              style={{
                ...themeStyle,
                ...animationStyle,
                width: props.width || "100%",
                height: props.height || "auto",
                backgroundColor: props.bgColor || "transparent",
                padding: props.padding || "0",
                margin: props.margin || "0",
                display: props.display || "block",
                flexDirection: props.flexDirection || "row",
                justifyContent: props.justifyContent || "flex-start",
                alignItems: props.alignItems || "flex-start",
                gap: props.gap || "0",
                border:
                  props.border ||
                  props.borderBottom ||
                  props.borderTop ||
                  props.borderLeft ||
                  props.borderRight ||
                  "none",
                borderBottom: props.borderBottom || "none",
                borderTop: props.borderTop || "none",
                borderLeft: props.borderLeft || "none",
                borderRight: props.borderRight || "none",
                borderRadius: props.borderRadius || "0",
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor:
                        child.properties?.bgColor || "transparent",
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <MutedPlaceholder>容器</MutedPlaceholder>
              )}
            </ChildSlot>
          );
        default:
          return (
            <DefaultFallback>
              {component.name || component.type}
            </DefaultFallback>
          );
      }
    };

    if (!parentComponent) {
      const rootProps = component.properties || {};
      return (
        <div
          key={component.id}
          style={{
            position: rootProps.position || "relative",
            left:
              rootProps.position === "absolute"
                ? `${component.position?.x || 0}px`
                : "auto",
            top:
              rootProps.position === "absolute"
                ? `${component.position?.y || 0}px`
                : "auto",
            width: rootProps.width || "100%",
            height: rootProps.height || "auto",
            margin: rootProps.margin || "0",
            padding: rootProps.padding || "0",
            backgroundColor: rootProps.bgColor || "transparent",
            display: rootProps.display || "block",
            flexDirection: rootProps.flexDirection || "row",
            justifyContent: rootProps.justifyContent || "flex-start",
            alignItems: rootProps.alignItems || "flex-start",
            gap: rootProps.gap || "0",
            border: rootProps.border || rootProps.borderBottom || "none",
            borderBottom: rootProps.borderBottom || "none",
            borderRadius: rootProps.borderRadius || "0",
          }}
        >
          {renderComponentContent()}
        </div>
      );
    }

    return renderComponentContent();
  };

  const rootComponents = components.filter((comp) => !comp.parentId);

  const calculateCanvasHeight = () => {
    if (rootComponents.length === 0) return 500;

    let maxHeight = 500;

    rootComponents.forEach((component) => {
      const compHeight = component.properties?.height
        ? Number.parseInt(component.properties.height.toString())
        : 0;
      const compY = component.position?.y || 0;

      const totalHeight = compY + compHeight + 100;
      if (totalHeight > maxHeight) {
        maxHeight = totalHeight;
      }
    });

    return maxHeight;
  };

  const calculateCanvasWidth = () => {
    if (rootComponents.length === 0) return width;

    let maxWidth = width;

    rootComponents.forEach((component) => {
      const compWidth = component.properties?.width
        ? Number.parseInt(component.properties.width.toString())
        : 0;
      const compX = component.position?.x || 0;

      const totalWidth = compX + compWidth + 100;
      if (totalWidth > maxWidth) {
        maxWidth = totalWidth;
      }
    });

    return maxWidth;
  };

  const canvasWidth = calculateCanvasWidth();
  const canvasHeight = calculateCanvasHeight();

  return (
    <div
      ref={canvasRef}
      style={{
        backgroundColor: theme?.backgroundColor || "#ffffff",
        color: theme?.textColor || "#000000",
        fontFamily: theme?.fontFamily || "system-ui, sans-serif",
        width: `${canvasWidth}px`,
        minHeight: `${canvasHeight}px`,
        overflow: "visible",
      }}
    >
      {rootComponents.length === 0 ? (
        <PreviewEmptyOuter $width={width}>
          <PreviewEmptyInner>
            <p>此模板没有组件</p>
          </PreviewEmptyInner>
        </PreviewEmptyOuter>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...rootComponents]
            .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))
            .map((component) => renderComponent(component))}
        </div>
      )}
    </div>
  );
}
