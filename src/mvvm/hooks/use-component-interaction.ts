import { useState, useEffect, useRef, useCallback } from "react";
import type { Component } from "@/mvvm/models/types";
import { ComponentManagementService } from "@/mvvm/viewmodels/component-management.service";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // 选择组件
  const handleSelectComponent = useCallback(
    (component: Component) => {
      if (isPreviewMode) return;

      setSelectedId(component.id);
      onSelectComponent(component);
    },
    [isPreviewMode, onSelectComponent]
  );

  // 清除选择
  const handleClearSelection = useCallback(() => {
    setSelectedId(null);
    onSelectComponent(null);
  }, [onSelectComponent]);

  // 鼠标按下开始拖动
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, component: Component) => {
      if (isPreviewMode) return;

      e.stopPropagation();
      setSelectedId(component.id);
      onSelectComponent(component);

      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setIsDragging(true);
    },
    [isPreviewMode, onSelectComponent]
  );

  // 鼠标移动拖拽
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedId || isPreviewMode) return;

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
          selectedId,
          position,
          components
        );

      onUpdateComponents(updatedComponents);
    },
    [
      isDragging,
      selectedId,
      isPreviewMode,
      dragOffset,
      snapToGrid,
      components,
      onUpdateComponents,
    ]
  );

  // 鼠标抬起结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 键盘操作
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedId || isPreviewMode) return;

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
          if (component.id === selectedId) {
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
    [selectedId, isPreviewMode, snapToGrid, components, onUpdateComponents]
  );

  // 删除选中的组件
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;

    const newComponents = ComponentManagementService.deleteComponentAndChildren(
      selectedId,
      components
    );
    onUpdateComponents(newComponents);
    setSelectedId(null);
    onSelectComponent(null);
  }, [selectedId, components, onUpdateComponents, onSelectComponent]);

  // 清空所有组件
  const handleClear = useCallback(() => {
    onUpdateComponents([]);
    setSelectedId(null);
    onSelectComponent(null);
  }, [onUpdateComponents, onSelectComponent]);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewMode) return;

      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, isPreviewMode, handleDeleteSelected]);

  // 预览模式变化时清除选择
  useEffect(() => {
    if (isPreviewMode) {
      setSelectedId(null);
    }
  }, [isPreviewMode]);

  return {
    selectedId,
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
