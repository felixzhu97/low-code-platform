"use client";

import { useCallback, Suspense, lazy, useEffect, useState } from "react";
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
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/presentation/components/ui";
import { Eye, Undo2, Redo2, MoreHorizontal } from "lucide-react";
import { useToolbarResponsive } from "@/presentation/hooks";
import { toast } from "@/presentation/hooks/use-toast";
import { useAdapters, useAllStores } from "@/presentation/hooks";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { print, printWithTimestamp, initWasm } from "@/shared/wasm";

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
const AIGenerator = lazy(() =>
  import("@/presentation/components/ui").then((mod) => ({
    default: mod.AIGenerator,
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

// WASM 状态文字组件
function WasmStatusText({
  status,
  error,
}: Readonly<{
  status: "loading" | "success" | "error";
  error: string | null;
}>) {
  let text: string;

  if (status === "success") {
    text = "WASM 就绪";
  } else if (status === "error") {
    text = `WASM 错误: ${error || "加载失败"}`;
  } else {
    text = "WASM 加载中...";
  }

  return <span className="text-xs text-muted-foreground">{text}</span>;
}

export default function LowCodePlatform() {
  // WASM 加载状态
  const [wasmStatus, setWasmStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [wasmError, setWasmError] = useState<string | null>(null);

  // 响应式工具栏
  const { shouldCollapse } = useToolbarResponsive();

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
        setWasmStatus("loading");
        setWasmError(null);

        // 初始化 WASM 模块
        await initWasm();
        setWasmStatus("success");

        // 调用 WASM print 函数
        const result = await print("Hello from Rust WASM!");
        console.log("WASM Print Result:", result);

        // 调用带时间戳的打印函数
        const timestampResult = await printWithTimestamp(
          "WASM 模块已成功加载并运行"
        );
        console.log("WASM Print with Timestamp:", timestampResult);

        // 显示成功提示
        toast({
          title: "WASM 模块加载成功",
          description: "Rust WebAssembly 模块已成功初始化",
        });
      } catch (error) {
        console.error("WASM 初始化或调用失败:", error);
        const errorMessage =
          error instanceof Error ? error.message : "WASM 模块加载失败";
        setWasmStatus("error");
        setWasmError(errorMessage);

        // 显示错误提示
        toast({
          title: "WASM 模块加载失败",
          description: errorMessage,
          variant: "destructive",
        });
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

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z / Cmd+Z: 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }
      // Ctrl+Shift+Z / Cmd+Shift+Z: 重做
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
      // Ctrl+P / Cmd+P: 预览（阻止默认打印）
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        togglePreviewMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo, togglePreviewMode]);

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
          <TooltipProvider>
            <Toolbar className="w-full border-0 shadow-none bg-transparent px-0">
              {/* 左侧：基础操作按钮 */}
              <ToolbarGroup aria-label="基础操作">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={undo}
                      disabled={!canUndo()}
                      aria-label="撤销"
                    >
                      <Undo2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">撤销</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>撤销 (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={redo}
                      disabled={!canRedo()}
                      aria-label="重做"
                    >
                      <Redo2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">重做</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>重做 (Ctrl+Shift+Z)</p>
                  </TooltipContent>
                </Tooltip>
                <ToolbarSeparator />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePreviewMode}
                      aria-label={isPreviewMode ? "退出预览" : "预览"}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span className="ml-2 hidden sm:inline">
                        {isPreviewMode ? "退出预览" : "预览"}
                      </span>
                      <span className="sr-only">
                        {isPreviewMode ? "退出预览" : "预览"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPreviewMode ? "退出预览模式" : "进入预览模式"}</p>
                  </TooltipContent>
                </Tooltip>
              </ToolbarGroup>

              {/* 中间：核心功能 */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                <ToolbarGroup aria-label="核心功能">
                  <Suspense fallback={<ComponentLoader />}>
                    <ResponsiveControls />
                  </Suspense>
                  <Suspense fallback={<ComponentLoader />}>
                    <TemplateGallery />
                  </Suspense>
                  <Suspense fallback={<ComponentLoader />}>
                    <AIGenerator />
                  </Suspense>
                </ToolbarGroup>

                {!shouldCollapse && (
                  <>
                    <ToolbarSeparator />
                    {/* 编辑功能 */}
                    <ToolbarGroup aria-label="编辑功能">
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
                    </ToolbarGroup>

                    <ToolbarSeparator />
                    {/* 协作与导出 */}
                    <ToolbarGroup aria-label="协作与导出">
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
                    </ToolbarGroup>
                  </>
                )}

                {/* 移动端/平板端：更多菜单 */}
                {shouldCollapse && (
                  <>
                    <ToolbarSeparator />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" aria-label="更多功能">
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          <span className="ml-2 hidden sm:inline">更多</span>
                          <span className="sr-only">更多功能</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-80 overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>更多功能</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                              编辑功能
                            </h3>
                            <div className="flex flex-col gap-2">
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
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                              协作与导出
                            </h3>
                            <div className="flex flex-col gap-2">
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
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </>
                )}
              </div>

              {/* 右侧：状态信息 */}
              <ToolbarGroup aria-label="状态信息">
                <WasmStatusText status={wasmStatus} error={wasmError} />
              </ToolbarGroup>
            </Toolbar>
          </TooltipProvider>
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
