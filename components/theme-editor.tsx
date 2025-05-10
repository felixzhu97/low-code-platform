"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/dialog"
import { Button } from "@/src/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { Label } from "@/src/shared/ui/label"
import { Palette, Sparkles, CopyCheck, RefreshCw } from "lucide-react"
import { ColorPicker } from "./color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import type { ThemeConfig } from "@/src/shared/utils/types"
import { RadioGroup, RadioGroupItem } from "@/src/shared/ui/radio-group"
import { Badge } from "@/src/shared/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/shared/ui/tooltip"

interface ThemeEditorProps {
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig) => void
}

// 扩展预设主题类型
interface PresetTheme {
  name: string
  description?: string
  tags?: string[]
  config: ThemeConfig
  previewBg?: string
}

export function ThemeEditor({ theme, onThemeChange }: ThemeEditorProps) {
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [themeCategory, setThemeCategory] = useState<string>("all")

  // 加载最近使用的颜色
  useEffect(() => {
    const savedColors = localStorage.getItem('recentColors')
    if (savedColors) {
      setRecentColors(JSON.parse(savedColors))
    }
  }, [])

  const handleChange = (key: keyof ThemeConfig, value: string) => {
    // 重置当前激活的预设
    setActivePreset(null)
    
    // 更新主题
    const updatedTheme = { ...localTheme, [key]: value }
    setLocalTheme(updatedTheme)
    
    // 如果是颜色，添加到最近使用的颜色中
    if (key.includes('Color') && !recentColors.includes(value)) {
      const updatedColors = [value, ...recentColors.slice(0, 7)]
      setRecentColors(updatedColors)
      localStorage.setItem('recentColors', JSON.stringify(updatedColors))
    }
  }

  const handleApply = () => {
    onThemeChange(localTheme)
  }

  // 生成互补色
  const generateComplementaryColor = (color: string): string => {
    // 将十六进制转为RGB
    let r = parseInt(color.substr(1, 2), 16)
    let g = parseInt(color.substr(3, 2), 16)
    let b = parseInt(color.substr(5, 2), 16)
    
    // 计算互补色
    r = 255 - r
    g = 255 - g
    b = 255 - b
    
    // 转回十六进制
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // 生成协调的文本颜色
  const generateTextColor = (bgColor: string): string => {
    // 简单判断亮色还是暗色背景
    const r = parseInt(bgColor.substr(1, 2), 16)
    const g = parseInt(bgColor.substr(3, 2), 16)
    const b = parseInt(bgColor.substr(5, 2), 16)
    
    // 计算亮度 (HSL中的L)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    
    // 较暗的背景用亮色文本，较亮的背景用暗色文本
    return luma < 128 ? '#ffffff' : '#000000'
  }

  // 生成智能配色方案
  const generateSmartColorScheme = () => {
    // 基于主色生成整套配色方案
    const newPrimaryColor = localTheme.primaryColor
    const complementary = generateComplementaryColor(newPrimaryColor)
    
    // 根据主色调生成一套协调的配色方案
    const newTheme: ThemeConfig = {
      ...localTheme,
      secondaryColor: complementary,
      textColor: generateTextColor(localTheme.backgroundColor),
    }
    
    setLocalTheme(newTheme)
    setActivePreset(null)
  }

  // 定义更多的预设主题
  const presetThemes: PresetTheme[] = [
    {
      name: "默认简约",
      description: "干净清爽的设计风格",
      tags: ["简约", "商务"],
      config: {
        primaryColor: "#0070f3",
        secondaryColor: "#6c757d",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0.375rem",
        spacing: "1rem",
      },
    },
    {
      name: "暗黑模式",
      description: "降低眼睛疲劳的深色主题",
      tags: ["深色", "专业"],
      config: {
        primaryColor: "#3b82f6",
        secondaryColor: "#6b7280",
        backgroundColor: "#1f2937",
        textColor: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0.375rem",
        spacing: "1rem",
      },
    },
    {
      name: "柔和紫罗兰",
      description: "温和舒适的紫色调",
      tags: ["柔和", "创意"],
      config: {
        primaryColor: "#8b5cf6",
        secondaryColor: "#a78bfa",
        backgroundColor: "#f5f3ff",
        textColor: "#4c1d95",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "0.5rem",
        spacing: "1.25rem",
      },
    },
    {
      name: "自然绿意",
      description: "灵感来自自然的绿色主题",
      tags: ["自然", "生态"],
      config: {
        primaryColor: "#059669",
        secondaryColor: "#34d399",
        backgroundColor: "#ecfdf5",
        textColor: "#064e3b",
        fontFamily: "'Noto Sans SC', sans-serif",
        borderRadius: "0.5rem",
        spacing: "1rem",
      },
    },
    {
      name: "霓虹未来",
      description: "鲜艳的赛博朋克风格",
      tags: ["未来", "现代"],
      config: {
        primaryColor: "#ec4899",
        secondaryColor: "#8b5cf6",
        backgroundColor: "#18181b",
        textColor: "#f4f4f5",
        fontFamily: "'Roboto', sans-serif",
        borderRadius: "0.125rem",
        spacing: "1.25rem",
      },
    },
    {
      name: "商务蓝调",
      description: "专业可靠的商业风格",
      tags: ["商务", "专业"],
      config: {
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        fontFamily: "'Helvetica Neue', sans-serif",
        borderRadius: "0.25rem",
        spacing: "1rem",
      },
    },
    {
      name: "暖阳橙彩",
      description: "充满活力的橙色主题",
      tags: ["活力", "温暖"],
      config: {
        primaryColor: "#ea580c",
        secondaryColor: "#fb923c",
        backgroundColor: "#fff7ed",
        textColor: "#7c2d12",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "0.625rem",
        spacing: "1rem",
      },
    },
    {
      name: "莫兰迪风格",
      description: "低饱和度的优雅色彩",
      tags: ["优雅", "时尚"],
      config: {
        primaryColor: "#94a3b8",
        secondaryColor: "#cbd5e1",
        backgroundColor: "#f8fafc",
        textColor: "#334155",
        fontFamily: "'Noto Sans SC', sans-serif",
        borderRadius: "0.25rem",
        spacing: "1rem",
      },
    },
  ]

  const filteredPresets = themeCategory === "all" 
    ? presetThemes 
    : presetThemes.filter(theme => theme.tags?.includes(themeCategory))

  // 主题分类标签
  const themeTags = ["all", "简约", "商务", "深色", "专业", "柔和", "创意", "自然", "活力", "优雅", "时尚", "未来", "现代", "温暖"]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Palette className="mr-2 h-4 w-4" />
          主题设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>主题设置</DialogTitle>
          <DialogDescription>自定义应用的视觉风格</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">预设主题</TabsTrigger>
            <TabsTrigger value="customize">自定义</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 py-4">
            <div className="mb-4">
              <Label className="mb-2 block">主题风格</Label>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {themeTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={themeCategory === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setThemeCategory(tag)}
                  >
                    {tag === "all" ? "全部" : tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredPresets.map((presetTheme) => (
                <div 
                  key={presetTheme.name}
                  className={`cursor-pointer rounded-lg border p-3 hover:border-primary transition-all ${
                    activePreset === presetTheme.name ? 'border-primary-500 ring-1 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setLocalTheme(presetTheme.config)
                    setActivePreset(presetTheme.name)
                  }}
                >
                  <h3 className="text-sm font-medium mb-1">{presetTheme.name}</h3>
                  {presetTheme.description && (
                    <p className="text-xs text-muted-foreground mb-2">{presetTheme.description}</p>
                  )}
                  <div className="flex gap-1.5 mb-2">
                    {presetTheme.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                    ))}
                  </div>
                  <div 
                    className="h-16 rounded-md overflow-hidden"
                    style={{
                      backgroundColor: presetTheme.config.backgroundColor,
                    }}
                  >
                    <div className="flex h-full p-2 gap-1">
                      <div
                        className="flex-1 rounded-sm"
                        style={{
                          backgroundColor: presetTheme.config.primaryColor,
                        }}
                      ></div>
                      <div
                        className="flex-1 rounded-sm"
                        style={{
                          backgroundColor: presetTheme.config.secondaryColor,
                        }}
                      ></div>
                      <div
                        className="flex-1 rounded-sm flex items-center justify-center text-xs"
                        style={{
                          color: presetTheme.config.textColor,
                        }}
                      >
                        Aa
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="primaryColor">主色调</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={generateSmartColorScheme}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>智能配色建议</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ColorPicker
                    color={localTheme.primaryColor}
                    onChange={(color) => handleChange("primaryColor", color)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secondaryColor">次要色调</Label>
                  <ColorPicker
                    color={localTheme.secondaryColor}
                    onChange={(color) => handleChange("secondaryColor", color)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="backgroundColor">背景色</Label>
                  <ColorPicker
                    color={localTheme.backgroundColor}
                    onChange={(color) => handleChange("backgroundColor", color)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="textColor">文本颜色</Label>
                  <ColorPicker 
                    color={localTheme.textColor} 
                    onChange={(color) => handleChange("textColor", color)} 
                  />
                </div>
                
                {recentColors.length > 0 && (
                  <div className="pt-2">
                    <Label className="block mb-2">最近使用的颜色</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {recentColors.map((color, index) => (
                        <div 
                          key={`${color}-${index}`}
                          className="h-6 w-6 rounded-md cursor-pointer border"
                          style={{ backgroundColor: color }}
                          onClick={() => handleChange("primaryColor", color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fontFamily">字体</Label>
                  <Select value={localTheme.fontFamily} onValueChange={(value) => handleChange("fontFamily", value)}>
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="选择字体" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui, sans-serif">系统默认</SelectItem>
                      <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                      <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                      <SelectItem value="'Noto Sans SC', sans-serif">Noto Sans SC</SelectItem>
                      <SelectItem value="'Helvetica Neue', sans-serif">Helvetica Neue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="borderRadius">圆角</Label>
                  <Select value={localTheme.borderRadius} onValueChange={(value) => handleChange("borderRadius", value)}>
                    <SelectTrigger id="borderRadius">
                      <SelectValue placeholder="选择圆角大小" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">无圆角</SelectItem>
                      <SelectItem value="0.125rem">小圆角 (2px)</SelectItem>
                      <SelectItem value="0.25rem">中小圆角 (4px)</SelectItem>
                      <SelectItem value="0.375rem">中圆角 (6px)</SelectItem>
                      <SelectItem value="0.5rem">大圆角 (8px)</SelectItem>
                      <SelectItem value="0.75rem">特大圆角 (12px)</SelectItem>
                      <SelectItem value="9999px">圆形</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="spacing">基础间距</Label>
                  <Select value={localTheme.spacing} onValueChange={(value) => handleChange("spacing", value)}>
                    <SelectTrigger id="spacing">
                      <SelectValue placeholder="选择基础间距" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5rem">紧凑 (8px)</SelectItem>
                      <SelectItem value="0.75rem">较紧凑 (12px)</SelectItem>
                      <SelectItem value="1rem">标准 (16px)</SelectItem>
                      <SelectItem value="1.25rem">宽松 (20px)</SelectItem>
                      <SelectItem value="1.5rem">较宽松 (24px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-md bg-accent/20 p-4 mt-4">
                  <h4 className="mb-3 text-sm font-medium flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    智能配色建议
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    根据您选择的主色调，自动生成协调的配色方案
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={generateSmartColorScheme}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    生成智能配色
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>暗黑模式自适应</Label>
                <RadioGroup defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">不启用</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto">跟随系统</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="toggle" id="toggle" />
                    <Label htmlFor="toggle">允许用户切换</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <Label>CSS 变量导出</Label>
                <div className="rounded-md bg-muted p-3 font-mono text-xs">
                  {`/* 主题变量 */
:root {
  --primary-color: ${localTheme.primaryColor};
  --secondary-color: ${localTheme.secondaryColor};
  --background-color: ${localTheme.backgroundColor};
  --text-color: ${localTheme.textColor};
  --font-family: ${localTheme.fontFamily};
  --border-radius: ${localTheme.borderRadius};
  --spacing: ${localTheme.spacing};
}`}
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto">
                  <CopyCheck className="mr-2 h-4 w-4" />
                  复制 CSS 变量
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div className="rounded-md border p-4">
            <h4 className="mb-2 text-sm font-medium">实时预览</h4>
            <div
              className="flex flex-col gap-3 rounded p-4"
              style={{
                backgroundColor: localTheme.backgroundColor,
                color: localTheme.textColor,
                fontFamily: localTheme.fontFamily,
              }}
            >
              <div className="text-sm" style={{ color: localTheme.textColor }}>
                示例文本内容
              </div>
              <div className="flex gap-2">
                <div
                  className="rounded px-3 py-1"
                  style={{
                    backgroundColor: localTheme.primaryColor,
                    color: "#ffffff",
                    borderRadius: localTheme.borderRadius,
                  }}
                >
                  主按钮
                </div>
                <div
                  className="rounded px-3 py-1"
                  style={{
                    backgroundColor: localTheme.secondaryColor,
                    color: "#ffffff",
                    borderRadius: localTheme.borderRadius,
                  }}
                >
                  次要按钮
                </div>
                <div
                  className="rounded border px-3 py-1"
                  style={{
                    borderColor: localTheme.primaryColor,
                    color: localTheme.textColor,
                    borderRadius: localTheme.borderRadius,
                  }}
                >
                  轮廓按钮
                </div>
              </div>
              <div
                className="rounded p-3"
                style={{
                  backgroundColor: localTheme.primaryColor + "20", // 添加透明度
                  borderRadius: localTheme.borderRadius,
                  borderLeftWidth: "4px",
                  borderLeftStyle: "solid",
                  borderLeftColor: localTheme.primaryColor,
                }}
              >
                <div className="text-sm" style={{ color: localTheme.textColor }}>
                  信息提示区块
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleApply}>应用主题</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
