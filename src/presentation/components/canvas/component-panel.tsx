"use client";

import { useState } from "react";
import { useDrag } from "react-dnd";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import {
  LayoutGrid,
  Type,
  Square,
  CircleIcon as CircleSquare,
  Layers,
  FormInput,
  Table2,
  BarChart4,
} from "lucide-react";

import { ComponentCategory } from "@/domain/entities/types";

export function ComponentPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 组件分类
  const categories: ComponentCategory[] = [
    {
      id: "basic",
      name: "基础组件",
      icon: <Type className="h-4 w-4" />,
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
      icon: <LayoutGrid className="h-4 w-4" />,
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
      icon: <FormInput className="h-4 w-4" />,
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
      icon: <Table2 className="h-4 w-4" />,
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
      icon: <BarChart4 className="h-4 w-4" />,
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
      icon: <Square className="h-4 w-4" />,
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
      icon: <CircleSquare className="h-4 w-4" />,
      components: [
        { id: "carousel", name: "轮播图", type: "carousel", isContainer: true },
        { id: "steps", name: "步骤条", type: "steps" },
        { id: "progress", name: "进度条", type: "progress" },
        { id: "avatar", name: "头像", type: "avatar" },
        { id: "badge", name: "徽章", type: "badge" },
        { id: "tag", name: "标签", type: "tag" },
        { id: "timeline", name: "时间线", type: "timeline" },
        { id: "rating", name: "评分", type: "rating" },
      ],
    },
  ];

  // 过滤组件
  const filteredCategories = categories.map((category) => ({
    ...category,
    components: category.components.filter((component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  // 显示的分类
  const visibleCategories = searchTerm
    ? filteredCategories.filter((category) => category.components.length > 0)
    : filteredCategories;

  // 拖拽组件
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
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          console.log(`Component ${item.name} was dropped successfully`);
        }
      },
    }));

    return (
      <div
        ref={drag as any}
        className="flex cursor-grab items-center justify-between rounded-md border bg-card p-2 text-sm shadow-sm"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <span>{component.name}</span>
        {component.isContainer && (
          <Layers className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="p-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索组件..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="categories"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="grid w-full grid-cols-2 shrink-0">
          <TabsTrigger value="categories">分类</TabsTrigger>
          <TabsTrigger value="all">全部</TabsTrigger>
        </TabsList>

        <TabsContent
          value="categories"
          className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
        >
          <div className="flex flex-wrap gap-1 border-b p-2 shrink-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )
                }
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-4">
              {(activeCategory
                ? visibleCategories.filter((c) => c.id === activeCategory)
                : visibleCategories
              ).map((category) => (
                <div key={category.id} className="mb-6">
                  <div className="mb-2 flex items-center">
                    {category.icon}
                    <h3 className="ml-2 text-sm font-medium">
                      {category.name}
                    </h3>
                  </div>
                  <div className="grid gap-2">
                    {category.components.map((component) => (
                      <DraggableComponent
                        key={component.id}
                        component={component}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="all"
          className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="grid gap-2 p-4">
              {categories
                .flatMap((category) => category.components)
                .filter((component) =>
                  component.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((component) => (
                  <DraggableComponent
                    key={component.id}
                    component={component}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
