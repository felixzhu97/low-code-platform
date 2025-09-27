import type React from "react";
import type { Component, ThemeConfig } from "../../../../domain/entities/types";
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui";
import { ChevronDown } from "lucide-react";
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
      {renderChildComponent(child)}
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

    case "collapse":
      return (
        <div
          className={cn(
            "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300",
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
          <Collapsible defaultOpen={props.defaultOpen || false}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4"
                disabled={isPreviewMode}
              >
                <span className="font-medium">{props.title || "折叠面板"}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              {childComponents.length > 0 ? (
                childComponents.map((child) => renderChildWrapper(child))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  折叠面板内容
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );

    case "tabs":
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

    case "modal":
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isPreviewMode}>
                {props.triggerText || "打开模态框"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{props.title || "模态框标题"}</DialogTitle>
                {props.description && (
                  <DialogDescription>{props.description}</DialogDescription>
                )}
              </DialogHeader>
              <div className="py-4">
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    模态框内容
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );

    case "drawer":
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
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" disabled={isPreviewMode}>
                {props.triggerText || "打开抽屉"}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{props.title || "抽屉标题"}</DrawerTitle>
                {props.description && (
                  <DrawerDescription>{props.description}</DrawerDescription>
                )}
              </DrawerHeader>
              <div className="px-4 pb-4">
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    抽屉内容
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      );

    case "popover":
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" disabled={isPreviewMode}>
                {props.triggerText || "打开弹出框"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  {props.title || "弹出框标题"}
                </h4>
                {props.description && (
                  <p className="text-sm text-muted-foreground">
                    {props.description}
                  </p>
                )}
              </div>
              <div className="mt-4">
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    弹出框内容
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );

    case "tooltip":
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" disabled={isPreviewMode}>
                  {props.triggerText || "悬停查看提示"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{props.content || "这是一个提示框"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
