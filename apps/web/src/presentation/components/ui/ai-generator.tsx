"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/presentation/components/ui";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAIGenerator } from "@/presentation/hooks/use-ai-generator";
import { toast } from "@/presentation/hooks/use-toast";
import type { Component } from "@/domain/component";
import { Alert, AlertDescription } from "./alert";

interface AIGeneratorProps {
  onComponentsGenerated?: (components: Component[]) => void;
}

export function AIGenerator({ onComponentsGenerated }: AIGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [generationType, setGenerationType] = useState<"page" | "component">(
    "page"
  );
  const [layout, setLayout] = useState<
    "centered" | "full-width" | "sidebar" | "grid"
  >("centered");
  const [componentType, setComponentType] = useState<string>("");

  const {
    loading,
    error,
    provider,
    apiKey,
    setProvider,
    setApiKey,
    generateComponent,
    generatePage,
    applyComponentsToCanvas,
    clearError,
  } = useAIGenerator();

  // 处理生成
  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "请输入描述",
        description: "请描述您想要生成的页面或组件",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "请输入 API Key",
        description: "请先输入您的 AI API Key",
        variant: "destructive",
      });
      return;
    }

    try {
      clearError();

      let components: Component[];

      if (generationType === "page") {
        // 生成页面
        components = await generatePage(description, layout);
      } else {
        // 生成组件
        const component = await generateComponent(
          description,
          componentType || undefined
        );
        components = [component];
      }

      // 应用组件到画布
      const appliedComponents = await applyComponentsToCanvas(components);

      toast({
        title: "生成成功",
        description: `已成功生成并添加 ${appliedComponents.length} 个组件到画布`,
      });

      // 调用回调
      if (onComponentsGenerated) {
        onComponentsGenerated(appliedComponents);
      }

      // 关闭对话框
      setIsOpen(false);
      setDescription("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "生成失败，请稍后重试";
      toast({
        title: "生成失败",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    description,
    apiKey,
    generationType,
    layout,
    componentType,
    generateComponent,
    generatePage,
    applyComponentsToCanvas,
    onComponentsGenerated,
    clearError,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          AI 生成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI 生成页面/组件</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* API Key 配置 */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="请输入您的 AI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* AI 提供商选择 */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI 提供商</Label>
            <Select
              value={provider}
              onValueChange={(value) => setProvider(value as any)}
              disabled={loading}
            >
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 生成类型选择 */}
          <div className="space-y-2">
            <Label htmlFor="generation-type">生成类型</Label>
            <Select
              value={generationType}
              onValueChange={(value) =>
                setGenerationType(value as "page" | "component")
              }
              disabled={loading}
            >
              <SelectTrigger id="generation-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">页面</SelectItem>
                <SelectItem value="component">组件</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 布局选择（仅页面生成时显示） */}
          {generationType === "page" && (
            <div className="space-y-2">
              <Label htmlFor="layout">布局</Label>
              <Select
                value={layout}
                onValueChange={(value) =>
                  setLayout(
                    value as "centered" | "full-width" | "sidebar" | "grid"
                  )
                }
                disabled={loading}
              >
                <SelectTrigger id="layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">居中布局</SelectItem>
                  <SelectItem value="full-width">全宽布局</SelectItem>
                  <SelectItem value="sidebar">侧边栏布局</SelectItem>
                  <SelectItem value="grid">网格布局</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 组件类型（仅组件生成时显示） */}
          {generationType === "component" && (
            <div className="space-y-2">
              <Label htmlFor="component-type">组件类型（可选）</Label>
              <Input
                id="component-type"
                placeholder="例如: button, form, card..."
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {/* 描述输入 */}
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              placeholder={
                generationType === "page"
                  ? "例如: 创建一个用户登录页面，包含邮箱输入框、密码输入框和登录按钮"
                  : "例如: 创建一个蓝色的主按钮，文字为'提交'"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button onClick={handleGenerate} disabled={loading || !description.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
