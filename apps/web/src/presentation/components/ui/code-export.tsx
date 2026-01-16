"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { FileJson, Copy, Download } from "lucide-react";

import {
  useComponentStore,
  useUIStore,
} from "@/infrastructure/state-management/stores";
import { PersistenceManager } from "@/infrastructure/state-management/stores/persistence.manager";
import {
  projectDataToSchema,
  projectDataToSchemaJson,
} from "@/domain/entities/schema.types";

interface CodeExportProps {
  // 移除 props，现在从 store 获取状态
}

export function CodeExport({}: CodeExportProps) {
  // 从 store 获取状态
  const { components } = useComponentStore();
  const { projectName } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [schemaJson, setSchemaJson] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 异步生成 Schema JSON（使用 WASM）
  const generateSchemaJson = async (): Promise<string> => {
    if (components.length === 0) {
      return JSON.stringify(
        {
          version: "1.0.0",
          metadata: {
            name: projectName || "未命名项目",
            description: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: "1.0.0",
          },
          components: [],
          canvas: {
            showGrid: false,
            snapToGrid: false,
            viewportWidth: 1920,
            activeDevice: "desktop",
          },
          theme: {},
          dataSources: [],
        },
        null,
        2
      );
    }

    // 获取当前项目ID，如果没有则生成一个临时ID
    const currentProjectId =
      PersistenceManager.getCurrentProjectId() || `temp-${Date.now()}`;

    // 导出项目数据
    const projectData = PersistenceManager.exportProjectData(
      currentProjectId,
      projectName || "未命名项目"
    );

    // 使用 WASM 异步版本序列化 Schema
    try {
      return await projectDataToSchemaJson(projectData);
    } catch (error) {
      console.warn("WASM schema serialization failed, using fallback:", error);
      // 降级到同步版本
      const schema = projectDataToSchema(projectData);
      return JSON.stringify(schema, null, 2);
    }
  };

  // 在组件挂载时生成 Schema
  const loadSchema = useCallback(async () => {
    setIsGenerating(true);
    try {
      const json = await generateSchemaJson();
      setSchemaJson(json);
    } catch (error) {
      console.error("Failed to generate schema:", error);
      setSchemaJson("{}");
    } finally {
      setIsGenerating(false);
    }
  }, [components, projectName]);

  useEffect(() => {
    loadSchema();
  }, [loadSchema]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSchema = (schemaJson: string) => {
    const blob = new Blob([schemaJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `${projectName || "schema"}.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // schemaJson 现在通过 useEffect 异步生成

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileJson className="mr-2 h-4 w-4" />
          导出 Schema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>导出 Schema JSON</DialogTitle>
          <DialogDescription>
            将设计导出为 Schema JSON 格式，可用于导入和渲染页面
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="relative rounded-md bg-muted">
            <ScrollArea className="h-[400px] w-full rounded-md">
              {isGenerating ? (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-sm text-muted-foreground">
                    正在生成 Schema...
                  </div>
                </div>
              ) : (
                <pre className="p-4 text-sm">
                  <code>{schemaJson || "{}"}</code>
                </pre>
              )}
            </ScrollArea>
            <div className="absolute right-2 top-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyCode(schemaJson)}
                title="复制到剪贴板"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownloadSchema(schemaJson)}
                title="下载 Schema JSON"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {copied && (
          <div className="absolute bottom-4 right-4 rounded-md bg-green-100 px-4 py-2 text-sm text-green-800">
            Schema 已复制到剪贴板
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
