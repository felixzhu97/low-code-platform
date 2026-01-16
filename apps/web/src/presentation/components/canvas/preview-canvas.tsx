"use client";

import type React from "react";

import { useRef } from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import type { PageSchema } from "@/domain/entities/schema.types";
import { SchemaRenderer } from "./schema-renderer";

interface PreviewCanvasProps {
  readonly components?: Component[];
  readonly width: number;
  readonly theme?: ThemeConfig;
  readonly isAnimating?: boolean;
  readonly schema?: PageSchema | string; // 支持 Schema JSON
}

export function PreviewCanvas({
  components,
  width,
  theme,
  isAnimating = false,
  schema,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // 如果提供了 Schema，使用 SchemaRenderer
  if (schema) {
    return (
      <div
        style={{
          width: `${width}px`,
          overflow: "auto",
        }}
      >
        <SchemaRenderer schema={schema} isReadOnly={true} />
      </div>
    );
  }

  // 如果没有提供 components，返回空状态
  if (!components || components.length === 0) {
    return (
      <div
        className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed"
        style={{
          width: `${width}px`,
        }}
      >
        <div className="text-center text-muted-foreground">
          <p>没有组件可预览</p>
        </div>
      </div>
    );
  }

  // 递归渲染组件
  const renderComponent = (
    component: Component,
    parentComponent: Component | null = null
  ) => {
    // 如果组件被设置为不可见，则不渲染
    if (component.properties?.visible === false) {
      return null;
    }

    const props = component.properties || {};
    const animation = props.animation;

    // 应用动画样式
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

    // 应用主题样式
    const themeStyle = {
      fontFamily: theme?.fontFamily || "system-ui, sans-serif",
      "--border-radius": theme?.borderRadius || "0.375rem",
      "--primary": theme?.primaryColor || "#0070f3",
      "--secondary": theme?.secondaryColor || "#6c757d",
    } as React.CSSProperties;

    // 获取组件的子组件
    const childComponents = components.filter(
      (comp) => comp.parentId === component.id
    );

    // 根据组件类型渲染不同的内容
    const renderComponentContent = () => {
      switch (component.type) {
        case "text":
          return (
            <div
              style={{
                fontSize: `${props.fontSize || 14}px`,
                fontWeight: props.fontWeight || "normal",
                color: props.color || "#1f2937",
                textAlign: (props.alignment as any) || "left",
                lineHeight: props.lineHeight || "normal",
                letterSpacing: props.letterSpacing || "normal",
                textTransform: (props.textTransform as any) || "none",
                textDecoration: (props.textDecoration as any) || "none",
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
            <button
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                props.variant === "outline"
                  ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } ${props.fullWidth ? "w-full" : ""}`}
              disabled={props.disabled}
              style={{ ...themeStyle, ...animationStyle }}
            >
              {props.text || "按钮"}
            </button>
          );
        case "image":
          return (
            <div style={{ ...animationStyle }}>
              <img
                src={props.src || "/placeholder.svg?height=200&width=300"}
                alt={props.alt || "示例图片"}
                width={props.width || 300}
                height={props.height || 200}
                className={`object-cover ${props.rounded ? "rounded-lg" : ""} ${
                  props.shadow ? "shadow-md" : ""
                } ${props.border ? "border" : ""}`}
                style={{ objectFit: (props.objectFit as any) || "cover" }}
              />
              {props.caption && (
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  {props.caption}
                </div>
              )}
            </div>
          );
        case "divider":
          return (
            <hr
              className={props.orientation === "vertical" ? "h-full" : "w-full"}
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
            <div
              className={`${props.shadow ? "shadow-md" : ""} ${
                props.rounded ? "rounded-lg" : ""
              } ${props.border ? "border" : "border-0"}`}
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
              {props.title && (
                <div className="border-b p-4 font-medium">{props.title}</div>
              )}
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className="relative"
                    style={{
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
                <div className="text-center text-sm text-muted-foreground">
                  卡片内容
                </div>
              )}
            </div>
          );
        case "grid-layout":
          return (
            <div
              className="grid min-h-40 min-w-40 rounded p-4"
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
                  <div
                    key={child.id}
                    className="relative"
                    style={{
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
                <div className="text-center text-sm text-muted-foreground">
                  网格布局
                </div>
              )}
            </div>
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
                  <div
                    key={child.id}
                    className="relative"
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
                <div className="text-center text-sm text-muted-foreground">
                  弹性布局
                </div>
              )}
            </div>
          );
        case "container":
          return (
            <div
              className="relative"
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
                <div className="text-center text-sm text-muted-foreground">
                  容器
                </div>
              )}
            </div>
          );
        default:
          return (
            <div className="rounded border p-2">
              {component.name || component.type}
            </div>
          );
      }
    };

    // 如果是根级组件（没有父组件）
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

    // 如果是子组件
    return renderComponentContent();
  };

  // 获取根级组件（没有父组件的组件）
  const rootComponents = components.filter((comp) => !comp.parentId);

  // 计算画布高度 - 确保至少有足够的空间来容纳所有组件
  const calculateCanvasHeight = () => {
    if (rootComponents.length === 0) return 500;

    let maxHeight = 500; // 默认最小高度

    rootComponents.forEach((component) => {
      const compHeight = component.properties?.height
        ? Number.parseInt(component.properties.height.toString())
        : 0;
      const compY = component.position?.y || 0;

      const totalHeight = compY + compHeight + 100; // 添加一些额外空间
      if (totalHeight > maxHeight) {
        maxHeight = totalHeight;
      }
    });

    return maxHeight;
  };

  // 计算画布宽度 - 确保至少有足够的空间来容纳所有组件
  const calculateCanvasWidth = () => {
    if (rootComponents.length === 0) return width;

    let maxWidth = width; // 默认最小宽度

    rootComponents.forEach((component) => {
      const compWidth = component.properties?.width
        ? Number.parseInt(component.properties.width.toString())
        : 0;
      const compX = component.position?.x || 0;

      const totalWidth = compX + compWidth + 100; // 添加一些额外空间
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
        <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center text-muted-foreground">
            <p>此模板没有组件</p>
          </div>
        </div>
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
