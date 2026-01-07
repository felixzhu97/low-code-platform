import React from "react";
import {
  Button,
  Header,
  ResponsiveControls,
  ComponentGrouping,
  AnimationEditor,
  ThemeEditor,
  Collaboration,
  ComponentLibraryManager,
  CodeExport,
} from "@/presentation/components/ui";
import { Eye, Undo2, Redo2 } from "lucide-react";

import type { Component } from "@/domain/component";
import type { ThemeConfig } from "@/domain/theme";
import { TemplateGallery } from "../templates";
import { FormBuilder } from "../forms";

interface PlatformHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  previewMode: boolean;
  selectedComponentId: string | null;
  projectName: string;
  theme: ThemeConfig;
  components: Component[];
  customComponents: any[];
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
  onViewportChange: (width: number, device: string) => void;
  onSelectTemplate: (templateComponents: Component[]) => void;
  onAddForm: (formComponents: Component[]) => void;
  onGroupComponents: (componentIds: string[], groupName: string) => void;
  onApplyAnimation: (componentId: string, animation: any) => void;
  onThemeChange: (theme: ThemeConfig) => void;
  onAddCustomComponent: (component: any) => void;
  onRemoveCustomComponent: (componentId: string) => void;
  onImportComponents: (components: any[]) => void;
}

export function PlatformHeader({
  canUndo,
  canRedo,
  previewMode,
  selectedComponentId,
  projectName,
  theme,
  components,
  customComponents,
  onUndo,
  onRedo,
  onTogglePreview,
  onViewportChange,
  onSelectTemplate,
  onAddForm,
  onGroupComponents,
  onApplyAnimation,
  onThemeChange,
  onAddCustomComponent,
  onRemoveCustomComponent,
  onImportComponents,
}: PlatformHeaderProps) {
  return (
    <Header>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="mr-2 h-4 w-4" />
          撤销
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="mr-2 h-4 w-4" />
          重做
        </Button>
        <Button variant="outline" size="sm" onClick={onTogglePreview}>
          <Eye className="mr-2 h-4 w-4" />
          {previewMode ? "退出预览" : "预览"}
        </Button>
        <ResponsiveControls />
        <TemplateGallery />
        <FormBuilder />
        <ComponentGrouping />
        <AnimationEditor />
        <ThemeEditor />
        <Collaboration />
        <ComponentLibraryManager />
        <CodeExport />
      </div>
    </Header>
  );
}
