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
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { cn } from "@/application/services/utils";
import {
  tableShell,
  treePanelShell,
  tableHeaderBar,
  overflowXAuto,
  paginationBar,
  fallbackBox,
  mutedCenter,
  flex1,
  flexBetween,
  flexRowGap1,
  flexRowGap2,
} from "./renderer-emotion";

const ThNowrap = styled(TableHead)`
  white-space: nowrap;
`;

const TdNowrap = styled(TableCell)`
  white-space: nowrap;
`;

const TdEmpty = styled(TableCell)`
  height: 6rem;
  text-align: center;
`;

const PageNumBtn = styled(Button)`
  height: 2rem;
  width: 2rem;
  padding: 0;
`;

const SelectSm = styled.select`
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const TreeSearchInput = styled.input`
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const DataCardRoot = styled(Card)`
  overflow: hidden;
`;

const DataCardHeader = styled(CardHeader)<{ $stats?: boolean }>`
  ${(p) => p.$stats && "padding-bottom: 0.5rem;"}
`;

const DataCardTitle = styled(CardTitle)`
  font-size: 1rem;
  line-height: 1.5rem;
`;

const StatsValue = styled.div`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
`;

const DataCardFooter = styled(CardFooter)`
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  padding: 0.75rem 1.5rem;
`;

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
  // 优先使用 componentData，其次 props.data / props.dataSource（模板与属性面板可能用不同字段）
  const data =
    componentData !== null && componentData !== undefined
      ? componentData
      : props.data ?? props.dataSource;

  switch (component.type) {
    case "data-table":
      return (
        <div css={tableShell} style={{ ...animationStyle }}>
          {props.title && (
            <div css={tableHeaderBar}>
              {props.title}
            </div>
          )}
          <div css={overflowXAuto}>
            <Table>
              {data ? (
                <>
                  <TableHeader>
                    <TableRow>
                      {(props.columns || []).map((column: TableColumn) => (
                        <ThNowrap key={column.key}>
                          <div css={flexRowGap1}>
                            {column.title}
                            {column.sortable && (
                              <ArrowUpDown
                                size={12}
                                style={{ color: "hsl(var(--muted-foreground))" }}
                              />
                            )}
                            {column.filterable && (
                              <Filter
                                size={12}
                                style={{ color: "hsl(var(--muted-foreground))" }}
                              />
                            )}
                          </div>
                        </ThNowrap>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(data) &&
                    data.length > 0 ? (
                      data
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
                                <TdNowrap key={column.key}>
                                  {row[column.dataIndex]}
                                </TdNowrap>
                              )
                            )}
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TdEmpty colSpan={(props.columns || []).length}>
                          无数据
                        </TdEmpty>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              ) : (
                <>
                  <TableHeader>
                    <TableRow>
                      {(props.columns || []).map((column: TableColumn) => (
                        <ThNowrap key={column.key}>
                          {column.title}
                        </ThNowrap>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TdEmpty colSpan={(props.columns || []).length}>
                        请绑定数据源
                      </TdEmpty>
                    </TableRow>
                  </TableBody>
                </>
              )}
            </Table>
          </div>
          {props.pagination && (
            <div css={paginationBar}>
              <div
                css={css`
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  color: hsl(var(--muted-foreground));
                `}
              >
                共{" "}
                {data && Array.isArray(data)
                  ? data.length
                  : 0}{" "}
                条
              </div>
              <div css={flexRowGap1}>
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
                <PageNumBtn variant="outline" size="sm">
                  1
                </PageNumBtn>
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
        <div css={tableShell} style={{ ...animationStyle }}>
          {props.title && (
            <div css={tableHeaderBar}>
              {props.title}
            </div>
          )}
          <div
            css={css`
              & > * + * {
                border-top: 1px solid hsl(var(--border));
              }
            `}
          >
            {data &&
            Array.isArray(data) &&
            data.length > 0 ? (
              data
                .slice(0, props.pageSize || 5)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    css={css`
                      display: flex;
                      padding: 1rem;
                      ${props.itemLayout === "vertical"
                        ? "flex-direction: column;"
                        : "align-items: center;"}
                    `}
                  >
                    {props.listType === "avatar" && (
                      <div
                        css={css`
                          margin-right: 1rem;
                          ${props.itemLayout === "vertical" &&
                          `
                            margin-right: 0;
                            margin-bottom: 0.5rem;
                          `}
                        `}
                      >
                        <Avatar>
                          <AvatarImage src={item.avatar || ""} />
                          <AvatarFallback>
                            {item.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div css={flex1}>
                      <div css={flexBetween}>
                        <div css={css({ fontWeight: 500 })}>
                          {item.title || item.name || `项目 ${index + 1}`}
                        </div>
                        {props.showExtra && (
                          <div
                            css={css`
                              font-size: 0.875rem;
                              line-height: 1.25rem;
                              color: hsl(var(--muted-foreground));
                            `}
                          >
                            {item.date || "2023-01-01"}
                          </div>
                        )}
                      </div>
                      <div
                        css={css`
                          margin-top: 0.25rem;
                          font-size: 0.875rem;
                          line-height: 1.25rem;
                          color: hsl(var(--muted-foreground));
                        `}
                      >
                        {item.description || "这是一个列表项描述"}
                      </div>
                      {props.showActions && (
                        <div
                          css={css`
                            margin-top: 0.5rem;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                          `}
                        >
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
              <div
                css={css`
                  display: flex;
                  height: 6rem;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <p
                  css={css`
                    color: hsl(var(--muted-foreground));
                  `}
                >
                  {data ? "无数据" : "请绑定数据源"}
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case "data-card":
      return (
        <DataCardRoot style={{ ...animationStyle }}>
          <DataCardHeader $stats={props.cardType === "stats"}>
            <div css={flexBetween}>
              <div css={flexRowGap2}>
                <div>
                  <DataCardTitle>
                    {props.title || "数据卡片"}
                  </DataCardTitle>
                  {props.cardType !== "stats" && (
                    <CardDescription>
                      {data?.description || "数据卡片描述"}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>
          </DataCardHeader>
          <CardContent>
            {props.cardType === "stats" ? (
              <div>
                <StatsValue>
                  {data?.value || data?.count || 0}
                </StatsValue>
                {props.showTrend && (
                  <div
                    css={css`
                      margin-top: 0.25rem;
                      display: flex;
                      align-items: center;
                      gap: 0.25rem;
                    `}
                  >
                    <Badge variant="outline" css={{ color: "#10b981" }}>
                      +{data?.increase || "12.5"}%
                    </Badge>
                    <span
                      css={css`
                        font-size: 0.75rem;
                        line-height: 1rem;
                        color: hsl(var(--muted-foreground));
                      `}
                    >
                      vs 上期
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {data ? (
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      gap: 0.5rem;
                    `}
                  >
                    {Object.entries(data).map(([key, value]) => (
                      <div
                        key={key}
                        css={css`
                          display: flex;
                          justify-content: space-between;
                        `}
                      >
                        <span
                          css={css`
                            font-size: 0.875rem;
                            font-weight: 500;
                          `}
                        >
                          {key}:
                        </span>
                        <span css={css({ fontSize: "0.875rem" })}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div css={mutedCenter}>请绑定数据源</div>
                )}
              </div>
            )}
          </CardContent>
          <DataCardFooter>
            <div
              css={css`
                font-size: 0.75rem;
                line-height: 1rem;
                color: hsl(var(--muted-foreground));
              `}
            >
              最后更新: {data?.updateTime || "2023-01-01 12:00:00"}
            </div>
          </DataCardFooter>
        </DataCardRoot>
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
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          `}
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
            <div
              css={css`
                font-size: 0.875rem;
                line-height: 1.25rem;
                color: hsl(var(--muted-foreground));
              `}
            >
              共 {props.total || totalPages * pageSize} 条记录，第 {currentPage}{" "}
              / {totalPages} 页
            </div>
          )}

          {showSizeChanger && (
            <div css={flexRowGap2}>
              <span css={css({ fontSize: "0.875rem" })}>每页显示</span>
              <SelectSm value={pageSize}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </SelectSm>
              <span css={css({ fontSize: "0.875rem" })}>条</span>
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
          <div key={node.id} css={css({ userSelect: "none" })}>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.25rem 0.5rem;
                border-radius: 0.125rem;
                cursor: pointer;
                &:hover {
                  background-color: hsl(var(--muted) / 0.5);
                }
                ${isSelected &&
                `
                  background-color: hsl(var(--primary) / 0.1);
                  color: hsl(var(--primary));
                `}
                ${isDisabled &&
                `
                  opacity: 0.5;
                  cursor: not-allowed;
                `}
                ${level > 0 && "margin-left: 1rem;"}
              `}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  css={css`
                    padding: 0.125rem;
                    border: none;
                    background: transparent;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    &:hover {
                      background-color: hsl(var(--muted));
                    }
                  `}
                  disabled={isDisabled}
                >
                  {isExpanded ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </button>
              ) : (
                <div css={css({ width: "1rem" })} />
              )}

              <div
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                  flex: 1;
                `}
              >
                {node.icon === "folder" ? (
                  isExpanded ? (
                    <FolderOpen size={16} color="rgb(59 130 246)" />
                  ) : (
                    <Folder size={16} color="rgb(59 130 246)" />
                  )
                ) : node.icon === "file" ? (
                  <File size={16} color="rgb(107 114 128)" />
                ) : null}

                <span css={css({ fontSize: "0.875rem" })}>{node.title}</span>
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

      const treeData = data || defaultTreeData;

      return (
        <div css={treePanelShell} style={{ ...animationStyle }}>
          {props.title && (
            <div
              css={[
                tableHeaderBar,
                css`
                  border-bottom: 1px solid hsl(var(--border));
                `,
              ]}
            >
              {props.title}
            </div>
          )}

          <div css={css({ padding: "0.5rem" })}>
            {Array.isArray(treeData) && treeData.length > 0 ? (
              treeData.map((node) => renderTreeNode(node))
            ) : (
              <div
                css={css`
                  display: flex;
                  height: 6rem;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <p
                  css={css`
                    color: hsl(var(--muted-foreground));
                  `}
                >
                  {componentData ? "无数据" : "请绑定数据源"}
                </p>
              </div>
            )}
          </div>

          {props.showSearch && (
            <div
              css={css`
                border-top: 1px solid hsl(var(--border));
                padding: 0.5rem;
              `}
            >
              <TreeSearchInput type="text" placeholder="搜索节点..." />
            </div>
          )}
        </div>
      );

    default:
      return (
        <div css={fallbackBox} style={{ ...animationStyle }}>
          {component.name || component.type}
        </div>
      );
  }
}
