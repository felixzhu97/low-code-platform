import React from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { ResponsiveControls } from "@/canvas/responsive-controls";
import { ComponentGrouping } from "@/component/component-grouping";
import { ComponentLibraryManager } from "@/component/component-library-manager";
import { AnimationEditor } from "@/theme/animation-editor";
import { ThemeEditor } from "@/theme/theme-editor";
import { Collaboration } from "@/collaboration/collaboration";
import { CodeExport } from "@/export/code-export";
import { Eye, Undo2, Redo2 } from "lucide-react";

import type { Component } from "@/component/types";
import type { ThemeConfig } from "@/theme/types";
import type { TemplateSelectHandler } from "@/template/types";
import { TemplateGallery } from "@/template/template-gallery";
import { FormBuilder } from "@/form/forms/form-builder";

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
  onSelectTemplate: TemplateSelectHandler;
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
      {/* Left Group: Core Actions */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="group/btn relative overflow-hidden"
        >
          <span
            className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100"
          />
          <Undo2 className="h-4 w-4" />
          <span className="ml-1.5 hidden sm:inline">撤销</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="group/btn relative overflow-hidden"
        >
          <span
            className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100"
          />
          <Redo2 className="h-4 w-4" />
          <span className="ml-1.5 hidden sm:inline">重做</span>
        </Button>

        {/* Separator */}
        <div className="mx-2 h-5 w-px bg-border/60" />

        <Button
          variant={previewMode ? "secondary" : "ghost"}
          size="sm"
          onClick={onTogglePreview}
          className="group/btn relative overflow-hidden"
        >
          <span
            className={`absolute inset-0 transition-opacity duration-200 ${
              previewMode
                ? "bg-primary/10"
                : "bg-primary/5 opacity-0 group-hover/btn:opacity-100"
            }`}
          />
          <Eye className="h-4 w-4" />
          <span className="ml-1.5 hidden sm:inline">
            {previewMode ? "退出预览" : "预览"}
          </span>
        </Button>
      </div>

      {/* Center Group: Design Tools */}
      <div className="flex items-center gap-0.5">
        <ResponsiveControls />
        <TemplateGallery />
        <FormBuilder />
        <ComponentGrouping />
        <AnimationEditor />

        {/* Separator */}
        <div className="mx-2 h-5 w-px bg-border/60" />

        <ThemeEditor />
        <Collaboration />
        <ComponentLibraryManager />
        <CodeExport />
      </div>
    </Header>
  );
}
