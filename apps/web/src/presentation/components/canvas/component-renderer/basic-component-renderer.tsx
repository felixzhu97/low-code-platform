import type React from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import {
  Button,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from "@/presentation/components/ui";
import { CheckCircle, Circle, Star, Clock, User } from "lucide-react";
import { cn } from "@/application/services/utils";
import { ComponentRenderer } from "./index";

interface BasicComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  theme?: ThemeConfig;
  animationStyle: React.CSSProperties;
  themeStyle: React.CSSProperties;
  childComponents?: Component[];
  components?: Component[];
  isPreviewMode?: boolean;
  selectedId?: string | null;
  dropTargetId?: string | null;
  onSelectComponent?: (component: Component) => void;
  onMouseDown?: (e: React.MouseEvent, component: Component) => void;
}

export function BasicComponentRenderer({
  component,
  props,
  theme,
  animationStyle,
  themeStyle,
  childComponents = [],
  components = [],
  isPreviewMode = false,
  selectedId = null,
  dropTargetId = null,
  onSelectComponent = () => {},
  onMouseDown = () => {},
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
          className={cn(
            props.fullWidth ? "w-full" : "",
            props.gradient && "gradient-primary text-white border-0",
            props.shadow && "shadow-medium",
            props.floating && "floating"
          )}
          style={{
            ...themeStyle,
            ...animationStyle,
            background: props.gradient ? undefined : props.backgroundColor,
            color: props.textColor,
            borderRadius: props.borderRadius || "0.375rem",
            border: props.border
              ? `2px solid ${props.borderColor || "transparent"}`
              : "none",
            boxShadow: props.shadow
              ? "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.12)"
              : undefined,
          }}
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
        <div
          className={cn(props.floating && "floating")}
          style={{ ...animationStyle }}
        >
          <div className="relative overflow-hidden group">
            <img
              src={props.src || "/placeholder.svg?height=200&width=300"}
              alt={props.alt || "示例图片"}
              width={props.width || 300}
              height={props.height || 200}
              className={cn(
                "object-cover",
                props.rounded && "rounded-lg",
                props.shadow && "shadow-medium",
                props.border && "border-2 border-gray-200",
                props.gradientOverlay && "group-hover:brightness-110"
              )}
              style={{
                objectFit: (props.objectFit as any) || "cover",
                filter: props.gradientOverlay
                  ? "contrast(1.1) saturate(1.1)"
                  : undefined,
              }}
            />
            {props.gradientOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            {props.overlayText && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-semibold bg-black/50 px-3 py-1 rounded-lg">
                  {props.overlayText}
                </span>
              </div>
            )}
          </div>
          {props.caption && (
            <div className="mt-2 text-center text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
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

    case "carousel":
      return (
        <div className="w-full max-w-xs mx-auto" style={{ ...animationStyle }}>
          <Carousel
            opts={{
              align: "start",
              loop: props.loop || false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {childComponents.length > 0 ? (
                childComponents.map((child, index) => (
                  <CarouselItem key={child.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <ComponentRenderer
                            component={child}
                            parentComponent={component}
                            components={components}
                            theme={theme}
                            isPreviewMode={isPreviewMode}
                            selectedId={selectedId}
                            dropTargetId={dropTargetId}
                            onSelectComponent={onSelectComponent}
                            onMouseDown={onMouseDown}
                            componentData={null}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <>
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="gradient-primary">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold text-white">
                            1
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="gradient-secondary">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold text-white">
                            2
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="gradient-success">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold text-white">
                            3
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </>
              )}
            </CarouselContent>
            {props.showArrows !== false && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      );

    case "steps":
      const steps = props.steps || [
        { title: "步骤1", description: "第一步描述" },
        { title: "步骤2", description: "第二步描述" },
        { title: "步骤3", description: "第三步描述" },
      ];
      const currentStep = props.currentStep || 1;

      return (
        <div className="w-full" style={{ ...animationStyle }}>
          <div className="flex items-center justify-between">
            {steps.map((step: any, index: number) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isPending = stepNumber > currentStep;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      isCompleted &&
                        "bg-primary border-primary text-primary-foreground",
                      isCurrent && "border-primary text-primary",
                      isPending &&
                        "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isCurrent && "text-primary",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-5 left-1/2 h-0.5 w-full -translate-y-1/2",
                        stepNumber < currentStep ? "bg-primary" : "bg-muted"
                      )}
                      style={{
                        width: "calc(100% - 2.5rem)",
                        left: "calc(50% + 1.25rem)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );

    case "progress":
      return (
        <div className="w-full space-y-2" style={{ ...animationStyle }}>
          {props.label && (
            <div className="flex justify-between text-sm">
              <span>{props.label}</span>
              <span>{props.value || 0}%</span>
            </div>
          )}
          <Progress value={props.value || 0} className="w-full" />
          {props.description && (
            <p className="text-xs text-muted-foreground">{props.description}</p>
          )}
        </div>
      );

    case "avatar":
      return (
        <div
          className="flex items-center space-x-4"
          style={{ ...animationStyle }}
        >
          <Avatar
            className={cn(
              "h-12 w-12",
              props.size === "sm" && "h-8 w-8",
              props.size === "lg" && "h-16 w-16"
            )}
          >
            <AvatarImage src={props.src || ""} alt={props.alt || "头像"} />
            <AvatarFallback>
              {props.fallback || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          {props.showInfo && (
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {props.name || "用户名"}
              </p>
              <p className="text-xs text-muted-foreground">
                {props.description || "用户描述"}
              </p>
            </div>
          )}
        </div>
      );

    case "badge":
      return (
        <div
          className="flex items-center space-x-2"
          style={{ ...animationStyle }}
        >
          <Badge
            variant={props.variant || "default"}
            className={cn(
              props.className,
              props.pulse && "animate-pulse",
              props.gradient && "gradient-primary text-white border-0"
            )}
            style={{
              background: props.gradient ? undefined : props.backgroundColor,
              color: props.textColor,
              borderRadius: props.borderRadius || "0.375rem",
              boxShadow: props.shadow
                ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                : undefined,
            }}
          >
            {props.text || "徽章"}
          </Badge>
          {props.showClose && (
            <button
              className="ml-1 h-4 w-4 rounded-full hover:bg-muted"
              onClick={() => {}}
            >
              ×
            </button>
          )}
        </div>
      );

    case "tag":
      return (
        <div className="flex flex-wrap gap-2" style={{ ...animationStyle }}>
          {(props.tags || ["标签1", "标签2", "标签3"]).map(
            (tag: string, index: number) => (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
                  props.variant === "secondary" &&
                    "border-transparent bg-secondary text-secondary-foreground",
                  props.variant === "destructive" &&
                    "border-transparent bg-destructive text-destructive-foreground",
                  props.variant === "outline" && "text-foreground",
                  !props.variant &&
                    "border-transparent bg-primary text-primary-foreground",
                  props.gradient && "gradient-primary text-white border-0"
                )}
                style={{
                  background: props.gradient
                    ? undefined
                    : props.backgroundColor,
                  color: props.textColor,
                  borderRadius: props.borderRadius || "0.375rem",
                  boxShadow: props.shadow
                    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                    : undefined,
                }}
              >
                {tag}
                {props.closable && (
                  <button
                    className="ml-1 h-3 w-3 rounded-full hover:bg-muted"
                    onClick={() => {}}
                  >
                    ×
                  </button>
                )}
              </div>
            )
          )}
        </div>
      );

    case "timeline":
      const timelineItems = props.items || [
        { title: "事件1", description: "事件描述1", time: "2023-01-01" },
        { title: "事件2", description: "事件描述2", time: "2023-01-02" },
        { title: "事件3", description: "事件描述3", time: "2023-01-03" },
      ];

      return (
        <div className="w-full" style={{ ...animationStyle }}>
          <div className="space-y-4">
            {timelineItems.map((item: any, index: number) => (
              <div key={index} className="relative flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Clock className="h-3 w-3" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-3 top-6 h-full w-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "rating":
      const maxRating = props.maxRating || 5;
      const rating = props.rating || 0;
      const size = props.size || "default";

      return (
        <div
          className="flex items-center space-x-1"
          style={{ ...animationStyle }}
        >
          {Array.from({ length: maxRating }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;
            const isHalfFilled =
              starValue === Math.ceil(rating) && rating % 1 !== 0;

            return (
              <button
                key={index}
                className={cn(
                  "transition-colors",
                  size === "sm" && "h-4 w-4",
                  size === "default" && "h-5 w-5",
                  size === "lg" && "h-6 w-6"
                )}
                onClick={() => {}}
                disabled={props.readonly}
              >
                <Star
                  className={cn(
                    "h-full w-full",
                    isFilled && "fill-yellow-400 text-yellow-400",
                    isHalfFilled && "fill-yellow-400/50 text-yellow-400",
                    !isFilled && !isHalfFilled && "text-muted-foreground"
                  )}
                />
              </button>
            );
          })}
          {props.showValue && (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating}/{maxRating}
            </span>
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
}
