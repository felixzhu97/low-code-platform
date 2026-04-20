"use client";

import type React from "react";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

import type { Component } from "@/domain/component";
import { useComponentState } from "@/presentation/hooks";

const TreeRoot = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const TreeHeader = styled.div`
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.5rem 1rem;
`;

const TreeTitle = styled.h3`
  font-weight: 500;
`;

const TreeScroll = styled(ScrollArea)`
  flex: 1;
  min-height: 0;
`;

const DropZone = styled.div<{ $active: boolean }>`
  padding: 0.5rem;
  background-color: ${(p) =>
    p.$active ? "hsl(var(--primary) / 0.05)" : "transparent"};
`;

const NodeOuter = styled.div`
  user-select: none;
`;

const NodeRow = styled.div<{
  $levelPadding: number;
  $selected: boolean;
  $dropHighlight: boolean;
}>`
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  padding-left: ${(p) => p.$levelPadding}px;
  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
  ${(p) =>
    p.$selected &&
    `
    background-color: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
  `}
  ${(p) =>
    p.$dropHighlight &&
    `
    background-color: hsl(var(--primary) / 0.1);
  `}
`;

const ExpandToggleButton = styled(Button)`
  width: 1.25rem;
  height: 1.25rem;
  min-height: 1.25rem;
  padding: 0;
`;

const ExpandSpacer = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const RowMain = styled.div`
  margin-left: 0.25rem;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
  overflow: hidden;
`;

const RowLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
`;

const VisibilityActionButton = styled(Button)`
  width: 1.5rem;
  height: 1.5rem;
  min-height: 1.5rem;
  padding: 0;
  color: hsl(var(--muted-foreground));
  &:hover {
    color: hsl(var(--foreground));
  }
`;

const DeleteActionButton = styled(Button)`
  width: 1.5rem;
  height: 1.5rem;
  min-height: 1.5rem;
  padding: 0;
  color: hsl(var(--muted-foreground));
  &:hover {
    color: hsl(var(--destructive));
  }
`;

const EmptyState = styled.div`
  display: flex;
  height: 5rem;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`;

function dragLeaveToOutside(e: React.DragEvent, onLeave: () => void) {
  const related = e.relatedTarget as Node | null;
  if (!related || !e.currentTarget.contains(related)) {
    onLeave();
  }
}

function isContainerType(type: string): boolean {
  return [
    "container",
    "grid-layout",
    "flex-layout",
    "split-layout",
    "two-column-layout",
    "sidebar",
    "main-panel",
    "tab-layout",
    "card-group",
    "responsive-container",
    "row",
    "column",
    "card",
    "collapse",
    "tabs",
    "modal",
    "drawer",
    "popover",
    "tooltip",
    "carousel",
  ].includes(type);
}

export function ComponentTree() {
  const {
    components,
    selectedComponentId,
    selectComponent,
    deleteComponent,
    updateComponent,
  } = useComponentState();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [rootDropActive, setRootDropActive] = useState(false);

  interface ComponentWithChildren extends Component {
    children?: ComponentWithChildren[];
  }

  const buildComponentTree = (
    comps: Component[],
    parentId: string | null = null
  ): ComponentWithChildren[] => {
    if (!comps || comps.length === 0) {
      return [];
    }

    return comps
      .filter((comp) => {
        const compParentId = comp.parentId ?? null;
        return compParentId === parentId;
      })
      .map((comp) => ({
        ...comp,
        children: buildComponentTree(comps, comp.id),
      }));
  };

  const componentsArray = Array.isArray(components) ? components : [];
  const componentTree = buildComponentTree(componentsArray);

  useEffect(() => {
    if (!selectedComponentId || componentsArray.length === 0) {
      return;
    }

    const byId = new Map(componentsArray.map((c) => [c.id, c]));
    const parentIdsToExpand = new Set<string>();
    let walker = byId.get(selectedComponentId);
    while (walker?.parentId) {
      parentIdsToExpand.add(walker.parentId);
      walker = byId.get(walker.parentId);
    }

    setExpandedNodes((prev) => {
      const next = { ...prev };
      for (const id of parentIdsToExpand) {
        next[id] = true;
      }
      return next;
    });

    const timer = window.setTimeout(() => {
      const safeId =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(selectedComponentId)
          : selectedComponentId.replace(/["\\]/g, "");
      document
        .querySelector(`[data-tree-node-id="${safeId}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [selectedComponentId, components]);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData("component-id", component.id);
  };

  const handleDragOver = (e: React.DragEvent, component: Component | null) => {
    e.preventDefault();
    if (component && isContainerType(component.type)) {
      setDropTargetId(component.id);
    } else {
      setDropTargetId(null);
    }
  };

  const handleDragLeaveRow = (e: React.DragEvent) => {
    dragLeaveToOutside(e, () => setDropTargetId(null));
  };

  const handleDrop = (
    e: React.DragEvent,
    targetComponent: Component | null
  ) => {
    e.preventDefault();
    setDropTargetId(null);
    setRootDropActive(false);

    const componentId = e.dataTransfer.getData("component-id");
    if (!componentId) return;

    if (!targetComponent || isContainerType(targetComponent.type)) {
      updateComponent(componentId, {
        parentId: targetComponent?.id || null,
      });
    }
  };

  const getComponentTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      container: "容器",
      "grid-layout": "网格布局",
      "flex-layout": "弹性布局",
      "split-layout": "分栏布局",
      "tab-layout": "标签页布局",
      "card-group": "卡片组",
      "responsive-container": "响应式容器",
      row: "行",
      column: "列",
      card: "卡片",
      text: "文本",
      button: "按钮",
      input: "输入框",
      select: "下拉选择",
      checkbox: "复选框",
      radio: "单选框",
      switch: "开关",
      slider: "滑块",
      divider: "分割线",
      image: "图片",
    };
    return typeMap[type] || type;
  };

  const renderTreeNode = (component: ComponentWithChildren, level = 0) => {
    const hasChildren = component.children && component.children.length > 0;
    const isExpanded = expandedNodes[component.id] || false;
    const isSelected = component.id === selectedComponentId;
    const asContainer = isContainerType(component.type);
    const levelPadding = level * 12 + 8;

    return (
      <NodeOuter key={component.id} data-tree-node-id={component.id}>
        <NodeRow
          $levelPadding={levelPadding}
          $selected={isSelected}
          $dropHighlight={dropTargetId === component.id && asContainer}
          onClick={() => {
            const flat = componentsArray.find((c) => c.id === component.id);
            selectComponent(flat ?? component);
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, component)}
          onDragOver={(e) => handleDragOver(e, component)}
          onDragLeave={handleDragLeaveRow}
          onDrop={(e) => handleDrop(e, component)}
        >
          {hasChildren ? (
            <ExpandToggleButton
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(component.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </ExpandToggleButton>
          ) : (
            <ExpandSpacer />
          )}

          <RowMain>
            {asContainer ? (
              <Layers
                size={14}
                strokeWidth={2}
                style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
              />
            ) : null}
            <RowLabel>
              {component.name || getComponentTypeName(component.type)}
            </RowLabel>
            <RowActions>
              <VisibilityActionButton
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  updateComponent(component.id, {
                    properties: {
                      ...component.properties,
                      visible: component.properties?.visible === false,
                    },
                  });
                }}
              >
                {component.properties?.visible === false ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </VisibilityActionButton>
              <DeleteActionButton
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 size={14} />
              </DeleteActionButton>
            </RowActions>
          </RowMain>
        </NodeRow>

        {hasChildren && isExpanded && (
          <div>
            {component.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </NodeOuter>
    );
  };

  return (
    <TreeRoot>
      <TreeHeader>
        <TreeTitle>组件树</TreeTitle>
      </TreeHeader>
      <TreeScroll>
        <DropZone
          $active={rootDropActive}
          onDragOver={(e) => {
            e.preventDefault();
            setRootDropActive(true);
          }}
          onDragLeave={(e) => {
            dragLeaveToOutside(e, () => setRootDropActive(false));
          }}
          onDrop={(e) => handleDrop(e, null)}
        >
          {componentTree.length > 0 ? (
            componentTree.map((component) => renderTreeNode(component))
          ) : (
            <EmptyState>
              <p>暂无组件</p>
            </EmptyState>
          )}
        </DropZone>
      </TreeScroll>
    </TreeRoot>
  );
}
