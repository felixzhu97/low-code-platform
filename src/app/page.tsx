"use client";

import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Canvas } from "@/canvas/presentation/canvas";
import { PropertiesPanel } from "@/canvas/presentation/properties-panel";
import { ComponentPanel } from "@/component/presentation/component-panel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/presentation/ui/tabs";
import { Header } from "@/common/presentation/header";
import { TemplateGallery } from "@/template/presentation/template-gallery";
import { ResponsiveControls } from "@/canvas/presentation/responsive-controls";
import { ThemeEditor } from "@/theme/presentation/theme-editor";
import { AnimationEditor } from "@/theme/presentation/animation-editor";
import { FormBuilder } from "@/form/presentation/forms/form-builder";
import { Collaboration } from "@/collaboration/presentation/collaboration";
import { CodeExport } from "@/export/presentation/code-export";
import type { Component } from "@/component/domain/types";
import type { ThemeConfig } from "@/theme/domain/types";
import { TemplateApplicationError } from "@/template/domain/types";
import { TemplateService } from "@/template/application/template-command.service";
import { Button } from "@/common/presentation/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { ComponentLibraryManager } from "@/component/presentation/component-library-manager";
import { ComponentGrouping } from "@/component/presentation/component-grouping";
import { ComponentTree } from "@/canvas/presentation/component-tree";
import { toast } from "@/common/presentation/hooks/use-toast";
import { useStores } from "@/common/infrastructure/use-stores";
import { useSimplifiedActions } from "@/common/presentation/hooks/use-simplified-actions";
import { DataPanel } from "@/data/presentation/data-panel";

export default function LowCodePlatform() {
  // 从 stores 获取状态
  const {
    // 组件状态
    components,
    selectedComponent,
    selectComponent,
    // 画布状态
    isPreviewMode,
    setPreviewMode,
    // UI状态
    activeTab,
    projectName,
    setActiveTab,
    // 历史记录状态
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStores();

  // 使用简化的操作hooks
  const { addComponentsWithHistory } = useSimplifiedActions();

  // 简化的处理函数

  const togglePreviewMode = () => {
    setPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      selectComponent(null);
    }
  };

  // 移除不必要的处理函数，组件直接使用store actions

  // 处理模板选择
  const handleSelectTemplate = useCallback(
    (templateComponents: Component[]) => {
      try {
        const processedComponents =
          TemplateService.applyTemplate(templateComponents);

        // 添加组件到store
        addComponentsWithHistory(processedComponents);

        toast({
          title: "模板应用成功",
          description: `已添加 ${processedComponents.length} 个组件到画布`,
        });
      } catch (error) {
        console.error("应用模板时出错:", error);

        if (error instanceof TemplateApplicationError) {
          toast({
            title: "模板应用失败",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "应用模板失败",
            description: "处理模板时发生未知错误",
            variant: "destructive",
          });
        }
      }
    },
    [addComponentsWithHistory]
  );

  // 移除不必要的处理函数，组件直接使用store actions

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <Header>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
            >
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="mr-2 h-4 w-4" />
              {isPreviewMode ? "退出预览" : "预览"}
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
        <div className="flex flex-1 overflow-hidden">
          {!isPreviewMode && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-64 border-r flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 shrink-0">
                <TabsTrigger value="components">组件</TabsTrigger>
                <TabsTrigger value="tree">组件树</TabsTrigger>
                <TabsTrigger value="data">数据</TabsTrigger>
              </TabsList>
              <TabsContent
                value="components"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <ComponentPanel />
              </TabsContent>
              <TabsContent
                value="tree"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <ComponentTree />
              </TabsContent>
              <TabsContent
                value="data"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <DataPanel />
              </TabsContent>
            </Tabs>
          )}
          <div
            className="flex-1 overflow-auto"
            style={{
              maxWidth: isPreviewMode ? "100%" : "none",
              margin: isPreviewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas />
          </div>
          {!isPreviewMode && <PropertiesPanel />}
        </div>
      </div>
    </DndProvider>
  );
}
