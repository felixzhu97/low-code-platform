import type React from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
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
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { cn } from "@/application/services/utils";
import { ComponentRenderer } from "./index";
import { fallbackBox, mutedCenter } from "./renderer-emotion";

const LayoutTabsList = styled(TabsList)`
  width: 100%;
`;

const LayoutTabTrigger = styled(TabsTrigger)`
  flex: 1;
`;

const LayoutTabsContent = styled(TabsContent)`
  padding: 1rem;
`;

const CollapseTriggerButton = styled(Button)`
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
`;

const CollapsePanel = styled(CollapsibleContent)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`;

const DialogSection = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const DrawerSection = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`;

const PopoverWide = styled(PopoverContent)`
  width: 20rem;
`;

const PopoverStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PopoverTitle = styled.h4`
  font-weight: 500;
  line-height: 1;
`;

const CardPlaceholderLabel = styled.div`
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: white;
`;

const LayoutCardContentPad = styled(CardContent)`
  padding: 1rem;
`;

const CardTitleBar = styled.div<{ $onGradient?: boolean }>`
  border-bottom: 1px solid
    ${(p) => (p.$onGradient ? "rgb(255 255 255 / 0.2)" : "hsl(var(--border))")};
  padding: 1rem;
  font-weight: 500;
  transition: color 200ms;
  ${(p) => p.$onGradient && "color: white;"}
`;

const CardEmptyHint = styled.div<{ $onGradient?: boolean }>`
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: color 200ms;
  color: ${(p) =>
    p.$onGradient ? "rgb(255 255 255 / 0.8)" : "hsl(var(--muted-foreground))"};
`;

const GridLikeEmpty = styled.div<{ $dark?: boolean }>`
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${(p) => (p.$dark ? "#374151" : "hsl(var(--muted-foreground))")};
`;

const SplitFirstPanel = styled.div<{ $row: boolean }>`
  overflow: hidden;
  ${(p) =>
    p.$row
      ? "border-right: 1px dashed #d1d5db;"
      : "border-bottom: 1px dashed #d1d5db;"}
`;

const SplitRestPanel = styled.div`
  flex: 1;
  overflow: hidden;
`;

const SplitPlaceholder = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const ResponsiveChrome = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsl(var(--border));
  padding-bottom: 0.5rem;
`;

const ResponsiveLabel = styled.span`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
`;

const DotsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DeviceDot = styled.div`
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: hsl(var(--muted));
`;

const PopoverDesc = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

const PopoverChildrenWrap = styled.div`
  margin-top: 1rem;
`;

const DialogContentSized = styled(DialogContent)`
  @media (min-width: 640px) {
    max-width: 425px;
  }
`;

const GradientCardBlock = styled(Card)`
  padding: 1rem;
`;

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
      componentData={null}
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
        !isPreviewMode && "cursor-move component-hover"
      )}
      style={{
        width: child.properties?.width || "auto",
        height: child.properties?.height || "auto",
        margin: child.properties?.margin || "0",
        padding: child.properties?.padding || "0",
        backgroundColor: child.properties?.bgColor || "transparent",
        borderRadius: child.properties?.borderRadius || "0.5rem",
        border: child.properties?.border
          ? `1px solid ${child.properties?.borderColor || "rgb(229 231 235)"}`
          : "none",
        boxShadow: "none",
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
            "component-hover",
            props.shadow ? "shadow-medium" : "shadow-soft",
            props.rounded ? "rounded-lg" : "",
            props.border ? "border" : "border-0",
            props.gradient && "gradient-primary text-white",
            props.floating && "floating"
          )}
          style={{
            padding: props.padding || "1rem",
            background: props.gradient ? undefined : props.backgroundColor,
            borderRadius: props.borderRadius || "0.5rem",
            border: props.border
              ? `2px solid ${props.borderColor || "rgb(229 231 235)"}`
              : "none",
            ...themeStyle,
            ...animationStyle,
          }}
        >
          {props.title && (
            <CardTitleBar $onGradient={!!props.gradient}>
              {props.title}
            </CardTitleBar>
          )}
          <LayoutCardContentPad>
            {childComponents.length > 0 ? (
              childComponents.map((child) => renderChildWrapper(child))
            ) : (
              <CardEmptyHint $onGradient={!!props.gradient}>
                卡片内容
              </CardEmptyHint>
            )}
          </LayoutCardContentPad>
        </Card>
      );

    case "grid-layout":
      return (
        <div
          className={cn(
            "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "component-drag-over",
            props.gradient && "gradient-cool",
            props.glass && "glass-morphism",
            `grid-cols-${props.columns || 3}`,
            `gap-${props.gap || 2}`
          )}
          style={{
            gridTemplateRows: props.autoRows
              ? `repeat(auto-fill, ${props.rowHeight || "minmax(100px, auto)"})`
              : "auto",
            width: props.width || "100%",
            height: props.height || "auto",
            borderRadius: props.borderRadius || "0.5rem",
            background: props.gradient ? undefined : props.backgroundColor,
            boxShadow: props.shadow
              ? "0 4px 16px rgba(0, 0, 0, 0.08)"
              : undefined,
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <GridLikeEmpty $dark={!!props.gradient}>
              网格布局
            </GridLikeEmpty>
          )}
        </div>
      );

    case "flex-layout":
      return (
        <div
          className={cn(
            "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "component-drag-over",
            props.gradient && "gradient-warm",
            props.glass && "glass-morphism",
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
            borderRadius: props.borderRadius || "0.5rem",
            background: props.gradient ? undefined : props.backgroundColor,
            boxShadow: props.shadow
              ? "0 4px 16px rgba(0, 0, 0, 0.08)"
              : undefined,
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <GridLikeEmpty $dark={!!props.gradient}>
              弹性布局
            </GridLikeEmpty>
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
          <SplitFirstPanel
            $row={props.direction === "horizontal"}
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
              <SplitPlaceholder>
                左侧/顶部区域
              </SplitPlaceholder>
            )}
          </SplitFirstPanel>
          <SplitRestPanel>
            {childComponents.length > 1 && childComponents[1] ? (
              renderChildWrapper(childComponents[1], {
                height: "100%",
                width: "100%",
              })
            ) : (
              <SplitPlaceholder>
                右侧/底部区域
              </SplitPlaceholder>
            )}
          </SplitRestPanel>
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
            <LayoutTabsList>
              {(
                props.tabs || [
                  { id: "tab-1", label: "标签1" },
                  { id: "tab-2", label: "标签2" },
                ]
              ).map((tab: any) => (
                <LayoutTabTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </LayoutTabTrigger>
              ))}
            </LayoutTabsList>
            {(
              props.tabs || [
                { id: "tab-1", label: "标签1", content: "标签1内容" },
                { id: "tab-2", label: "标签2", content: "标签2内容" },
              ]
            ).map((tab: any, index: number) => (
              <LayoutTabsContent key={tab.id} value={tab.id}>
                {childComponents[index] ? (
                  renderChildWrapper(childComponents[index])
                ) : (
                  <div css={mutedCenter}>
                    {tab.content || `${tab.label}内容`}
                  </div>
                )}
              </LayoutTabsContent>
            ))}
          </Tabs>
        </div>
      );

    case "card-group":
      return (
        <div
          className={cn(
            "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
            isDropTarget && "component-drag-over",
            props.gradient && "gradient-success",
            `grid-cols-${props.columns || 3}`,
            `gap-${props.gap || 2}`
          )}
          style={{
            width: props.width || "100%",
            height: props.height || "auto",
            borderRadius: props.borderRadius || "0.5rem",
            background: props.gradient ? undefined : props.backgroundColor,
            boxShadow: props.shadow
              ? "0 4px 16px rgba(0, 0, 0, 0.08)"
              : undefined,
            ...themeStyle,
            ...animationStyle,
          }}
          data-component-id={component.id}
        >
          {childComponents.length > 0 ? (
            childComponents.map((child, index) => (
              <Card
                key={child.id}
                className={cn(
                  "overflow-hidden component-hover",
                  index % 3 === 0 && "gradient-primary text-white",
                  index % 3 === 1 && "gradient-secondary text-white",
                  index % 3 === 2 && "gradient-success text-white"
                )}
              >
                {renderChildWrapper(child)}
              </Card>
            ))
          ) : (
            <>
              <GradientCardBlock className="gradient-primary">
                <CardPlaceholderLabel>卡片1</CardPlaceholderLabel>
              </GradientCardBlock>
              <GradientCardBlock className="gradient-secondary">
                <CardPlaceholderLabel>卡片2</CardPlaceholderLabel>
              </GradientCardBlock>
              <GradientCardBlock className="gradient-success">
                <CardPlaceholderLabel>卡片3</CardPlaceholderLabel>
              </GradientCardBlock>
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
          <ResponsiveChrome>
            <ResponsiveLabel>响应式容器</ResponsiveLabel>
            <DotsRow>
              <DeviceDot />
              <DeviceDot />
              <DeviceDot />
            </DotsRow>
          </ResponsiveChrome>
          {childComponents.length > 0 ? (
            childComponents.map((child) => renderChildWrapper(child))
          ) : (
            <div css={mutedCenter}>
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
            <div css={mutedCenter}>
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
            <div css={mutedCenter}>行</div>
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
            <div css={mutedCenter}>列</div>
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
              <CollapseTriggerButton
                variant="ghost"
                disabled={isPreviewMode}
              >
                <span css={css({ fontWeight: 500 })}>
                  {props.title || "折叠面板"}
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                />
              </CollapseTriggerButton>
            </CollapsibleTrigger>
            <CollapsePanel>
              {childComponents.length > 0 ? (
                childComponents.map((child) => renderChildWrapper(child))
              ) : (
                <div css={mutedCenter}>
                  折叠面板内容
                </div>
              )}
            </CollapsePanel>
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
            <LayoutTabsList>
              {(
                props.tabs || [
                  { id: "tab-1", label: "标签1" },
                  { id: "tab-2", label: "标签2" },
                ]
              ).map((tab: any) => (
                <LayoutTabTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </LayoutTabTrigger>
              ))}
            </LayoutTabsList>
            {(
              props.tabs || [
                { id: "tab-1", label: "标签1", content: "标签1内容" },
                { id: "tab-2", label: "标签2", content: "标签2内容" },
              ]
            ).map((tab: any, index: number) => (
              <LayoutTabsContent key={tab.id} value={tab.id}>
                {childComponents[index] ? (
                  renderChildWrapper(childComponents[index])
                ) : (
                  <div css={mutedCenter}>
                    {tab.content || `${tab.label}内容`}
                  </div>
                )}
              </LayoutTabsContent>
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
            <DialogContentSized>
              <DialogHeader>
                <DialogTitle>{props.title || "模态框标题"}</DialogTitle>
                {props.description && (
                  <DialogDescription>{props.description}</DialogDescription>
                )}
              </DialogHeader>
              <DialogSection>
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div css={mutedCenter}>
                    模态框内容
                  </div>
                )}
              </DialogSection>
            </DialogContentSized>
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
              <DrawerSection>
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div css={mutedCenter}>
                    抽屉内容
                  </div>
                )}
              </DrawerSection>
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
            <PopoverWide>
              <PopoverStack>
                <PopoverTitle>
                  {props.title || "弹出框标题"}
                </PopoverTitle>
                {props.description && (
                  <PopoverDesc>
                    {props.description}
                  </PopoverDesc>
                )}
              </PopoverStack>
              <PopoverChildrenWrap>
                {childComponents.length > 0 ? (
                  childComponents.map((child) => renderChildWrapper(child))
                ) : (
                  <div css={mutedCenter}>
                    弹出框内容
                  </div>
                )}
              </PopoverChildrenWrap>
            </PopoverWide>
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
        <div css={fallbackBox} style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
