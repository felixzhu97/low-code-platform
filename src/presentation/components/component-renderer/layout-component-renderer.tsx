import type React from "react";
import type { Component, ThemeConfig } from "@/domain/entities/types";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { cn } from "@/application/services/utils";
import { ComponentRenderer } from "./index";

interface LayoutComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  childComponents: Component[];
  components: Component[];
  theme?: ThemeConfig;
  isPreviewMode: boolean;
  selectedId: string | null;
  dropTargetId: string | null;
  onSelectComponent: (component: Component) => void;
  onMouseDown: (e: React.MouseEvent, component: Component) => void;
  isDropTarget: boolean;
  themeStyle: React.CSSProperties;
  animationStyle: React.CSSProperties;
}

export function LayoutComponentRenderer({
  component,
  props,
  childComponents,
  components,
  theme,
  isPreviewMode,
  selectedId,
  dropTargetId,
  onSelectComponent,
  onMouseDown,
  isDropTarget,
  themeStyle,
  animationStyle,
}: LayoutComponentRendererProps) {
  // 渲染子组件的通用函数
  const renderChildComponent = (
    child: Component,
    additionalProps: any = {}
  ) => (
    <ComponentRenderer
      key={child.id}
      component={child}
      parentComponent={component}
      components={components}
      theme={theme}
      isPreviewMode={isPreviewMode}
      selectedId={selectedId}
      dropTargetId={dropTargetId}
      onSelectComponent={onSelectComponent}
      onMouseDown={onMouseDown}
      componentData={null} // 这里可以根据需要传递数据
      {...additionalProps}
    />
  );

  const renderChildWrapper = (
    child: Component,
    additionalStyle: React.CSSProperties = {}
  ) => (
    <div
      key={child.id}
      className={cn(
        "relative",
        !isPreviewMode && "cursor-move",
        selectedId === child.id &&
          !isPreviewMode &&
          "ring-2 ring-primary ring-offset-2"
      )}
      style={{
        width: child.properties?.width || "auto",
        height: child.properties?.height || "auto",
        margin: child.properties?.margin || "0",
        padding: child.properties?.padding || "0",
        backgroundColor: child.properties?.bgColor || "transparent",
        ...additionalStyle,
      }}
      onClick={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        onSelectComponent(child);
      }}
    >
      <div className="rounded border p-2">{child.name || child.type}</div>
    </div>
  );

  switch (component.type) {
    case "card":
      return (
        <Card
          className={cn(
            props.shadow ? "shadow-md" : "",
            props.rounded ? "rounded-lg" : "",
            props.border ? "border" : "border-0"
          )}
          style={{
            padding: props.padding || "1rem",
            ...themeStyle,
            ...animationStyle,
          }}
        >
          {props.title && (
            <div className="border-b p-4 font-medium">{props.title}</div>
          )}
          <CardContent className="p-4">
            {childComponents.length > 0 ? (
              childComponents.map((child) => renderChildWrapper(child))
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                卡片内容
              </div>
            )}
          </CardContent>
        </Card>
      );

    case "grid-layout":
      return (
        <div
          className={cn(
            "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "border-primary bg-primary/5",
            `grid-cols-${props.columns || 3}`,
            `gap-${props.gap || 2}`
          )}
          style={{
            gridTemplateRows: props.autoRows
              ? `repeat(auto-fill, ${props.rowHeight || "minmax(100px, auto)"})`
              : "auto",
            width: props.width || "100%",
            height: props.height || "auto",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
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
          className={cn(
            "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "border-primary bg-primary/5",
            props.direction === "column" ? "flex-col" : "flex-row",
            props.wrap ? "flex-wrap" : "flex-nowrap",
            `justify-${props.justifyContent || "start"}`,
            `items-${props.alignItems || "center"}`,
            `gap-${props.gap || 2}`
          )}
          style={{
            display: "flex",
            width: props.width || "100%",
            height: props.height || "auto",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              弹性布局
            </div>
          )}
        </div>
      );

    case "split-layout":
      return (
        <div
          className={cn(
            "min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 flex",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{
            flexDirection: props.direction === "horizontal" ? "row" : "column",
            width: props.width || "100%",
            height: props.height || "300px",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          <div
            className="border-r border-dashed border-gray-300 overflow-hidden"
            style={{
              width:
                props.direction === "horizontal"
                  ? `${props.splitRatio || 30}%`
                  : "100%",
              height:
                props.direction === "vertical"
                  ? `${props.splitRatio || 30}%`
                  : "100%",
              minWidth:
                props.direction === "horizontal"
                  ? `${props.minSize || 100}px`
                  : "auto",
              minHeight:
                props.direction === "vertical"
                  ? `${props.minSize || 100}px`
                  : "auto",
            }}
          >
            {childComponents.length > 0 && childComponents[0] ? (
              renderChildWrapper(childComponents[0], {
                height: "100%",
                width: "100%",
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                左侧/顶部区域
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            {childComponents.length > 1 && childComponents[1] ? (
              renderChildWrapper(childComponents[1], {
                height: "100%",
                width: "100%",
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                右侧/底部区域
              </div>
            )}
          </div>
        </div>
      );

    case "tab-layout":
      return (
        <div
          className={cn(
            "min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{
            width: props.width || "100%",
            height: props.height || "auto",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          <Tabs defaultValue={props.defaultTab || "tab-1"}>
            <TabsList className="w-full">
              {(
                props.tabs || [
                  { id: "tab-1", label: "标签1" },
                  { id: "tab-2", label: "标签2" },
                ]
              ).map((tab: any) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {(
              props.tabs || [
                { id: "tab-1", label: "标签1", content: "标签1内容" },
                { id: "tab-2", label: "标签2", content: "标签2内容" },
              ]
            ).map((tab: any, index: number) => (
              <TabsContent key={tab.id} value={tab.id} className="p-4">
                {childComponents[index] ? (
                  renderChildWrapper(childComponents[index])
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    {tab.content || `${tab.label}内容`}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      );

    case "card-group":
      return (
        <div
          className={cn(
            "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "border-primary bg-primary/5",
            `grid-cols-${props.columns || 3}`,
            `gap-${props.gap || 2}`
          )}
          style={{
            width: props.width || "100%",
            height: props.height || "auto",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => (
              <Card key={child.id} className="overflow-hidden">
                {renderChildWrapper(child)}
              </Card>
            ))
          ) : (
            <>
              <Card className="p-4">
                <div className="text-center text-sm text-muted-foreground">
                  卡片1
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center text-sm text-muted-foreground">
                  卡片2
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center text-sm text-muted-foreground">
                  卡片3
                </div>
              </Card>
            </>
          )}
        </div>
      );

    case "responsive-container":
      return (
        <div
          className={cn(
            "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{
            width: props.width || "100%",
            height: props.height || "auto",
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          <div className="mb-2 flex items-center justify-between border-b pb-2">
            <span className="text-xs font-medium">响应式容器</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
            </div>
          </div>
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              响应式内容
            </div>
          )}
        </div>
      );

    case "container":
      return (
        <div
          className={cn(
            "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4 relative",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{ ...themeStyle, ...animationStyle }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              容器
            </div>
          )}
        </div>
      );

    case "row":
      return (
        <div
          className={cn(
            "flex min-h-12 min-w-40 gap-2 rounded border-2 border-dashed border-gray-300 p-2",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{ ...themeStyle, ...animationStyle }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div className="text-center text-sm text-muted-foreground">行</div>
          )}
        </div>
      );

    case "column":
      return (
        <div
          className={cn(
            "flex min-h-20 min-w-20 flex-col gap-2 rounded border-2 border-dashed border-gray-300 p-2",
            isDropTarget && "border-primary bg-primary/5"
          )}
          style={{ ...themeStyle, ...animationStyle }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div className="text-center text-sm text-muted-foreground">列</div>
          )}
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
