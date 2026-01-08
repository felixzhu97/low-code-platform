"use client";

import { useState, useEffect } from "react";
import { Button, ScrollArea } from "@/presentation/components/ui";
import { DataMappingEditor } from "./data-mapping-editor";
import type { DataMapping } from "@/domain/datasource";
import type { DataSource } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataMappingListProps {
  mappings: DataMapping[];
  dataSource: DataSource | null;
  componentType?: string;
  onChange: (mappings: DataMapping[]) => void;
}

export function DataMappingList({
  mappings,
  dataSource,
  componentType,
  onChange,
}: DataMappingListProps) {
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取可用路径
  useEffect(() => {
    const loadPaths = async () => {
      if (!dataSource) {
        setAvailablePaths([]);
        return;
      }

      setLoading(true);
      try {
        const paths = await DataBindingService.getDataSourceStructure(
          dataSource
        );
        setAvailablePaths(paths);
      } catch (error) {
        console.error("加载数据源路径失败:", error);
        setAvailablePaths([]);
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, [dataSource]);

  // 根据组件类型生成目标路径建议
  const getTargetPathSuggestions = (): string[] => {
    const suggestions: string[] = [];
    if (!componentType) return suggestions;

    switch (componentType) {
      case "text":
        suggestions.push("properties.content");
        break;
      case "button":
        suggestions.push("properties.text");
        break;
      case "image":
        suggestions.push("properties.src");
        suggestions.push("properties.alt");
        break;
      case "input":
        suggestions.push("properties.defaultValue");
        suggestions.push("properties.placeholder");
        break;
      default:
        suggestions.push("properties.value");
        suggestions.push("properties.content");
        suggestions.push("properties.text");
    }

    return suggestions;
  };

  const handleAddMapping = () => {
    const newMapping: DataMapping = {
      field: `field_${mappings.length + 1}`,
      sourcePath: "",
      targetPath: "",
    };
    onChange([...mappings, newMapping]);
  };

  const handleUpdateMapping = (index: number, mapping: DataMapping) => {
    const updated = [...mappings];
    updated[index] = mapping;
    onChange(updated);
  };

  const handleDeleteMapping = (index: number) => {
    const updated = mappings.filter((_, i) => i !== index);
    onChange(updated);
  };

  if (!dataSource) {
    return (
      <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
        请先选择数据源
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">数据映射</h3>
        <Button size="sm" onClick={handleAddMapping}>
          添加映射
        </Button>
      </div>

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          加载数据源结构...
        </div>
      )}

      {mappings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>暂无数据映射</p>
          <p className="mt-2 text-xs">点击"添加映射"按钮开始配置</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3">
            {mappings.map((mapping, index) => (
              <DataMappingEditor
                key={index}
                mapping={mapping}
                dataSource={dataSource}
                availablePaths={availablePaths}
                targetPathSuggestions={getTargetPathSuggestions()}
                onChange={(updatedMapping) =>
                  handleUpdateMapping(index, updatedMapping)
                }
                onDelete={() => handleDeleteMapping(index)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
