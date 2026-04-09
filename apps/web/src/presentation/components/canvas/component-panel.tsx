"use client";

import { isValidElement, ReactNode, useState } from "react";
import { useDrag } from "react-dnd";
import styled from "@emotion/styled";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Search,
  LayoutGrid,
  Type,
  Square,
  CircleIcon as CircleSquare,
  Layers,
  FormInput,
  Table2,
  BarChart4,
} from "lucide-react";

import type { ComponentCategory } from "@/domain/component";
import { useUIStore } from "@/infrastructure/state-management/stores";

const PanelRoot = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
`;

const SearchSection = styled.div`
  padding: 1rem;
  flex-shrink: 0;
`;

const SearchWrap = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.5rem;
  top: 0.625rem;
  width: 1rem;
  height: 1rem;
  color: hsl(var(--muted-foreground));
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: 2rem;
`;

const StyledTabs = styled(Tabs)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledTabsList = styled(TabsList)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  flex-shrink: 0;
`;

const TabPanelContent = styled(TabsContent)`
  flex: 1;
  padding: 0;
  overflow: hidden;
  &[data-state="active"] {
    display: flex;
    flex-direction: column;
  }
`;

const CategoryChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.5rem;
  flex-shrink: 0;
`;

const CategoryFilterButton = styled(Button)`
  height: 2rem;
`;

const ChipLabel = styled.span`
  margin-left: 0.25rem;
`;

const PanelScroll = styled(ScrollArea)`
  flex: 1;
  overflow: hidden;
`;

const ScrollInner = styled.div`
  padding: 1rem;
`;

const CategoryBlock = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryHeadingRow = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const CategoryTitle = styled.h3`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

const ComponentGrid = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const AllComponentsGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
`;

const DraggableCard = styled.div<{ $dragging: boolean }>`
  display: flex;
  cursor: grab;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  opacity: ${(p) => (p.$dragging ? 0.5 : 1)};
`;

export function ComponentPanel() {
  const { activeTab, setActiveTab } = useUIStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: ComponentCategory[] = [
    {
      id: "basic",
      name: "基础组件",
      icon: <Type size={16} />,
      components: [
        { id: "text", name: "文本", type: "text" },
        { id: "button", name: "按钮", type: "button" },
        { id: "image", name: "图片", type: "image" },
        { id: "divider", name: "分割线", type: "divider" },
      ],
    },
    {
      id: "layout",
      name: "布局组件",
      icon: <LayoutGrid size={16} />,
      components: [
        { id: "container", name: "容器", type: "container", isContainer: true },
        {
          id: "grid-layout",
          name: "网格布局",
          type: "grid-layout",
          isContainer: true,
        },
        {
          id: "flex-layout",
          name: "弹性布局",
          type: "flex-layout",
          isContainer: true,
        },
        {
          id: "split-layout",
          name: "分割布局",
          type: "split-layout",
          isContainer: true,
        },
        {
          id: "two-column-layout",
          name: "双栏布局",
          type: "two-column-layout",
          isContainer: true,
        },
        {
          id: "sidebar",
          name: "侧栏",
          type: "sidebar",
          isContainer: true,
        },
        {
          id: "main-panel",
          name: "主内容区",
          type: "main-panel",
          isContainer: true,
        },
        {
          id: "tab-layout",
          name: "标签页布局",
          type: "tab-layout",
          isContainer: true,
        },
        {
          id: "card-group",
          name: "卡片组",
          type: "card-group",
          isContainer: true,
        },
        {
          id: "responsive-container",
          name: "响应式容器",
          type: "responsive-container",
          isContainer: true,
        },
        { id: "row", name: "行", type: "row", isContainer: true },
        { id: "column", name: "列", type: "column", isContainer: true },
      ],
    },
    {
      id: "form",
      name: "表单组件",
      icon: <FormInput size={16} />,
      components: [
        { id: "input", name: "输入框", type: "input" },
        { id: "textarea", name: "文本域", type: "textarea" },
        { id: "select", name: "下拉选择", type: "select" },
        { id: "checkbox", name: "复选框", type: "checkbox" },
        { id: "radio", name: "单选框", type: "radio" },
        { id: "switch", name: "开关", type: "switch" },
        { id: "slider", name: "滑块", type: "slider" },
        { id: "date-picker", name: "日期选择器", type: "date-picker" },
        { id: "time-picker", name: "时间选择器", type: "time-picker" },
        { id: "file-upload", name: "文件上传", type: "file-upload" },
      ],
    },
    {
      id: "data",
      name: "数据组件",
      icon: <Table2 size={16} />,
      components: [
        { id: "data-table", name: "数据表格", type: "data-table" },
        { id: "data-list", name: "数据列表", type: "data-list" },
        { id: "data-card", name: "数据卡片", type: "data-card" },
        { id: "pagination", name: "分页", type: "pagination" },
        { id: "tree", name: "树形控件", type: "tree" },
      ],
    },
    {
      id: "chart",
      name: "图表组件",
      icon: <BarChart4 size={16} />,
      components: [
        { id: "bar-chart", name: "柱状图", type: "bar-chart" },
        { id: "line-chart", name: "折线图", type: "line-chart" },
        { id: "pie-chart", name: "饼图", type: "pie-chart" },
        { id: "area-chart", name: "面积图", type: "area-chart" },
        { id: "scatter-chart", name: "散点图", type: "scatter-chart" },
        { id: "radar-chart", name: "雷达图", type: "radar-chart" },
        { id: "gauge", name: "仪表盘", type: "gauge" },
        { id: "radial-bar-chart", name: "环形图", type: "radial-bar-chart" },
        { id: "treemap-chart", name: "树状图", type: "treemap-chart" },
      ],
    },
    {
      id: "container",
      name: "容器组件",
      icon: <Square size={16} />,
      components: [
        { id: "card", name: "卡片", type: "card", isContainer: true },
        {
          id: "collapse",
          name: "折叠面板",
          type: "collapse",
          isContainer: true,
        },
        { id: "tabs", name: "标签页", type: "tabs", isContainer: true },
        { id: "modal", name: "模态框", type: "modal", isContainer: true },
        { id: "drawer", name: "抽屉", type: "drawer", isContainer: true },
        { id: "popover", name: "弹出框", type: "popover", isContainer: true },
        { id: "tooltip", name: "提示框", type: "tooltip", isContainer: true },
      ],
    },
    {
      id: "advanced",
      name: "高级组件",
      icon: <CircleSquare size={16} />,
      components: [
        { id: "carousel", name: "轮播图", type: "carousel", isContainer: true },
        { id: "steps", name: "步骤条", type: "steps" },
        { id: "progress", name: "进度条", type: "progress" },
        { id: "avatar", name: "头像", type: "avatar" },
        { id: "badge", name: "徽章", type: "badge" },
        { id: "tag", name: "标签", type: "tag" },
        { id: "timeline", name: "时间线", type: "timeline" },
        { id: "rating", name: "评分", type: "rating" },
        { id: "nav-item", name: "导航项", type: "nav-item" },
      ],
    },
  ];

  const filteredCategories = categories.map((category) => ({
    ...category,
    components: category.components.filter((component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const visibleCategories = searchTerm
    ? filteredCategories.filter((category) => category.components.length > 0)
    : filteredCategories;

  const DraggableComponent = ({
    component,
  }: {
    component: {
      id: string;
      name: string;
      type: string;
      isContainer?: boolean;
    };
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "COMPONENT",
      item: {
        id: component.id,
        name: component.name,
        type: component.type,
        isContainer: component.isContainer,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <DraggableCard
        ref={drag as unknown as React.RefCallback<HTMLDivElement>}
        $dragging={isDragging}
      >
        <span>{component.name}</span>
        {component.isContainer && (
          <Layers
            size={12}
            style={{ color: "hsl(var(--muted-foreground))" }}
          />
        )}
      </DraggableCard>
    );
  };

  return (
    <PanelRoot>
      <SearchSection>
        <SearchWrap>
          <SearchIcon aria-hidden />
          <SearchInput
            placeholder="搜索组件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrap>
      </SearchSection>

      <StyledTabs defaultValue="categories">
        <StyledTabsList>
          <TabsTrigger value="categories">分类</TabsTrigger>
          <TabsTrigger value="all">全部</TabsTrigger>
        </StyledTabsList>

        <TabPanelContent value="categories">
          <CategoryChipsRow>
            {categories.map((category) => (
              <CategoryFilterButton
                key={category.id}
                variant={activeCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )
                }
              >
                {isValidElement(category.icon) ? (category.icon as ReactNode) : null}
                <ChipLabel>{category.name}</ChipLabel>
              </CategoryFilterButton>
            ))}
          </CategoryChipsRow>

          <PanelScroll>
            <ScrollInner>
              {(activeCategory
                ? visibleCategories.filter((c) => c.id === activeCategory)
                : visibleCategories
              ).map((category) => (
                <CategoryBlock key={category.id}>
                  <CategoryHeadingRow>
                    {isValidElement(category.icon) ? (category.icon as ReactNode) : null}
                    <CategoryTitle>{category.name}</CategoryTitle>
                  </CategoryHeadingRow>
                  <ComponentGrid>
                    {category.components.map((component) => (
                      <DraggableComponent
                        key={component.id}
                        component={component}
                      />
                    ))}
                  </ComponentGrid>
                </CategoryBlock>
              ))}
            </ScrollInner>
          </PanelScroll>
        </TabPanelContent>

        <TabPanelContent value="all">
          <PanelScroll>
            <AllComponentsGrid>
              {categories
                .flatMap((category) => category.components)
                .filter((component) =>
                  component.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((component) => (
                  <DraggableComponent
                    key={`${component.id}-all`}
                    component={component}
                  />
                ))}
            </AllComponentsGrid>
          </PanelScroll>
        </TabPanelContent>
      </StyledTabs>
    </PanelRoot>
  );
}
