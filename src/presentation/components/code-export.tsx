"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { ScrollArea } from "@/src/presentation/components/ui/scroll-area"
import { Code, Copy, Download } from "lucide-react"


import {Component} from "@/src/domain/entities/types";

interface CodeExportProps {
  components: Component[]
}

export function CodeExport({ components }: CodeExportProps) {
  const [copied, setCopied] = useState(false)

  const generateReactCode = () => {
    if (components.length === 0) return "// 没有组件可导出"

    let imports = `import React from 'react';\n`
    imports += `import { Button } from '@/components/ui/button';\n`
    imports += `import { Input } from '@/components/ui/input';\n`
    imports += `import { Card, CardContent } from '@/components/ui/card';\n`
    imports += `import { Separator } from '@/components/ui/separator';\n\n`

    let componentCode = `export default function GeneratedComponent() {\n`
    componentCode += `  return (\n`
    componentCode += `    <div className="relative w-full min-h-screen bg-background p-4">\n`

    components.forEach((component) => {
      const props = component.properties || {}
      const style = `position: absolute; left: ${component.position?.x || 0}px; top: ${component.position?.y || 0}px;`

      switch (component.type) {
        case "text":
          componentCode += `      <div style={{ ${style} }} className="p-2" style={{ fontSize: '${props.fontSize || 16}px', fontWeight: '${props.fontWeight || "normal"}', color: '${props.color || "#000000"}', textAlign: '${props.alignment || "left"}' }}>${props.content || "示例文本"}</div>\n`
          break
        case "button":
          componentCode += `      <Button style={{ ${style} }} variant="${props.variant || "default"}" size="${props.size || "default"}" ${props.disabled ? "disabled" : ""}>${props.text || "按钮"}</Button>\n`
          break
        case "input":
          componentCode += `      <Input style={{ ${style} }} placeholder="${props.placeholder || "请输入..."}" ${props.disabled ? "disabled" : ""} ${props.required ? "required" : ""} />\n`
          break
        case "card":
          componentCode += `      <Card style={{ ${style} }} className="${props.shadow ? "shadow-md" : ""}">\n`
          if (props.title) {
            componentCode += `        <div className="border-b p-4 font-medium">${props.title}</div>\n`
          }
          componentCode += `        <CardContent className="p-4">卡片内容</CardContent>\n`
          componentCode += `      </Card>\n`
          break
        case "divider":
          componentCode += `      <Separator style={{ ${style} }} className="my-2" />\n`
          break
        default:
          componentCode += `      <div style={{ ${style} }} className="p-2 border rounded">${component.name}</div>\n`
      }
    })

    componentCode += `    </div>\n`
    componentCode += `  );\n`
    componentCode += `}\n`

    return imports + componentCode
  }

  const generateHTMLCode = () => {
    if (components.length === 0) return "<!-- 没有组件可导出 -->"

    let htmlCode = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>导出的页面</title>\n  <style>\n    body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }\n    .container { position: relative; width: 100%; min-height: 100vh; padding: 1rem; }\n    .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; padding: 0.5rem 1rem; background-color: #000; color: #fff; cursor: pointer; }\n    .btn-outline { background-color: transparent; color: #000; border: 1px solid #e2e8f0; }\n    .input { padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; width: 100%; }\n    .card { border-radius: 0.375rem; border: 1px solid #e2e8f0; overflow: hidden; }\n    .card-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }\n    .card-header { padding: 1rem; border-bottom: 1px solid #e2e8f0; font-weight: 500; }\n    .card-content { padding: 1rem; }\n    .divider { height: 1px; width: 100%; background-color: #e2e8f0; margin: 0.5rem 0; }\n  </style>\n</head>\n<body>\n  <div class="container">\n`

    components.forEach((component) => {
      const props = component.properties || {}
      const style = `position: absolute; left: ${component.position?.x || 0}px; top: ${component.position?.y || 0}px;`

      switch (component.type) {
        case "text":
          htmlCode += `    <div style="${style}; font-size: ${props.fontSize || 16}px; font-weight: ${props.fontWeight || "normal"}; color: ${props.color || "#000000"}; text-align: ${props.alignment || "left"}; padding: 0.5rem;">${props.content || "示例文本"}</div>\n`
          break
        case "button":
          const btnClass = props.variant === "outline" ? "btn btn-outline" : "btn"
          htmlCode += `    <button style="${style}" class="${btnClass}" ${props.disabled ? "disabled" : ""}>${props.text || "按钮"}</button>\n`
          break
        case "input":
          htmlCode += `    <input style="${style}" class="input" type="text" placeholder="${props.placeholder || "请输入..."}" ${props.disabled ? "disabled" : ""} ${props.required ? "required" : ""} />\n`
          break
        case "card":
          htmlCode += `    <div style="${style}" class="card ${props.shadow ? "card-shadow" : ""}">\n`
          if (props.title) {
            htmlCode += `      <div class="card-header">${props.title}</div>\n`
          }
          htmlCode += `      <div class="card-content">卡片内容</div>\n`
          htmlCode += `    </div>\n`
          break
        case "divider":
          htmlCode += `    <div style="${style}" class="divider"></div>\n`
          break
        default:
          htmlCode += `    <div style="${style}; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;">${component.name}</div>\n`
      }
    })

    htmlCode += `  </div>\n</body>\n</html>`

    return htmlCode
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = (code: string, fileType: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileType === "react" ? "GeneratedComponent.jsx" : "index.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reactCode = generateReactCode()
  const htmlCode = generateHTMLCode()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Code className="mr-2 h-4 w-4" />
          导出代码
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>导出代码</DialogTitle>
          <DialogDescription>将设计导出为可用的代码</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="react" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="react">
            <div className="relative mt-4 rounded-md bg-muted">
              <ScrollArea className="h-[400px] w-full rounded-md">
                <pre className="p-4 text-sm">
                  <code>{reactCode}</code>
                </pre>
              </ScrollArea>
              <div className="absolute right-2 top-2 flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopyCode(reactCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownloadCode(reactCode, "react")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="html">
            <div className="relative mt-4 rounded-md bg-muted">
              <ScrollArea className="h-[400px] w-full rounded-md">
                <pre className="p-4 text-sm">
                  <code>{htmlCode}</code>
                </pre>
              </ScrollArea>
              <div className="absolute right-2 top-2 flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopyCode(htmlCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownloadCode(htmlCode, "html")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {copied && (
          <div className="absolute bottom-4 right-4 rounded-md bg-green-100 px-4 py-2 text-sm text-green-800">
            代码已复制到剪贴板
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
