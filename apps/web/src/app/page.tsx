"use client";

import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Canvas,
  ComponentPanel,
  PropertiesPanel,
} from "@/presentation/components/canvas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { CodeExport, Header, SchemaImport } from "@/presentation/components/ui";
import { TemplateGallery } from "@/presentation/components/templates";
import { ResponsiveControls } from "@/presentation/components/ui";
import { ThemeEditor } from "@/presentation/components/ui";
import { FormBuilder } from "@/presentation/components/forms";
import { AnimationEditor } from "@/presentation/components/ui";
import { Collaboration } from "@/presentation/components/ui";
import { Button } from "@/presentation/components/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { ComponentLibraryManager } from "@/presentation/components/ui";
import { ComponentGrouping } from "@/presentation/components/ui";
import { ComponentTree } from "@/presentation/components/canvas";
import { toast } from "@/presentation/hooks/use-toast";
import { useAdapters, useAllStores } from "@/presentation/hooks";
import { DataPanel } from "@/presentation/components/data";

export default function LowCodePlatform() {
  // 从 stores 获取状态
  const {
    // 组件状态
    selectedComponent,
    selectComponent,
    // 画布状态
    isPreviewMode,
    setPreviewMode,
    // UI状态
    activeTab,
    setActiveTab,
    // 历史记录状态
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAllStores();

  // 获取适配器
  const { templateAdapter } = useAdapters();

  // 处理预览模式切换
  const togglePreviewMode = () => {
    setPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      selectComponent(null);
    }
  };

  // 处理模板选择
  const handleSelectTemplate = useCallback(
    async (templateComponents: any[]) => {
      try {
        // 通过适配器应用模板
        const processedComponents =
          await templateAdapter.applyTemplateFromComponents(templateComponents);

        toast({
          title: "模板应用成功",
          description: `已添加 ${processedComponents.length} 个组件到画布`,
        });
      } catch (error) {
        console.error("应用模板时出错:", error);

        const errorMessage =
          error instanceof Error ? error.message : "处理模板时发生未知错误";

        toast({
          title: "模板应用失败",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [templateAdapter]
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
            <SchemaImport />
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
