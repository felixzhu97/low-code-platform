"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { Laptop, Smartphone, Tablet } from "lucide-react"

interface ResponsiveControlsProps {
  onViewportChange: (width: number, device: string) => void
}

export function ResponsiveControls({ onViewportChange }: ResponsiveControlsProps) {
  const [activeDevice, setActiveDevice] = useState<string>("desktop")

  const handleDeviceChange = (device: string) => {
    setActiveDevice(device)

    switch (device) {
      case "mobile":
        onViewportChange(375, device)
        break
      case "tablet":
        onViewportChange(768, device)
        break
      case "desktop":
      default:
        onViewportChange(1280, device)
        break
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Tabs value={activeDevice} onValueChange={handleDeviceChange} className="mr-2">
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
  )
}
