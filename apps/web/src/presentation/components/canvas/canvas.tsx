"use client";

import React from "react";
import { useCallback } from "react";
import { ScrollArea } from "@/presentation";
import { Button } from "../ui/button";
import {
  Toolbar,
  ToolbarGroup,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import { Trash2, Smartphone, Tablet, Grid, Grid3x3 } from "lucide-react";
import { cn } from "@/application/services/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ComponentManagementService } from "@/application/services/component-management.service";
import { useCanvasDrag } from "@/presentation";
import { useComponentInteraction } from "@/presentation";
import { ComponentRenderer } from "@/presentation";
import { useAllStores, useComponentState } from "@/presentation/hooks";
import { useComponentStore } from "@/infrastructure/state-management/stores";
import type { Component } from "@/domain/component";

type CanvasProps = {
  // 移除 props，现在从 store 获取状态
};

export const Canvas = React.memo<CanvasProps>(() => {
  // 从 stores 获取状态
  const {
    // 组件状态
    components,
    selectedComponent,
    selectComponent,
    clearAllComponents,
    // 画布状态
    isPreviewMode,
    showGrid,
    snapToGrid,
    viewportWidth,
    activeDevice,
    theme,
    toggleGrid,
    toggleSnapToGrid,
    // 数据状态
    dataSources,
  } = useAllStores();

  // 使用自定义Hook处理组件交互
  const {
    selectedId,
    isDragging,
    canvasRef,
    handleSelectComponent,
    handleClearSelection,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleClear,
  } = useComponentInteraction({
    components,
    onUpdateComponents: (newComponents) => {
      // 直接更新 store
      useComponentStore.getState().updateComponents(newComponents);
    },
    onSelectComponent: selectComponent,
    isPreviewMode,
    snapToGrid,
  });

  // 使用自定义Hook处理拖拽
  const { drop, isOver, dropTargetId } = useCanvasDrag({
    components,
    onUpdateComponents: (newComponents) => {
      // 直接更新 store
      useComponentStore.getState().updateComponents(newComponents);
    },
    isPreviewMode,
    snapToGrid,
    theme,
  });

  // 获取组件绑定的数据源
  const getComponentData = useCallback(
    (component: Component) => {
      return ComponentManagementService.getComponentData(
        component,
        dataSources
      );
    },
    [dataSources]
  );

  // 创建ref合并函数
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      canvasRef.current = element;
      drop(element);
    },
    [drop, canvasRef]
  );

  // 递归渲染组件
  const renderComponent = useCallback(
    (component: Component, parentComponent: Component | null = null) => {
      const componentData = getComponentData(component);

      return (
        <ComponentRenderer
          key={component.id}
          component={component}
          parentComponent={parentComponent}
          components={components}
          theme={theme}
          isPreviewMode={isPreviewMode}
          selectedId={selectedId}
          dropTargetId={dropTargetId}
          onSelectComponent={handleSelectComponent}
          onMouseDown={handleMouseDown}
          componentData={componentData}
        />
      );
    },
    [
      components,
      theme,
      isPreviewMode,
      selectedId,
      dropTargetId,
      handleSelectComponent,
      handleMouseDown,
      getComponentData,
    ]
  );

  // 获取根级组件（没有父组件的组件）
  const rootComponents =
    ComponentManagementService.getRootComponents(components);

  return (
    <div className="flex-1 bg-gray-50">
      {!isPreviewMode && (
        <TooltipProvider>
          <div className="flex h-12 items-center justify-between border-b bg-background px-4 shadow-sm transition-shadow duration-200">
            <span className="font-semibold text-sm">画布</span>
            <Toolbar className="border-0 shadow-none bg-transparent px-0">
              <ToolbarGroup aria-label="画布工具" className="gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="show-grid"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <Grid className="h-4 w-4 text-muted-foreground" />
                        <span className="hidden sm:inline">显示网格</span>
                      </Label>
                      <Switch
                        id="show-grid"
                        checked={showGrid}
                        onCheckedChange={toggleGrid}
                        aria-label="切换显示网格"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>显示/隐藏画布网格辅助线</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="snap-grid"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                        <span className="hidden sm:inline">对齐网格</span>
                      </Label>
                      <Switch
                        id="snap-grid"
                        checked={snapToGrid}
                        onCheckedChange={toggleSnapToGrid}
                        aria-label="切换对齐网格"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>启用/禁用组件对齐到网格</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearAllComponents}
                      disabled={components.length === 0}
                      aria-label="清空画布"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>清空画布上的所有组件</p>
                  </TooltipContent>
                </Tooltip>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </TooltipProvider>
      )}
      <ScrollArea
        className={
          isPreviewMode ? "h-[calc(100vh-3.5rem)]" : "h-[calc(100vh-7.5rem)]"
        }
      >
        <div
          id="canvas-area"
          ref={setRefs}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={cn(
            "relative min-h-[calc(100vh-7.5rem)] p-4",
            isOver && !isPreviewMode && "bg-blue-50",
            showGrid && !isPreviewMode && "bg-grid-pattern"
          )}
          style={{
            backgroundSize: "20px 20px",
            backgroundImage:
              showGrid && !isPreviewMode
                ? "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)"
                : "none",
            backgroundColor: theme?.backgroundColor || "#ffffff",
            color: theme?.textColor || "#000000",
            fontFamily: theme?.fontFamily || "system-ui, sans-serif",
            width: isPreviewMode ? `${viewportWidth}px` : "100%",
            cursor: isDragging ? "grabbing" : "default",
          }}
          onClick={handleClearSelection}
        >
          {activeDevice !== "desktop" && isPreviewMode && (
            <div className="absolute left-0 right-0 top-0 flex items-center justify-center bg-muted/50 py-2">
              <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs shadow-sm">
                {activeDevice === "mobile" ? (
                  <Smartphone className="h-3 w-3" />
                ) : (
                  <Tablet className="h-3 w-3" />
                )}
                <span>
                  {activeDevice === "mobile" ? "移动设备" : "平板设备"} (
                  {viewportWidth}px)
                </span>
              </div>
            </div>
          )}

          {rootComponents.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <p>将组件拖拽到此处或选择一个模板开始</p>
              </div>
            </div>
          ) : (
            rootComponents.map((component) => renderComponent(component))
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

Canvas.displayName = "Canvas";
