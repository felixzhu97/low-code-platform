"use client"

import { useDrag } from "react-dnd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, Type, FormInput, Table2, BarChart3 } from "lucide-react"

const componentCategories = [
  {
    id: "layout",
    name: "布局组件",
    icon: <LayoutGrid className="h-4 w-4" />,
    components: [
      { id: "container", name: "容器", type: "container" },
      { id: "row", name: "行", type: "row" },
      { id: "column", name: "列", type: "column" },
      { id: "card", name: "卡片", type: "card" },
    ],
  },
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
    id: "form",
    name: "表单组件",
    icon: <FormInput className="h-4 w-4" />,
    components: [
      { id: "input", name: "输入框", type: "input" },
      { id: "select", name: "下拉选择", type: "select" },
      { id: "checkbox", name: "复选框", type: "checkbox" },
      { id: "radio", name: "单选框", type: "radio" },
      { id: "switch", name: "开关", type: "switch" },
      { id: "slider", name: "滑块", type: "slider" },
    ],
  },
  {
    id: "data",
    name: "数据组件",
    icon: <Table2 className="h-4 w-4" />,
    components: [
      { id: "table", name: "表格", type: "table" },
      { id: "list", name: "列表", type: "list" },
      { id: "pagination", name: "分页", type: "pagination" },
      { id: "tree", name: "树形控件", type: "tree" },
    ],
  },
  {
    id: "chart",
    name: "图表组件",
    icon: <BarChart3 className="h-4 w-4" />,
    components: [
      { id: "bar-chart", name: "柱状图", type: "bar-chart" },
      { id: "line-chart", name: "折线图", type: "line-chart" },
      { id: "pie-chart", name: "饼图", type: "pie-chart" },
      { id: "area-chart", name: "面积图", type: "area-chart" },
    ],
  },
]

function DraggableComponent({ component }: { component: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { ...component },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`flex cursor-grab items-center rounded-md border p-2 ${isDragging ? "opacity-50" : ""}`}>
      <span>{component.name}</span>
    </div>
  )
}

export function ComponentPanel() {
  return (
    <div className="flex w-64 flex-col border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold">组件库</h2>
      </div>
      <Tabs defaultValue="layout" className="flex-1">
        <TabsList className="grid w-full grid-cols-5">
          {componentCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-2">
              {category.icon}
            </TabsTrigger>
          ))}
        </TabsList>
        {componentCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-8.5rem)]">
              <div className="grid gap-2 p-4">
                <h3 className="mb-2 font-medium">{category.name}</h3>
                <div className="grid gap-2">
                  {category.components.map((component) => (
                    <DraggableComponent key={component.id} component={component} />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
