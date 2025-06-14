"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/presentation/components/ui/dialog"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { Label } from "@/src/presentation/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/presentation/components/ui/select"
import { ScrollArea } from "@/src/presentation/components/ui/scroll-area"
import { PlusCircle, Save } from "lucide-react"
import { Card, CardContent } from "@/src/presentation/components/ui/card"
import { Switch } from "@/src/presentation/components/ui/switch"


import {Component} from "@/src/domain/entities/types";

interface CustomComponentBuilderProps {
  onSaveComponent: (component: any) => void
  existingComponents: Component[]
}

export function CustomComponentBuilder({ onSaveComponent, existingComponents }: CustomComponentBuilderProps) {
  const [componentName, setComponentName] = useState("")
  const [componentType, setComponentType] = useState("container")
  const [componentCategory, setComponentCategory] = useState("layout")
  const [isContainer, setIsContainer] = useState(false)
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])

  const handleSave = () => {
    if (!componentName.trim()) return

    const newComponent = {
      id: `custom-${Date.now()}`,
      name: componentName,
      type: componentType,
      category: componentCategory,
      isContainer,
      isCustom: true,
      childComponents: selectedComponents.map((id) => {
        const component = existingComponents.find((c) => c.id === id)
        return {
          id: `${component?.type}-${Date.now()}`,
          type: component?.type || "text",
          name: component?.name || "组件",
          position: { x: 0, y: 0 },
          properties: {},
        }
      }),
    }

    onSaveComponent(newComponent)

    // 重置表单
    setComponentName("")
    setComponentType("container")
    setComponentCategory("layout")
    setIsContainer(false)
    setSelectedComponents([])
  }

  const toggleComponentSelection = (id: string) => {
    if (selectedComponents.includes(id)) {
      setSelectedComponents(selectedComponents.filter((cId) => cId !== id))
    } else {
      setSelectedComponents([...selectedComponents, id])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          创建自定义组件
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建自定义组件</DialogTitle>
          <DialogDescription>组合现有组件创建可复用的自定义组件</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="composition">组件组合</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="component-name">组件名称</Label>
                <Input
                  id="component-name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="输入组件名称"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="component-type">组件类型</Label>
                <Select value={componentType} onValueChange={setComponentType}>
                  <SelectTrigger id="component-type">
                    <SelectValue placeholder="选择组件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container">容器</SelectItem>
                    <SelectItem value="card">卡片</SelectItem>
                    <SelectItem value="form">表单</SelectItem>
                    <SelectItem value="section">区块</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="component-category">组件分类</Label>
                <Select value={componentCategory} onValueChange={setComponentCategory}>
                  <SelectTrigger id="component-category">
                    <SelectValue placeholder="选择组件分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="layout">布局组件</SelectItem>
                    <SelectItem value="basic">基础组件</SelectItem>
                    <SelectItem value="form">表单组件</SelectItem>
                    <SelectItem value="data">数据组件</SelectItem>
                    <SelectItem value="custom">自定义组件</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch id="is-container" checked={isContainer} onCheckedChange={setIsContainer} />
                <Label htmlFor="is-container">可以包含其他组件</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="py-4">
            <div className="space-y-4">
              <Label>选择要包含的组件</Label>
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {existingComponents.map((component) => (
                    <Card
                      key={component.id}
                      className={`cursor-pointer transition-colors ${
                        selectedComponents.includes(component.id) ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => toggleComponentSelection(component.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-xs text-muted-foreground">{component.type}</div>
                          </div>
                          {selectedComponents.includes(component.id) && (
                            <div className="rounded-full bg-primary p-1 text-primary-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              <div className="text-sm text-muted-foreground">已选择 {selectedComponents.length} 个组件</div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!componentName.trim()}>
            <Save className="mr-2 h-4 w-4" />
            保存组件
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
