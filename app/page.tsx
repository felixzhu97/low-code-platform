"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentPanel } from "@/components/component-panel"
import { Canvas } from "@/components/canvas"
import { PropertiesPanel } from "@/components/properties-panel"
import { Header } from "@/components/header"
import { DataPanel } from "@/components/data-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeExport } from "@/components/code-export"
import { TemplateGallery } from "@/components/template-gallery"
import { ResponsiveControls } from "@/components/responsive-controls"
import { ThemeEditor } from "@/components/theme-editor"
import { FormBuilder } from "@/components/form-builder"
import { AnimationEditor } from "@/components/animation-editor"
import { Collaboration } from "@/components/collaboration"
import type { Component, ThemeConfig } from "@/lib/types"
import { type HistoryState, createHistory, addToHistory, undo, redo } from "@/lib/history"
import { Button } from "@/components/ui/button"
import { Eye, Undo2, Redo2 } from "lucide-react"

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

  const components = componentsHistory.present

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

  const handleSelectTemplate = (templateComponents: Component[]) => {
    setComponentsHistory(addToHistory(componentsHistory, templateComponents))
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
            <TemplateGallery onSelectTemplate={handleSelectTemplate} />
            <FormBuilder onAddForm={handleAddForm} />
            <AnimationEditor componentId={selectedComponent?.id || null} onApplyAnimation={handleApplyAnimation} />
            <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
            <Collaboration projectName={projectName} />
            <CodeExport components={components} />
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-64 border-r">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">组件</TabsTrigger>
                <TabsTrigger value="data">数据</TabsTrigger>
              </TabsList>
              <TabsContent
                value="components"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <ComponentPanel />
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
