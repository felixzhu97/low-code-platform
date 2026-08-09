"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Canvas } from "@/canvas/canvas";
import { PropertiesPanel } from "@/canvas/properties-panel";
import { ComponentPanel } from "@/component/component-panel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { ResponsiveControls } from "@/canvas/responsive-controls";
import { Button } from "@/components/ui/button";
import { Eye, Undo2, Redo2 } from "lucide-react";
import { ComponentTree } from "@/canvas/component-tree";
import { useComponentStore } from "@/component/component.store";
import { useCanvasStore } from "@/canvas/canvas.store";
import { useUIStore } from "@/lib/ui.store";
import { useHistoryStore } from "@/lib/history.store";

const TemplateGallery = dynamic(
  () =>
    import("@/template/template-gallery").then((m) => ({
      default: m.TemplateGallery,
    })),
  { ssr: false }
);
const FormBuilder = dynamic(
  () =>
    import("@/form/forms/form-builder").then((m) => ({
      default: m.FormBuilder,
    })),
  { ssr: false }
);
const ComponentGrouping = dynamic(
  () =>
    import("@/component/component-grouping").then((m) => ({
      default: m.ComponentGrouping,
    })),
  { ssr: false }
);
const AnimationEditor = dynamic(
  () =>
    import("@/theme/animation-editor").then((m) => ({
      default: m.AnimationEditor,
    })),
  { ssr: false }
);
const ThemeEditor = dynamic(
  () =>
    import("@/theme/theme-editor").then((m) => ({ default: m.ThemeEditor })),
  { ssr: false }
);
const Collaboration = dynamic(
  () =>
    import("@/collaboration/collaboration").then((m) => ({
      default: m.Collaboration,
    })),
  { ssr: false }
);
const ComponentLibraryManager = dynamic(
  () =>
    import("@/component/component-library-manager").then((m) => ({
      default: m.ComponentLibraryManager,
    })),
  { ssr: false }
);
const CodeExport = dynamic(
  () =>
    import("@/export/code-export").then((m) => ({ default: m.CodeExport })),
  { ssr: false }
);
const DataPanel = dynamic(
  () => import("@/data/data-panel").then((m) => ({ default: m.DataPanel })),
  { ssr: false }
);

export default function LowCodePlatform() {
  const selectComponent = useComponentStore((s) => s.selectComponent);
  const isPreviewMode = useCanvasStore((s) => s.isPreviewMode);
  const setPreviewMode = useCanvasStore((s) => s.setPreviewMode);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const canUndo = useHistoryStore((s) => s.componentsHistory.past.length > 0);
  const canRedo = useHistoryStore((s) => s.componentsHistory.future.length > 0);

  const togglePreviewMode = useCallback(() => {
    const previewing = useCanvasStore.getState().isPreviewMode;
    setPreviewMode(!previewing);
    if (!previewing) {
      selectComponent(null);
    }
  }, [setPreviewMode, selectComponent]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <Header>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
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
