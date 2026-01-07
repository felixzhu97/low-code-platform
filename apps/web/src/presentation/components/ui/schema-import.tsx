"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Upload, FileJson, AlertCircle } from "lucide-react";
import { PersistenceManager } from "@/infrastructure/state-management/stores/persistence.manager";
import { useUIStore } from "@/infrastructure/state-management/stores";
import { toast } from "@/presentation/hooks/use-toast";
import {
  validateSchema,
  migrateSchema,
  SchemaValidationError,
} from "@/domain/entities/schema.types";

interface SchemaImportProps {
  onImportSuccess?: () => void;
}

export function SchemaImport({ onImportSuccess }: SchemaImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setProjectName } = useUIStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.endsWith(".json")) {
      toast({
        title: "文件格式错误",
        description: "请选择 JSON 格式的文件",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 使用 PersistenceManager 导入文件
      const projectData = await PersistenceManager.importFromFile(file);

      // 导入项目数据到 stores
      PersistenceManager.importProjectData(projectData);

      // 更新项目名称
      if (projectData.name) {
        setProjectName(projectData.name);
      }

      // 生成新的项目ID并保存
      const newProjectId = `project-${Date.now()}`;
      PersistenceManager.saveCurrentProject(newProjectId, projectData.name);

      toast({
        title: "导入成功",
        description: `已成功导入项目: ${projectData.name}`,
      });

      setIsOpen(false);
      onImportSuccess?.();
    } catch (error) {
      console.error("导入失败:", error);
      
      let errorMessage = "导入文件失败";
      if (error instanceof SchemaValidationError) {
        errorMessage = `Schema 验证失败: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "导入失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast({
        title: "文件格式错误",
        description: "请选择 JSON 格式的文件",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const projectData = await PersistenceManager.importFromFile(file);
      PersistenceManager.importProjectData(projectData);

      if (projectData.name) {
        setProjectName(projectData.name);
      }

      const newProjectId = `project-${Date.now()}`;
      PersistenceManager.saveCurrentProject(newProjectId, projectData.name);

      toast({
        title: "导入成功",
        description: `已成功导入项目: ${projectData.name}`,
      });

      setIsOpen(false);
      onImportSuccess?.();
    } catch (error) {
      console.error("导入失败:", error);
      
      let errorMessage = "导入文件失败";
      if (error instanceof SchemaValidationError) {
        errorMessage = `Schema 验证失败: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "导入失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          导入 Schema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导入 Schema JSON</DialogTitle>
          <DialogDescription>
            选择或拖拽 Schema JSON 文件以导入项目
          </DialogDescription>
        </DialogHeader>

        <div
          className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-gray-400"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FileJson className="mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-2 text-sm text-gray-600">
            拖拽文件到此处，或
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            id="schema-import-input"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? "导入中..." : "选择文件"}
          </Button>
          <p className="mt-4 text-xs text-gray-500">
            支持 Schema JSON 和 ProjectData JSON 格式
          </p>
        </div>

        <div className="mt-4 rounded-md bg-blue-50 p-3">
          <div className="flex">
            <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">提示</p>
              <p className="mt-1">
                导入 Schema 将替换当前项目的所有组件、配置和主题设置。
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

