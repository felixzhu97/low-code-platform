import { useCallback } from "react";
import { useDrop } from "react-dnd";
import type { Component } from "@/component/types";
import { ComponentManagementService } from "@/component/component-management.service";
import { useComponentStore } from "@/lib/stores";

interface UseCanvasDragProps {
  components: Component[];
  onUpdateComponents: (components: Component[]) => void;
  isPreviewMode: boolean;
  snapToGrid: boolean;
  theme?: unknown;
}

export function useCanvasDrag({
  components,
  onUpdateComponents: _onUpdateComponents,
  isPreviewMode,
  snapToGrid,
  theme,
}: UseCanvasDragProps) {
  const dropTargetId = useComponentStore((s) => s.dropTargetId);
  const setDropTarget = useComponentStore((s) => s.setDropTarget);
  const addComponent = useComponentStore((s) => s.addComponent);

  const resolveDropTargetId = useCallback(
    (clientX: number, clientY: number): string | null => {
      const elementsAtPoint = document.elementsFromPoint(clientX, clientY);

      for (const element of elementsAtPoint) {
        const componentId = element.getAttribute("data-component-id");
        if (!componentId) continue;

        const component = components.find((comp) => comp.id === componentId);
        if (
          component &&
          ComponentManagementService.isContainer(component.type)
        ) {
          return componentId;
        }
      }

      return null;
    },
    [components]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "COMPONENT",
      drop: (item: { type: string }, monitor) => {
        if (isPreviewMode) return;

        const offset = monitor.getClientOffset();
        const canvasRect = document
          .getElementById("canvas-area")
          ?.getBoundingClientRect();

        if (!offset || !canvasRect) return;

        let position = {
          x: offset.x - canvasRect.left,
          y: offset.y - canvasRect.top,
        };

        if (snapToGrid) {
          position = ComponentManagementService.snapToGrid(position);
        }

        const currentDropTargetId =
          useComponentStore.getState().dropTargetId;

        if (currentDropTargetId) {
          const targetComponent = components.find(
            (comp) => comp.id === currentDropTargetId
          );
          if (
            targetComponent &&
            ComponentManagementService.isContainer(targetComponent.type)
          ) {
            const newComponent = ComponentManagementService.createComponent(
              item.type,
              { x: 0, y: 0 },
              currentDropTargetId,
              theme
            );

            addComponent(newComponent);
            setDropTarget(null);
            return newComponent;
          }
        }

        const newComponent = ComponentManagementService.createComponent(
          item.type,
          position,
          null,
          theme
        );

        addComponent(newComponent);
        return newComponent;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (_item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          if (useComponentStore.getState().dropTargetId !== null) {
            setDropTarget(null);
          }
          return;
        }

        const nextTargetId = resolveDropTargetId(
          clientOffset.x,
          clientOffset.y
        );
        if (useComponentStore.getState().dropTargetId !== nextTargetId) {
          setDropTarget(nextTargetId);
        }
      },
    }),
    [
      components,
      snapToGrid,
      isPreviewMode,
      addComponent,
      theme,
      setDropTarget,
      resolveDropTargetId,
    ]
  );

  return {
    drop,
    isOver,
    dropTargetId,
  };
}
