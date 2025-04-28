"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutTemplate, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Component } from "@/lib/types"

interface TemplateGalleryProps {
  onSelectTemplate: (components: Component[]) => void
}

// 模板数据
const templates = [
  {
    id: "landing-page",
    category: "marketing",
    name: "着陆页",
    description: "简洁的产品着陆页模板",
    thumbnail: "/placeholder.svg?height=200&width=300",
    components: [
      {
        id: "header-1",
        type: "container",
        name: "页头容器",
        position: { x: 20, y: 20 },
        properties: {
          width: "90%",
          height: "auto",
          padding: "20px",
          bgColor: "#ffffff",
        },
        children: [
          {
            id: "logo-text",
            type: "text",
            name: "Logo文本",
            position: { x: 0, y: 0 },
            properties: {
              content: "品牌名称",
              fontSize: 24,
              fontWeight: "bold",
              color: "#000000",
            },
            parentId: "header-1",
          },
          {
            id: "nav-button-1",
            type: "button",
            name: "导航按钮1",
            position: { x: 200, y: 0 },
            properties: {
              text: "首页",
              variant: "ghost",
              size: "sm",
            },
            parentId: "header-1",
          },
          {
            id: "nav-button-2",
            type: "button",
            name: "导航按钮2",
            position: { x: 260, y: 0 },
            properties: {
              text: "功能",
              variant: "ghost",
              size: "sm",
            },
            parentId: "header-1",
          },
          {
            id: "nav-button-3",
            type: "button",
            name: "导航按钮3",
            position: { x: 320, y: 0 },
            properties: {
              text: "价格",
              variant: "ghost",
              size: "sm",
            },
            parentId: "header-1",
          },
          {
            id: "cta-button",
            type: "button",
            name: "CTA按钮",
            position: { x: 400, y: 0 },
            properties: {
              text: "立即开始",
              variant: "default",
              size: "sm",
            },
            parentId: "header-1",
          },
        ],
      },
      {
        id: "hero-section",
        type: "container",
        name: "Hero区域",
        position: { x: 20, y: 100 },
        properties: {
          width: "90%",
          height: "auto",
          padding: "40px",
          bgColor: "#f8f9fa",
        },
        children: [
          {
            id: "hero-title",
            type: "text",
            name: "Hero标题",
            position: { x: 0, y: 0 },
            properties: {
              content: "强大的产品解决您的问题",
              fontSize: 36,
              fontWeight: "bold",
              color: "#000000",
              alignment: "center",
            },
            parentId: "hero-section",
          },
          {
            id: "hero-subtitle",
            type: "text",
            name: "Hero副标题",
            position: { x: 0, y: 50 },
            properties: {
              content: "简单易用的解决方案，为您的业务提供支持",
              fontSize: 18,
              fontWeight: "normal",
              color: "#666666",
              alignment: "center",
            },
            parentId: "hero-section",
          },
          {
            id: "hero-cta",
            type: "button",
            name: "Hero CTA",
            position: { x: 150, y: 120 },
            properties: {
              text: "免费试用",
              variant: "default",
              size: "lg",
            },
            parentId: "hero-section",
          },
        ],
      },
    ],
  },
  {
    id: "login-form",
    category: "auth",
    name: "登录表单",
    description: "用户登录表单模板",
    thumbnail: "/placeholder.svg?height=200&width=300",
    components: [
      {
        id: "login-card",
        type: "card",
        name: "登录卡片",
        position: { x: 100, y: 100 },
        properties: {
          width: "400px",
          shadow: true,
          title: "用户登录",
        },
        children: [
          {
            id: "username-input",
            type: "input",
            name: "用户名输入",
            position: { x: 20, y: 70 },
            properties: {
              placeholder: "请输入用户名",
              required: true,
              width: "360px",
            },
            parentId: "login-card",
          },
          {
            id: "password-input",
            type: "input",
            name: "密码输入",
            position: { x: 20, y: 120 },
            properties: {
              placeholder: "请输入密码",
              required: true,
              width: "360px",
              type: "password",
            },
            parentId: "login-card",
          },
          {
            id: "login-button",
            type: "button",
            name: "登录按钮",
            position: { x: 20, y: 180 },
            properties: {
              text: "登录",
              variant: "default",
              size: "default",
              width: "360px",
            },
            parentId: "login-card",
          },
        ],
      },
    ],
  },
  {
    id: "dashboard",
    category: "admin",
    name: "仪表盘",
    description: "管理后台仪表盘模板",
    thumbnail: "/placeholder.svg?height=200&width=300",
    components: [
      {
        id: "stats-row",
        type: "row",
        name: "统计数据行",
        position: { x: 20, y: 20 },
        properties: {
          width: "90%",
        },
        children: [
          {
            id: "stat-card-1",
            type: "card",
            name: "统计卡片1",
            position: { x: 0, y: 0 },
            properties: {
              width: "200px",
              shadow: true,
              title: "总用户",
            },
            parentId: "stats-row",
            children: [
              {
                id: "stat-value-1",
                type: "text",
                name: "统计值1",
                position: { x: 20, y: 60 },
                properties: {
                  content: "1,234",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000000",
                },
                parentId: "stat-card-1",
              },
            ],
          },
          {
            id: "stat-card-2",
            type: "card",
            name: "统计卡片2",
            position: { x: 220, y: 0 },
            properties: {
              width: "200px",
              shadow: true,
              title: "活跃用户",
            },
            parentId: "stats-row",
            children: [
              {
                id: "stat-value-2",
                type: "text",
                name: "统计值2",
                position: { x: 20, y: 60 },
                properties: {
                  content: "789",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000000",
                },
                parentId: "stat-card-2",
              },
            ],
          },
          {
            id: "stat-card-3",
            type: "card",
            name: "统计卡片3",
            position: { x: 440, y: 0 },
            properties: {
              width: "200px",
              shadow: true,
              title: "收入",
            },
            parentId: "stats-row",
            children: [
              {
                id: "stat-value-3",
                type: "text",
                name: "统计值3",
                position: { x: 20, y: 60 },
                properties: {
                  content: "¥9,876",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000000",
                },
                parentId: "stat-card-3",
              },
            ],
          },
        ],
      },
    ],
  },
]

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LayoutTemplate className="mr-2 h-4 w-4" />
          模板库
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>模板库</DialogTitle>
          <DialogDescription>选择一个模板快速开始您的项目</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="marketing">营销</TabsTrigger>
            <TabsTrigger value="auth">认证</TabsTrigger>
            <TabsTrigger value="admin">管理</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4 p-1">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="aspect-video w-full object-cover"
                      />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4">
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelectTemplate(template.components)
                          document
                            .querySelector('[role="dialog"]')
                            ?.closest('div[data-state="open"]')
                            ?.querySelector('button[data-state="closed"]')
                            ?.click()
                        }}
                      >
                        使用
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
