"use client";

import { useState } from "react";
import styled from "@emotion/styled";
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

interface ComponentGroupingProps {}

const Wrapper = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const ComponentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

const ComponentLabel = styled(Label)`
  display: flex;
  flex: 1;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
`;

const TypeLabel = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

export function ComponentGrouping({}: ComponentGroupingProps) {
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

    const groupComponents = components.filter((component: Component) =>
      selectedIds.includes(component.id)
    );

    const firstComponent = groupComponents[0];
    const groupPosition = firstComponent.position || { x: 0, y: 0 };

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

    const childComponents = groupComponents.map((component: Component) => {
      const relativeX = (component.position?.x || 0) - groupPosition.x;
      const relativeY = (component.position?.y || 0) - groupPosition.y;

      return {
        ...component,
        position: { x: relativeX, y: relativeY },
        parentId: groupContainer.id,
      };
    });

    groupContainer.children = childComponents;

    addComponentWithHistory(groupContainer);

    setGroupName("新建组");
    setSelectedIds([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={components.length < 2}>
          <Group css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          组件分组
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "28rem" }}>
        <DialogHeader>
          <DialogTitle>创建组件分组</DialogTitle>
          <DialogDescription>
            选择多个组件创建一个组，便于统一管理和移动
          </DialogDescription>
        </DialogHeader>

        <Wrapper>
          <FormGroup>
            <Label htmlFor="group-name">组名称</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="输入组名称"
            />
          </FormGroup>

          <FormGroup>
            <Label>选择组件</Label>
            <ScrollArea css={{ height: "12.5rem", border: "1px solid hsl(var(--border))", borderRadius: "calc(var(--radius))", padding: "0.5rem" }}>
              {components.length > 0 ? (
                components.map((component: Component) => (
                  <ComponentItem key={component.id}>
                    <Checkbox
                      id={`component-${component.id}`}
                      checked={selectedIds.includes(component.id)}
                      onCheckedChange={() =>
                        handleToggleComponent(component.id)
                      }
                    />
                    <ComponentLabel htmlFor={`component-${component.id}`}>
                      <span>{component.name || component.type}</span>
                      <TypeLabel>{component.type}</TypeLabel>
                    </ComponentLabel>
                  </ComponentItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyText>没有可用的组件</EmptyText>
                </EmptyState>
              )}
            </ScrollArea>
            <HelperText>
              已选择 {selectedIds.length} 个组件
            </HelperText>
          </FormGroup>
        </Wrapper>

        <DialogFooter>
          <Button
            onClick={handleCreateGroup}
            disabled={selectedIds.length < 2 || !groupName.trim()}
          >
            <Layers css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
            创建组
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
