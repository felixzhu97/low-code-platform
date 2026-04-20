"use client";

import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
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
import { useCanvasDrag, useStateManagement } from "@/presentation";
import { useComponentInteraction } from "@/presentation";
import { ComponentRenderer } from "@/presentation";
import { useAllStores } from "@/presentation/hooks";
import type { Component } from "@/domain/component/entities/component.entity";
import { useComponentState, useCanvasState } from "@/presentation/hooks/use-adapters";
import { useDataStore, useHistoryStore, useThemeStore } from "@/shared/stores";

const CanvasRoot = styled.div`
  flex: 1;
  min-height: 0;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  flex-shrink: 0;
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

const CanvasScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

const CanvasArea = styled.div<{ $minHeight: number }>`
  position: relative;
  z-index: 0;
  isolation: isolate;
  min-height: ${(p) => p.$minHeight}px;
  padding: 1rem;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  flex-shrink: 0;

  & > * {
    max-width: 100%;
    box-sizing: border-box;
  }
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

// 计算所有根级组件的边界
function calculateCanvasBounds(components: Component[]): number {
  const rootComponents = ComponentManagementService.getRootComponents(components);
  if (rootComponents.length === 0) return 0;

  let maxBottom = 0;
  for (const component of rootComponents) {
    const y = component.position?.y ?? 0;
    const height = component.properties?.height;

    let componentBottom = y;
    if (height && typeof height === "number") {
      componentBottom = y + height;
    } else {
      // 对于没有明确高度的组件，估算一个最小高度
      componentBottom = y + 50;
    }

    if (componentBottom > maxBottom) {
      maxBottom = componentBottom;
    }
  }

  // 加上底部 padding (1rem = 16px, 转换为px)
  return maxBottom + 16;
}

export const Canvas = React.memo<CanvasProps>(() => {
  const { components, updateComponents, selectComponent } = useComponentState();
  const { toggleGrid, toggleSnapToGrid, showGrid, snapToGrid, isPreviewMode, viewportWidth, activeDevice } = useCanvasState();  
  const { addToHistory } = useHistoryStore();
  const { theme } = useThemeStore()
  const { dataSources } = useDataStore()
  const { setComponents } = useStateManagement();


  // 画布区域 DOM 引用
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // 计算的画布最小高度
  const [canvasMinHeight, setCanvasMinHeight] = useState(0);

  // 计算画布边界
  useEffect(() => {
    if (isPreviewMode) {
      // 预览模式下使用视口宽度对应的内容高度
      setCanvasMinHeight(0);
      return;
    }

    // 编辑模式下根据组件内容计算最小高度
    const bounds = calculateCanvasBounds(components);
    // 最小高度为屏幕高度减去工具栏和画布头部高度（约 7.5rem = 120px）
    const screenHeight = window.innerHeight - 120;
    const minHeight = Math.max(bounds, screenHeight);
    setCanvasMinHeight(minHeight);
  }, [components, isPreviewMode]);

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
    setComponents([]);
    if (addToHistory) {
      addToHistory([]);
    }
    selectComponent(null);
  }, [setComponents, addToHistory, selectComponent]);

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
      canvasAreaRef.current = element;
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

  const rootComponents = useMemo(
    () => ComponentManagementService.getRootComponents(components),
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
      <CanvasScroll>
        <CanvasArea
          id="canvas-area"
          $minHeight={canvasMinHeight}
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

          {rootComponents.length === 0 ? (
            <EmptyDropZone>
              <EmptyDropText>
                <p>将组件拖拽到此处或选择一个模板开始</p>
              </EmptyDropText>
            </EmptyDropZone>
          ) : (
            rootComponents.map((component) => renderComponent(component))
          )}
        </CanvasArea>
      </CanvasScroll>
    </CanvasRoot>
  );
});

Canvas.displayName = "Canvas";
