"use client";

import { useCallback, Suspense, lazy, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Canvas, PropertiesPanel } from "@/presentation/components/canvas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { Header } from "@/presentation/components/ui";
import { Button } from "@/presentation/components/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { toast } from "@/presentation/hooks/use-toast";
import { useAdapters, useAllStores } from "@/presentation/hooks";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { print, printWithTimestamp } from "@/shared/wasm";

// 动态导入 Header 中的功能组件
const ResponsiveControls = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.ResponsiveControls,
  }))
);
const TemplateGallery = lazy(() =>
  import("@/presentation/components/templates").then((mod) => ({
    default: mod.TemplateGallery,
  }))
);
const FormBuilder = lazy(() =>
  import("@/presentation/components/forms").then((mod) => ({
    default: mod.FormBuilder,
  }))
);
const ComponentGrouping = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.ComponentGrouping,
  }))
);
const AnimationEditor = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.AnimationEditor,
  }))
);
const ThemeEditor = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.ThemeEditor,
  }))
);
const Collaboration = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.Collaboration,
  }))
);
const ComponentLibraryManager = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.ComponentLibraryManager,
  }))
);
const SchemaImport = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.SchemaImport,
  }))
);
const CodeExport = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.CodeExport,
  }))
);

// 动态导入 Tab 内容组件
const ComponentPanel = lazy(() =>
  import("@/presentation/components/canvas").then((mod) => ({
    default: mod.ComponentPanel,
  }))
);
const ComponentTree = lazy(() =>
  import("@/presentation/components/canvas").then((mod) => ({
    default: mod.ComponentTree,
  }))
);
const DataPanel = lazy(() =>
  import("@/presentation/components/data").then((mod) => ({
    default: mod.DataPanel,
  }))
);

// 加载占位符组件
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-2">
    <Skeleton className="h-8 w-20" />
  </div>
);

// Tab 内容加载占位符
const TabContentLoader = () => (
  <div className="flex flex-col gap-2 p-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-3/4" />
  </div>
);

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

  // 初始化并使用 WASM 打印功能
  useEffect(() => {
    const initWasmPrint = async () => {
      try {
        // 调用 WASM print 函数
        const result = await print("Hello from Rust WASM!");
        console.log("WASM Print Result:", result);

        // 调用带时间戳的打印函数
        const timestampResult = await printWithTimestamp(
          "WASM 模块已成功加载并运行"
        );
        console.log("WASM Print with Timestamp:", timestampResult);
      } catch (error) {
        console.error("WASM 初始化或调用失败:", error);
      }
    };

    initWasmPrint();
  }, []);

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
            <Suspense fallback={<ComponentLoader />}>
              <ResponsiveControls />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <TemplateGallery />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FormBuilder />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ComponentGrouping />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <AnimationEditor />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ThemeEditor />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Collaboration />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ComponentLibraryManager />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <SchemaImport />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <CodeExport />
            </Suspense>
          </div>
        </Header>
        <div className="flex flex-1 overflow-hidden">
          {!isPreviewMode && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-80 border-r flex flex-col"
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
                <Suspense fallback={<TabContentLoader />}>
                  <ComponentPanel />
                </Suspense>
              </TabsContent>
              <TabsContent
                value="tree"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <Suspense fallback={<TabContentLoader />}>
                  <ComponentTree />
                </Suspense>
              </TabsContent>
              <TabsContent
                value="data"
                className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden"
              >
                <Suspense fallback={<TabContentLoader />}>
                  <DataPanel />
                </Suspense>
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
