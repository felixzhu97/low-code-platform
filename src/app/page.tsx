"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentPanel } from "@/src/presentation/components/component-panel"
import { Canvas } from "@/src/presentation/components/canvas"
import { PropertiesPanel } from "@/src/presentation/components/properties-panel"
import { Header } from "@/src/presentation/components/header"
import { DataPanel } from "@/src/presentation/components/data-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { CodeExport } from "@/src/presentation/components/code-export"
import { TemplateGallery } from "@/src/presentation/components/template-gallery"
import { ResponsiveControls } from "@/src/presentation/components/responsive-controls"
import { ThemeEditor } from "@/src/presentation/components/theme-editor"
import { FormBuilder } from "@/src/presentation/components/form-builder"
import { AnimationEditor } from "@/src/presentation/components/animation-editor"
import { Collaboration } from "@/src/presentation/components/collaboration"
import type {Component, ThemeConfig} from "@/src/domain/entities/types"
import { type HistoryState, createHistory, addToHistory, undo, redo } from "@/src/application/services/history"
import { Button } from "@/src/presentation/components/ui/button"
import { Eye, Undo2, Redo2 } from "lucide-react"
import { ComponentLibraryManager } from "@/src/presentation/components/component-library-manager"
import { ComponentGrouping } from "@/src/presentation/components/component-grouping"
import { ComponentTree } from "@/src/presentation/components/component-tree"
import { toast } from "@/src/presentation/components/ui/use-toast"

export default function LowCodePlatform() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [activeTab, setActiveTab] = useState("components")
  const [componentsHistory, setComponentsHistory] = useState<HistoryState<Component[]>>(createHistory([]))
  const [previewMode, setPreviewMode] = useState(false)
  const [projectName, setProjectName] = useState("我的低代码项目")
  const [viewportWidth, setViewportWidth] = useState<number>(1280)
  const [activeDevice, setActiveDevice] = useState<string>("desktop")
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: "#0070f3",
    secondaryColor: "#6c757d",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "0.375rem",
    spacing: "1rem",
  })

  const [customComponents, setCustomComponents] = useState<any[]>([])

  const components = componentsHistory.present

  // 添加调试日志
  useEffect(() => {
    console.log("Current components:", components)
  }, [components])

  const handleAddCustomComponent = (component: any) => {
    setCustomComponents([...customComponents, component])
  }

  const handleRemoveCustomComponent = (componentId: string) => {
    setCustomComponents(customComponents.filter((c) => c.id !== componentId))
  }

  const handleImportComponents = (components: any[]) => {
    setCustomComponents([...customComponents, ...components])
  }

  const handleUpdateComponent = (id: string, properties: any) => {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return { ...component, properties }
      }
      return component
    })

    setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
  }

  const handleSelectComponent = (component: Component | null) => {
    setSelectedComponent(component)
  }

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
    if (!previewMode) {
      // 进入预览模式时取消选中组件
      setSelectedComponent(null)
    }
  }

  const handleUndo = () => {
    setComponentsHistory(undo(componentsHistory))
  }

  const handleRedo = () => {
    setComponentsHistory(redo(componentsHistory))
  }

  const handleViewportChange = (width: number, device: string) => {
    setViewportWidth(width)
    setActiveDevice(device)
  }

  const handleThemeChange = (newTheme: ThemeConfig) => {
    setTheme(newTheme)
  }

  // 处理模板选择
  const handleSelectTemplate = (templateComponents: Component[]) => {
    try {
      console.log("应用模板组件:", templateComponents)

      // 为每个组件生成新的唯一ID，避免ID冲突
      const processedComponents = templateComponents.map((component) => {
        // 生成新ID
        const newId = `${component.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // 记录旧ID到新ID的映射，用于更新parentId和children引用
        const idMapping = { [component.id]: newId }

        return {
          ...component,
          id: newId,
          // 暂时保留原始ID作为临时属性，后续处理完成后会删除
          _originalId: component.id,
        }
      })

      // 第二次遍历，更新所有组件的parentId和children引用
      const finalComponents = processedComponents.map((component) => {
        // 创建组件的副本
        const updatedComponent = { ...component }

        // 删除临时属性
        delete updatedComponent._originalId

        // 更新parentId引用
        if (component.parentId) {
          // 查找对应的新parentId
          const parentComponent = processedComponents.find((c) => c._originalId === component.parentId)
          updatedComponent.parentId = parentComponent ? parentComponent.id : null
        }

        // 更新children引用
        if (component.children && Array.isArray(component.children)) {
          updatedComponent.children = component.children.map((childId) => {
            const childComponent = processedComponents.find((c) => c._originalId === childId)
            return childComponent ? childComponent.id : childId
          })
        }

        return updatedComponent
      })

      // 应用处理后的组件到画布
      setComponentsHistory(addToHistory(componentsHistory, finalComponents))

      // 显示成功提示
      toast({
        title: "模板应用成功",
        description: `已添加 ${finalComponents.length} 个组件到画布`,
      })
    } catch (error) {
      console.error("应用模板时出错:", error)
      toast({
        title: "应用模板失败",
        description: "处理模板时发生错误，请查看控制台获取详细信息",
        variant: "destructive",
      })
    }
  }

  const handleAddForm = (formComponents: Component[]) => {
    setComponentsHistory(addToHistory(componentsHistory, [...components, ...formComponents]))
  }

  const handleApplyAnimation = (componentId: string, animation: any) => {
    const updatedComponents = components.map((component) => {
      if (component.id === componentId) {
        return {
          ...component,
          properties: {
            ...component.properties,
            animation,
          },
        }
      }
      return component
    })

    setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
  }

  const handleGroupComponents = (componentIds: string[], groupName: string) => {
    if (componentIds.length < 2) return

    // 找出要分组的组件
    const groupComponents = components.filter((c) => componentIds.includes(c.id))

    // 计算组的位置（使用第一个组件的位置）
    const firstComponent = groupComponents[0]
    const groupPosition = firstComponent.position || { x: 0, y: 0 }

    // 创建组容器
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
    }

    // 调整子组件的位置为相对于组的位置
    const childComponents = groupComponents.map((component) => {
      const relativeX = (component.position?.x || 0) - groupPosition.x
      const relativeY = (component.position?.y || 0) - groupPosition.y

      return {
        ...component,
        position: { x: relativeX, y: relativeY },
        parentId: groupContainer.id,
      }
    })

    groupContainer.children = childComponents

    // 从画布中移除被分组的组件
    const remainingComponents = components.filter((c) => !componentIds.includes(c.id))

    // 添加新的组容器
    setComponentsHistory(addToHistory(componentsHistory, [...remainingComponents, groupContainer]))
  }

  // 处理组件树中的组件删除
  const handleDeleteComponent = (id: string) => {
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

    const newComponents = deleteComponentAndChildren(id, components)
    setComponentsHistory(addToHistory(componentsHistory, newComponents))

    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  // 处理组件可见性切换
  const handleToggleVisibility = (id: string, visible: boolean) => {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          properties: {
            ...component.properties,
            visible: !visible,
          },
        }
      }
      return component
    })

    setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
  }

  // 处理组件移动
  const handleMoveComponent = (id: string, targetParentId: string | null) => {
    const componentToMove = components.find((comp) => comp.id === id)
    if (!componentToMove) return

    // 如果目标是画布（targetParentId为null）
    if (targetParentId === null) {
      // 如果组件已经在画布上，不需要移动
      if (componentToMove.parentId === null) return

      // 找到当前父组件，计算全局位置
      const calculateGlobalPosition = (comp: Component): { x: number; y: number } => {
        if (!comp.parentId) {
          return comp.position || { x: 0, y: 0 }
        }

        const parent = components.find((p) => p.id === comp.parentId)
        if (!parent) {
          return comp.position || { x: 0, y: 0 }
        }

        const parentPos = calculateGlobalPosition(parent)
        return {
          x: (comp.position?.x || 0) + parentPos.x,
          y: (comp.position?.y || 0) + parentPos.y,
        }
      }

      const globalPosition = calculateGlobalPosition(componentToMove)

      // 更新组件，移动到画布上
      const updatedComponents = components.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            parentId: null,
            position: globalPosition,
          }
        }
        return comp
      })

      setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
    } else {
      // 移动到目标容器中
      const updatedComponents = components.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            parentId: targetParentId,
            position: { x: 10, y: 10 }, // 设置相对于容器的初始位置
          }
        }
        return comp
      })

      setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <Header>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={componentsHistory.past.length === 0}>
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={componentsHistory.future.length === 0}>
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? "退出预览" : "预览"}
            </Button>
            <ResponsiveControls onViewportChange={handleViewportChange} />
            <TemplateGallery onSelectTemplate={handleSelectTemplate} theme={theme} />
            <FormBuilder onAddForm={handleAddForm} />
            <ComponentGrouping components={components} onGroupComponents={handleGroupComponents} />
            <AnimationEditor componentId={selectedComponent?.id || null} onApplyAnimation={handleApplyAnimation} />
            <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
            <Collaboration projectName={projectName} />
            <ComponentLibraryManager
              customComponents={customComponents}
              onAddComponent={handleAddCustomComponent}
              onRemoveComponent={handleRemoveCustomComponent}
              onImportComponents={handleImportComponents}
              existingComponents={components}
            />
            <CodeExport components={components} />
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-64 border-r">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="components">组件</TabsTrigger>
                <TabsTrigger value="tree">组件树</TabsTrigger>
                <TabsTrigger value="data">数据</TabsTrigger>
              </TabsList>
              <TabsContent
                value="components"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <ComponentPanel />
              </TabsContent>
              <TabsContent value="tree" className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ComponentTree
                  components={components}
                  selectedId={selectedComponent?.id || null}
                  onSelectComponent={handleSelectComponent}
                  onDeleteComponent={handleDeleteComponent}
                  onToggleVisibility={handleToggleVisibility}
                  onMoveComponent={handleMoveComponent}
                />
              </TabsContent>
              <TabsContent value="data" className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <DataPanel />
              </TabsContent>
            </Tabs>
          )}
          <div
            className="flex-1 overflow-auto"
            style={{
              maxWidth: previewMode ? viewportWidth + "px" : "none",
              margin: previewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas
              onSelectComponent={handleSelectComponent}
              isPreviewMode={previewMode}
              theme={theme}
              viewportWidth={viewportWidth}
              activeDevice={activeDevice}
              components={components}
              onUpdateComponents={(updatedComponents) =>
                setComponentsHistory(addToHistory(componentsHistory, updatedComponents))
              }
            />
          </div>
          {!previewMode && (
            <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={handleUpdateComponent} />
          )}
        </div>
      </div>
    </DndProvider>
  )
}
