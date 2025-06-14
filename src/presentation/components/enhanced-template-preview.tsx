"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PreviewCanvas } from "@/components/preview-canvas"
import { Button } from "@/components/ui/button"
import { Smartphone, Tablet, Monitor, Code, Layout, FileJson } from "lucide-react"
import type { ThemeConfig } from "@/lib/types"
import { VirtualList } from "@/components/virtual-list"
import {Component} from "@/lib/component";

interface EnhancedTemplatePreviewProps {
  templateId: string
  templates: any[]
  theme: ThemeConfig
}

export function EnhancedTemplatePreview({ templateId, templates, theme }: EnhancedTemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [activeDevice, setActiveDevice] = useState("desktop")

  // 查找模板
  const template = useMemo(() => templates.find((t) => t.id === templateId), [templateId, templates])

  if (!template) {
    return <div className="p-4 text-center text-muted-foreground">未找到模板</div>
  }

  const getDeviceWidth = () => {
    if (activeTab !== "preview") return 1280 // Default width when not in preview
    switch (activeDevice) {
      case "mobile":
        return 375
      case "tablet":
        return 768
      case "desktop":
      default:
        return 1280
    }
  }

  // 递归构建组件树
  const buildComponentTree = (components: Component[], parentId: string | null = null, level = 0): JSX.Element[] => {
    return components
      .filter((component) => component.parentId === parentId)
      .map((component) => (
        <div key={component.id} className="mb-1">
          <div
            className="flex items-center rounded px-2 py-1 text-sm hover:bg-muted/50"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            <span className="mr-1 text-xs text-muted-foreground">{component.type}</span>
            <span className="font-medium">{component.name || component.type}</span>
          </div>
          {buildComponentTree(components, component.id, level + 1)}
        </div>
      ))
  }

  // 扁平化组件树，用于虚拟列表
  const flattenComponentTree = (
    components: Component[],
    parentId: string | null = null,
    level = 0,
  ): { component: Component; level: number }[] => {
    const result: { component: Component; level: number }[] = []

    components
      .filter((component) => component.parentId === parentId)
      .forEach((component) => {
        result.push({ component, level })
        result.push(...flattenComponentTree(components, component.id, level + 1))
      })

    return result
  }

  const flattenedComponents = useMemo(() => (template ? flattenComponentTree(template.components) : []), [template])

  return (
    <div className="mt-4 border rounded-md overflow-hidden flex flex-col" style={{ height: "600px" }}>
      <div className="flex items-center justify-between border-b p-2 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="preview" className="px-2 flex items-center gap-1">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">预览</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="px-2 flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">结构</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="px-2 flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              <span className="hidden sm:inline">JSON</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "preview" && (
          <div className="flex items-center gap-1 rounded-md border p-1">
            <Button
              variant={activeDevice === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={activeDevice === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveDevice("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={activeDevice === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" && (
          <ScrollArea className="h-full" orientation="both">
            <div
              className="mx-auto bg-white"
              style={{
                width: activeDevice === "desktop" ? "100%" : `${getDeviceWidth()}px`,
                padding: "1rem",
              }}
            >
              <PreviewCanvas
                components={template.components}
                width={getDeviceWidth()}
                theme={theme}
                isAnimating={false}
              />
            </div>
          </ScrollArea>
        )}

        {activeTab === "structure" && (
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex-shrink-0">
              <h3 className="text-sm font-medium">组件结构</h3>
              <p className="text-xs text-muted-foreground">共 {template?.components?.length || 0} 个组件</p>
            </div>
            <ScrollArea className="flex-1">
              <VirtualList
                items={flattenedComponents}
                height={500}
                itemHeight={32}
                renderItem={({ component, level }, index) => (
                  <div
                    key={component.id}
                    className="flex items-center rounded px-2 py-1 text-sm hover:bg-muted/50"
                    style={{ paddingLeft: `${level * 16 + 8}px`, height: "32px" }}
                  >
                    <span className="mr-1 text-xs text-muted-foreground">{component.type}</span>
                    <span className="font-medium">{component.name || component.type}</span>
                  </div>
                )}
              />
            </ScrollArea>
          </div>
        )}

        {activeTab === "json" && (
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex-shrink-0">
              <h3 className="text-sm font-medium">JSON 数据</h3>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-4 text-xs">{template ? JSON.stringify(template.components, null, 2) : ""}</pre>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
