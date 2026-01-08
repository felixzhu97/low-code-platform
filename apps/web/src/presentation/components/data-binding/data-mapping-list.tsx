"use client";

import { useState, useEffect } from "react";
import {
  Button,
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  Card,
  CardHeader,
  CardContent,
} from "@/presentation/components/ui";
import { Link2, Plus, Database, FileJson, Loader2 } from "lucide-react";
import { DataMappingEditor } from "./data-mapping-editor";
import { JsonDataInput } from "./json-data-input";
import type { DataMapping, DataSource } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataMappingListProps {
  mappings: DataMapping[];
  dataSource: DataSource | null;
  componentType?: string;
  onChange: (mappings: DataMapping[]) => void;
  onCreateDataSourceFromJson?: (dataSource: DataSource) => void;
  onQuickInput?: (data: any) => void; // 快速输入回调
}

export function DataMappingList({
  mappings,
  dataSource,
  componentType,
  onChange,
  onCreateDataSourceFromJson,
  onQuickInput,
}: DataMappingListProps) {
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuickInput, setShowQuickInput] = useState(false);

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

  const handleJsonConfirm = (data: any) => {
    // 优先使用快速输入回调
    if (onQuickInput) {
      onQuickInput(data);
    } else if (onCreateDataSourceFromJson) {
      // 如果没有快速输入回调，使用创建数据源回调
      onCreateDataSourceFromJson(data);
    }

    setShowQuickInput(false);
  };

  if (!dataSource) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-2">
              请先选择数据源
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs">
              选择数据源后即可配置数据映射，或使用快速输入功能直接输入数据
            </p>

            <Collapsible open={showQuickInput} onOpenChange={setShowQuickInput}>
              <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200 w-full">
                <Card className="mt-4 border-primary/20 bg-primary/5">
                  <JsonDataInput
                    onConfirm={handleJsonConfirm}
                    showTemplateSelector={true}
                    placeholder="输入JSON数据，或从模板中选择..."
                    minHeight="200px"
                    componentType={componentType}
                  />
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {!showQuickInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuickInput(true)}
                className="gap-2"
              >
                <FileJson className="h-4 w-4" />
                快速输入数据
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">数据映射</h3>
          </div>
          <Button size="sm" onClick={handleAddMapping} className="gap-2 h-7">
            <Plus className="h-3 w-3" />
            添加映射
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            加载数据源结构...
          </div>
        )}

        {!loading && mappings.length === 0 && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <Link2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground mb-1">
              暂无数据映射
            </p>
            <p className="text-xs text-muted-foreground/70 mb-4">
              点击"添加映射"按钮开始配置数据绑定关系
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddMapping}
              className="gap-2"
            >
              <Plus className="h-3 w-3" />
              添加映射
            </Button>
          </div>
        )}

        {!loading && mappings.length > 0 && (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3 pr-4">
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
      </CardContent>
    </Card>
  );
}
