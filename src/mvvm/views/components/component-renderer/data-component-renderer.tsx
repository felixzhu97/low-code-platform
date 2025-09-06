import type React from "react";
import type { Component, TableColumn } from "@/domain/entities/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/presentation/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
import { ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/application/services/utils";

interface DataComponentRendererProps {
  component: Component;
  props: Record<string, any>;
  componentData: any;
  animationStyle: React.CSSProperties;
}

export function DataComponentRenderer({
  component,
  props,
  componentData,
  animationStyle,
}: DataComponentRendererProps) {
  switch (component.type) {
    case "data-table":
      return (
        <div
          className="w-full overflow-hidden rounded-md border"
          style={{ ...animationStyle }}
        >
          {props.title && (
            <div className="bg-muted px-4 py-2 text-sm font-medium">
              {props.title}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              {componentData ? (
                <>
                  <TableHeader>
                    <TableRow>
                      {(props.columns || []).map((column: TableColumn) => (
                        <TableHead
                          key={column.key}
                          className="whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1">
                            {column.title}
                            {column.sortable && (
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                            )}
                            {column.filterable && (
                              <Filter className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(componentData) &&
                    componentData.length > 0 ? (
                      componentData
                        .slice(0, props.pageSize || 10)
                        .map((row: any, rowIndex: number) => (
                          <TableRow
                            key={rowIndex}
                            className={cn(
                              props.striped &&
                                rowIndex % 2 === 1 &&
                                "bg-muted/50"
                            )}
                          >
                            {(props.columns || []).map(
                              (column: TableColumn) => (
                                <TableCell
                                  key={column.key}
                                  className="whitespace-nowrap"
                                >
                                  {row[column.dataIndex]}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={(props.columns || []).length}
                          className="h-24 text-center"
                        >
                          无数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              ) : (
                <>
                  <TableHeader>
                    <TableRow>
                      {(props.columns || []).map((column: TableColumn) => (
                        <TableHead
                          key={column.key}
                          className="whitespace-nowrap"
                        >
                          {column.title}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={(props.columns || []).length}
                        className="h-24 text-center"
                      >
                        请绑定数据源
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </>
              )}
            </Table>
          </div>
          {props.pagination && (
            <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
              <div className="text-sm text-muted-foreground">
                共{" "}
                {componentData && Array.isArray(componentData)
                  ? componentData.length
                  : 0}{" "}
                条
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  下一页
                </Button>
              </div>
            </div>
          )}
        </div>
      );

    case "data-list":
      return (
        <div
          className="w-full overflow-hidden rounded-md border"
          style={{ ...animationStyle }}
        >
          {props.title && (
            <div className="bg-muted px-4 py-2 text-sm font-medium">
              {props.title}
            </div>
          )}
          <div className="divide-y">
            {componentData &&
            Array.isArray(componentData) &&
            componentData.length > 0 ? (
              componentData
                .slice(0, props.pageSize || 5)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      "flex p-4",
                      props.itemLayout === "vertical" && "flex-col",
                      props.itemLayout !== "vertical" && "items-center"
                    )}
                  >
                    {props.listType === "avatar" && (
                      <div
                        className={cn(
                          "mr-4",
                          props.itemLayout === "vertical" && "mb-2"
                        )}
                      >
                        <Avatar>
                          <AvatarImage src={item.avatar || ""} />
                          <AvatarFallback>
                            {item.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {item.title || item.name || `项目 ${index + 1}`}
                        </div>
                        {props.showExtra && (
                          <div className="text-sm text-muted-foreground">
                            {item.date || "2023-01-01"}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {item.description || "这是一个列表项描述"}
                      </div>
                      {props.showActions && (
                        <div className="mt-2 flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            查看
                          </Button>
                          <Button variant="ghost" size="sm">
                            编辑
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground">
                  {componentData ? "无数据" : "请绑定数据源"}
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case "data-card":
      return (
        <Card className="overflow-hidden" style={{ ...animationStyle }}>
          <CardHeader className={cn(props.cardType === "stats" && "pb-2")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <CardTitle className="text-base">
                    {props.title || "数据卡片"}
                  </CardTitle>
                  {props.cardType !== "stats" && (
                    <CardDescription>
                      {componentData?.description || "数据卡片描述"}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {props.cardType === "stats" ? (
              <div>
                <div className="text-3xl font-bold">
                  {componentData?.value || componentData?.count || 0}
                </div>
                {props.showTrend && (
                  <div className="mt-1 flex items-center gap-1">
                    <Badge variant="outline" className="text-emerald-500">
                      +{componentData?.increase || "12.5"}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      vs 上期
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {componentData ? (
                  <div className="space-y-2">
                    {Object.entries(componentData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm font-medium">{key}:</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    请绑定数据源
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              最后更新: {componentData?.updateTime || "2023-01-01 12:00:00"}
            </div>
          </CardFooter>
        </Card>
      );

    default:
      return (
        <div className="rounded border p-2" style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
