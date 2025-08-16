import type React from "react";
import type { Component, ThemeConfig } from "@/mvvm/models/types";
import { Button } from "@/mvvm/views/components/ui/button";
import { Separator } from "@/mvvm/views/components/ui/separator";
import { cn } from "@/mvvm/viewmodels/utils";

interface BasicComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  theme?: ThemeConfig;
  animationStyle: React.CSSProperties;
  themeStyle: React.CSSProperties;
}

export function BasicComponentRenderer({
  component,
  props,
  theme,
  animationStyle,
  themeStyle,
}: BasicComponentRendererProps) {
  // 渲染图标的辅助函数
  const renderIcon = (iconName: string) => {
    // 简化实现，实际项目中可以使用lucide-react或其他图标库
    switch (iconName) {
      case "plus":
        return <span>+</span>;
      case "minus":
        return <span>-</span>;
      case "check":
        return <span>✓</span>;
      case "x":
        return <span>×</span>;
      default:
        return <span>⚪</span>;
    }
  };

  switch (component.type) {
    case "text":
      return (
        <div
          className="p-2"
          style={{
            fontSize: `${props.fontSize}px`,
            fontWeight: props.fontWeight,
            color: props.color,
            textAlign: props.alignment as any,
            lineHeight: props.lineHeight,
            letterSpacing: props.letterSpacing,
            textTransform: props.textTransform as any,
            textDecoration: props.textDecoration as any,
            ...themeStyle,
            ...animationStyle,
          }}
        >
          {props.content || "示例文本"}
        </div>
      );

    case "button":
      return (
        <Button
          variant={(props.variant as any) || "default"}
          size={(props.size as any) || "default"}
          disabled={props.disabled}
          className={props.fullWidth ? "w-full" : ""}
          style={{ ...themeStyle, ...animationStyle }}
        >
          {props.icon && props.iconPosition === "left" && (
            <span className="mr-2">{renderIcon(props.icon)}</span>
          )}
          {props.text || "按钮"}
          {props.icon && props.iconPosition === "right" && (
            <span className="ml-2">{renderIcon(props.icon)}</span>
          )}
        </Button>
      );

    case "image":
      return (
        <div style={{ ...animationStyle }}>
          <img
            src={props.src || "/placeholder.svg?height=200&width=300"}
            alt={props.alt || "示例图片"}
            width={props.width || 300}
            height={props.height || 200}
            className={cn(
              "object-cover",
              props.rounded && "rounded-lg",
              props.shadow && "shadow-md",
              props.border && "border"
            )}
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
        <Separator
          className={cn(props.orientation === "vertical" ? "h-full" : "w-full")}
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

    default:
      return (
        <div className="rounded border p-2">
          {component.name || component.type}
        </div>
      );
  }
}
