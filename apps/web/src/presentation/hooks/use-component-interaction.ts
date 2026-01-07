import { useState, useEffect, useRef, useCallback } from "react";
import type { Component } from "@/domain/component";
import { ComponentManagementService } from "@/application/services/component-management.service";
import { useComponentStore } from "@/infrastructure/state-management/stores";

interface UseComponentInteractionProps {
  components: Component[];
  onUpdateComponents: (components: Component[]) => void;
  onSelectComponent: (component: Component | null) => void;
  isPreviewMode: boolean;
  snapToGrid: boolean;
}

export function useComponentInteraction({
  components,
  onUpdateComponents,
  onSelectComponent,
  isPreviewMode,
  snapToGrid,
}: UseComponentInteractionProps) {
  // 从 store 获取状态
  const {
    selectedComponentId,
    isDragging,
    dragOffset,
    selectComponent,
    setDragging,
    setDragOffset,
  } = useComponentStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  // 选择组件
  const handleSelectComponent = useCallback(
    (component: Component) => {
      if (isPreviewMode) return;

      selectComponent(component);
      onSelectComponent(component);
    },
    [isPreviewMode, onSelectComponent, selectComponent]
  );

  // 清除选择
  const handleClearSelection = useCallback(() => {
    selectComponent(null);
    onSelectComponent(null);
  }, [onSelectComponent, selectComponent]);

  // 鼠标按下开始拖动
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, component: Component) => {
      if (isPreviewMode) return;

      e.stopPropagation();
      selectComponent(component);
      onSelectComponent(component);

      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setDragging(true);
    },
    [
      isPreviewMode,
      onSelectComponent,
      selectComponent,
      setDragOffset,
      setDragging,
    ]
  );

  // 鼠标移动拖拽
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedComponentId || isPreviewMode) return;

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      let position = {
        x: e.clientX - canvasRect.left - dragOffset.x,
        y: e.clientY - canvasRect.top - dragOffset.y,
      };

      // 应用网格对齐
      if (snapToGrid) {
        position = ComponentManagementService.snapToGrid(position);
      }

      // 更新组件位置
      const updatedComponents =
        ComponentManagementService.updateComponentPosition(
          selectedComponentId,
          position,
          components
        );

      onUpdateComponents(updatedComponents);
    },
    [
      isDragging,
      selectedComponentId,
      isPreviewMode,
      dragOffset,
      snapToGrid,
      components,
      onUpdateComponents,
    ]
  );

  // 鼠标抬起结束拖拽
  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  // 键盘操作
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedComponentId || isPreviewMode) return;

      const step = snapToGrid ? 20 : 1;
      let deltaX = 0;
      let deltaY = 0;

      switch (e.key) {
        case "ArrowUp":
          deltaY = -step;
          break;
        case "ArrowDown":
          deltaY = step;
          break;
        case "ArrowLeft":
          deltaX = -step;
          break;
        case "ArrowRight":
          deltaX = step;
          break;
        default:
          return;
      }

      if (deltaX !== 0 || deltaY !== 0) {
        e.preventDefault();

        const updatedComponents = components.map((component) => {
          if (component.id === selectedComponentId) {
            return {
              ...component,
              position: {
                x: (component.position?.x || 0) + deltaX,
                y: (component.position?.y || 0) + deltaY,
              },
            };
          }
          return component;
        });

        onUpdateComponents(updatedComponents);
      }
    },
    [
      selectedComponentId,
      isPreviewMode,
      snapToGrid,
      components,
      onUpdateComponents,
    ]
  );

  // 删除选中的组件
  const handleDeleteSelected = useCallback(() => {
    if (!selectedComponentId) return;

    const newComponents = ComponentManagementService.deleteComponentAndChildren(
      selectedComponentId,
      components
    );
    onUpdateComponents(newComponents);
    selectComponent(null);
    onSelectComponent(null);
  }, [
    selectedComponentId,
    components,
    onUpdateComponents,
    onSelectComponent,
    selectComponent,
  ]);

  // 清空所有组件
  const handleClear = useCallback(() => {
    onUpdateComponents([]);
    selectComponent(null);
    onSelectComponent(null);
  }, [onUpdateComponents, onSelectComponent, selectComponent]);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewMode) return;

      // Delete: Delete or Backspace
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedComponentId
      ) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponentId, isPreviewMode, handleDeleteSelected]);

  // 预览模式变化时清除选择
  useEffect(() => {
    if (isPreviewMode) {
      selectComponent(null);
    }
  }, [isPreviewMode, selectComponent]);

  return {
    selectedId: selectedComponentId,
    isDragging,
    canvasRef,
    handleSelectComponent,
    handleClearSelection,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleDeleteSelected,
    handleClear,
  };
}
