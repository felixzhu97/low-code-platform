"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDrop } from "react-dnd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Smartphone, Tablet, BarChart, LineChart, PieChart, ArrowUpDown, Filter } from "lucide-react"
import type { Component, ThemeConfig, DataSource, TableColumn } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CanvasProps = {
  onSelectComponent: (component: Component | null) => void
  isPreviewMode?: boolean
  theme?: ThemeConfig
  viewportWidth?: number
  activeDevice?: string
  components: Component[]
  onUpdateComponents: (components: Component[]) => void
  dataSources?: DataSource[]
}

export function Canvas({
  onSelectComponent,
  isPreviewMode = false,
  theme,
  viewportWidth = 1280,
  activeDevice = "desktop",
  components,
  onUpdateComponents,
  dataSources = [],
}: CanvasProps) {
  const [showGrid, setShowGrid] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  // 添加拖拽状态
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // 添加鼠标事件处理函数
  const handleMouseDown = (e: React.MouseEvent, component: Component) => {
    if (isPreviewMode) return

    e.stopPropagation()
    setSelectedId(component.id)
    onSelectComponent(component)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || isPreviewMode) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = e.clientX - canvasRect.left - dragOffset.x
    const y = e.clientY - canvasRect.top - dragOffset.y

    // 应用网格对齐
    const gridSize = 20
    const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x
    const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y

    // 更新组件位置
    const updatedComponents = components.map((component) => {
      if (component.id === selectedId) {
        return {
          ...component,
          position: { x: snappedX, y: snappedY },
        }
      }
      return component
    })

    onUpdateComponents(updatedComponents)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 添加键盘微调位置功能
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedId || isPreviewMode) return

    const step = snapToGrid ? 20 : 1
    let deltaX = 0
    let deltaY = 0

    switch (e.key) {
      case "ArrowUp":
        deltaY = -step
        break
      case "ArrowDown":
        deltaY = step
        break
      case "ArrowLeft":
        deltaX = -step
        break
      case "ArrowRight":
        deltaX = step
        break
      default:
        return
    }

    if (deltaX !== 0 || deltaY !== 0) {
      e.preventDefault()

      const updatedComponents = components.map((component) => {
        if (component.id === selectedId) {
          return {
            ...component,
            position: {
              x: (component.position?.x || 0) + deltaX,
              y: (component.position?.y || 0) + deltaY,
            },
          }
        }
        return component
      })

      onUpdateComponents(updatedComponents)
    }
  }

  useEffect(() => {
    if (isPreviewMode) {
      setSelectedId(null)
    }
  }, [isPreviewMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewMode) return

      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault()
        handleDeleteSelected()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId, isPreviewMode])

  const handleClear = () => {
    onUpdateComponents([])
    setSelectedId(null)
    onSelectComponent(null)
  }

  const handleDeleteSelected = () => {
    if (!selectedId) return

    // 递归删除组件及其子组件
    const deleteComponentAndChildren = (componentId: string, comps: Component[]): Component[] => {
      // 找出所有子组件ID
      const childIds = comps.filter((comp) => comp.parentId === componentId).map((comp) => comp.id)

      // 递归删除所有子组件
      let updatedComps = [...comps]
      for (const childId of childIds) {
        updatedComps = deleteComponentAndChildren(childId, updatedComps)
      }

      // 删除当前组件
      return updatedComps.filter((comp) => comp.id !== componentId)
    }

    const newComponents = deleteComponentAndChildren(selectedId, components)
    onUpdateComponents(newComponents)
    setSelectedId(null)
    onSelectComponent(null)
  }

  // 使用useDrop hook处理拖放
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "COMPONENT",
      drop: (item: any, monitor) => {
        if (isPreviewMode) return

        const offset = monitor.getClientOffset()
        const canvasRect = canvasRef.current?.getBoundingClientRect()

        if (offset && canvasRect) {
          let x = offset.x - canvasRect.left
          let y = offset.y - canvasRect.top

          // Snap to grid if enabled
          if (snapToGrid) {
            const gridSize = 20
            x = Math.round(x / gridSize) * gridSize
            y = Math.round(y / gridSize) * gridSize
          }

          // 如果有目标容器，则将组件添加到容器中
          if (dropTargetId) {
            const targetComponent = components.find((comp) => comp.id === dropTargetId)
            if (targetComponent && isContainer(targetComponent.type)) {
              const newComponent: Component = {
                ...item,
                id: `${item.type}-${Date.now()}`,
                position: { x: 0, y: 0 }, // 相对于容器的位置
                properties: getDefaultProperties(item.type),
                parentId: dropTargetId,
              }

              onUpdateComponents([...components, newComponent])
              setDropTargetId(null)
              return newComponent
            }
          }

          // 否则添加到画布根级别
          const newComponent: Component = {
            ...item,
            id: `${item.type}-${Date.now()}`,
            position: { x, y },
            properties: getDefaultProperties(item.type),
            parentId: null,
          }

          console.log("Adding new component:", newComponent)
          onUpdateComponents([...components, newComponent])
          return newComponent
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item: any, monitor) => {
        // 清除之前的目标
        setDropTargetId(null)

        // 获取当前鼠标位置
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        // 查找鼠标下方的组件
        const elementsAtPoint = document.elementsFromPoint(clientOffset.x, clientOffset.y)

        // 查找第一个可作为容器的组件
        for (const element of elementsAtPoint) {
          const componentId = element.getAttribute("data-component-id")
          if (componentId) {
            const component = components.find((comp) => comp.id === componentId)
            if (component && isContainer(component.type)) {
              setDropTargetId(componentId)
              break
            }
          }
        }
      },
    }),
    [components, snapToGrid, isPreviewMode, dropTargetId, onUpdateComponents],
  )

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
      "card",
    ].includes(type)
  }

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case "text":
        return {
          content: "示例文本",
          fontSize: 16,
          fontWeight: "normal",
          color: theme?.textColor || "#000000",
          alignment: "left",
          visible: true,
          lineHeight: 1.5,
          letterSpacing: "normal",
          textTransform: "none",
          textDecoration: "none",
        }
      case "button":
        return {
          text: "按钮",
          variant: "default",
          size: "default",
          disabled: false,
          visible: true,
          icon: "",
          iconPosition: "left",
          fullWidth: false,
          onClick: "none",
        }
      case "image":
        return {
          src: "/placeholder.svg?height=200&width=300",
          alt: "示例图片",
          width: 300,
          height: 200,
          objectFit: "cover",
          visible: true,
          rounded: false,
          shadow: false,
          border: false,
          caption: "",
        }
      case "divider":
        return {
          orientation: "horizontal",
          thickness: 1,
          color: "#e2e8f0",
          visible: true,
          margin: "1rem 0",
          style: "solid",
        }
      case "input":
        return {
          placeholder: "请输入...",
          disabled: false,
          required: false,
          type: "text",
          visible: true,
          label: "输入框",
          helperText: "",
          defaultValue: "",
        }
      case "textarea":
        return {
          placeholder: "请输入多行文本...",
          disabled: false,
          required: false,
          rows: 4,
          visible: true,
          label: "文本域",
          helperText: "",
          defaultValue: "",
        }
      case "select":
        return {
          placeholder: "请选择...",
          disabled: false,
          required: false,
          options: ["选项1", "选项2", "选项3"],
          visible: true,
          label: "下拉选择",
          helperText: "",
          defaultValue: "",
        }
      case "checkbox":
        return {
          label: "复选框",
          checked: false,
          disabled: false,
          visible: true,
          helperText: "",
        }
      case "radio":
        return {
          options: ["选项1", "选项2", "选项3"],
          disabled: false,
          visible: true,
          label: "单选框组",
          helperText: "",
          defaultValue: "",
        }
      case "card":
        return {
          title: "卡片标题",
          shadow: true,
          visible: true,
          padding: "1rem",
          border: true,
          rounded: true,
        }
      case "data-table":
        return {
          title: "数据表格",
          dataSource: null,
          columns: [
            { title: "列1", dataIndex: "field1", key: "field1", width: 150, sortable: true, filterable: true },
            { title: "列2", dataIndex: "field2", key: "field2", width: 150, sortable: false, filterable: false },
            { title: "列3", dataIndex: "field3", key: "field3", width: 150, sortable: false, filterable: false },
          ],
          pagination: true,
          pageSize: 10,
          bordered: true,
          striped: true,
          size: "default",
          visible: true,
        }
      case "data-list":
        return {
          title: "数据列表",
          dataSource: null,
          listType: "default", // default, avatar, card
          itemLayout: "horizontal", // horizontal, vertical
          showActions: true,
          showExtra: true,
          pagination: true,
          pageSize: 5,
          visible: true,
        }
      case "data-card":
        return {
          title: "数据卡片",
          dataSource: null,
          cardType: "default", // default, stats, profile
          showIcon: true,
          iconPosition: "left",
          showTrend: true,
          trendPosition: "bottom",
          visible: true,
        }
      case "pagination":
        return {
          defaultCurrent: 1,
          total: 50,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          size: "default",
          visible: true,
        }
      case "tree":
        return {
          dataSource: null,
          defaultExpandAll: false,
          showLine: true,
          showIcon: true,
          selectable: true,
          checkable: false,
          visible: true,
        }
      case "bar-chart":
        return {
          title: "柱状图",
          dataSource: null,
          xField: "x",
          yField: "y",
          seriesField: "category",
          isGroup: true,
          isStack: false,
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "line-chart":
        return {
          title: "折线图",
          dataSource: null,
          xField: "x",
          yField: "y",
          seriesField: "category",
          smooth: true,
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "pie-chart":
        return {
          title: "饼图",
          dataSource: null,
          colorField: "type",
          valueField: "value",
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "area-chart":
        return {
          title: "面积图",
          dataSource: null,
          xField: "x",
          yField: "y",
          seriesField: "category",
          smooth: true,
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "scatter-chart":
        return {
          title: "散点图",
          dataSource: null,
          xField: "x",
          yField: "y",
          colorField: "category",
          sizeField: "size",
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "radar-chart":
        return {
          title: "雷达图",
          dataSource: null,
          angleField: "item",
          radiusField: "value",
          seriesField: "category",
          legend: true,
          width: 500,
          height: 300,
          visible: true,
        }
      case "gauge":
        return {
          title: "仪表盘",
          dataSource: null,
          percent: 0.75,
          range: { color: "l(0) 0:#6B74E6 1:#5DDECF" },
          startAngle: Math.PI * -1.2,
          endAngle: Math.PI * 0.2,
          width: 300,
          height: 300,
          visible: true,
        }
      case "grid-layout":
        return {
          columns: 3,
          gap: 2,
          autoRows: false,
          rowHeight: "auto",
          width: "100%",
          height: "auto",
          visible: true,
        }
      case "flex-layout":
        return {
          direction: "row",
          wrap: true,
          justifyContent: "start",
          alignItems: "center",
          gap: 2,
          width: "100%",
          height: "auto",
          visible: true,
        }
      case "split-layout":
        return {
          direction: "horizontal",
          splitRatio: 30,
          minSize: 100,
          width: "100%",
          height: "300px",
          visible: true,
        }
      case "tab-layout":
        return {
          tabs: [
            { id: "tab-1", label: "标签1", content: "标签1内容" },
            { id: "tab-2", label: "标签2", content: "标签2内容" },
          ],
          defaultTab: "tab-1",
          width: "100%",
          height: "auto",
          visible: true,
        }
      case "card-group":
        return {
          columns: 3,
          gap: 2,
          width: "100%",
          height: "auto",
          visible: true,
        }
      case "responsive-container":
        return {
          breakpoints: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
          },
          width: "100%",
          height: "auto",
          visible: true,
        }
      default:
        return {
          visible: true,
        }
    }
  }

  const handleSelectComponent = (component: Component) => {
    if (isPreviewMode) return

    setSelectedId(component.id)
    onSelectComponent(component)
  }

  // 获取组件绑定的数据源
  const getComponentData = (component: Component) => {
    if (!component.dataSource) return null

    const dataSource = dataSources.find((ds) => ds.id === component.dataSource)
    if (!dataSource) return null

    return dataSource.data
  }

  // 递归渲染组件
  const renderComponent = (component: Component, parentComponent: Component | null = null) => {
    // 如果组件被设置为不可见，则不渲染
    if (component.properties?.visible === false && !isPreviewMode) {
      return null
    }

    const isSelected = component.id === selectedId && !isPreviewMode
    const isDropTarget = component.id === dropTargetId && !isPreviewMode
    const props = component.properties || {}
    const animation = props.animation

    // 应用动画样式
    let animationStyle = {}
    if (animation && !isPreviewMode) {
      animationStyle = {
        animation: `${animation.type} ${animation.duration}ms ${animation.easing} ${animation.delay}ms ${animation.repeat === 0 ? "infinite" : animation.repeat} ${animation.direction}`,
      }
    }

    // 应用主题样式
    const themeStyle = {
      fontFamily: theme?.fontFamily || "system-ui, sans-serif",
      "--border-radius": theme?.borderRadius || "0.375rem",
      "--primary": theme?.primaryColor || "#0070f3",
      "--secondary": theme?.secondaryColor || "#6c757d",
    } as React.CSSProperties

    // 获取组件的子组件
    const childComponents = components.filter((comp) => comp.parentId === component.id)

    // 获取组件绑定的数据
    const componentData = getComponentData(component)

    // 根据组件类型渲染不同的内容
    const renderComponentContent = () => {
      switch (component.type) {
        case "text":
          return (
            <div
              className="p-2"
              style={{
                fontSize: `${props.fontSize}px`,
                fontWeight: props.fontWeight,
                color: props.color,
                textAlign: props.alignment as any,
                lineHeight: props.lineHeight,
                letterSpacing: props.letterSpacing,
                textTransform: props.textTransform as any,
                textDecoration: props.textDecoration as any,
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {props.content || "示例文本"}
            </div>
          )
        case "button":
          return (
            <Button
              variant={(props.variant as any) || "default"}
              size={(props.size as any) || "default"}
              disabled={props.disabled}
              className={props.fullWidth ? "w-full" : ""}
              style={{ ...themeStyle, ...animationStyle }}
            >
              {props.icon && props.iconPosition === "left" && <span className="mr-2">{renderIcon(props.icon)}</span>}
              {props.text || "按钮"}
              {props.icon && props.iconPosition === "right" && <span className="ml-2">{renderIcon(props.icon)}</span>}
            </Button>
          )
        case "image":
          return (
            <div style={{ ...animationStyle }}>
              <img
                src={props.src || "/placeholder.svg?height=200&width=300"}
                alt={props.alt || "示例图片"}
                width={props.width || 300}
                height={props.height || 200}
                className={cn(
                  "object-cover",
                  props.rounded && "rounded-lg",
                  props.shadow && "shadow-md",
                  props.border && "border",
                )}
                style={{ objectFit: (props.objectFit as any) || "cover" }}
              />
              {props.caption && <div className="mt-2 text-center text-sm text-muted-foreground">{props.caption}</div>}
            </div>
          )
        case "divider":
          return (
            <Separator
              className={cn(props.orientation === "vertical" ? "h-full" : "w-full")}
              style={{
                margin: props.margin || "1rem 0",
                borderStyle: props.style || "solid",
                borderColor: props.color || "#e2e8f0",
                borderWidth:
                  props.orientation === "horizontal"
                    ? `${props.thickness || 1}px 0 0 0`
                    : `0 0 0 ${props.thickness || 1}px`,
                ...animationStyle,
              }}
            />
          )
        case "data-table":
          return (
            <div className="w-full overflow-hidden rounded-md border" style={{ ...animationStyle }}>
              {props.title && <div className="bg-muted px-4 py-2 text-sm font-medium">{props.title}</div>}
              <div className="overflow-x-auto">
                <Table>
                  {componentData ? (
                    <>
                      <TableHeader>
                        <TableRow>
                          {(props.columns || []).map((column: TableColumn) => (
                            <TableHead key={column.key} className="whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                {column.title}
                                {column.sortable && <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                                {column.filterable && <Filter className="h-3 w-3 text-muted-foreground" />}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(componentData) && componentData.length > 0 ? (
                          componentData.slice(0, props.pageSize || 10).map((row: any, rowIndex: number) => (
                            <TableRow
                              key={rowIndex}
                              className={cn(props.striped && rowIndex % 2 === 1 && "bg-muted/50")}
                            >
                              {(props.columns || []).map((column: TableColumn) => (
                                <TableCell key={column.key} className="whitespace-nowrap">
                                  {row[column.dataIndex]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={(props.columns || []).length} className="h-24 text-center">
                              无数据
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </>
                  ) : (
                    <>
                      <TableHeader>
                        <TableRow>
                          {(props.columns || []).map((column: TableColumn) => (
                            <TableHead key={column.key} className="whitespace-nowrap">
                              {column.title}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={(props.columns || []).length} className="h-24 text-center">
                            请绑定数据源
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </>
                  )}
                </Table>
              </div>
              {props.pagination && (
                <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
                  <div className="text-sm text-muted-foreground">
                    共 {componentData && Array.isArray(componentData) ? componentData.length : 0} 条
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled>
                      上一页
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        case "data-list":
          return (
            <div className="w-full overflow-hidden rounded-md border" style={{ ...animationStyle }}>
              {props.title && <div className="bg-muted px-4 py-2 text-sm font-medium">{props.title}</div>}
              <div className="divide-y">
                {componentData && Array.isArray(componentData) && componentData.length > 0 ? (
                  componentData.slice(0, props.pageSize || 5).map((item: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex p-4",
                        props.itemLayout === "vertical" && "flex-col",
                        props.itemLayout !== "vertical" && "items-center",
                      )}
                    >
                      {props.listType === "avatar" && (
                        <div className={cn("mr-4", props.itemLayout === "vertical" && "mb-2")}>
                          <Avatar>
                            <AvatarImage src={item.avatar || ""} />
                            <AvatarFallback>{item.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.title || item.name || `项目 ${index + 1}`}</div>
                          {props.showExtra && (
                            <div className="text-sm text-muted-foreground">{item.date || "2023-01-01"}</div>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.description || "这是一个列表项描述"}
                        </div>
                        {props.showActions && (
                          <div className="mt-2 flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              查看
                            </Button>
                            <Button variant="ghost" size="sm">
                              编辑
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-muted-foreground">{componentData ? "无数据" : "请绑定数据源"}</p>
                  </div>
                )}
              </div>
              {props.pagination && (
                <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
                  <div className="text-sm text-muted-foreground">
                    共 {componentData && Array.isArray(componentData) ? componentData.length : 0} 条
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled>
                      上一页
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        case "data-card":
          return (
            <Card className="overflow-hidden" style={{ ...animationStyle }}>
              <CardHeader className={cn(props.cardType === "stats" && "pb-2")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {props.showIcon && props.iconPosition === "left" && (
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        {renderIcon(props.icon || "chart")}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{props.title || "数据卡片"}</CardTitle>
                      {props.cardType !== "stats" && (
                        <CardDescription>{componentData?.description || "数据卡片描述"}</CardDescription>
                      )}
                    </div>
                  </div>
                  {props.showIcon && props.iconPosition === "right" && (
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      {renderIcon(props.icon || "chart")}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {props.cardType === "stats" ? (
                  <div>
                    <div className="text-3xl font-bold">{componentData?.value || componentData?.count || 0}</div>
                    {props.showTrend && (
                      <div className="mt-1 flex items-center gap-1">
                        <Badge variant="outline" className="text-emerald-500">
                          +{componentData?.increase || "12.5"}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs 上期</span>
                      </div>
                    )}
                  </div>
                ) : props.cardType === "profile" ? (
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={componentData?.avatar || ""} />
                      <AvatarFallback>{componentData?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-lg font-medium">{componentData?.name || "用户名称"}</h3>
                    <p className="text-sm text-muted-foreground">{componentData?.title || "职位头衔"}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">关注</Button>
                      <Button size="sm" variant="outline">
                        消息
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {componentData ? (
                      <div className="space-y-2">
                        {Object.entries(componentData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm font-medium">{key}:</span>
                            <span className="text-sm">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">请绑定数据源</div>
                    )}
                  </div>
                )}
              </CardContent>
              {props.cardType !== "profile" && (
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    最后更新: {componentData?.updateTime || "2023-01-01 12:00:00"}
                  </div>
                </CardFooter>
              )}
            </Card>
          )
        case "bar-chart":
          return (
            <div
              className="overflow-hidden rounded-md border bg-card p-4"
              style={{ width: props.width || 500, height: props.height || 300, ...animationStyle }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium">{props.title || "柱状图"}</h3>
                {componentData ? (
                  <div className="text-sm text-muted-foreground">
                    共 {Array.isArray(componentData) ? componentData.length : 0} 条数据
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">请绑定数据源</div>
                )}
              </div>
              <div className="flex h-[calc(100%-3rem)] items-center justify-center">
                {componentData ? (
                  <div className="relative h-full w-full">
                    <BarChart className="h-full w-full text-primary/20" />
                    <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
                      {props.xField}: {props.yField}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <BarChart className="h-16 w-16" />
                    <span className="mt-2 text-sm">请绑定数据源</span>
                  </div>
                )}
              </div>
            </div>
          )
        case "line-chart":
          return (
            <div
              className="overflow-hidden rounded-md border bg-card p-4"
              style={{ width: props.width || 500, height: props.height || 300, ...animationStyle }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium">{props.title || "折线图"}</h3>
                {componentData ? (
                  <div className="text-sm text-muted-foreground">
                    共 {Array.isArray(componentData) ? componentData.length : 0} 条数据
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">请绑定数据源</div>
                )}
              </div>
              <div className="flex h-[calc(100%-3rem)] items-center justify-center">
                {componentData ? (
                  <div className="relative h-full w-full">
                    <LineChart className="h-full w-full text-primary/20" />
                    <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
                      {props.xField}: {props.yField}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <LineChart className="h-16 w-16" />
                    <span className="mt-2 text-sm">请绑定数据源</span>
                  </div>
                )}
              </div>
            </div>
          )
        case "pie-chart":
          return (
            <div
              className="overflow-hidden rounded-md border bg-card p-4"
              style={{ width: props.width || 500, height: props.height || 300, ...animationStyle }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium">{props.title || "饼图"}</h3>
                {componentData ? (
                  <div className="text-sm text-muted-foreground">
                    共 {Array.isArray(componentData) ? componentData.length : 0} 条数据
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">请绑定数据源</div>
                )}
              </div>
              <div className="flex h-[calc(100%-3rem)] items-center justify-center">
                {componentData ? (
                  <div className="relative h-full w-full">
                    <PieChart className="h-full w-full text-primary/20" />
                    <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
                      {props.colorField}: {props.valueField}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PieChart className="h-16 w-16" />
                    <span className="mt-2 text-sm">请绑定数据源</span>
                  </div>
                )}
              </div>
            </div>
          )
        case "input":
          return (
            <div className="space-y-2" style={{ ...animationStyle }}>
              {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
              <Input
                id={component.id}
                placeholder={props.placeholder || "请输入..."}
                disabled={props.disabled}
                required={props.required}
                type={props.type || "text"}
                defaultValue={props.defaultValue || ""}
                style={{ ...themeStyle }}
              />
              {props.helperText && <p className="text-xs text-muted-foreground">{props.helperText}</p>}
            </div>
          )
        case "textarea":
          return (
            <div className="space-y-2" style={{ ...animationStyle }}>
              {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
              <Textarea
                id={component.id}
                placeholder={props.placeholder || "请输入多行文本..."}
                disabled={props.disabled}
                required={props.required}
                rows={props.rows || 4}
                defaultValue={props.defaultValue || ""}
                style={{ ...themeStyle }}
              />
              {props.helperText && <p className="text-xs text-muted-foreground">{props.helperText}</p>}
            </div>
          )
        case "select":
          return (
            <div className="space-y-2" style={{ ...animationStyle }}>
              {props.label && <Label htmlFor={component.id}>{props.label}</Label>}
              <Select disabled={props.disabled} defaultValue={props.defaultValue || ""}>
                <SelectTrigger id={component.id} style={{ ...themeStyle }}>
                  <SelectValue placeholder={props.placeholder || "请选择..."} />
                </SelectTrigger>
                <SelectContent>
                  {(props.options || ["选项1", "选项2", "选项3"]).map((option: string, index: number) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {props.helperText && <p className="text-xs text-muted-foreground">{props.helperText}</p>}
            </div>
          )
        case "checkbox":
          return (
            <div className="space-y-2" style={{ ...animationStyle }}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={component.id}
                  disabled={props.disabled}
                  checked={props.checked}
                  defaultChecked={props.checked}
                />
                <Label htmlFor={component.id}>{props.label || "复选框"}</Label>
              </div>
              {props.helperText && <p className="text-xs text-muted-foreground">{props.helperText}</p>}
            </div>
          )
        case "radio":
          return (
            <div className="space-y-2" style={{ ...animationStyle }}>
              {props.label && <Label>{props.label}</Label>}
              <RadioGroup defaultValue={props.defaultValue || "option-1"}>
                {(props.options || ["选项1", "选项2", "选项3"]).map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={`option-${index + 1}`}
                      id={`${component.id}-${index}`}
                      disabled={props.disabled}
                    />
                    <Label htmlFor={`${component.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {props.helperText && <p className="text-xs text-muted-foreground">{props.helperText}</p>}
            </div>
          )
        case "card":
          return (
            <Card
              className={cn(
                props.shadow ? "shadow-md" : "",
                props.rounded ? "rounded-lg" : "",
                props.border ? "border" : "border-0",
              )}
              style={{
                padding: props.padding || "1rem",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {props.title && <div className="border-b p-4 font-medium">{props.title}</div>}
              <CardContent className="p-4">
                {childComponents.length > 0 ? (
                  childComponents.map((child) => (
                    <div
                      key={child.id}
                      className={cn(
                        "relative",
                        !isPreviewMode && "cursor-move",
                        selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                      )}
                      style={{
                        margin: child.properties?.margin || "0",
                        padding: child.properties?.padding || "0",
                        backgroundColor: child.properties?.bgColor || "transparent",
                      }}
                      onClick={(e) => {
                        if (isPreviewMode) return
                        e.stopPropagation()
                        handleSelectComponent(child)
                      }}
                    >
                      {renderComponent(child, component)}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">卡片内容</div>
                )}
              </CardContent>
            </Card>
          )
        case "grid-layout":
          return (
            <div
              className={cn(
                "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
                isDropTarget && "border-primary bg-primary/5",
                `grid-cols-${props.columns || 3}`,
                `gap-${props.gap || 2}`,
              )}
              style={{
                gridTemplateRows: props.autoRows
                  ? `repeat(auto-fill, ${props.rowHeight || "minmax(100px, auto)"})`
                  : "auto",
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "relative",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">网格布局</div>
              )}
            </div>
          )
        case "flex-layout":
          return (
            <div
              className={cn(
                "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
                isDropTarget && "border-primary bg-primary/5",
                props.direction === "column" ? "flex-col" : "flex-row",
                props.wrap ? "flex-wrap" : "flex-nowrap",
                `justify-${props.justifyContent || "start"}`,
                `items-${props.alignItems || "center"}`,
                `gap-${props.gap || 2}`,
              )}
              style={{
                display: "flex",
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "relative",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">弹性布局</div>
              )}
            </div>
          )
        case "split-layout":
          return (
            <div
              className={cn(
                "min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 flex",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{
                flexDirection: props.direction === "horizontal" ? "row" : "column",
                width: props.width || "100%",
                height: props.height || "300px",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              <div
                className="border-r border-dashed border-gray-300 overflow-hidden"
                style={{
                  width: props.direction === "horizontal" ? `${props.splitRatio || 30}%` : "100%",
                  height: props.direction === "vertical" ? `${props.splitRatio || 30}%` : "100%",
                  minWidth: props.direction === "horizontal" ? `${props.minSize || 100}px` : "auto",
                  minHeight: props.direction === "vertical" ? `${props.minSize || 100}px` : "auto",
                }}
              >
                {childComponents.length > 0 && childComponents[0] ? (
                  <div
                    className={cn(
                      "relative h-full w-full",
                      !isPreviewMode && "cursor-move",
                      selectedId === childComponents[0].id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(childComponents[0])
                    }}
                  >
                    {renderComponent(childComponents[0], component)}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    左侧/顶部区域
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {childComponents.length > 1 && childComponents[1] ? (
                  <div
                    className={cn(
                      "relative h-full w-full",
                      !isPreviewMode && "cursor-move",
                      selectedId === childComponents[1].id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(childComponents[1])
                    }}
                  >
                    {renderComponent(childComponents[1], component)}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    右侧/底部区域
                  </div>
                )}
              </div>
            </div>
          )
        case "tab-layout":
          return (
            <div
              className={cn(
                "min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              <Tabs defaultValue={props.defaultTab || "tab-1"}>
                <TabsList className="w-full">
                  {(
                    props.tabs || [
                      { id: "tab-1", label: "标签1" },
                      { id: "tab-2", label: "标签2" },
                    ]
                  ).map((tab: any) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(
                  props.tabs || [
                    { id: "tab-1", label: "标签1", content: "标签1内容" },
                    { id: "tab-2", label: "标签2", content: "标签2内容" },
                  ]
                ).map((tab: any, index: number) => (
                  <TabsContent key={tab.id} value={tab.id} className="p-4">
                    {childComponents[index] ? (
                      <div
                        className={cn(
                          "relative",
                          !isPreviewMode && "cursor-move",
                          selectedId === childComponents[index].id &&
                            !isPreviewMode &&
                            "ring-2 ring-primary ring-offset-2",
                        )}
                        onClick={(e) => {
                          if (isPreviewMode) return
                          e.stopPropagation()
                          handleSelectComponent(childComponents[index])
                        }}
                      >
                        {renderComponent(childComponents[index], component)}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">
                        {tab.content || `${tab.label}内容`}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )
        case "card-group":
          return (
            <div
              className={cn(
                "grid min-h-40 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
                isDropTarget && "border-primary bg-primary/5",
                `grid-cols-${props.columns || 3}`,
                `gap-${props.gap || 2}`,
              )}
              style={{
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <Card key={child.id} className="overflow-hidden">
                    <div
                      className={cn(
                        "relative",
                        !isPreviewMode && "cursor-move",
                        selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                      )}
                      onClick={(e) => {
                        if (isPreviewMode) return
                        e.stopPropagation()
                        handleSelectComponent(child)
                      }}
                    >
                      {renderComponent(child, component)}
                    </div>
                  </Card>
                ))
              ) : (
                <>
                  <Card className="p-4">
                    <div className="text-center text-sm text-muted-foreground">卡片1</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center text-sm text-muted-foreground">卡片2</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center text-sm text-muted-foreground">卡片3</div>
                  </Card>
                </>
              )}
            </div>
          )
        case "responsive-container":
          return (
            <div
              className={cn(
                "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
              data-component-id={component.id}
            >
              <div className="mb-2 flex items-center justify-between border-b pb-2">
                <span className="text-xs font-medium">响应式容器</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted"></div>
                  <div className="h-2 w-2 rounded-full bg-muted"></div>
                  <div className="h-2 w-2 rounded-full bg-muted"></div>
                </div>
              </div>
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "relative",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">响应式内容</div>
              )}
            </div>
          )
        case "container":
          return (
            <div
              className={cn(
                "min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4 relative",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{ ...themeStyle, ...animationStyle }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "absolute",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      left: `${child.position?.x || 0}px`,
                      top: `${child.position?.y || 0}px`,
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">容器</div>
              )}
            </div>
          )
        case "row":
          return (
            <div
              className={cn(
                "flex min-h-12 min-w-40 gap-2 rounded border-2 border-dashed border-gray-300 p-2",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{ ...themeStyle, ...animationStyle }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "relative",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">行</div>
              )}
            </div>
          )
        case "column":
          return (
            <div
              className={cn(
                "flex min-h-20 min-w-20 flex-col gap-2 rounded border-2 border-dashed border-gray-300 p-2",
                isDropTarget && "border-primary bg-primary/5",
              )}
              style={{ ...themeStyle, ...animationStyle }}
              data-component-id={component.id}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "relative",
                      !isPreviewMode && "cursor-move",
                      selectedId === child.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
                    }}
                    onClick={(e) => {
                      if (isPreviewMode) return
                      e.stopPropagation()
                      handleSelectComponent(child)
                    }}
                  >
                    {renderComponent(child, component)}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">列</div>
              )}
            </div>
          )
        default:
          return <div className="rounded border p-2">{component.name}</div>
      }
    }

    // 渲染图标的辅助函数
    const renderIcon = (iconName: string) => {
      // 这里可以根据iconName返回对应的图标组件
      // 简化实现，实际项目中可以使用lucide-react或其他图标库
      switch (iconName) {
        case "chart":
          return <BarChart className="h-4 w-4" />
        case "plus":
          return <span>+</span>
        case "minus":
          return <span>-</span>
        case "check":
          return <span>✓</span>
        case "x":
          return <span>×</span>
        default:
          return <span>⚪</span>
      }
    }

    // 如果是根级组件（没有父组件）
    if (!parentComponent) {
      return (
        <div
          key={component.id}
          className={cn(
            "absolute",
            !isPreviewMode && "cursor-grab",
            isDragging && selectedId === component.id && "cursor-grabbing",
            selectedId === component.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
            isDropTarget && "ring-2 ring-primary ring-offset-2",
          )}
          style={{
            left: `${component.position?.x || 0}px`,
            top: `${component.position?.y || 0}px`,
            width: component.properties?.width || "auto",
            height: component.properties?.height || "auto",
            margin: component.properties?.margin || "0",
            padding: component.properties?.padding || "0",
            backgroundColor: component.properties?.bgColor || "transparent",
            zIndex: isSelected ? 10 : 1,
          }}
          onMouseDown={(e) => handleMouseDown(e, component)}
          onClick={(e) => {
            if (isPreviewMode) return
            e.stopPropagation()
            handleSelectComponent(component)
          }}
          data-component-id={component.id}
        >
          {renderComponentContent()}
        </div>
      )
    }

    // 如果是子组件
    return renderComponentContent()
  }

  // 获取根级组件（没有父组件的组件）
  const rootComponents = components.filter((comp) => !comp.parentId)

  // 创建一个ref合并函数
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      // 设置canvasRef
      canvasRef.current = element
      // 设置drop ref
      drop(element)
    },
    [drop],
  )

  return (
    <div className="flex-1 bg-gray-50">
      {!isPreviewMode && (
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
          <span className="font-medium">画布</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="show-grid" className="text-xs">
                显示网格
              </Label>
              <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="snap-grid" className="text-xs">
                对齐网格
              </Label>
              <Switch id="snap-grid" checked={snapToGrid} onCheckedChange={setSnapToGrid} size="sm" />
            </div>
            <Button variant="outline" size="icon" onClick={handleClear} disabled={components.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className={isPreviewMode ? "h-[calc(100vh-3.5rem)]" : "h-[calc(100vh-7.5rem)]"}>
        <div
          id="canvas-area"
          ref={setRefs}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={cn(
            "relative min-h-[calc(100vh-7.5rem)] p-4",
            isOver && !isPreviewMode && "bg-blue-50",
            showGrid && !isPreviewMode && "bg-grid-pattern",
          )}
          style={{
            backgroundSize: "20px 20px",
            backgroundImage:
              showGrid && !isPreviewMode
                ? "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)"
                : "none",
            backgroundColor: theme?.backgroundColor || "#ffffff",
            color: theme?.textColor || "#000000",
            fontFamily: theme?.fontFamily || "system-ui, sans-serif",
            width: isPreviewMode ? `${viewportWidth}px` : "100%",
            cursor: isDragging ? "grabbing" : "default",
          }}
          onClick={() => {
            setSelectedId(null)
            onSelectComponent(null)
          }}
        >
          {activeDevice !== "desktop" && isPreviewMode && (
            <div className="absolute left-0 right-0 top-0 flex items-center justify-center bg-muted/50 py-2">
              <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs shadow-sm">
                {activeDevice === "mobile" ? <Smartphone className="h-3 w-3" /> : <Tablet className="h-3 w-3" />}
                <span>
                  {activeDevice === "mobile" ? "移动设备" : "平板设备"} ({viewportWidth}px)
                </span>
              </div>
            </div>
          )}

          {rootComponents.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <p>将组件拖拽到此处或选择一个模板开始</p>
              </div>
            </div>
          ) : (
            rootComponents.map((component) => renderComponent(component))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
