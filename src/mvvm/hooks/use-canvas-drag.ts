import { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import type { Component } from "@/mvvm/models/types";
import { ComponentManagementService } from "@/mvvm/viewmodels/component-management.service";

interface UseCanvasDragProps {
  components: Component[];
  onUpdateComponents: (components: Component[]) => void;
  isPreviewMode: boolean;
  snapToGrid: boolean;
  theme?: any;
}

export function useCanvasDrag({
  components,
  onUpdateComponents,
  isPreviewMode,
  snapToGrid,
  theme,
}: UseCanvasDragProps) {
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

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

          // 如果有目标容器，则将组件添加到容器中
          if (dropTargetId) {
            const targetComponent = components.find(
              (comp) => comp.id === dropTargetId
            );
            if (
              targetComponent &&
              ComponentManagementService.isContainer(targetComponent.type)
            ) {
              const newComponent = ComponentManagementService.createComponent(
                item.type,
                { x: 0, y: 0 }, // 相对于容器的位置
                dropTargetId,
                theme
              );

              onUpdateComponents([...components, newComponent]);
              setDropTargetId(null);
              return newComponent;
            }
          }

          // 否则添加到画布根级别
          const newComponent = ComponentManagementService.createComponent(
            item.type,
            position,
            null,
            theme
          );

          onUpdateComponents([...components, newComponent]);
          return newComponent;
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item: any, monitor) => {
        // 清除之前的目标
        setDropTargetId(null);

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
              setDropTargetId(componentId);
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
      onUpdateComponents,
      theme,
    ]
  );

  return {
    drop,
    isOver,
    dropTargetId,
  };
}
