"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ScrollArea } from "./scroll-area";
import { Layers, Group } from "lucide-react";
import { Checkbox } from "./checkbox";

import type { Component } from "@/domain/component";
import { useAllStores } from "@/presentation/hooks";
import { useSimplifiedActions } from "@/presentation/hooks";

interface ComponentGroupingProps {
  // 移除 props，现在从 store 获取状态
}

export function ComponentGrouping({}: ComponentGroupingProps) {
  // 从 store 获取状态
  const { components } = useAllStores();
  const { addComponentWithHistory } = useSimplifiedActions();
  const [groupName, setGroupName] = useState("新建组");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleComponent = (componentId: string) => {
    if (selectedIds.includes(componentId)) {
      setSelectedIds(selectedIds.filter((id) => id !== componentId));
    } else {
      setSelectedIds([...selectedIds, componentId]);
    }
  };

  const handleCreateGroup = () => {
    if (selectedIds.length < 2 || !groupName.trim()) return;

    // 找出要分组的组件
    const groupComponents = components.filter((c) =>
      selectedIds.includes(c.id)
    );

    // 计算组的位置（使用第一个组件的位置）
    const firstComponent = groupComponents[0];
    const groupPosition = firstComponent.position || { x: 0, y: 0 };

    // 创建组容器
    const groupContainer: Component = {
      id: `group-${Date.now()}`,
      type: "container",
      name: groupName,
      position: groupPosition,
      properties: {
        width: "auto",
        height: "auto",
        padding: "10px",
        bgColor: "rgba(0, 0, 0, 0.03)",
        isGroup: true,
      },
      children: [],
    };

    // 调整子组件的位置为相对于组的位置
    const childComponents = groupComponents.map((component) => {
      const relativeX = (component.position?.x || 0) - groupPosition.x;
      const relativeY = (component.position?.y || 0) - groupPosition.y;

      return {
        ...component,
        position: { x: relativeX, y: relativeY },
        parentId: groupContainer.id,
      };
    });

    groupContainer.children = childComponents;

    // 添加新的组容器
    addComponentWithHistory(groupContainer);

    setGroupName("新建组");
    setSelectedIds([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={components.length < 2}>
          <Group className="mr-2 h-4 w-4" />
          组件分组
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>创建组件分组</DialogTitle>
          <DialogDescription>
            选择多个组件创建一个组，便于统一管理和移动
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">组名称</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="输入组名称"
            />
          </div>

          <div className="grid gap-2">
            <Label>选择组件</Label>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {components.length > 0 ? (
                components.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={`component-${component.id}`}
                      checked={selectedIds.includes(component.id)}
                      onCheckedChange={() =>
                        handleToggleComponent(component.id)
                      }
                    />
                    <Label
                      htmlFor={`component-${component.id}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                    >
                      <span>{component.name || component.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {component.type}
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    没有可用的组件
                  </p>
                </div>
              )}
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              已选择 {selectedIds.length} 个组件
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreateGroup}
            disabled={selectedIds.length < 2 || !groupName.trim()}
          >
            <Layers className="mr-2 h-4 w-4" />
            创建组
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
