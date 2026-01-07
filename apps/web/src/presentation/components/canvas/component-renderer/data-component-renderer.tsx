import type React from "react";
import type { TableColumn, TreeNode } from "@/domain/chart";
import type { Component } from "@/domain/component";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/presentation/components/ui";
import {
  ArrowUpDown,
  Filter,
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
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

    case "pagination":
      const totalPages = props.totalPages || 10;
      const currentPage = props.currentPage || 1;
      const showSizeChanger = props.showSizeChanger || false;
      const pageSize = props.pageSize || 10;
      const showQuickJumper = props.showQuickJumper || false;

      const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
              pages.push(i);
            }
            pages.push("ellipsis");
            pages.push(totalPages);
          } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push("ellipsis");
            for (let i = totalPages - 3; i <= totalPages; i++) {
              pages.push(i);
            }
          } else {
            pages.push(1);
            pages.push("ellipsis");
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
              pages.push(i);
            }
            pages.push("ellipsis");
            pages.push(totalPages);
          }
        }

        return pages;
      };

      return (
        <div
          className="flex flex-col items-center gap-4"
          style={{ ...animationStyle }}
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink href="#" isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {props.showTotal && (
            <div className="text-sm text-muted-foreground">
              共 {props.total || totalPages * pageSize} 条记录，第 {currentPage}{" "}
              / {totalPages} 页
            </div>
          )}

          {showSizeChanger && (
            <div className="flex items-center gap-2">
              <span className="text-sm">每页显示</span>
              <select
                className="rounded border px-2 py-1 text-sm"
                value={pageSize}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm">条</span>
            </div>
          )}
        </div>
      );

    case "tree":
      const renderTreeNode = (node: TreeNode, level: number = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = node.expanded || false;
        const isSelected = node.selected || false;
        const isDisabled = node.disabled || false;

        return (
          <div key={node.id} className="select-none">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 hover:bg-muted/50 cursor-pointer rounded-sm",
                isSelected && "bg-primary/10 text-primary",
                isDisabled && "opacity-50 cursor-not-allowed",
                level > 0 && "ml-4"
              )}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {hasChildren ? (
                <button
                  className="p-0.5 hover:bg-muted rounded"
                  disabled={isDisabled}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              ) : (
                <div className="w-4" />
              )}

              <div className="flex items-center gap-1 flex-1">
                {node.icon === "folder" ? (
                  isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Folder className="h-4 w-4 text-blue-500" />
                  )
                ) : node.icon === "file" ? (
                  <File className="h-4 w-4 text-gray-500" />
                ) : null}

                <span className="text-sm">{node.title}</span>
              </div>
            </div>

            {hasChildren && isExpanded && (
              <div>
                {node.children!.map((child) =>
                  renderTreeNode(child, level + 1)
                )}
              </div>
            )}
          </div>
        );
      };

      // 默认树形数据
      const defaultTreeData: TreeNode[] = [
        {
          id: "1",
          title: "根节点",
          icon: "folder",
          expanded: true,
          children: [
            {
              id: "1-1",
              title: "子节点 1",
              icon: "folder",
              expanded: false,
              children: [
                {
                  id: "1-1-1",
                  title: "子节点 1-1",
                  icon: "file",
                },
                {
                  id: "1-1-2",
                  title: "子节点 1-2",
                  icon: "file",
                },
              ],
            },
            {
              id: "1-2",
              title: "子节点 2",
              icon: "folder",
              expanded: false,
              children: [
                {
                  id: "1-2-1",
                  title: "子节点 2-1",
                  icon: "file",
                },
              ],
            },
          ],
        },
        {
          id: "2",
          title: "另一个根节点",
          icon: "folder",
          expanded: false,
          children: [
            {
              id: "2-1",
              title: "子节点 2-1",
              icon: "file",
            },
          ],
        },
      ];

      const treeData = componentData || defaultTreeData;

      return (
        <div
          className="w-full overflow-hidden rounded-md border bg-background"
          style={{ ...animationStyle }}
        >
          {props.title && (
            <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
              {props.title}
            </div>
          )}

          <div className="p-2">
            {Array.isArray(treeData) && treeData.length > 0 ? (
              treeData.map((node) => renderTreeNode(node))
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground">
                  {componentData ? "无数据" : "请绑定数据源"}
                </p>
              </div>
            )}
          </div>

          {props.showSearch && (
            <div className="border-t p-2">
              <input
                type="text"
                placeholder="搜索节点..."
                className="w-full rounded border px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="rounded border p-2" style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
