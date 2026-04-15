"use client";

import { Suspense, lazy, useEffect } from "react";
import styled from "@emotion/styled";
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
import { Eye, Undo2, Redo2, MoreHorizontal, LayoutGrid, Layers, Database, MessageSquare } from "lucide-react";
import { useToolbarResponsive } from "@/presentation/hooks";
import { useAllStores } from "@/presentation/hooks";
import { Skeleton } from "@/presentation/components/ui/skeleton";

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

const AIChat = lazy(() =>
  import("@/presentation/components/ai").then((mod) => ({
    default: mod.AIChat,
  }))
);

const PageRoot = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const HeaderToolbar = styled(Toolbar)`
  width: 100%;
  min-width: 0;
  border-width: 0;
  box-shadow: none;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  gap: 0.375rem;
`;

const CenterToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
  justify-content: center;
`;

const LoaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const SkeletonBtn = styled(Skeleton)`
  height: 2rem;
  width: 5rem;
`;

const TabLoaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

const SkeletonFull = styled(Skeleton)`
  height: 2rem;
  width: 100%;
`;

const SkeletonThreeQuarter = styled(Skeleton)`
  height: 2rem;
  width: 75%;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const ToolbarLabel = styled.span`
  margin-left: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  @media (max-width: 639px) {
    display: none;
  }
`;

const SheetPanel = styled(SheetContent)`
  width: 20rem;
  overflow-y: auto;
`;

const SheetBody = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SheetSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SheetSectionTitle = styled.h3`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
`;

const SheetButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const WorkArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const RailTabs = styled(Tabs)`
  width: 20rem;
  min-width: 20rem;
  flex-shrink: 0;
  border-right: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const RailTabsList = styled(TabsList)`
  display: grid;
  width: 100%;
  height: auto;
  min-height: 3.25rem;
  grid-template-columns: repeat(4, minmax(2.5rem, 1fr));
  flex-shrink: 0;
  align-items: stretch;
  box-sizing: border-box;
`;

const RailTabTrigger = styled(TabsTrigger)`
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 0.125rem;
  font-size: 0.625rem;
  line-height: 1;
  min-height: 3rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  white-space: normal;

  svg {
    flex-shrink: 0;
  }

  &[data-state="active"] {
    background-color: hsl(var(--primary) / 0.12);
    color: hsl(var(--primary));
    box-shadow: none;
    font-weight: 600;
  }

  &[data-state="inactive"] {
    opacity: 0.72;
  }

  &[data-state="inactive"]:hover {
    opacity: 1;
    background-color: hsl(var(--muted-foreground) / 0.06);
  }
`;

const RailTabPanel = styled(TabsContent)`
  flex: 1;
  padding: 0;
  overflow: hidden;
  &[data-state="active"] {
    display: flex;
    flex-direction: column;
  }
`;

const CanvasWrap = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ComponentLoader = () => (
  <LoaderWrap>
    <SkeletonBtn />
  </LoaderWrap>
);

const TabContentLoader = () => (
  <TabLoaderWrap>
    <SkeletonFull />
    <SkeletonFull />
    <SkeletonThreeQuarter />
  </TabLoaderWrap>
);

export default function LowCodePlatform() {
  const { shouldCollapse } = useToolbarResponsive();

  const {
    selectComponent,
    isPreviewMode,
    setPreviewMode,
    activeTab,
    setActiveTab,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAllStores();

  const togglePreviewMode = () => {
    setPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      selectComponent(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        togglePreviewMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo, togglePreviewMode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <PageRoot>
        <Header>
          <TooltipProvider>
            <HeaderToolbar>
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
                      <Undo2 size={16} aria-hidden="true" />
                      <VisuallyHidden>撤销</VisuallyHidden>
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
                      <Redo2 size={16} aria-hidden="true" />
                      <VisuallyHidden>重做</VisuallyHidden>
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
                      <Eye size={16} aria-hidden="true" />
                      <ToolbarLabel>
                        {isPreviewMode ? "退出预览" : "预览"}
                      </ToolbarLabel>
                      <VisuallyHidden>
                        {isPreviewMode ? "退出预览" : "预览"}
                      </VisuallyHidden>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPreviewMode ? "退出预览模式" : "进入预览模式"}</p>
                  </TooltipContent>
                </Tooltip>
              </ToolbarGroup>

              <CenterToolbar>
                <ToolbarGroup aria-label="核心功能">
                  <Suspense fallback={<ComponentLoader />}>
                    <ResponsiveControls />
                  </Suspense>
                  <Suspense fallback={<ComponentLoader />}>
                    <TemplateGallery />
                  </Suspense>
                </ToolbarGroup>

                {!shouldCollapse && (
                  <>
                    <ToolbarSeparator />
                    <ToolbarGroup aria-label="编辑功能">
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

                {shouldCollapse && (
                  <>
                    <ToolbarSeparator />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="更多功能"
                        >
                          <MoreHorizontal size={16} aria-hidden="true" />
                          <ToolbarLabel>更多</ToolbarLabel>
                          <VisuallyHidden>更多功能</VisuallyHidden>
                        </Button>
                      </SheetTrigger>
                      <SheetPanel side="right">
                        <SheetHeader>
                          <SheetTitle>更多功能</SheetTitle>
                        </SheetHeader>
                        <SheetBody>
                          <SheetSection>
                            <SheetSectionTitle>编辑功能</SheetSectionTitle>
                            <SheetButtonStack>
                              <Suspense fallback={<ComponentLoader />}>
                                <ComponentGrouping />
                              </Suspense>
                              <Suspense fallback={<ComponentLoader />}>
                                <AnimationEditor />
                              </Suspense>
                              <Suspense fallback={<ComponentLoader />}>
                                <ThemeEditor />
                              </Suspense>
                            </SheetButtonStack>
                          </SheetSection>
                          <SheetSection>
                            <SheetSectionTitle>协作与导出</SheetSectionTitle>
                            <SheetButtonStack>
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
                            </SheetButtonStack>
                          </SheetSection>
                        </SheetBody>
                      </SheetPanel>
                    </Sheet>
                  </>
                )}
              </CenterToolbar>
            </HeaderToolbar>
          </TooltipProvider>
        </Header>
        <WorkArea>
          {!isPreviewMode && (
            <TooltipProvider>
              <RailTabs value={activeTab} onValueChange={setActiveTab}>
              <RailTabsList>
                <RailTabTrigger value="components" aria-label="组件">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span style={{ display: "contents" }}>
                        <LayoutGrid size={18} />
                        <VisuallyHidden>组件</VisuallyHidden>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>组件</p>
                    </TooltipContent>
                  </Tooltip>
                </RailTabTrigger>
                <RailTabTrigger value="tree" aria-label="组件树">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span style={{ display: "contents" }}>
                        <Layers size={18} />
                        <VisuallyHidden>组件树</VisuallyHidden>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>组件树</p>
                    </TooltipContent>
                  </Tooltip>
                </RailTabTrigger>
                <RailTabTrigger value="data" aria-label="数据">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span style={{ display: "contents" }}>
                        <Database size={18} />
                        <VisuallyHidden>数据</VisuallyHidden>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>数据</p>
                    </TooltipContent>
                  </Tooltip>
                </RailTabTrigger>
                <RailTabTrigger value="ai-chat" aria-label="AI 对话">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span style={{ display: "contents" }}>
                        <MessageSquare size={18} />
                        <VisuallyHidden>AI对话</VisuallyHidden>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>AI 对话</p>
                    </TooltipContent>
                  </Tooltip>
                </RailTabTrigger>
              </RailTabsList>
              <RailTabPanel value="components">
                <Suspense fallback={<TabContentLoader />}>
                  <ComponentPanel />
                </Suspense>
              </RailTabPanel>
              <RailTabPanel value="tree">
                <Suspense fallback={<TabContentLoader />}>
                  <ComponentTree />
                </Suspense>
              </RailTabPanel>
              <RailTabPanel value="data">
                <Suspense fallback={<TabContentLoader />}>
                  <DataPanel />
                </Suspense>
              </RailTabPanel>
              <RailTabPanel value="ai-chat">
                <Suspense fallback={<TabContentLoader />}>
                  <AIChat />
                </Suspense>
              </RailTabPanel>
            </RailTabs>
            </TooltipProvider>
          )}
          <CanvasWrap
            style={{
              maxWidth: isPreviewMode ? "100%" : "none",
              margin: isPreviewMode ? "0 auto" : "0",
              transition: "max-width 0.3s ease",
            }}
          >
            <Canvas />
          </CanvasWrap>
          {!isPreviewMode && <PropertiesPanel />}
        </WorkArea>
      </PageRoot>
    </DndProvider>
  );
}
