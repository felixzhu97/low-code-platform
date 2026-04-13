import React from "react";
import styled from "@emotion/styled";
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
  onGroupComponents: (componentIds: string[], groupName: string) => void;
  onApplyAnimation: (componentId: string, animation: any) => void;
  onThemeChange: (theme: ThemeConfig) => void;
  onAddCustomComponent: (component: any) => void;
  onRemoveCustomComponent: (componentId: string) => void;
  onImportComponents: (components: any[]) => void;
}

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonIcon = styled.span`
  display: flex;
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
`;

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
  onGroupComponents,
  onApplyAnimation,
  onThemeChange,
  onAddCustomComponent,
  onRemoveCustomComponent,
  onImportComponents,
}: PlatformHeaderProps) {
  return (
    <Header>
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <ButtonIcon>
            <Undo2 />
          </ButtonIcon>
          撤销
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <ButtonIcon>
            <Redo2 />
          </ButtonIcon>
          重做
        </Button>
        <Button variant="outline" size="sm" onClick={onTogglePreview}>
          <ButtonIcon>
            <Eye />
          </ButtonIcon>
          {previewMode ? "退出预览" : "预览"}
        </Button>
        <ResponsiveControls />
        <ComponentGrouping />
        <AnimationEditor />
        <ThemeEditor />
        <Collaboration />
        <ComponentLibraryManager />
        <CodeExport />
      </ButtonGroup>
    </Header>
  );
}
