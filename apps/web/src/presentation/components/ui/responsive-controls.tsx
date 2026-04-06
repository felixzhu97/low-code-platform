"use client";

import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { useCanvasStore } from "@/infrastructure/state-management/stores";

interface ResponsiveControlsProps {
  // 移除 props，现在从 store 获取状态
}

export function ResponsiveControls({}: ResponsiveControlsProps) {
  // 从 store 获取状态
  const { activeDevice, setActiveDevice, setViewportWidth } = useCanvasStore();

  const handleDeviceChange = (device: string) => {
    setActiveDevice(device);

    switch (device) {
      case "mobile":
        setViewportWidth(375);
        break;
      case "tablet":
        setViewportWidth(768);
        break;
      case "desktop":
      default:
        setViewportWidth(1280);
        break;
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Tabs
        value={activeDevice}
        onValueChange={handleDeviceChange}
        className="mr-1"
      >
        <TabsList className="grid h-8 w-auto grid-cols-3 gap-0 p-0.5">
          <TabsTrigger value="mobile" className="h-7 px-2 py-0 text-xs">
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
          </TabsTrigger>
          <TabsTrigger value="tablet" className="h-7 px-2 py-0 text-xs">
            <Tablet className="h-3.5 w-3.5" aria-hidden="true" />
          </TabsTrigger>
          <TabsTrigger value="desktop" className="h-7 px-2 py-0 text-xs">
            <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
