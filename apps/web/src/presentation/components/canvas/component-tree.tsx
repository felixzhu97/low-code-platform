"use client";

import type React from "react";

import { useState } from "react";
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
import { cn } from "../../../application/services/utils";

import type { Component } from "@/domain/component";
import { useAllStores } from "@/presentation/hooks";

interface ComponentTreeProps {
  // 移除 props，现在从 store 获取状态
}

export function ComponentTree({}: ComponentTreeProps) {
  // 从 store 获取状态
  const {
    components,
    selectedComponentId,
    selectComponent,
    deleteComponent,
    updateComponent,
  } = useAllStores();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  // 扩展的组件类型，包含 children 属性
  interface ComponentWithChildren extends Component {
    children?: ComponentWithChildren[];
  }

  // 构建组件树结构
  const buildComponentTree = (
    comps: Component[],
    parentId: string | null = null
  ): ComponentWithChildren[] => {
    if (!comps || comps.length === 0) {
      return [];
    }
    
    return comps
      .filter((comp) => {
        // 处理 parentId 可能是 null、undefined 或字符串的情况
        const compParentId = comp.parentId ?? null;
        return compParentId === parentId;
      })
      .map((comp) => ({
        ...comp,
        children: buildComponentTree(comps, comp.id),
      }));
  };

  // 确保 components 是数组
  const componentsArray = Array.isArray(components) ? components : [];
  const componentTree = buildComponentTree(componentsArray);

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
    // 只有容器类组件可以接收拖放
    if (component && isContainer(component.type)) {
      e.currentTarget.classList.add("bg-primary/10");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/10");
  };

  const handleDrop = (
    e: React.DragEvent,
    targetComponent: Component | null
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-primary/10");

    const componentId = e.dataTransfer.getData("component-id");
    if (!componentId) return;

    // 如果目标是画布（targetComponent为null）或者是容器类组件
    if (!targetComponent || isContainer(targetComponent.type)) {
      updateComponent(componentId, {
        parentId: targetComponent?.id || null,
      });
    }
  };

  // 判断组件类型是否为容器
  const isContainer = (type: string): boolean => {
    return [
      "container",
      "grid-layout",
      "flex-layout",
      "split-layout",
      "tab-layout",
      "card-group",
      "responsive-container",
      "row",
      "column",
    ].includes(type);
  };

  // 获取组件类型的显示名称
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

  // 递归渲染组件树节点
  const renderTreeNode = (component: ComponentWithChildren, level = 0) => {
    const hasChildren = component.children && component.children.length > 0;
    const isExpanded = expandedNodes[component.id] || false;
    const isSelected = component.id === selectedComponentId;
    const isContainer = [
      "container",
      "grid-layout",
      "flex-layout",
      "split-layout",
      "tab-layout",
      "card-group",
      "responsive-container",
      "row",
      "column",
    ].includes(component.type);

    return (
      <div key={component.id} className="select-none">
        <div
          className={cn(
            "flex items-center rounded-md px-2 py-1 hover:bg-muted/50",
            isSelected && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => selectComponent(component)}
          draggable
          onDragStart={(e) => handleDragStart(e, component)}
          onDragOver={(e) => handleDragOver(e, component)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, component)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(component.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="h-5 w-5" />
          )}

          <div className="ml-1 flex flex-1 items-center gap-1.5 overflow-hidden">
            {isContainer ? (
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            ) : null}
            <span className="flex-1 truncate text-sm">
              {component.name || getComponentTypeName(component.type)}
            </span>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
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
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {component.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-2">
        <h3 className="font-medium">组件树</h3>
      </div>
      <ScrollArea className="flex-1">
        <div
          className="p-2"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("bg-primary/5");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("bg-primary/5");
          }}
          onDrop={(e) => handleDrop(e, null)}
        >
          {componentTree.length > 0 ? (
            componentTree.map((component) => renderTreeNode(component))
          ) : (
            <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
              <p>暂无组件</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
