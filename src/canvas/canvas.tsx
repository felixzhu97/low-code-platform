"use client";

import React, { useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComponentManagementService } from "@/component/component-management.service";
import { useCanvasDrag } from "@/canvas/use-canvas-drag";
import { useComponentInteraction } from "@/component/use-component-interaction";
import { ComponentRenderer } from "@/component/component-renderer";
import { useComponentStore } from "@/component/component.store";
import { useCanvasStore } from "@/canvas/canvas.store";
import { useThemeStore } from "@/theme/theme.store";
import { useDataStore } from "@/data/data.store";
import type { Component } from "@/component/types";

const updateComponentsInStore = (newComponents: Component[]) => {
  useComponentStore.getState().updateComponents(newComponents);
};

export const Canvas = React.memo(function Canvas() {
  const components = useComponentStore((s) => s.components);
  const selectComponent = useComponentStore((s) => s.selectComponent);
  const clearAllComponents = useComponentStore((s) => s.clearAllComponents);

  const isPreviewMode = useCanvasStore((s) => s.isPreviewMode);
  const showGrid = useCanvasStore((s) => s.showGrid);
  const snapToGrid = useCanvasStore((s) => s.snapToGrid);
  const viewportWidth = useCanvasStore((s) => s.viewportWidth);
  const activeDevice = useCanvasStore((s) => s.activeDevice);
  const toggleGrid = useCanvasStore((s) => s.toggleGrid);
  const toggleSnapToGrid = useCanvasStore((s) => s.toggleSnapToGrid);

  const theme = useThemeStore((s) => s.theme);
  const dataSources = useDataStore((s) => s.dataSources);

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
  } = useComponentInteraction({
    components,
    onUpdateComponents: updateComponentsInStore,
    onSelectComponent: selectComponent,
    isPreviewMode,
    snapToGrid,
  });

  const { drop, isOver, dropTargetId } = useCanvasDrag({
    components,
    onUpdateComponents: updateComponentsInStore,
    isPreviewMode,
    snapToGrid,
    theme,
  });

  const getComponentData = useCallback(
    (component: Component) => {
      return ComponentManagementService.getComponentData(
        component,
        dataSources
      );
    },
    [dataSources]
  );

  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      canvasRef.current = element;
      drop(element);
    },
    [drop, canvasRef]
  );

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

  const rootComponents =
    ComponentManagementService.getRootComponents(components);

  return (
    <div className="flex-1 bg-gray-50">
      {!isPreviewMode && (
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
          <span className="font-medium">画布</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="show-grid" className="text-xs">
                显示网格
              </Label>
              <Switch
                id="show-grid"
                checked={showGrid}
                onCheckedChange={toggleGrid}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="snap-grid" className="text-xs">
                对齐网格
              </Label>
              <Switch
                id="snap-grid"
                checked={snapToGrid}
                onCheckedChange={toggleSnapToGrid}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={clearAllComponents}
              disabled={components.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
