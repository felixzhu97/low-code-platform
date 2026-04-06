"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  ScrollArea,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/presentation/components/ui";
import {
  PlusCircle,
  Database,
  Globe,
  Table2,
  FileText,
  Wifi,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { DataSource, DataSourceConfig } from "@/domain/datasource";
import { DataSourceService } from "@/application/services/data-source.service";
import { useDataStore } from "@/infrastructure/state-management/stores";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 20rem;
  border-right: 1px solid hsl(var(--border));
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid hsl(var(--border));
`;

const PanelTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
`;

const PanelSubtitle = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const TabsStyled = styled(Tabs)`
  flex: 1;
`;

const TabsListStyled = styled(TabsList)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
`;

const TabsContentStyled = styled(TabsContent)`
  flex: 1;
  padding: 0;
`;

const ContentArea = styled(ScrollArea)`
  height: calc(100vh - 12rem);
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
`;

const SourceCard = styled(Card)`
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SourceHeader = styled(CardHeader)`
  padding: 0.75rem;
`;

const SourceHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const SourceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
`;

const SourceTitle = styled(CardTitle)`
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SourceMetaText = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const SmallBadge = styled(Badge)`
  font-size: 0.75rem;
  height: 1rem;
  padding: 0 0.375rem;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
`;

const IconButton = styled(Button)`
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
`;

const SourceContent = styled(CardContent)`
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-bottom: 0.75rem;
  padding-top: 0;
`;

const SourceFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const BindButton = styled(Button)`
  height: 1.75rem;
  font-size: 0.75rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: hsl(var(--muted-foreground));
`;

const EmptyIcon = styled(Database)`
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.5rem;
  opacity: 0.5;
`;

const EmptySubtitle = styled.p`
  font-size: 0.875rem;
`;

const EmptyText = styled.p`
  font-size: 0.75rem;
`;

const ErrorText = styled.div`
  font-size: 0.75rem;
  color: hsl(var(--destructive));
  margin-top: 0.25rem;
`;

const AddPanel = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const PreviewPre = styled.pre`
  font-size: 0.875rem;
  background-color: hsl(var(--muted));
  padding: 1rem;
  border-radius: calc(var(--radius));
  overflow: auto;
  max-height: 60vh;
`;

const EditForm = styled.div`
  display: grid;
  gap: 1rem;
`;

const DataSourceIcon = styled.div<{ type: string }>`
  width: 1rem;
  height: 1rem;
  color: ${(p) =>
    p.type === "static"
      ? "#3b82f6"
      : p.type === "api"
      ? "#22c55e"
      : p.type === "database"
      ? "#a855f7"
      : p.type === "file"
      ? "#f97316"
      : p.type === "websocket"
      ? "#06b6d4"
      : "#6b7280"};
`;

const StatusIcon = styled.div<{ status?: string }>`
  width: 1rem;
  height: 1rem;
  color: ${(p) =>
    p.status === "active"
      ? "#22c55e"
      : p.status === "error"
      ? "#ef4444"
      : "#eab308"};
`;

export function DataPanel() {
  const { dataSources, addDataSource, updateDataSource, deleteDataSource } =
    useDataStore();

  const [cacheEntries, setCacheEntries] = useState<
    Array<{ id: string; age: number; ttl: number }>
  >([]);

  useEffect(() => {
    const updateCacheEntries = () => {
      const status = DataSourceService.getCacheStatus();
      setCacheEntries(status.entries);
    };

    updateCacheEntries();
    const interval = setInterval(updateCacheEntries, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasStatic1 = dataSources.some((ds) => ds.id === "static-1");
    const hasApi1 = dataSources.some((ds) => ds.id === "api-1");

    if (dataSources.length === 0 || (!hasStatic1 && !hasApi1)) {
      if (!hasStatic1) {
        const exampleDataSource1: DataSource = {
          id: "static-1",
          name: "用户列表",
          type: "static",
          data: [
            { id: 1, name: "张三", age: 28, role: "管理员" },
            { id: 2, name: "李四", age: 32, role: "编辑" },
            { id: 3, name: "王五", age: 24, role: "用户" },
          ],
          lastUpdated: new Date().toISOString(),
          status: "active",
        };
        addDataSource(exampleDataSource1);
      }

      if (!hasApi1) {
        const exampleDataSource2: DataSource = {
          id: "api-1",
          name: "产品数据",
          type: "api",
          data: null,
          config: {
            url: "https://api.example.com/products",
            method: "GET",
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
            retryCount: 3,
            cacheEnabled: true,
            cacheTTL: 300,
          },
          lastUpdated: new Date().toISOString(),
          status: "active",
        };
        addDataSource(exampleDataSource2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSources.length]);

  const [newDataSource, setNewDataSource] = useState<{
    name: string;
    type: DataSource["type"];
    data: string;
    config: Partial<DataSourceConfig>;
  }>({
    name: "",
    type: "static",
    data: "",
    config: {},
  });

  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(
    null
  );
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getTypeText = (type: DataSource["type"]) => {
    switch (type) {
      case "static":
        return "静态数据";
      case "api":
        return "API接口";
      case "database":
        return "数据库";
      case "file":
        return "文件数据";
      case "websocket":
        return "WebSocket";
      default:
        return type;
    }
  };

  const handleAddDataSource = async () => {
    if (!newDataSource.name.trim()) return;

    let parsedData: any;
    let config: DataSourceConfig | undefined;

    try {
      switch (newDataSource.type) {
        case "static":
          parsedData = JSON.parse(newDataSource.data);
          break;
        case "api":
          parsedData = null;
          config = {
            url: newDataSource.data,
            method: "GET",
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
            retryCount: 3,
            cacheEnabled: true,
            cacheTTL: 300,
            ...newDataSource.config,
          };
          break;
        case "database":
          parsedData = null;
          config = {
            connectionString: newDataSource.data,
            query: "SELECT * FROM table",
            ...newDataSource.config,
          };
          break;
        case "file":
          parsedData = null;
          config = {
            filePath: newDataSource.data,
            fileType: "json",
            ...newDataSource.config,
          };
          break;
        case "websocket":
          parsedData = null;
          config = {
            wsUrl: newDataSource.data,
            protocols: [],
            ...newDataSource.config,
          };
          break;
      }

      const newSource = DataSourceService.createDataSource(
        newDataSource.name,
        newDataSource.type,
        parsedData,
        config
      );

      const validation = DataSourceService.validateDataSource(newSource);
      if (!validation.valid) {
        alert(`数据源配置错误: ${validation.errors.join(", ")}`);
        return;
      }

      addDataSource(newSource);
      setNewDataSource({
        name: "",
        type: "static",
        data: "",
        config: {},
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "数据格式不正确，请检查配置";
      alert(errorMessage);
    }
  };

  const handleDeleteDataSource = (id: string) => {
    if (confirm("确定要删除这个数据源吗？")) {
      deleteDataSource(id);
    }
  };

  const handleRefreshDataSource = async (dataSource: DataSource) => {
    setLoading((prev) => ({ ...prev, [dataSource.id]: true }));

    try {
      const data = await DataSourceService.getDataSourceData(dataSource);
      const updatedDataSource = DataSourceService.updateDataSource(dataSource, {
        data,
        status: "active",
        error: undefined,
      });

      updateDataSource(dataSource.id, updatedDataSource);
    } catch (error) {
      const updatedDataSource = DataSourceService.updateDataSource(dataSource, {
        status: "error",
        error: error instanceof Error ? error.message : "未知错误",
      });

      updateDataSource(dataSource.id, updatedDataSource);
    } finally {
      setLoading((prev) => ({ ...prev, [dataSource.id]: false }));
    }
  };

  const handlePreviewDataSource = async (dataSource: DataSource) => {
    setLoading((prev) => ({ ...prev, [dataSource.id]: true }));

    try {
      const data = await DataSourceService.getDataSourceData(dataSource);
      setPreviewData(data);
    } catch (error) {
      alert(`预览失败: ${error instanceof Error ? error.message : "未知错误"}`);
    } finally {
      setLoading((prev) => ({ ...prev, [dataSource.id]: false }));
    }
  };

  return (
    <Wrapper>
      <PanelHeader>
        <PanelTitle>数据源管理</PanelTitle>
        <PanelSubtitle>管理数据源和绑定</PanelSubtitle>
      </PanelHeader>

      <TabsStyled defaultValue="sources">
        <TabsListStyled>
          <TabsTrigger value="sources">数据源</TabsTrigger>
          <TabsTrigger value="add">添加</TabsTrigger>
          <TabsTrigger value="cache">缓存</TabsTrigger>
        </TabsListStyled>

        <TabsContentStyled value="sources">
          <ContentArea>
            <ContentGrid>
              {dataSources.map((source) => (
                <SourceCard key={source.id}>
                  <SourceHeader>
                    <SourceHeaderRow>
                      <SourceInfo>
                        <SourceTitleRow>
                          <DataSourceIcon type={source.type}>
                            {source.type === "static" && <Database css={{ width: "1rem", height: "1rem" }} />}
                            {source.type === "api" && <Globe css={{ width: "1rem", height: "1rem" }} />}
                            {source.type === "database" && <Table2 css={{ width: "1rem", height: "1rem" }} />}
                            {source.type === "file" && <FileText css={{ width: "1rem", height: "1rem" }} />}
                            {source.type === "websocket" && <Wifi css={{ width: "1rem", height: "1rem" }} />}
                          </DataSourceIcon>
                          <SourceTitle>{source.name}</SourceTitle>
                          <StatusIcon status={source.status}>
                            {source.status === "active" && <CheckCircle css={{ width: "1rem", height: "1rem" }} />}
                            {source.status === "inactive" && <Clock css={{ width: "1rem", height: "1rem" }} />}
                            {source.status === "error" && <AlertCircle css={{ width: "1rem", height: "1rem" }} />}
                          </StatusIcon>
                        </SourceTitleRow>
                        <SourceMeta>
                          <SourceMetaText>{getTypeText(source.type)}</SourceMetaText>
                          {source.type === "static" && (
                            <SourceMetaText>
                              {Array.isArray(source.data)
                                ? `· ${source.data.length} 条记录`
                                : "· 对象数据"}
                            </SourceMetaText>
                          )}
                          {source.config?.cacheEnabled && (
                            <SmallBadge variant="outline">缓存</SmallBadge>
                          )}
                        </SourceMeta>
                        {source.error && (
                          <ErrorText>{source.error}</ErrorText>
                        )}
                      </SourceInfo>
                      <ActionButtons>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewDataSource(source)}
                          disabled={loading[source.id]}
                          title="预览"
                        >
                          {loading[source.id] ? (
                            <RefreshCw css={{ width: "0.875rem", height: "0.875rem" }} />
                          ) : (
                            <Eye css={{ width: "0.875rem", height: "0.875rem" }} />
                          )}
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefreshDataSource(source)}
                          disabled={loading[source.id]}
                          title="刷新"
                        >
                          <RefreshCw
                            css={css`
                              width: 0.875rem;
                              height: 0.875rem;
                              ${loading[source.id] ? "animation: spin 1s linear infinite;" : ""}
                              @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                              }
                            `}
                          />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDataSource(source)}
                          title="编辑"
                        >
                          <Edit css={{ width: "0.875rem", height: "0.875rem" }} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDataSource(source.id)}
                          title="删除"
                          css={{ "&:hover": { color: "hsl(var(--destructive))" } }}
                        >
                          <Trash2 css={{ width: "0.875rem", height: "0.875rem" }} />
                        </IconButton>
                      </ActionButtons>
                    </SourceHeaderRow>
                  </SourceHeader>
                  <SourceContent>
                    <SourceFooter>
                      <Timestamp>
                        {new Date(source.lastUpdated || "").toLocaleString(
                          "zh-CN",
                          {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Timestamp>
                      <BindButton variant="outline" size="sm">
                        绑定到组件
                      </BindButton>
                    </SourceFooter>
                  </SourceContent>
                </SourceCard>
              ))}

              {dataSources.length === 0 && (
                <EmptyState>
                  <EmptyIcon />
                  <EmptySubtitle>暂无数据源</EmptySubtitle>
                  <EmptyText>点击"添加"创建数据源</EmptyText>
                </EmptyState>
              )}
            </ContentGrid>
          </ContentArea>
        </TabsContentStyled>

        <TabsContentStyled value="add">
          <ContentArea>
            <AddPanel>
              <FormGroup>
                <Label htmlFor="data-name">数据源名称</Label>
                <Input
                  id="data-name"
                  placeholder="输入数据源名称"
                  value={newDataSource.name}
                  onChange={(e) =>
                    setNewDataSource({ ...newDataSource, name: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="data-type">数据源类型</Label>
                <Select
                  value={newDataSource.type}
                  onValueChange={(value: DataSource["type"]) =>
                    setNewDataSource({
                      ...newDataSource,
                      type: value,
                      data: "",
                      config: {},
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据源类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">
                      <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Database css={{ width: "1rem", height: "1rem", color: "#3b82f6" }} />
                        静态数据
                      </div>
                    </SelectItem>
                    <SelectItem value="api">
                      <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Globe css={{ width: "1rem", height: "1rem", color: "#22c55e" }} />
                        API接口
                      </div>
                    </SelectItem>
                    <SelectItem value="database">
                      <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Table2 css={{ width: "1rem", height: "1rem", color: "#a855f7" }} />
                        数据库
                      </div>
                    </SelectItem>
                    <SelectItem value="file">
                      <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FileText css={{ width: "1rem", height: "1rem", color: "#f97316" }} />
                        文件数据
                      </div>
                    </SelectItem>
                    <SelectItem value="websocket">
                      <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Wifi css={{ width: "1rem", height: "1rem", color: "#06b6d4" }} />
                        WebSocket
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup>
                {newDataSource.type === "static" && (
                  <>
                    <Label htmlFor="static-data">JSON数据</Label>
                    <Textarea
                      id="static-data"
                      placeholder='[{"id": 1, "name": "示例"}]'
                      rows={6}
                      value={newDataSource.data}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          data: e.target.value,
                        })
                      }
                    />
                    <p css={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                      输入有效的JSON数据，例如数组或对象
                    </p>
                  </>
                )}

                {newDataSource.type === "api" && (
                  <>
                    <Label htmlFor="api-url">API地址</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/data"
                      value={newDataSource.data}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          data: e.target.value,
                        })
                      }
                    />

                    <FormRow>
                      <div>
                        <Label htmlFor="api-method">请求方法</Label>
                        <Select
                          value={newDataSource.config?.method || "GET"}
                          onValueChange={(value) =>
                            setNewDataSource({
                              ...newDataSource,
                              config: {
                                ...newDataSource.config,
                                method: value as any,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="api-timeout">超时时间(ms)</Label>
                        <Input
                          id="api-timeout"
                          type="number"
                          placeholder="10000"
                          value={newDataSource.config?.timeout || 10000}
                          onChange={(e) =>
                            setNewDataSource({
                              ...newDataSource,
                              config: {
                                ...newDataSource.config,
                                timeout: Number.parseInt(e.target.value, 10),
                              },
                            })
                          }
                        />
                      </div>
                    </FormRow>

                    <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Switch
                        id="cache-enabled"
                        checked={newDataSource.config?.cacheEnabled || false}
                        onCheckedChange={(checked) =>
                          setNewDataSource({
                            ...newDataSource,
                            config: {
                              ...newDataSource.config,
                              cacheEnabled: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="cache-enabled">启用缓存</Label>
                    </div>
                  </>
                )}

                {newDataSource.type === "database" && (
                  <>
                    <Label htmlFor="db-connection">数据库连接字符串</Label>
                    <Input
                      id="db-connection"
                      placeholder="postgresql://user:password@localhost:5432/dbname"
                      value={newDataSource.data}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          data: e.target.value,
                        })
                      }
                    />

                    <Label htmlFor="db-query">查询语句</Label>
                    <Textarea
                      id="db-query"
                      placeholder="SELECT * FROM users"
                      rows={3}
                      value={newDataSource.config?.query || ""}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          config: {
                            ...newDataSource.config,
                            query: e.target.value,
                          },
                        })
                      }
                    />
                  </>
                )}

                {newDataSource.type === "file" && (
                  <>
                    <Label htmlFor="file-path">文件路径</Label>
                    <Input
                      id="file-path"
                      placeholder="/data/sample.json"
                      value={newDataSource.data}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          data: e.target.value,
                        })
                      }
                    />

                    <Label htmlFor="file-type">文件类型</Label>
                    <Select
                      value={newDataSource.config?.fileType || "json"}
                      onValueChange={(value) =>
                        setNewDataSource({
                          ...newDataSource,
                          config: {
                            ...newDataSource.config,
                            fileType: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}

                {newDataSource.type === "websocket" && (
                  <>
                    <Label htmlFor="ws-url">WebSocket地址</Label>
                    <Input
                      id="ws-url"
                      placeholder="ws://localhost:8080/ws"
                      value={newDataSource.data}
                      onChange={(e) =>
                        setNewDataSource({
                          ...newDataSource,
                          data: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </FormGroup>

              <FullWidthButton
                onClick={handleAddDataSource}
                disabled={!newDataSource.name || !newDataSource.data}
              >
                <PlusCircle css={{ marginRight: "0.5rem", width: "1rem", height: "1rem" }} />
                添加数据源
              </FullWidthButton>
            </AddPanel>
          </ContentArea>
        </TabsContentStyled>

        <TabsContentStyled value="cache">
          <ContentArea>
            <ContentGrid>
              <div css={{ display: "grid", gap: "1rem" }}>
                <div css={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 css={{ fontSize: "0.875rem", fontWeight: 500 }}>缓存管理</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => DataSourceService.clearCache()}
                  >
                    清除所有缓存
                  </Button>
                </div>

                <div css={{ display: "grid", gap: "0.5rem" }}>
                  <div css={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                    缓存状态: {cacheEntries.length} 个条目
                  </div>

                  {cacheEntries.length === 0 ? (
                    <div css={{ textAlign: "center", padding: "1rem 0", color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
                      暂无缓存条目
                    </div>
                  ) : (
                    cacheEntries.map((entry, index) => (
                      <div
                        key={`cache-${entry.id}-${index}`}
                        css={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "calc(var(--radius))",
                        }}
                      >
                        <div css={{ fontSize: "0.875rem" }}>
                          <div css={{ fontWeight: 500 }}>{entry.id}</div>
                          <div css={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                            年龄: {Math.round(entry.age / 1000)}s, TTL: {entry.ttl}s
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            DataSourceService.clearDataSourceCache(entry.id)
                          }
                        >
                          <Trash2 css={{ width: "0.75rem", height: "0.75rem" }} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ContentGrid>
          </ContentArea>
        </TabsContentStyled>
      </TabsStyled>

      <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
        <DialogContent css={{ maxWidth: "36rem", maxHeight: "80vh" }}>
          <DialogHeader>
            <DialogTitle>数据预览</DialogTitle>
            <DialogDescription>预览数据源的内容</DialogDescription>
          </DialogHeader>
          <ScrollArea css={{ maxHeight: "60vh" }}>
            <PreviewPre>
              {JSON.stringify(previewData, null, 2)}
            </PreviewPre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewData(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingDataSource}
        onOpenChange={() => setEditingDataSource(null)}
      >
        <DialogContent css={{ maxWidth: "36rem" }}>
          <DialogHeader>
            <DialogTitle>编辑数据源</DialogTitle>
            <DialogDescription>修改数据源配置</DialogDescription>
          </DialogHeader>
          {editingDataSource && (
            <EditForm>
              <FormGroup>
                <Label htmlFor="edit-name">数据源名称</Label>
                <Input
                  id="edit-name"
                  value={editingDataSource.name}
                  onChange={(e) =>
                    setEditingDataSource({
                      ...editingDataSource,
                      name: e.target.value,
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>数据源类型</Label>
                <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <DataSourceIcon type={editingDataSource.type}>
                    {editingDataSource.type === "static" && <Database css={{ width: "1rem", height: "1rem" }} />}
                    {editingDataSource.type === "api" && <Globe css={{ width: "1rem", height: "1rem" }} />}
                    {editingDataSource.type === "database" && <Table2 css={{ width: "1rem", height: "1rem" }} />}
                    {editingDataSource.type === "file" && <FileText css={{ width: "1rem", height: "1rem" }} />}
                    {editingDataSource.type === "websocket" && <Wifi css={{ width: "1rem", height: "1rem" }} />}
                  </DataSourceIcon>
                  <span css={{ fontSize: "0.875rem" }}>
                    {getTypeText(editingDataSource.type)}
                  </span>
                </div>
              </FormGroup>

              {editingDataSource.type === "api" && editingDataSource.config && (
                <div css={{ display: "grid", gap: "1rem" }}>
                  <FormGroup>
                    <Label htmlFor="edit-url">API地址</Label>
                    <Input
                      id="edit-url"
                      value={editingDataSource.config.url || ""}
                      onChange={(e) =>
                        setEditingDataSource({
                          ...editingDataSource,
                          config: {
                            ...editingDataSource.config,
                            url: e.target.value,
                          },
                        })
                      }
                    />
                  </FormGroup>

                  <FormRow>
                    <div>
                      <Label htmlFor="edit-method">请求方法</Label>
                      <Select
                        value={editingDataSource.config.method || "GET"}
                        onValueChange={(value) =>
                          setEditingDataSource({
                            ...editingDataSource,
                            config: {
                              ...editingDataSource.config,
                              method: value as any,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="edit-timeout">超时时间(ms)</Label>
                      <Input
                        id="edit-timeout"
                        type="number"
                        value={editingDataSource.config.timeout || 10000}
                        onChange={(e) =>
                          setEditingDataSource({
                            ...editingDataSource,
                            config: {
                              ...editingDataSource.config,
                              timeout: Number.parseInt(e.target.value, 10),
                            },
                          })
                        }
                      />
                    </div>
                  </FormRow>

                  <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Switch
                      id="edit-cache"
                      checked={editingDataSource.config.cacheEnabled || false}
                      onCheckedChange={(checked) =>
                        setEditingDataSource({
                          ...editingDataSource,
                          config: {
                            ...editingDataSource.config,
                            cacheEnabled: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="edit-cache">启用缓存</Label>
                  </div>
                </div>
              )}
            </EditForm>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingDataSource(null)}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                if (editingDataSource) {
                  updateDataSource(editingDataSource.id, editingDataSource);
                  setEditingDataSource(null);
                }
              }}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Wrapper>
  );
}
