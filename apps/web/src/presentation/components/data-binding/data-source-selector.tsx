"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Button,
  Collapsible,
  CollapsibleContent,
  Card,
  CardHeader,
  CardContent,
  Badge,
} from "@/presentation/components/ui";
import {
  Database,
  Plus,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { DataSource } from "@/domain/datasource";
import { JsonDataInput } from "./json-data-input";
import { DataSourceService } from "@/application/services/data-source.service";

interface DataSourceSelectorProps {
  dataSources: DataSource[];
  selectedDataSourceId: string | null;
  onDataSourceChange: (dataSourceId: string | null) => void;
  onCreateDataSourceFromJson?: (dataSource: DataSource) => void;
  componentType?: string; // 组件类型，用于推荐模板
}

export function DataSourceSelector({
  dataSources,
  selectedDataSourceId,
  onDataSourceChange,
  onCreateDataSourceFromJson,
  componentType,
}: DataSourceSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedDataSourceId
  );
  const [showQuickInput, setShowQuickInput] = useState(false);

  useEffect(() => {
    setSelectedId(selectedDataSourceId);
  }, [selectedDataSourceId]);

  const handleChange = (value: string) => {
    if (value === "none" || value === "") {
      setSelectedId(null);
      onDataSourceChange(null);
    } else {
      setSelectedId(value);
      onDataSourceChange(value);
    }
  };

  const handleClear = () => {
    setSelectedId(null);
    onDataSourceChange(null);
  };

  const handleJsonConfirm = (data: any) => {
    // 如果提供了回调，使用回调（会自动创建数据源并渲染）
    if (onCreateDataSourceFromJson) {
      onCreateDataSourceFromJson(data);
    } else {
      // 如果没有回调，创建临时数据源并触发变化
      const tempDataSource = DataSourceService.createDataSource(
        `快速输入数据-${Date.now()}`,
        "static",
        data
      );
      onDataSourceChange(tempDataSource.id);
    }

    setShowQuickInput(false);
  };

  const selectedDataSource = dataSources.find((ds) => ds.id === selectedId);

  return (
    <div className="space-y-3">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-primary/10 p-1.5">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <Label
                htmlFor="data-source-select"
                className="text-sm font-semibold"
              >
                数据源
              </Label>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuickInput(!showQuickInput)}
                className="h-7 gap-1.5 text-xs"
              >
                <Plus className="h-3 w-3" />
                快速输入
              </Button>
              {selectedId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 w-7 p-0"
                  title="清除绑定"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          {dataSources.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                暂无可用数据源
              </p>
              <p className="text-xs text-muted-foreground/70">
                请在左侧"数据"面板中创建数据源，或使用快速输入功能
              </p>
            </div>
          ) : (
            <Select value={selectedId || "none"} onValueChange={handleChange}>
              <SelectTrigger
                id="data-source-select"
                className="w-full h-9 text-sm"
              >
                <SelectValue placeholder="选择数据源">
                  {selectedId && selectedDataSource ? (
                    <span className="truncate">{selectedDataSource.name}</span>
                  ) : (
                    "选择数据源"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="none" className="text-muted-foreground">
                  <span className="text-sm">无</span>
                </SelectItem>
                {dataSources.map((dataSource) => (
                  <SelectItem
                    key={dataSource.id}
                    value={dataSource.id}
                    className="py-2"
                  >
                    <div className="flex items-center gap-2.5 w-full min-w-0">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm truncate block min-w-0">
                            {dataSource.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs h-4 px-1.5 font-normal shrink-0"
                          >
                            {dataSource.type}
                          </Badge>
                        </div>
                      </div>
                      {dataSource.status === "error" && (
                        <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                      )}
                      {dataSource.status === "active" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* 快速输入JSON数据 */}
      <Collapsible open={showQuickInput} onOpenChange={setShowQuickInput}>
        <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
            <JsonDataInput
              onConfirm={handleJsonConfirm}
              showTemplateSelector={true}
              placeholder="输入JSON数据，或从模板中选择..."
              minHeight="150px"
              componentType={componentType}
            />
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {selectedDataSource && (
        <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0 overflow-hidden">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div
                    className="font-semibold text-sm text-foreground mb-2 truncate"
                    title={selectedDataSource.name}
                  >
                    {selectedDataSource.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="h-5 px-2 text-xs font-medium bg-background/60"
                    >
                      {selectedDataSource.type}
                    </Badge>
                    {selectedDataSource.status === "active" && (
                      <Badge
                        variant="outline"
                        className="h-5 px-2 text-xs font-medium border-green-500/60 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        活跃
                      </Badge>
                    )}
                    {selectedDataSource.status === "error" && (
                      <Badge
                        variant="destructive"
                        className="h-5 px-2 text-xs font-medium"
                      >
                        错误
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          {selectedDataSource.lastUpdated && (
            <CardContent className="pt-0 px-4 pb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/40 rounded-md px-2.5 py-1.5 border border-border/50">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  最后更新:{" "}
                  {new Date(selectedDataSource.lastUpdated).toLocaleString(
                    "zh-CN",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </span>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
