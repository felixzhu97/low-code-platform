"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Layers, Info } from "lucide-react"
import {
  LayoutGrid,
  Type,
  Square,
  CircleIcon as CircleSquare,
  Layers as LayersIcon,
  FormInput,
  Table2,
  BarChart4,
  MousePointer,
  Move,
} from "lucide-react"
import type { ComponentCategory } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// 组件描述信息
const componentDescriptions: Record<string, string> = {
  text: "用于展示静态文本内容，可自定义字体、颜色、大小等样式",
  button: "可点击的按钮，支持多种样式和大小",
  image: "图片展示组件，支持各种图片格式",
  divider: "分隔线，用于分隔内容区域",
  container: "基础容器组件，可包含其他组件",
  "grid-layout": "网格布局，使用CSS Grid实现等分或自定义网格",
  "flex-layout": "弹性布局，使用CSS Flex实现灵活的一维排列",
  input: "文本输入框，用于收集用户输入",
  textarea: "多行文本输入框，适用于较长文本",
  select: "下拉选择框，用于从预设选项中选择",
  checkbox: "复选框，用于多选场景",
  radio: "单选框，用于单选场景",
  "bar-chart": "柱状图，展示分类数据的数值比较",
  "line-chart": "折线图，展示连续数据的趋势变化",
  "pie-chart": "饼图，展示部分与整体的关系",
  card: "卡片容器，用于包装相关内容和操作",
  carousel: "轮播图，循环播放内容或图片",
  progress: "进度条，展示操作完成的进度",
};

// 获取组件描述
const getComponentDescription = (type: string): string => {
  return componentDescriptions[type] || "暂无描述";
};

// 组件示例渲染函数
const renderComponentPreview = (type: string): React.ReactNode => {
  switch (type) {
    case "text":
      return <div className="text-sm">示例文本</div>;
    case "button":
      return <Button size="sm" variant="outline" className="h-6 text-xs">按钮</Button>;
    case "image":
      return <div className="h-12 w-16 bg-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground">图片</div>;
    case "divider":
      return <div className="h-px w-full bg-border my-1"></div>;
    case "container":
      return <div className="h-12 w-full border border-dashed border-muted-foreground/50 rounded-sm"></div>;
    case "grid-layout":
      return (
        <div className="grid grid-cols-2 gap-1 w-full">
          <div className="bg-muted h-6 rounded-sm"></div>
          <div className="bg-muted h-6 rounded-sm"></div>
          <div className="bg-muted h-6 rounded-sm"></div>
          <div className="bg-muted h-6 rounded-sm"></div>
        </div>
      );
    case "input":
      return <Input disabled placeholder="输入文本..." className="h-6 text-xs" />;
    case "textarea":
      return <div className="h-14 w-full border rounded-md bg-background"></div>;
    case "select":
      return <div className="h-6 w-full border rounded-md bg-background flex items-center justify-between px-2 text-xs"><span>选择选项</span><span>▼</span></div>;
    case "bar-chart":
      return (
        <div className="flex items-end h-14 gap-1 w-full">
          <div className="bg-primary w-3 h-8 rounded-sm"></div>
          <div className="bg-primary w-3 h-10 rounded-sm"></div>
          <div className="bg-primary w-3 h-6 rounded-sm"></div>
          <div className="bg-primary w-3 h-12 rounded-sm"></div>
        </div>
      );
    case "pie-chart":
      return <div className="h-12 w-12 rounded-full border-4 border-primary border-r-muted border-b-secondary"></div>;
    default:
      return <div className="text-xs text-muted-foreground">预览</div>;
  }
};

export function ComponentPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

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
        { id: "grid-layout", name: "网格布局", type: "grid-layout", isContainer: true },
        { id: "flex-layout", name: "弹性布局", type: "flex-layout", isContainer: true },
        { id: "split-layout", name: "分割布局", type: "split-layout", isContainer: true },
        { id: "tab-layout", name: "标签页布局", type: "tab-layout", isContainer: true },
        { id: "card-group", name: "卡片组", type: "card-group", isContainer: true },
        { id: "responsive-container", name: "响应式容器", type: "responsive-container", isContainer: true },
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
      ],
    },
    {
      id: "container",
      name: "容器组件",
      icon: <Square className="h-4 w-4" />,
      components: [
        { id: "card", name: "卡片", type: "card", isContainer: true },
        { id: "collapse", name: "折叠面板", type: "collapse", isContainer: true },
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
  ]

  // 过滤组件
  const filteredCategories = categories.map((category) => ({
    ...category,
    components: category.components.filter((component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  // 显示的分类
  const visibleCategories = searchTerm
    ? filteredCategories.filter((category) => category.components.length > 0)
    : filteredCategories

  // 拖拽组件
  const DraggableComponent = ({
    component,
  }: { component: { id: string; name: string; type: string; isContainer?: boolean } }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "COMPONENT",
      item: { id: component.id, name: component.name, type: component.type, isContainer: component.isContainer },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop) {
          console.log(`Component ${item.name} was dropped successfully`)
        }
      },
    }))

    return (
      <div
        ref={drag}
        className="relative flex flex-col cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary/50 transition-all"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={() => setSelectedComponent(component.id === selectedComponent ? null : component.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{component.name}</span>
          <div className="flex gap-1">
            {component.isContainer && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="h-5 px-1">
                      <Layers className="h-3 w-3" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">容器组件，可包含其他组件</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Badge variant="outline" className="h-5 px-1 cursor-pointer hover:bg-accent">
                  <Info className="h-3 w-3" />
                </Badge>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{component.name}</DialogTitle>
                  <DialogDescription>
                    {getComponentDescription(component.type)}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">组件预览</div>
                    <div className="flex items-center justify-center p-4 border rounded-md bg-accent/10">
                      {renderComponentPreview(component.type)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">使用方式</div>
                    <div className="text-sm flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      <span>拖拽此组件到画布中</span>
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      <span>在画布中调整位置与大小</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className={`h-14 flex items-center justify-center rounded border border-dashed ${
          isDragging ? "border-primary" : "border-muted-foreground/30"
        } p-1`}>
          {renderComponentPreview(component.type)}
        </div>
        
        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {getComponentDescription(component.type)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
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

      <Tabs defaultValue="categories" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">分类</TabsTrigger>
          <TabsTrigger value="all">全部</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col">
          <div className="flex flex-wrap gap-1 border-b p-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {(activeCategory ? visibleCategories.filter((c) => c.id === activeCategory) : visibleCategories).map(
                (category) => (
                  <div key={category.id} className="mb-6">
                    <div className="mb-2 flex items-center">
                      {category.icon}
                      <h3 className="ml-2 text-sm font-medium">{category.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {category.components.map((component) => (
                        <DraggableComponent key={component.id} component={component} />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="all" className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 gap-3 p-4">
              {categories
                .flatMap((category) => category.components)
                .filter((component) => component.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((component) => (
                  <DraggableComponent key={component.id} component={component} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
