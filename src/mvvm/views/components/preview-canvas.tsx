"use client"

import type React from "react"

import { useRef } from "react"
import type {Component, ThemeConfig} from "@/mvvm/models/types"

interface PreviewCanvasProps {
  components: Component[]
  width: number
  theme?: ThemeConfig
  isAnimating?: boolean
}

export function PreviewCanvas({ components, width, theme, isAnimating = false }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  // 递归渲染组件
  const renderComponent = (component: Component, parentComponent: Component | null = null) => {
    // 如果组件被设置为不可见，则不渲染
    if (component.properties?.visible === false) {
      return null
    }

    const props = component.properties || {}
    const animation = props.animation

    // 应用动画样式
    let animationStyle = {}
    if (animation && isAnimating) {
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
            <button
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                props.variant === "outline"
                  ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } ${props.fullWidth ? "w-full" : ""}`}
              disabled={props.disabled}
              style={{ ...themeStyle, ...animationStyle }}
            >
              {props.text || "按钮"}
            </button>
          )
        case "image":
          return (
            <div style={{ ...animationStyle }}>
              <img
                src={props.src || "/placeholder.svg?height=200&width=300"}
                alt={props.alt || "示例图片"}
                width={props.width || 300}
                height={props.height || 200}
                className={`object-cover ${props.rounded ? "rounded-lg" : ""} ${
                  props.shadow ? "shadow-md" : ""
                } ${props.border ? "border" : ""}`}
                style={{ objectFit: (props.objectFit as any) || "cover" }}
              />
              {props.caption && <div className="mt-2 text-center text-sm text-muted-foreground">{props.caption}</div>}
            </div>
          )
        case "divider":
          return (
            <hr
              className={props.orientation === "vertical" ? "h-full" : "w-full"}
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
        case "card":
          return (
            <div
              className={`rounded-lg ${props.shadow ? "shadow-md" : ""} ${
                props.rounded ? "rounded-lg" : ""
              } ${props.border ? "border" : "border-0"}`}
              style={{
                padding: props.padding || "1rem",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {props.title && <div className="border-b p-4 font-medium">{props.title}</div>}
              <div className="p-4">
                {childComponents.length > 0 ? (
                  childComponents.map((child) => (
                    <div
                      key={child.id}
                      className="relative"
                      style={{
                        margin: child.properties?.margin || "0",
                        padding: child.properties?.padding || "0",
                        backgroundColor: child.properties?.bgColor || "transparent",
                      }}
                    >
                      {renderComponent(child, component)}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">卡片内容</div>
                )}
              </div>
            </div>
          )
        case "grid-layout":
          return (
            <div
              className="grid min-h-40 min-w-40 rounded p-4"
              style={{
                gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
                gap: props.gap ? `${props.gap * 0.25}rem` : "0.5rem",
                gridTemplateRows: props.autoRows
                  ? `repeat(auto-fill, ${props.rowHeight || "minmax(100px, auto)"})`
                  : "auto",
                width: props.width || "100%",
                height: props.height || "auto",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className="relative"
                    style={{
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
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
              style={{
                display: "flex",
                flexDirection: props.direction === "column" ? "column" : "row",
                flexWrap: props.wrap ? "wrap" : "nowrap",
                justifyContent: props.justifyContent || "flex-start",
                alignItems: props.alignItems || "center",
                gap: props.gap ? `${props.gap * 0.25}rem` : "0.5rem",
                padding: "1rem",
                width: props.width || "100%",
                height: props.height || "auto",
                minHeight: "40px",
                minWidth: "40px",
                ...themeStyle,
                ...animationStyle,
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className="relative"
                    style={{
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
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
        case "container":
          return (
            <div
              className="relative min-h-20 min-w-40 rounded p-4"
              style={{
                ...themeStyle,
                ...animationStyle,
                width: props.width || "100%",
                height: props.height || "auto",
                backgroundColor: props.bgColor || "transparent",
              }}
            >
              {childComponents.length > 0 ? (
                childComponents.map((child) => (
                  <div
                    key={child.id}
                    className="absolute"
                    style={{
                      left: `${child.position?.x || 0}px`,
                      top: `${child.position?.y || 0}px`,
                      width: child.properties?.width || "auto",
                      height: child.properties?.height || "auto",
                      margin: child.properties?.margin || "0",
                      padding: child.properties?.padding || "0",
                      backgroundColor: child.properties?.bgColor || "transparent",
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
        default:
          return <div className="rounded border p-2">{component.name || component.type}</div>
      }
    }

    // 如果是根级组件（没有父组件）
    if (!parentComponent) {
      return (
        <div
          key={component.id}
          className="absolute"
          style={{
            left: `${component.position?.x || 0}px`,
            top: `${component.position?.y || 0}px`,
            width: component.properties?.width || "auto",
            height: component.properties?.height || "auto",
            margin: component.properties?.margin || "0",
            padding: component.properties?.padding || "0",
            backgroundColor: component.properties?.bgColor || "transparent",
          }}
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

  // 计算画布高度 - 确保至少有足够的空间来容纳所有组件
  const calculateCanvasHeight = () => {
    if (rootComponents.length === 0) return 500

    let maxHeight = 500 // 默认最小高度

    rootComponents.forEach((component) => {
      const compHeight = component.properties?.height ? Number.parseInt(component.properties.height.toString()) : 0
      const compY = component.position?.y || 0

      const totalHeight = compY + compHeight + 100 // 添加一些额外空间
      if (totalHeight > maxHeight) {
        maxHeight = totalHeight
      }
    })

    return maxHeight
  }

  // 计算画布宽度 - 确保至少有足够的空间来容纳所有组件
  const calculateCanvasWidth = () => {
    if (rootComponents.length === 0) return width

    let maxWidth = width // 默认最小宽度

    rootComponents.forEach((component) => {
      const compWidth = component.properties?.width ? Number.parseInt(component.properties.width.toString()) : 0
      const compX = component.position?.x || 0

      const totalWidth = compX + compWidth + 100 // 添加一些额外空间
      if (totalWidth > maxWidth) {
        maxWidth = totalWidth
      }
    })

    return maxWidth
  }

  const canvasWidth = calculateCanvasWidth()
  const canvasHeight = calculateCanvasHeight()

  return (
    <div
      ref={canvasRef}
      className="relative"
      style={{
        backgroundColor: theme?.backgroundColor || "#ffffff",
        color: theme?.textColor || "#000000",
        fontFamily: theme?.fontFamily || "system-ui, sans-serif",
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        overflow: "hidden",
      }}
    >
      {rootComponents.length === 0 ? (
        <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center text-muted-foreground">
            <p>此模板没有组件</p>
          </div>
        </div>
      ) : (
        rootComponents.map((component) => renderComponent(component))
      )}
    </div>
  )
}
