"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/presentation/components/ui/dialog"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { ScrollArea } from "@/src/presentation/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { Library, Search, Star, Trash2, Import, ImportIcon as Export, Edit } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/src/presentation/components/ui/card"
import { Badge } from "@/src/presentation/components/ui/badge"
import { CustomComponentBuilder } from "./custom-component-builder"


import {Component} from "@/src/domain/entities/types";

interface ComponentLibraryManagerProps {
  customComponents: any[]
  onAddComponent: (component: any) => void
  onRemoveComponent: (componentId: string) => void
  onImportComponents: (components: any[]) => void
  existingComponents: Component[]
}

export function ComponentLibraryManager({
  customComponents,
  onAddComponent,
  onRemoveComponent,
  onImportComponents,
  existingComponents,
}: ComponentLibraryManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredComponents = customComponents.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (componentId: string) => {
    if (favorites.includes(componentId)) {
      setFavorites(favorites.filter((id) => id !== componentId))
    } else {
      setFavorites([...favorites, componentId])
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const components = JSON.parse(event.target?.result as string)
        onImportComponents(Array.isArray(components) ? components : [components])
      } catch (error) {
        console.error("导入组件库失败:", error)
        alert("导入失败，请检查文件格式")
      }
    }
    reader.readAsText(file)
  }

  const handleExport = () => {
    const data = JSON.stringify(customComponents, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "component-library.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Library className="mr-2 h-4 w-4" />
          组件库管理
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>组件库管理</DialogTitle>
          <DialogDescription>管理您的自定义组件库</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <CustomComponentBuilder onSaveComponent={onAddComponent} existingComponents={existingComponents} />
          <div className="relative">
            <Input
              type="file"
              id="import-file"
              className="absolute inset-0 cursor-pointer opacity-0"
              accept=".json"
              onChange={handleImport}
            />
            <Button variant="outline" size="sm">
              <Import className="mr-2 h-4 w-4" />
              导入
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={customComponents.length === 0}>
            <Export className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">全部组件</TabsTrigger>
            <TabsTrigger value="favorites">收藏组件</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4 p-2">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((component) => (
                    <Card key={component.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="font-medium">{component.name}</div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{component.category}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleFavorite(component.id)}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  favorites.includes(component.id) ? "fill-yellow-400 text-yellow-400" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          类型: {component.type}
                          {component.isContainer && " (容器)"}
                        </div>
                        {component.childComponents && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            包含 {component.childComponents.length} 个子组件
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/50 p-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => onRemoveComponent(component.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          删除
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 flex h-32 items-center justify-center rounded-md border border-dashed">
                    <p className="text-center text-muted-foreground">
                      {searchTerm ? "没有找到匹配的组件" : "暂无自定义组件，点击“创建自定义组件”按钮开始创建"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4 p-2">
                {filteredComponents.filter((component) => favorites.includes(component.id)).length > 0 ? (
                  filteredComponents
                    .filter((component) => favorites.includes(component.id))
                    .map((component) => (
                      <Card key={component.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="font-medium">{component.name}</div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline">{component.category}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleFavorite(component.id)}
                              >
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            类型: {component.type}
                            {component.isContainer && " (容器)"}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-muted/50 p-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-1 h-3 w-3" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => onRemoveComponent(component.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            删除
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-2 flex h-32 items-center justify-center rounded-md border border-dashed">
                    <p className="text-center text-muted-foreground">暂无收藏组件</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
