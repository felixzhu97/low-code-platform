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
    <div className="flex items-center gap-2">
      <Tabs
        value={activeDevice}
        onValueChange={handleDeviceChange}
        className="mr-2"
      >
        <TabsList className="grid w-auto grid-cols-3">
          <TabsTrigger value="mobile" className="px-3">
            <Smartphone className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="tablet" className="px-3">
            <Tablet className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="desktop" className="px-3">
            <Laptop className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
