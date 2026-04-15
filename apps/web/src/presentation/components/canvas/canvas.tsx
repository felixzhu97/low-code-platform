"use client";

import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
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
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ComponentManagementService } from "@/application/services/component-management.service";
import { useCanvasDrag } from "@/presentation";
import { useComponentInteraction } from "@/presentation";
import { ComponentRenderer } from "@/presentation";
import { useAllStores } from "@/presentation/hooks";
import type { Component } from "@/domain/component/entities/component.entity";

const CanvasRoot = styled.div`
  flex: 1;
  background-color: #f9fafb;
`;

const ToolbarBar = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0 1rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: box-shadow 200ms;
`;

const ToolbarTitle = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const ToolRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledToolbar = styled(Toolbar)`
  border-width: 0;
  box-shadow: none;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
`;

const StyledToolbarGroup = styled(ToolbarGroup)`
  gap: 0.75rem;
`;

const StyledLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LabelText = styled.span`
  @media (max-width: 639px) {
    display: none;
  }
`;

const CanvasScroll = styled(ScrollArea)`
  height: ${(p) =>
    p.preview ? "calc(100vh - 3.5rem)" : "calc(100vh - 7.5rem)"};
`;

const CanvasArea = styled.div`
  position: relative;
  z-index: 0;
  isolation: isolate;
  min-height: 0;
  padding: 1rem;
`;

const DeviceBanner = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem 0;
`;

const DevicePill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: hsl(var(--background));
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

const EmptyDropZone = styled.div`
  display: flex;
  height: 100%;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 2px dashed hsl(var(--border));
`;

const EmptyDropText = styled.div`
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

type CanvasProps = Record<string, never>;

export const Canvas = React.memo<CanvasProps>(() => {
  const {
    components,
    updateComponents,
    selectComponent,
    clearAllComponents,
    isPreviewMode,
    showGrid,
    snapToGrid,
    viewportWidth,
    activeDevice,
    theme,
    toggleGrid,
    toggleSnapToGrid,
    dataSources,
    addToHistory,
  } = useAllStores();

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
    onUpdateComponents: (newComponents) => {
      updateComponents(newComponents);
    },
    onSelectComponent: selectComponent,
    isPreviewMode,
    snapToGrid,
    addToHistory,
  });

  // 清空画布并记录历史
  const handleClearWithHistory = useCallback(() => {
    clearAllComponents();
    if (addToHistory) {
      addToHistory([]);
    }
    selectComponent(null);
  }, [clearAllComponents, addToHistory, selectComponent]);

  const { drop, isOver, dropTargetId } = useCanvasDrag({
    components,
    onUpdateComponents: (newComponents) => {
      updateComponents(newComponents);
    },
    isPreviewMode,
    snapToGrid,
    theme,
    addToHistory, // 传递历史记录方法
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

  const rootComponentsSorted = useMemo(
    () =>
      [...ComponentManagementService.getRootComponents(components)].sort(
        (a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0)
      ),
    [components]
  );

  const gridBackground =
    showGrid && !isPreviewMode
      ? "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)"
      : "none";

  const canvasBackgroundColor =
    isOver && !isPreviewMode
      ? "rgb(239 246 255)"
      : theme?.backgroundColor || "#ffffff";

  return (
    <CanvasRoot>
      {!isPreviewMode && (
        <TooltipProvider>
          <ToolbarBar>
            <ToolbarTitle>画布</ToolbarTitle>
            <StyledToolbar>
              <StyledToolbarGroup aria-label="画布工具">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToolRow>
                      <StyledLabel htmlFor="show-grid">
                        <Grid
                          size={16}
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        />
                        <LabelText>显示网格</LabelText>
                      </StyledLabel>
                      <Switch
                        id="show-grid"
                        checked={showGrid}
                        onCheckedChange={toggleGrid}
                        aria-label="切换显示网格"
                      />
                    </ToolRow>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>显示/隐藏画布网格辅助线</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToolRow>
                      <StyledLabel htmlFor="snap-grid">
                        <Grid3x3
                          size={16}
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        />
                        <LabelText>对齐网格</LabelText>
                      </StyledLabel>
                      <Switch
                        id="snap-grid"
                        checked={snapToGrid}
                        onCheckedChange={toggleSnapToGrid}
                        aria-label="切换对齐网格"
                      />
                    </ToolRow>
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
                      onClick={handleClearWithHistory}
                      disabled={components.length === 0}
                      aria-label="清空画布"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>清空画布上的所有组件</p>
                  </TooltipContent>
                </Tooltip>
              </StyledToolbarGroup>
            </StyledToolbar>
          </ToolbarBar>
        </TooltipProvider>
      )}
      <CanvasScroll preview={isPreviewMode}>
        <CanvasArea
          id="canvas-area"
          ref={setRefs}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{
            backgroundSize: showGrid && !isPreviewMode ? "20px 20px" : undefined,
            backgroundImage: gridBackground,
            backgroundColor: canvasBackgroundColor,
            color: theme?.textColor || "#000000",
            fontFamily: theme?.fontFamily || "system-ui, sans-serif",
            width: isPreviewMode ? `${viewportWidth}px` : "100%",
            cursor: isDragging ? "grabbing" : "default",
          }}
          onClick={handleClearSelection}
        >
          {activeDevice !== "desktop" && isPreviewMode && (
            <DeviceBanner>
              <DevicePill>
                {activeDevice === "mobile" ? (
                  <Smartphone size={12} />
                ) : (
                  <Tablet size={12} />
                )}
                <span>
                  {activeDevice === "mobile" ? "移动设备" : "平板设备"} (
                  {viewportWidth}px)
                </span>
              </DevicePill>
            </DeviceBanner>
          )}

          {rootComponentsSorted.length === 0 ? (
            <EmptyDropZone>
              <EmptyDropText>
                <p>将组件拖拽到此处或选择一个模板开始</p>
              </EmptyDropText>
            </EmptyDropZone>
          ) : (
            rootComponentsSorted.map((component) => renderComponent(component))
          )}
        </CanvasArea>
      </CanvasScroll>
    </CanvasRoot>
  );
});

Canvas.displayName = "Canvas";
