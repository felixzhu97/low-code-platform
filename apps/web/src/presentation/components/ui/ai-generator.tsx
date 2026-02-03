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
    model,
    baseURL,
    setProvider,
    setApiKey,
    setModel,
    setBaseURL,
    generateComponent,
    generatePage,
    applyComponentsToCanvas,
    clearError,
  } = useAIGenerator();
  const isOllama = provider === "ollama";

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Describe the page or component you want to generate",
        variant: "destructive",
      });
      return;
    }

    if (!isOllama && !apiKey.trim()) {
      toast({
        title: "API Key required",
        description: "Please enter your AI API Key",
        variant: "destructive",
      });
      return;
    }

    try {
      clearError();

      let components: Component[];

      if (generationType === "page") {
        components = await generatePage(description, layout);
      } else {
        const component = await generateComponent(
          description,
          componentType || undefined
        );
        components = [component];
      }

      const appliedComponents = await applyComponentsToCanvas(components);

      toast({
        title: "Generated",
        description: `Added ${appliedComponents.length} component(s) to the canvas`,
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
        err instanceof Error ? err.message : "Generation failed. Please try again.";
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    description,
    apiKey,
    isOllama,
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
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Generate Page / Component</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
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
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="azure-openai">Azure OpenAI</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
                <SelectItem value="siliconflow">SiliconFlow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isOllama && (
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your AI API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {isOllama && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ollama-base-url">Base URL</Label>
                <Input
                  id="ollama-base-url"
                  type="url"
                  placeholder="http://localhost:11434"
                  value={baseURL ?? "http://localhost:11434"}
                  onChange={(e) => setBaseURL(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ollama-model">Model</Label>
                <Input
                  id="ollama-model"
                  placeholder="codellama"
                  value={model ?? "codellama"}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="generation-type">Generate</Label>
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
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="component">Component</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {generationType === "page" && (
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
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
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="full-width">Full width</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {generationType === "component" && (
            <div className="space-y-2">
              <Label htmlFor="component-type">Component type (optional)</Label>
              <Input
                id="component-type"
                placeholder="e.g. button, form, card"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={
                generationType === "page"
                  ? "e.g. A login page with email, password and submit button"
                  : "e.g. A blue primary button with label Submit"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={loading || !description.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
