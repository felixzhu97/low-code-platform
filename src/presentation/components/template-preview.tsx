"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/presentation/components/ui/dialog"
import { Button } from "@/src/presentation/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { ScrollArea } from "@/src/presentation/components/ui/scroll-area"
import { Star, Code, Layout, Smartphone, Tablet, Monitor } from "lucide-react"
import { PreviewCanvas } from "@/src/presentation/components/preview-canvas"


import {Component} from "@/src/domain/entities/types";

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  tags?: string[]
  components: Component[]
}

interface TemplatePreviewProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onUse: (components: Component[]) => void
  isFavorite: boolean
  onToggleFavorite: (templateId: string) => void
}

export function TemplatePreview({
  template,
  isOpen,
  onClose,
  onUse,
  isFavorite,
  onToggleFavorite,
}: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [activeDevice, setActiveDevice] = useState("desktop")

  if (!template) return null

  const handleUseTemplate = () => {
    console.log("使用模板:", template.name)
    console.log("模板组件:", template.components)
    onUse(template.components)
  }

  const getDeviceWidth = () => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(template.id)} className="h-8 w-8">
                <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="preview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between flex-shrink-0">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Layout className="h-4 w-4" />
                <span>预览</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>结构</span>
              </TabsTrigger>
            </TabsList>

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

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1 rounded-md border" orientation="both">
                <div
                  className="overflow-visible"
                  style={{
                    width: activeDevice === "desktop" ? "100%" : `${getDeviceWidth()}px`,
                    margin: "0 auto",
                  }}
                >
                  <PreviewCanvas components={template.components} width={getDeviceWidth()} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="structure" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 rounded-md border overflow-hidden">
                <div className="border-b bg-muted/50 px-4 py-2">
                  <h3 className="text-sm font-medium">组件结构</h3>
                  <p className="text-xs text-muted-foreground">共 {template.components.length} 个组件</p>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="p-4">{buildComponentTree(template.components)}</div>
                </ScrollArea>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-4 flex justify-between flex-shrink-0">
          <div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {template.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={handleUseTemplate}>使用此模板</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
