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
} from "@/presentation/components/ui";
import type { DataSource } from "@/domain/datasource";

interface DataSourceSelectorProps {
  dataSources: DataSource[];
  selectedDataSourceId: string | null;
  onDataSourceChange: (dataSourceId: string | null) => void;
}

export function DataSourceSelector({
  dataSources,
  selectedDataSourceId,
  onDataSourceChange,
}: DataSourceSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedDataSourceId
  );

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

  const selectedDataSource = dataSources.find((ds) => ds.id === selectedId);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="data-source-select">数据源</Label>
          {selectedId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 px-2 text-xs"
            >
              清除绑定
            </Button>
          )}
        </div>
        {dataSources.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm">
            <p className="text-muted-foreground mb-2">暂无可用数据源</p>
            <p className="text-xs text-muted-foreground">
              请在左侧"数据"面板中创建数据源
            </p>
          </div>
        ) : (
          <Select value={selectedId || "none"} onValueChange={handleChange}>
            <SelectTrigger id="data-source-select">
              <SelectValue placeholder="选择数据源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无</SelectItem>
              {dataSources.map((dataSource) => (
                <SelectItem key={dataSource.id} value={dataSource.id}>
                  <div className="flex items-center gap-2">
                    <span>{dataSource.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({dataSource.type})
                    </span>
                    {dataSource.status === "error" && (
                      <span className="text-xs text-destructive">错误</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedDataSource && (
        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium">{selectedDataSource.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            类型: {selectedDataSource.type}
            {selectedDataSource.status && (
              <span className="ml-2">状态: {selectedDataSource.status}</span>
            )}
          </div>
          {selectedDataSource.lastUpdated && (
            <div className="mt-1 text-xs text-muted-foreground">
              最后更新:{" "}
              {new Date(selectedDataSource.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
