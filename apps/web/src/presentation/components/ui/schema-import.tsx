"use client";

import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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

const DropZone = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 2px dashed #d1d5db;
  padding: 2rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: #9ca3af;
  }
`;

const DropZoneIcon = styled(FileJson)`
  margin-bottom: 1rem;
  height: 3rem;
  width: 3rem;
  color: #9ca3af;
`;

const DropZoneText = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const HintText = styled.p`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const HintBox = styled.div`
  margin-top: 1rem;
  border-radius: 0.375rem;
  background-color: #eff6ff;
  padding: 0.75rem;
`;

const HintBoxInner = styled.div`
  display: flex;
`;

const HintIcon = styled(AlertCircle)`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  color: #2563eb;
`;

const HintContent = styled.div`
  font-size: 0.875rem;
  color: #1e40af;
`;

const HintTitle = styled.p`
  font-weight: 500;
`;

const HintDescription = styled.p`
  margin-top: 0.25rem;
`;

export function SchemaImport({ onImportSuccess }: SchemaImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setProjectName } = useUIStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
        <Button variant="outline" size="sm">
          <Upload css={{ marginRight: "0.375rem" }} aria-hidden="true" />
          导入 Schema
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "28rem" }}>
        <DialogHeader>
          <DialogTitle>导入 Schema JSON</DialogTitle>
          <DialogDescription>
            选择或拖拽 Schema JSON 文件以导入项目
          </DialogDescription>
        </DialogHeader>

        <DropZone
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <DropZoneIcon />
          <DropZoneText>拖拽文件到此处，或</DropZoneText>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            id="schema-import-input"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? "导入中..." : "选择文件"}
          </Button>
          <HintText>支持 Schema JSON 和 ProjectData JSON 格式</HintText>
        </DropZone>

        <HintBox>
          <HintBoxInner>
            <HintIcon />
            <HintContent>
              <HintTitle>提示</HintTitle>
              <HintDescription>
                导入 Schema 将替换当前项目的所有组件、配置和主题设置。
              </HintDescription>
            </HintContent>
          </HintBoxInner>
        </HintBox>
      </DialogContent>
    </Dialog>
  );
}
