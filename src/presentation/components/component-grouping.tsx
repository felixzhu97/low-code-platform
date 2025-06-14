"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, Group } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import {Component} from "@/lib/component";

interface ComponentGroupingProps {
  components: Component[]
  onGroupComponents: (componentIds: string[], groupName: string) => void
}

export function ComponentGrouping({ components, onGroupComponents }: ComponentGroupingProps) {
  const [groupName, setGroupName] = useState("新建组")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleToggleComponent = (componentId: string) => {
    if (selectedIds.includes(componentId)) {
      setSelectedIds(selectedIds.filter((id) => id !== componentId))
    } else {
      setSelectedIds([...selectedIds, componentId])
    }
  }

  const handleCreateGroup = () => {
    if (selectedIds.length < 2 || !groupName.trim()) return
    onGroupComponents(selectedIds, groupName)
    setGroupName("新建组")
    setSelectedIds([])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={components.length < 2}>
          <Group className="mr-2 h-4 w-4" />
          组件分组
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>创建组件分组</DialogTitle>
          <DialogDescription>选择多个组件创建一个组，便于统一管理和移动</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">组名称</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="输入组名称"
            />
          </div>

          <div className="grid gap-2">
            <Label>选择组件</Label>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {components.length > 0 ? (
                components.map((component) => (
                  <div key={component.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`component-${component.id}`}
                      checked={selectedIds.includes(component.id)}
                      onCheckedChange={() => handleToggleComponent(component.id)}
                    />
                    <Label
                      htmlFor={`component-${component.id}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                    >
                      <span>{component.name || component.type}</span>
                      <span className="text-xs text-muted-foreground">{component.type}</span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">没有可用的组件</p>
                </div>
              )}
            </ScrollArea>
            <p className="text-xs text-muted-foreground">已选择 {selectedIds.length} 个组件</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateGroup} disabled={selectedIds.length < 2 || !groupName.trim()}>
            <Layers className="mr-2 h-4 w-4" />
            创建组
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
