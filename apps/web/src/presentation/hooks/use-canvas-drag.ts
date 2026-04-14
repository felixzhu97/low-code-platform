import { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import type { Component } from "@/domain/component";
import { ComponentManagementService } from "@/application/services/component-management.service";
import { useComponentStore } from "@/infrastructure/state-management/stores";

interface UseCanvasDragProps {
  components: Component[];
  onUpdateComponents: (components: Component[]) => void;
  isPreviewMode: boolean;
  snapToGrid: boolean;
  theme?: any;
  addToHistory?: (components: Component[]) => void;
}

export function useCanvasDrag({
  components,
  onUpdateComponents,
  isPreviewMode,
  snapToGrid,
  theme,
  addToHistory,
}: UseCanvasDragProps) {
  const { dropTargetId, setDropTarget, addComponent } = useComponentStore();

  // 拖拽Drop处理
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "COMPONENT",
      drop: (item: any, monitor) => {
        if (isPreviewMode) return;

        const offset = monitor.getClientOffset();
        const canvasRect = document
          .getElementById("canvas-area")
          ?.getBoundingClientRect();

        if (offset && canvasRect) {
          let position = {
            x: offset.x - canvasRect.left,
            y: offset.y - canvasRect.top,
          };

          // 应用网格对齐
          if (snapToGrid) {
            position = ComponentManagementService.snapToGrid(position);
          }

          let newComponent: Component | null = null;

          // 如果有目标容器，则将组件添加到容器中
          if (dropTargetId) {
            const targetComponent = components.find(
              (comp) => comp.id === dropTargetId
            );
            if (
              targetComponent &&
              ComponentManagementService.isContainer(targetComponent.type)
            ) {
              newComponent = ComponentManagementService.createComponent(
                item.type,
                { x: 0, y: 0 }, // 相对于容器的位置
                dropTargetId,
                theme
              );

              addComponent(newComponent);
              setDropTarget(null);
            }
          }

          // 否则添加到画布根级别
          if (!newComponent) {
            newComponent = ComponentManagementService.createComponent(
              item.type,
              position,
              null,
              theme
            );

            addComponent(newComponent);
          }

          // 创建组件后保存历史记录
          if (newComponent && addToHistory) {
            const updatedComponents = [...components, newComponent];
            addToHistory(updatedComponents);
          }

          return newComponent;
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item: any, monitor) => {
        // 清除之前的目标
        setDropTarget(null);

        // 获取当前鼠标位置
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        // 查找鼠标下方的组件
        const elementsAtPoint = document.elementsFromPoint(
          clientOffset.x,
          clientOffset.y
        );

        // 查找第一个可作为容器的组件
        for (const element of elementsAtPoint) {
          const componentId = element.getAttribute("data-component-id");
          if (componentId) {
            const component = components.find(
              (comp) => comp.id === componentId
            );
            if (
              component &&
              ComponentManagementService.isContainer(component.type)
            ) {
              setDropTarget(componentId);
              break;
            }
          }
        }
      },
    }),
    [
      components,
      snapToGrid,
      isPreviewMode,
      dropTargetId,
      addComponent,
      theme,
      setDropTarget,
    ]
  );

  return {
    drop,
    isOver,
    dropTargetId,
  };
}
