import type React from "react";
import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import { ComponentManagementService } from "@/application/services/component-management.service";
import { BasicComponentRenderer } from "./basic-component-renderer";
import { ChartComponentRenderer } from "./chart-component-renderer";
import { FormComponentRenderer } from "./form-component-renderer";
import { DataComponentRenderer } from "./data-component-renderer";
import { LayoutComponentRenderer } from "./layout-component-renderer";
import { cn } from "@/application/services/utils";

interface ComponentRendererProps {
  component: Component;
  parentComponent?: Component | null;
  components: Component[];
  theme?: ThemeConfig;
  isPreviewMode: boolean;
  selectedId: string | null;
  dropTargetId: string | null;
  onSelectComponent: (component: Component) => void;
  onMouseDown: (e: React.MouseEvent, component: Component) => void;
  componentData: any;
}

export function ComponentRenderer({
  component,
  parentComponent,
  components,
  theme,
  isPreviewMode,
  selectedId,
  dropTargetId,
  onSelectComponent,
  onMouseDown,
  componentData,
}: ComponentRendererProps) {
  const isSelected = component.id === selectedId && !isPreviewMode;
  const isDropTarget = component.id === dropTargetId && !isPreviewMode;
  const props = component.properties || {};

  // 如果组件被设置为不可见，则不渲染（编辑态与预览态均生效）
  if (props.visible === false) {
    return null;
  }

  // 获取组件的子组件
  const childComponents = ComponentManagementService.getChildComponents(
    component.id,
    components
  );

  // 应用动画样式
  let animationStyle = {};
  const animation = props.animation;
  if (animation && !isPreviewMode) {
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

  // 渲染组件内容
  const renderComponentContent = () => {
    // 基础组件和高级组件
    if (
      [
        "text",
        "button",
        "image",
        "divider",
        "carousel",
        "steps",
        "progress",
        "avatar",
        "badge",
        "tag",
        "timeline",
        "rating",
      ].includes(component.type)
    ) {
      return (
        <BasicComponentRenderer
          component={component}
          props={props}
          theme={theme}
          animationStyle={animationStyle}
          themeStyle={themeStyle}
          childComponents={childComponents}
          components={components}
          isPreviewMode={isPreviewMode}
          selectedId={selectedId}
          dropTargetId={dropTargetId}
          onSelectComponent={onSelectComponent}
          onMouseDown={onMouseDown}
        />
      );
    }

    // 图表组件
    if (component.type.includes("chart") || component.type === "gauge") {
      return (
        <ChartComponentRenderer
          component={component}
          props={props}
          componentData={componentData}
          animationStyle={animationStyle}
        />
      );
    }

    // 表单组件
    if (
      [
        "input",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "switch",
        "slider",
        "date-picker",
        "time-picker",
        "file-upload",
      ].includes(component.type)
    ) {
      return (
        <FormComponentRenderer
          component={component}
          props={props}
          themeStyle={themeStyle}
          animationStyle={animationStyle}
        />
      );
    }

    // 数据组件
    if (
      component.type.startsWith("data-") ||
      ["pagination", "tree"].includes(component.type)
    ) {
      return (
        <DataComponentRenderer
          component={component}
          props={props}
          componentData={componentData}
          animationStyle={animationStyle}
        />
      );
    }

    // 布局组件
    if (ComponentManagementService.isContainer(component.type)) {
      return (
        <LayoutComponentRenderer
          component={component}
          props={props}
          childComponents={childComponents}
          components={components}
          theme={theme}
          isPreviewMode={isPreviewMode}
          selectedId={selectedId}
          dropTargetId={dropTargetId}
          onSelectComponent={onSelectComponent}
          onMouseDown={onMouseDown}
          isDropTarget={isDropTarget}
          themeStyle={themeStyle}
          animationStyle={animationStyle}
        />
      );
    }

    // 默认渲染
    return (
      <div className="rounded border p-2">
        {component.name || component.type}
      </div>
    );
  };

  // 如果是根级组件（没有父组件）
  if (!parentComponent) {
    return (
      <div
        key={component.id}
        className={cn(
          "absolute",
          !isPreviewMode && "cursor-grab component-hover",
          selectedId === component.id && "cursor-grabbing",
          isDropTarget && "component-drag-over"
        )}
        style={{
          left: `${component.position?.x || 0}px`,
          top: `${component.position?.y || 0}px`,
          width: props.width || "auto",
          height: props.height || "auto",
          margin: props.margin || "0",
          padding: props.padding || "0",
          backgroundColor: props.bgColor || "transparent",
          zIndex: 1,
          borderRadius: props.borderRadius || "0.5rem",
          border: props.border
            ? `1px solid ${props.borderColor || "rgb(229 231 235)"}`
            : "none",
          boxShadow: "none",
          ...animationStyle,
        }}
        onMouseDown={(e) => onMouseDown(e, component)}
        onClick={(e) => {
          if (isPreviewMode) return;
          e.stopPropagation();
          onSelectComponent(component);
        }}
        data-component-id={component.id}
      >
        {renderComponentContent()}
      </div>
    );
  }

  // 如果是子组件
  return renderComponentContent();
}
