"use client";

import type React from "react";
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
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Library,
  Search,
  Star,
  Trash2,
  Import,
  ImportIcon as Export,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "./card";
import { Badge } from "./badge";
import { CustomComponentBuilder } from "./custom-component-builder";

import type { Component } from "@/domain/component";
import { useAllStores } from "@/presentation/hooks";
import { useCustomComponentsStore } from "@/shared/stores";

interface ComponentLibraryManagerProps {}

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: hsl(var(--muted-foreground));
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0.5rem;
`;

const ComponentCard = styled(Card)`
  overflow: hidden;
`;

const ComponentCardContent = styled(CardContent)`
  padding: 0.75rem;
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ComponentName = styled.div`
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const IconButton = styled(Button)`
  height: 1.5rem;
  width: 1.5rem;
`;

const StarIcon = styled(Star)<{ isFavorite: boolean }>`
  width: 1rem;
  height: 1rem;
  ${(p) =>
    p.isFavorite
      ? css`
          fill: #facc15;
          color: #facc15;
        `
      : ""}
`;

const ComponentType = styled.div`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const ChildCount = styled.div`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
`;

const CardFooterStyled = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.5rem;
`;

const CardButton = styled(Button)<{ destructive?: boolean }>`
  ${(p) =>
    p.destructive &&
    css`
      color: hsl(var(--destructive));
      &:hover {
        color: hsl(var(--destructive));
      }
    `}
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8rem;
  border: 1px dashed hsl(var(--border));
  border-radius: calc(var(--radius));
  grid-column: span 2;
`;

const EmptyText = styled.p`
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  inset: 0;
  cursor: pointer;
  opacity: 0;
`;

export const ComponentLibraryManager = memo(function ComponentLibraryManager({}: ComponentLibraryManagerProps) {
  const { customComponents, favorites, searchTerm, removeCustomComponent, importCustomComponents, toggleFavorite, setSearchTerm, getFilteredComponents } = useCustomComponentsStore();

  const filteredComponents = getFilteredComponents();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const components = JSON.parse(event.target?.result as string);
        importCustomComponents(
          Array.isArray(components) ? components : [components]
        );
      } catch (error) {
        console.error("导入组件库失败:", error);
        alert("导入失败，请检查文件格式");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = JSON.stringify(customComponents, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component-library.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Library
            css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }}
            aria-hidden="true"
          />
          组件库管理
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "48rem" }}>
        <DialogHeader>
          <DialogTitle>组件库管理</DialogTitle>
          <DialogDescription>管理您的自定义组件库</DialogDescription>
        </DialogHeader>

        <SearchWrapper>
          <SearchInputWrapper>
            <SearchIcon />
            <Input
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              css={{ paddingLeft: "2rem" }}
            />
          </SearchInputWrapper>
          <CustomComponentBuilder />
          <FileInputWrapper>
            <HiddenFileInput
              type="file"
              id="import-file"
              accept=".json"
              onChange={handleImport}
            />
            <Button variant="outline" size="sm">
              <Import
                css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }}
              />
              导入
            </Button>
          </FileInputWrapper>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={customComponents.length === 0}
          >
            <Export
              css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }}
            />
            导出
          </Button>
        </SearchWrapper>

        <Tabs defaultValue="all">
          <TabsList
            css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            <TabsTrigger value="all">全部组件</TabsTrigger>
            <TabsTrigger value="favorites">收藏组件</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea css={{ height: "25rem" }}>
              <GridWrapper>
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((component: Component) => (
                    <ComponentCard key={component.id}>
                      <ComponentCardContent>
                        <CardHeaderRow>
                          <ComponentName>{component.name}</ComponentName>
                          <CardActions>
                            <Badge variant="outline">
                              {component.properties?.category}
                            </Badge>
                            <IconButton
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(component.id)}
                            >
                              <StarIcon
                                isFavorite={favorites.includes(component.id)}
                              />
                            </IconButton>
                          </CardActions>
                        </CardHeaderRow>
                        <ComponentType>
                          类型: {component.type}
                          {component.properties?.isContainer && " (容器)"}
                        </ComponentType>
                        {component.properties?.childComponents && (
                          <ChildCount>
                            包含{" "}
                            {component.properties?.childComponents.length} 个子组件
                          </ChildCount>
                        )}
                      </ComponentCardContent>
                      <CardFooterStyled>
                        <CardButton variant="ghost" size="sm">
                          <Edit
                            css={{
                              marginRight: "0.25rem",
                              width: "0.75rem",
                              height: "0.75rem",
                            }}
                          />
                          编辑
                        </CardButton>
                        <CardButton
                          variant="ghost"
                          size="sm"
                          destructive
                          onClick={() => removeCustomComponent(component.id)}
                        >
                          <Trash2
                            css={{
                              marginRight: "0.25rem",
                              width: "0.75rem",
                              height: "0.75rem",
                            }}
                          />
                          删除
                        </CardButton>
                      </CardFooterStyled>
                    </ComponentCard>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyText>
                      {searchTerm
                        ? "没有找到匹配的组件"
                        : '暂无自定义组件，点击"创建自定义组件"按钮开始创建'}
                    </EmptyText>
                  </EmptyState>
                )}
              </GridWrapper>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea css={{ height: "25rem" }}>
              <GridWrapper>
                {filteredComponents.filter((component: Component) =>
                  favorites.includes(component.id)
                ).length > 0 ? (
                  filteredComponents
                    .filter((component: Component) =>
                      favorites.includes(component.id)
                    )
                    .map((component: Component) => (
                      <ComponentCard key={component.id}>
                        <ComponentCardContent>
                          <CardHeaderRow>
                            <ComponentName>{component.name}</ComponentName>
                            <CardActions>
                              <Badge variant="outline">
                                {component.properties?.category}
                              </Badge>
                              <IconButton
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(component.id)}
                              >
                                <StarIcon isFavorite={true} />
                              </IconButton>
                            </CardActions>
                          </CardHeaderRow>
                          <ComponentType>
                            类型: {component.type}
                            {component.properties?.isContainer && " (容器)"}
                          </ComponentType>
                        </ComponentCardContent>
                        <CardFooterStyled>
                          <CardButton variant="ghost" size="sm">
                            <Edit
                              css={{
                                marginRight: "0.25rem",
                                width: "0.75rem",
                                height: "0.75rem",
                              }}
                            />
                            编辑
                          </CardButton>
                          <CardButton
                            variant="ghost"
                            size="sm"
                            destructive
                            onClick={() => removeCustomComponent(component.id)}
                          >
                            <Trash2
                              css={{
                                marginRight: "0.25rem",
                                width: "0.75rem",
                                height: "0.75rem",
                              }}
                            />
                            删除
                          </CardButton>
                        </CardFooterStyled>
                      </ComponentCard>
                    ))
                ) : (
                  <EmptyState>
                    <EmptyText>暂无收藏组件</EmptyText>
                  </EmptyState>
                )}
              </GridWrapper>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});