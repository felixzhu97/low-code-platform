"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDrop } from "react-dnd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Undo2, Redo2, Trash2, Smartphone, Tablet } from "lucide-react"
import { type HistoryState, undo, redo, addToHistory, createHistory } from "@/lib/history"
import type { Component, ThemeConfig } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CanvasProps = {
  onSelectComponent: (component: Component | null) => void
  isPreviewMode?: boolean
  theme?: ThemeConfig
  viewportWidth?: number
  activeDevice?: string
}

export function Canvas({
  onSelectComponent,
  isPreviewMode = false,
  theme,
  viewportWidth = 1280,
  activeDevice = "desktop",
}: CanvasProps) {
  const [history, setHistory] = useState<HistoryState<Component[]>>(createHistory([]))
  const [showGrid, setShowGrid] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const components = history.present

  useEffect(() => {
    if (isPreviewMode) {
      setSelectedId(null)
    }
  }, [isPreviewMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewMode) return

      // Undo: Ctrl+Z or Command+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      // Redo: Ctrl+Y or Command+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault()
        handleDeleteSelected()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId, history, isPreviewMode])

  const handleUndo = () => {
    setHistory(undo(history))
  }

  const handleRedo = () => {
    setHistory(redo(history))
  }

  const handleClear = () => {
    setHistory(createHistory([]))
    setSelectedId(null)
    onSelectComponent(null)
  }

  const handleDeleteSelected = () => {
    if (!selectedId) return

    const newComponents = components.filter((comp) => comp.id !== selectedId)
    setHistory(addToHistory(history, newComponents))
    setSelectedId(null)
    onSelectComponent(null)
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "COMPONENT",
      drop: (item: any, monitor) => {
        if (isPreviewMode) return

        const offset = monitor.getClientOffset()
        const canvasRect = document.getElementById("canvas-area")?.getBoundingClientRect()

        if (offset && canvasRect) {
          let x = offset.x - canvasRect.left
          let y = offset.y - canvasRect.top

          // Snap to grid if enabled
          if (snapToGrid) {
            const gridSize = 20
            x = Math.round(x / gridSize) * gridSize
            y = Math.round(y / gridSize) * gridSize
          }

          const newComponent: Component = {
            ...item,
            id: `${item.type}-${Date.now()}`,
            position: { x, y },
            properties: getDefaultProperties(item.type),
          }

          setHistory(addToHistory(history, [...components, newComponent]))
          return newComponent
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [components, snapToGrid, isPreviewMode],
  )

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case "text":
        return {
          content: "示例文本",
          fontSize: 16,
          fontWeight: "normal",
          color: theme?.textColor || "#000000",
          alignment: "left",
        }
      case "button":
        return {
          text: "按钮",
          variant: "default",
          size: "default",
          disabled: false,
        }
      case "input":
        return {
          placeholder: "请输入...",
          disabled: false,
          required: false,
          type: "text",
        }
      case "textarea":
        return {
          placeholder: "请输入多行文本...",
          disabled: false,
          required: false,
          rows: 4,
        }
      case "select":
        return {
          placeholder: "请选择...",
          disabled: false,
          required: false,
          options: ["选项1", "选项2", "选项3"],
        }
      case "checkbox":
        return {
          label: "复选框",
          checked: false,
          disabled: false,
        }
      case "radio":
        return {
          options: ["选项1", "选项2", "选项3"],
          disabled: false,
        }
      case "card":
        return {
          title: "卡片标题",
          shadow: true,
        }
      default:
        return {}
    }
  }

  const handleSelectComponent = (component: Component) => {
    if (isPreviewMode) return

    setSelectedId(component.id)
    onSelectComponent(component)
  }

  const renderComponent = (component: Component) => {
    const isSelected = component.id === selectedId && !isPreviewMode
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
            style={{ ...themeStyle, ...animationStyle }}
          >
            {props.text || "按钮"}
          </Button>
        )
      case "input":
        return (
          <Input
            placeholder={props.placeholder || "请输入..."}
            disabled={props.disabled}
            required={props.required}
            type={props.type || "text"}
            style={{ ...themeStyle, ...animationStyle }}
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={props.placeholder || "请输入多行文本..."}
            disabled={props.disabled}
            required={props.required}
            rows={props.rows || 4}
            style={{ ...themeStyle, ...animationStyle }}
          />
        )
      case "select":
        return (
          <Select disabled={props.disabled}>
            <SelectTrigger style={{ ...themeStyle, ...animationStyle }}>
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
        )
      case "checkbox":
        return (
          <div className="flex items-center gap-2" style={{ ...animationStyle }}>
            <Checkbox id={component.id} disabled={props.disabled} checked={props.checked} />
            <Label htmlFor={component.id}>{props.label || "复选框"}</Label>
          </div>
        )
      case "radio":
        return (
          <RadioGroup defaultValue="option-1" style={{ ...animationStyle }}>
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
        )
      case "card":
        return (
          <Card className={cn(props.shadow ? "shadow-md" : "")} style={{ ...themeStyle, ...animationStyle }}>
            {props.title && <div className="border-b p-4 font-medium">{props.title}</div>}
            <CardContent className="p-4">卡片内容</CardContent>
          </Card>
        )
      case "divider":
        return <Separator className="my-2" style={{ ...animationStyle }} />
      case "container":
        return (
          <div
            className="min-h-20 min-w-40 rounded border-2 border-dashed border-gray-300 p-4"
            style={{ ...themeStyle, ...animationStyle }}
          >
            {component.children && component.children.length > 0 ? (
              component.children.map((child) => (
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
                  {renderComponent(child)}
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
            className="flex min-h-12 min-w-40 gap-2 rounded border-2 border-dashed border-gray-300 p-2"
            style={{ ...themeStyle, ...animationStyle }}
          >
            {component.children && component.children.length > 0 ? (
              component.children.map((child) => (
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
                  {renderComponent(child)}
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
            className="flex min-h-20 min-w-20 flex-col gap-2 rounded border-2 border-dashed border-gray-300 p-2"
            style={{ ...themeStyle, ...animationStyle }}
          >
            {component.children && component.children.length > 0 ? (
              component.children.map((child) => (
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
                  {renderComponent(child)}
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleUndo} disabled={history.past.length === 0}>
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRedo} disabled={history.future.length === 0}>
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleClear} disabled={components.length === 0}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <ScrollArea className={isPreviewMode ? "h-[calc(100vh-3.5rem)]" : "h-[calc(100vh-7.5rem)]"}>
        <div
          id="canvas-area"
          ref={drop}
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

          {components.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <p>将组件拖拽到此处或选择一个模板开始</p>
              </div>
            </div>
          ) : (
            components.map((component) => (
              <div
                key={component.id}
                className={cn(
                  "absolute",
                  !isPreviewMode && "cursor-move",
                  selectedId === component.id && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
                )}
                style={{
                  left: `${component.position?.x || 0}px`,
                  top: `${component.position?.y || 0}px`,
                  width: component.properties?.width || "auto",
                  height: component.properties?.height || "auto",
                  margin: component.properties?.margin || "0",
                  padding: component.properties?.padding || "0",
                  backgroundColor: component.properties?.bgColor || "transparent",
                }}
                onClick={(e) => {
                  if (isPreviewMode) return
                  e.stopPropagation()
                  handleSelectComponent(component)
                }}
              >
                {renderComponent(component)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
