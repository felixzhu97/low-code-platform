"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentPanel } from "@/components/component-panel"
import { Canvas } from "@/components/canvas"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { ResponsiveControls } from "@/components/responsive-controls"
import type { Component, ThemeConfig } from "@/src/shared/utils/types"
import { type HistoryState, createHistory, addToHistory, undo, redo } from "@/src/shared/utils/history"
import { Button } from "@/src/shared/ui/button"
import { Eye, Undo2, Redo2, HelpCircle, BookOpenIcon } from "lucide-react"
import { ComponentTree } from "@/components/component-tree"
import { toast } from "@/src/shared/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/shared/ui/dialog"

// 懒加载大型组件，减轻首屏加载负担
const PropertiesPanel = lazy(() => import("@/components/properties-panel").then(mod => ({ default: mod.PropertiesPanel })))
const DataPanel = lazy(() => import("@/components/data-panel").then(mod => ({ default: mod.DataPanel })))
const CodeExport = lazy(() => import("@/components/code-export").then(mod => ({ default: mod.CodeExport })))
const TemplateGallery = lazy(() => import("@/components/template-gallery").then(mod => ({ default: mod.TemplateGallery })))
const ThemeEditor = lazy(() => import("@/components/theme-editor").then(mod => ({ default: mod.ThemeEditor })))
const FormBuilder = lazy(() => import("@/components/form-builder").then(mod => ({ default: mod.FormBuilder })))
const AnimationEditor = lazy(() => import("@/components/animation-editor").then(mod => ({ default: mod.AnimationEditor })))
const Collaboration = lazy(() => import("@/components/collaboration").then(mod => ({ default: mod.Collaboration })))
const ComponentLibraryManager = lazy(() => import("@/components/component-library-manager").then(mod => ({ default: mod.ComponentLibraryManager })))
const ComponentGrouping = lazy(() => import("@/components/component-grouping").then(mod => ({ default: mod.ComponentGrouping })))

// 懒加载的组件包装器
const LazyComponentWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="p-4 flex items-center justify-center">加载中...</div>}>
    {children}
  </Suspense>
)

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
  
  // 添加教程模式状态
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  // 从本地存储加载是否首次访问的状态
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  // 初始化时检查是否是首次访问
  useEffect(() => {
    const visitedBefore = localStorage.getItem('lowCodePlatformVisited')
    if (visitedBefore) {
      setIsFirstVisit(false)
    } else {
      setIsFirstVisit(true)
      // 可以弹出欢迎对话框询问是否要开启教程
    }
  }, [])

  // 完成首次访问的标记
  const markAsVisited = () => {
    localStorage.setItem('lowCodePlatformVisited', 'true')
    setIsFirstVisit(false)
  }

  // 开始教程
  const startTutorial = () => {
    setShowTutorial(true)
    setTutorialStep(0)
    markAsVisited()
  }

  // 跳过教程
  const skipTutorial = () => {
    setShowTutorial(false)
    markAsVisited()
  }

  // 教程步骤
  const nextTutorialStep = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      // 完成教程
      setShowTutorial(false)
    }
  }

  // 定义教程步骤
  const TUTORIAL_STEPS = [
    {
      title: "欢迎使用低代码平台",
      description: "这个平台可以帮助您快速创建应用程序，无需编写大量代码。",
      target: ".tutorial-header",
      placement: "bottom",
    },
    {
      title: "组件面板",
      description: "从这里拖拽组件到画布上，快速构建您的应用界面。",
      target: ".tutorial-components",
      placement: "right",
    },
    {
      title: "画布",
      description: "这是您的工作区域，所有组件都会放置在这里。",
      target: ".tutorial-canvas",
      placement: "bottom",
    },
    {
      title: "属性面板",
      description: "选中组件后，可以在这里编辑其属性和样式。",
      target: ".tutorial-properties",
      placement: "left",
    },
    {
      title: "模板库",
      description: "使用预设的模板快速开始您的项目。",
      target: ".tutorial-templates",
      placement: "bottom",
    },
    {
      title: "预览和导出",
      description: "预览您的应用或导出代码以便部署。",
      target: ".tutorial-preview",
      placement: "bottom",
    },
  ]

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
      {/* 首次访问欢迎对话框 */}
      {isFirstVisit && (
        <Dialog open={isFirstVisit} onOpenChange={(open) => !open && skipTutorial()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>👋 欢迎使用低代码平台</DialogTitle>
              <DialogDescription>
                这是一个强大的低代码开发工具，可以帮助您快速构建应用。您可以使用我们的引导教程快速了解平台功能。
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={skipTutorial}>跳过教程</Button>
              <Button onClick={startTutorial}>开始教程</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 教程提示 */}
      {showTutorial && tutorialStep < TUTORIAL_STEPS.length && (
        <div className="fixed z-50 inset-0 bg-black/50 pointer-events-none">
          <div 
            className="absolute p-4 bg-background rounded-lg shadow-lg pointer-events-auto border border-primary"
            style={{
              width: "300px",
              // 根据target和placement动态定位，这里仅做示例
              // 实际应用中应该基于目标元素的位置计算
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{TUTORIAL_STEPS[tutorialStep].title}</h3>
              <p className="text-sm text-muted-foreground">{TUTORIAL_STEPS[tutorialStep].description}</p>
              <div className="flex justify-between mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTutorial(false)}
                >
                  退出教程
                </Button>
                <Button 
                  size="sm" 
                  onClick={nextTutorialStep}
                >
                  {tutorialStep < TUTORIAL_STEPS.length - 1 ? "下一步" : "完成"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen flex-col">
        <Header data-tutorial="header">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={componentsHistory.past.length === 0}>
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={componentsHistory.future.length === 0}>
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
            <Button variant="outline" size="sm" onClick={togglePreviewMode} data-tutorial="preview">
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? "退出预览" : "预览"}
            </Button>
            <ResponsiveControls onViewportChange={handleViewportChange} />
            <LazyComponentWrapper>
              <TemplateGallery onSelectTemplate={handleSelectTemplate} theme={theme} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <FormBuilder onAddForm={handleAddForm} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <ComponentGrouping components={components} onGroupComponents={handleGroupComponents} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <AnimationEditor componentId={selectedComponent?.id || null} onApplyAnimation={handleApplyAnimation} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <Collaboration projectName={projectName} />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <ComponentLibraryManager
                customComponents={customComponents}
                onAddComponent={handleAddCustomComponent}
                onRemoveComponent={handleRemoveCustomComponent}
                onImportComponents={handleImportComponents}
                existingComponents={components}
              />
            </LazyComponentWrapper>
            <LazyComponentWrapper>
              <CodeExport components={components} />
            </LazyComponentWrapper>
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-64 border-r" data-tutorial="components">
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
                <LazyComponentWrapper>
                  <DataPanel />
                </LazyComponentWrapper>
              </TabsContent>
            </Tabs>
          )}
          <div
            className="flex-1 overflow-auto"
            data-tutorial="canvas"
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
            <LazyComponentWrapper>
              <PropertiesPanel 
                selectedComponent={selectedComponent} 
                onUpdateComponent={handleUpdateComponent}
                data-tutorial="properties"
              />
            </LazyComponentWrapper>
          )}
        </div>
        
        {/* 底部工具栏，包含帮助按钮 */}
        {!previewMode && (
          <div className="border-t py-2 px-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {projectName}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                教程
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open('https://example.com/docs', '_blank')}
              >
                <BookOpenIcon className="mr-2 h-4 w-4" />
                文档
              </Button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
