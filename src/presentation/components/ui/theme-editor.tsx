"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Label } from "./label";
import { Palette } from "lucide-react";
import { ColorPicker } from "./color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import type { ThemeConfig } from "@/domain/entities/types";
import { useThemeStore } from "@/shared/stores";

interface ThemeEditorProps {
  // 移除 props，现在从 store 获取状态
}

export function ThemeEditor({}: ThemeEditorProps) {
  // 从 store 获取状态
  const { theme, updateTheme } = useThemeStore();
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);

  const handleChange = (key: keyof ThemeConfig, value: string) => {
    const updatedTheme = { ...localTheme, [key]: value };
    setLocalTheme(updatedTheme);
  };

  const handleApply = () => {
    updateTheme(localTheme);
  };

  const presetThemes = [
    {
      name: "默认主题",
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
      name: "暗色主题",
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
      name: "柔和主题",
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
  ];

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

        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">颜色</TabsTrigger>
            <TabsTrigger value="typography">排版</TabsTrigger>
            <TabsTrigger value="spacing">间距与圆角</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="primaryColor">主色调</Label>
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
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fontFamily">字体</Label>
                <Select
                  value={localTheme.fontFamily}
                  onValueChange={(value) => handleChange("fontFamily", value)}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="选择字体" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui, sans-serif">
                      系统默认
                    </SelectItem>
                    <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                    <SelectItem value="'Noto Sans SC', sans-serif">
                      Noto Sans SC
                    </SelectItem>
                    <SelectItem value="'Helvetica Neue', sans-serif">
                      Helvetica Neue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="borderRadius">圆角</Label>
                <Select
                  value={localTheme.borderRadius}
                  onValueChange={(value) => handleChange("borderRadius", value)}
                >
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
                <Select
                  value={localTheme.spacing}
                  onValueChange={(value) => handleChange("spacing", value)}
                >
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Label className="w-full">预设主题</Label>
            {presetThemes.map((presetTheme) => (
              <Button
                key={presetTheme.name}
                variant="outline"
                size="sm"
                onClick={() => setLocalTheme(presetTheme.config)}
              >
                {presetTheme.name}
              </Button>
            ))}
          </div>

          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">预览</h4>
            <div
              className="flex gap-2 rounded p-4"
              style={{
                backgroundColor: localTheme.backgroundColor,
                color: localTheme.textColor,
                fontFamily: localTheme.fontFamily,
              }}
            >
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
          </div>

          <div className="flex justify-end">
            <Button onClick={handleApply}>应用主题</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
