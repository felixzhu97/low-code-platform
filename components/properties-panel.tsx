"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Component } from "@/lib/types"
import { ColorPicker } from "./color-picker"

type PropertiesPanelProps = {
  selectedComponent: Component | null
  onUpdateComponent?: (id: string, properties: any) => void
}

export function PropertiesPanel({ selectedComponent, onUpdateComponent }: PropertiesPanelProps) {
  const [properties, setProperties] = useState<any>({})

  useEffect(() => {
    if (selectedComponent?.properties) {
      setProperties(selectedComponent.properties)
    } else if (selectedComponent) {
      // Set default properties based on component type
      switch (selectedComponent.type) {
        case "text":
          setProperties({
            content: "示例文本",
            fontSize: 16,
            fontWeight: "normal",
            color: "#000000",
            alignment: "left",
          })
          break
        case "button":
          setProperties({
            text: "按钮",
            variant: "default",
            size: "default",
            disabled: false,
          })
          break
        case "input":
          setProperties({
            placeholder: "请输入...",
            disabled: false,
            required: false,
          })
          break
        case "card":
          setProperties({
            title: "卡片标题",
            shadow: true,
          })
          break
        default:
          setProperties({})
      }
    } else {
      setProperties({})
    }
  }, [selectedComponent])

  const handlePropertyChange = (key: string, value: any) => {
    const updatedProperties = { ...properties, [key]: value }
    setProperties(updatedProperties)

    if (selectedComponent && onUpdateComponent) {
      onUpdateComponent(selectedComponent.id, updatedProperties)
    }
  }

  if (!selectedComponent) {
    return (
      <div className="w-64 border-l">
        <div className="p-4">
          <h2 className="text-lg font-semibold">属性面板</h2>
          <p className="mt-4 text-sm text-muted-foreground">选择一个组件来编辑其属性</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 border-l">
      <div className="p-4">
        <h2 className="text-lg font-semibold">属性面板</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedComponent.name} ({selectedComponent.id})
        </p>
      </div>
      <Tabs defaultValue="properties">
        <TabsList className="w-full">
          <TabsTrigger value="properties" className="flex-1">
            属性
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-1">
            数据
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1">
            事件
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <Accordion type="single" collapsible defaultValue="basic">
                <AccordionItem value="basic">
                  <AccordionTrigger>基本属性</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      {selectedComponent.type === "text" && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="content">文本内容</Label>
                            <Input
                              id="content"
                              value={properties.content || ""}
                              onChange={(e) => handlePropertyChange("content", e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="fontSize">字体大小</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="fontSize"
                                min={12}
                                max={36}
                                step={1}
                                value={[properties.fontSize || 16]}
                                onValueChange={(value) => handlePropertyChange("fontSize", value[0])}
                                className="flex-1"
                              />
                              <span className="w-8 text-right">{properties.fontSize || 16}px</span>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="fontWeight">字体粗细</Label>
                            <Select
                              value={properties.fontWeight || "normal"}
                              onValueChange={(value) => handlePropertyChange("fontWeight", value)}
                            >
                              <SelectTrigger id="fontWeight">
                                <SelectValue placeholder="选择字体粗细" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">正常</SelectItem>
                                <SelectItem value="bold">粗体</SelectItem>
                                <SelectItem value="light">细体</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="color">文本颜色</Label>
                            <ColorPicker
                              color={properties.color || "#000000"}
                              onChange={(color) => handlePropertyChange("color", color)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="alignment">对齐方式</Label>
                            <Select
                              value={properties.alignment || "left"}
                              onValueChange={(value) => handlePropertyChange("alignment", value)}
                            >
                              <SelectTrigger id="alignment">
                                <SelectValue placeholder="选择对齐方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">左对齐</SelectItem>
                                <SelectItem value="center">居中</SelectItem>
                                <SelectItem value="right">右对齐</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "button" && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="text">按钮文本</Label>
                            <Input
                              id="text"
                              value={properties.text || ""}
                              onChange={(e) => handlePropertyChange("text", e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="variant">样式变体</Label>
                            <Select
                              value={properties.variant || "default"}
                              onValueChange={(value) => handlePropertyChange("variant", value)}
                            >
                              <SelectTrigger id="variant">
                                <SelectValue placeholder="选择样式变体" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">默认</SelectItem>
                                <SelectItem value="outline">轮廓</SelectItem>
                                <SelectItem value="secondary">次要</SelectItem>
                                <SelectItem value="ghost">幽灵</SelectItem>
                                <SelectItem value="destructive">危险</SelectItem>
                                <SelectItem value="link">链接</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="size">尺寸</Label>
                            <Select
                              value={properties.size || "default"}
                              onValueChange={(value) => handlePropertyChange("size", value)}
                            >
                              <SelectTrigger id="size">
                                <SelectValue placeholder="选择尺寸" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">默认</SelectItem>
                                <SelectItem value="sm">小</SelectItem>
                                <SelectItem value="lg">大</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="disabled">禁用</Label>
                            <Switch
                              id="disabled"
                              checked={properties.disabled || false}
                              onCheckedChange={(checked) => handlePropertyChange("disabled", checked)}
                            />
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "input" && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="placeholder">占位文本</Label>
                            <Input
                              id="placeholder"
                              value={properties.placeholder || ""}
                              onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="disabled">禁用</Label>
                            <Switch
                              id="disabled"
                              checked={properties.disabled || false}
                              onCheckedChange={(checked) => handlePropertyChange("disabled", checked)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="required">必填</Label>
                            <Switch
                              id="required"
                              checked={properties.required || false}
                              onCheckedChange={(checked) => handlePropertyChange("required", checked)}
                            />
                          </div>
                        </>
                      )}

                      {selectedComponent.type === "card" && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="title">卡片标题</Label>
                            <Input
                              id="title"
                              value={properties.title || ""}
                              onChange={(e) => handlePropertyChange("title", e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="shadow">阴影</Label>
                            <Switch
                              id="shadow"
                              checked={properties.shadow || false}
                              onCheckedChange={(checked) => handlePropertyChange("shadow", checked)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="style">
                  <AccordionTrigger>样式</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="width">宽度</Label>
                        <Input
                          id="width"
                          placeholder="auto"
                          value={properties.width || ""}
                          onChange={(e) => handlePropertyChange("width", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="height">高度</Label>
                        <Input
                          id="height"
                          placeholder="auto"
                          value={properties.height || ""}
                          onChange={(e) => handlePropertyChange("height", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="margin">外边距</Label>
                        <Input
                          id="margin"
                          placeholder="0px"
                          value={properties.margin || ""}
                          onChange={(e) => handlePropertyChange("margin", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="padding">内边距</Label>
                        <Input
                          id="padding"
                          placeholder="0px"
                          value={properties.padding || ""}
                          onChange={(e) => handlePropertyChange("padding", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bgColor">背景颜色</Label>
                        <ColorPicker
                          color={properties.bgColor || "#ffffff"}
                          onChange={(color) => handlePropertyChange("bgColor", color)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="data-binding">数据绑定</Label>
                  <Select>
                    <SelectTrigger id="data-binding">
                      <SelectValue placeholder="选择数据源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="static-1">用户列表</SelectItem>
                      <SelectItem value="api-1">产品数据</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data-field">数据字段</Label>
                  <Select disabled>
                    <SelectTrigger id="data-field">
                      <SelectValue placeholder="选择数据字段" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">名称</SelectItem>
                      <SelectItem value="price">价格</SelectItem>
                      <SelectItem value="description">描述</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">请先选择数据源</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="events">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="onClick">点击事件</Label>
                  <Select
                    value={properties.onClick || "none"}
                    onValueChange={(value) => handlePropertyChange("onClick", value)}
                  >
                    <SelectTrigger id="onClick">
                      <SelectValue placeholder="选择事件" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="navigate">页面跳转</SelectItem>
                      <SelectItem value="submit">提交表单</SelectItem>
                      <SelectItem value="openDialog">打开对话框</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {properties.onClick === "navigate" && (
                  <div className="grid gap-2">
                    <Label htmlFor="navigateUrl">跳转地址</Label>
                    <Input
                      id="navigateUrl"
                      placeholder="https://example.com"
                      value={properties.navigateUrl || ""}
                      onChange={(e) => handlePropertyChange("navigateUrl", e.target.value)}
                    />
                  </div>
                )}

                {properties.onClick === "openDialog" && (
                  <div className="grid gap-2">
                    <Label htmlFor="dialogId">对话框ID</Label>
                    <Input
                      id="dialogId"
                      placeholder="dialog-1"
                      value={properties.dialogId || ""}
                      onChange={(e) => handlePropertyChange("dialogId", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
