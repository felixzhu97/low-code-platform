"use client";

import { useState, memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ScrollArea } from "./scroll-area";
import { PlusCircle, Save } from "lucide-react";
import { Card, CardContent } from "./card";
import { Switch } from "./switch";

import type { Component } from "@/domain/component";
import { useComponentState } from "@/presentation/hooks";
import { useCustomComponentsStore } from "@/shared/stores";

interface CustomComponentBuilderProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GridSection = styled.div`
  display: grid;
  gap: 1rem;
`;

const GridItem = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FieldSelector = styled(ScrollArea)`
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 1rem;
`;

const FieldCard = styled(Card)<{ selected: boolean }>`
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  ${(p) =>
    p.selected
      ? css`
          border-color: hsl(var(--primary));
          background-color: hsl(var(--primary) / 0.05);
        `
      : ""}
`;

const FieldCardContent = styled(CardContent)`
  padding: 0.75rem;
`;

const FieldCardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FieldName = styled.div`
  font-weight: 500;
`;

const FieldType = styled.div`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const SelectedBadge = styled.div`
  border-radius: 9999px;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.25rem;
`;

const StatusText = styled.div`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

export const CustomComponentBuilder = memo(function CustomComponentBuilder({}: CustomComponentBuilderProps) {
  const { addCustomComponent } = useCustomComponentsStore();
  const { components: existingComponents } = useComponentState();
  const [componentName, setComponentName] = useState("");
  const [componentType, setComponentType] = useState("container");
  const [componentCategory, setComponentCategory] = useState("layout");
  const [isContainer, setIsContainer] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const handleSave = () => {
    if (!componentName.trim()) return;

    const newComponent = {
      id: `custom-${Date.now()}`,
      name: componentName,
      type: componentType,
      category: componentCategory,
      isContainer,
      isCustom: true,
      childComponents: selectedComponents,
    };

    addCustomComponent(newComponent);

    setComponentName("");
    setComponentType("container");
    setComponentCategory("layout");
    setIsContainer(false);
    setSelectedComponents([]);
  };

  const toggleComponentSelection = (id: string) => {
    if (selectedComponents.includes(id)) {
      setSelectedComponents(selectedComponents.filter((cId) => cId !== id));
    } else {
      setSelectedComponents([...selectedComponents, id]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
          创建自定义组件
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "42rem" }}>
        <DialogHeader>
          <DialogTitle>创建自定义组件</DialogTitle>
          <DialogDescription>
            组合现有组件创建可复用的自定义组件
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(2, 1fr)" }}>
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="composition">组件组合</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <GridSection>
              <GridItem>
                <Label htmlFor="component-name">组件名称</Label>
                <Input
                  id="component-name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="输入组件名称"
                />
              </GridItem>

              <GridItem>
                <Label htmlFor="component-type">组件类型</Label>
                <Select value={componentType} onValueChange={setComponentType}>
                  <SelectTrigger id="component-type">
                    <SelectValue placeholder="选择组件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container">容器</SelectItem>
                    <SelectItem value="card">卡片</SelectItem>
                    <SelectItem value="form">表单</SelectItem>
                    <SelectItem value="section">区块</SelectItem>
                  </SelectContent>
                </Select>
              </GridItem>

              <GridItem>
                <Label htmlFor="component-category">组件分类</Label>
                <Select
                  value={componentCategory}
                  onValueChange={setComponentCategory}
                >
                  <SelectTrigger id="component-category">
                    <SelectValue placeholder="选择组件分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="layout">布局组件</SelectItem>
                    <SelectItem value="basic">基础组件</SelectItem>
                    <SelectItem value="form">表单组件</SelectItem>
                    <SelectItem value="data">数据组件</SelectItem>
                    <SelectItem value="custom">自定义组件</SelectItem>
                  </SelectContent>
                </Select>
              </GridItem>

              <SwitchRow>
                <Switch
                  id="is-container"
                  checked={isContainer}
                  onCheckedChange={setIsContainer}
                />
                <Label htmlFor="is-container">可以包含其他组件</Label>
              </SwitchRow>
            </GridSection>
          </TabsContent>

          <TabsContent value="composition" css={{ paddingTop: "1rem" }}>
            <Wrapper>
              <Label>选择要包含的组件</Label>
              <FieldSelector css={{ height: "18.75rem" }}>
                <FieldGrid>
                  {existingComponents.map((component: Component) => (
                    <FieldCard
                      key={component.id}
                      selected={selectedComponents.includes(component.id)}
                      onClick={() => toggleComponentSelection(component.id)}
                    >
                      <FieldCardContent>
                        <FieldCardRow>
                          <div>
                            <FieldName>{component.name}</FieldName>
                            <FieldType>{component.type}</FieldType>
                          </div>
                          {selectedComponents.includes(component.id) && (
                            <SelectedBadge>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </SelectedBadge>
                          )}
                        </FieldCardRow>
                      </FieldCardContent>
                    </FieldCard>
                  ))}
                </FieldGrid>
              </FieldSelector>
              <StatusText>已选择 {selectedComponents.length} 个组件</StatusText>
            </Wrapper>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!componentName.trim()}>
            <Save css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
            保存组件
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});