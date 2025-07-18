import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Eye, Undo2, Redo2 } from 'lucide-react';
import { Header } from '@/presentation/components/header';
import { ResponsiveControls } from '@/presentation/components/responsive-controls';
import { TemplateGallery } from '@/presentation/components/template-gallery';
import { FormBuilder } from '@/presentation/components/form-builder';
import { ComponentGrouping } from '@/presentation/components/component-grouping';
import { AnimationEditor } from '@/presentation/components/animation-editor';
import { ThemeEditor } from '@/presentation/components/theme-editor';
import { Collaboration } from '@/presentation/components/collaboration';
import { ComponentLibraryManager } from '@/presentation/components/component-library-manager';
import { CodeExport } from '@/presentation/components/code-export';
import type { Component, ThemeConfig, TemplateSelectHandler } from '@/domain/entities/types';

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
        <ResponsiveControls onViewportChange={onViewportChange} />
        <TemplateGallery onSelectTemplate={onSelectTemplate} theme={theme} />
        <FormBuilder onAddForm={onAddForm} />
        <ComponentGrouping
          components={components}
          onGroupComponents={onGroupComponents}
        />
        <AnimationEditor
          componentId={selectedComponentId}
          onApplyAnimation={onApplyAnimation}
        />
        <ThemeEditor theme={theme} onThemeChange={onThemeChange} />
        <Collaboration projectName={projectName} />
        <ComponentLibraryManager
          customComponents={customComponents}
          onAddComponent={onAddCustomComponent}
          onRemoveComponent={onRemoveCustomComponent}
          onImportComponents={onImportComponents}
          existingComponents={components}
        />
        <CodeExport components={components} />
      </div>
    </Header>
  );
}