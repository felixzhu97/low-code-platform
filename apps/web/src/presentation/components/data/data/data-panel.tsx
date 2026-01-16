"use client";

import { useState, useEffect } from "react";
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
  CardDescription,
  CardFooter,
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

export function DataPanel() {
  // 使用全局store管理数据源
  const { dataSources, addDataSource, updateDataSource, deleteDataSource } = useDataStore();

  // 初始化默认数据源（如果store为空）
  useEffect(() => {
    if (dataSources.length === 0) {
      // 添加示例数据源
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

      // 只在初始化时添加一次
      addDataSource(exampleDataSource1);
      addDataSource(exampleDataSource2);
    }
  }, [dataSources.length, addDataSource]);

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

  // 获取数据源图标
  const getDataSourceIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "static":
        return <Database className="h-4 w-4 text-blue-500" />;
      case "api":
        return <Globe className="h-4 w-4 text-green-500" />;
      case "database":
        return <Table2 className="h-4 w-4 text-purple-500" />;
      case "file":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "websocket":
        return <Wifi className="h-4 w-4 text-cyan-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // 添加数据源
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

      // 验证数据源
      const validation = DataSourceService.validateDataSource(newSource);
      if (!validation.valid) {
        alert(`数据源配置错误: ${validation.errors.join(", ")}`);
        return;
      }

      // 使用store的方法添加数据源
      addDataSource(newSource);
      setNewDataSource({
        name: "",
        type: "static",
        data: "",
        config: {},
      });
    } catch (e) {
      alert("数据格式不正确，请检查配置");
    }
  };

  // 删除数据源
  const handleDeleteDataSource = (id: string) => {
    if (confirm("确定要删除这个数据源吗？")) {
      deleteDataSource(id);
    }
  };

  // 刷新数据源
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

  // 预览数据源
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
    <div className="flex w-80 flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">数据源管理</h2>
        <p className="text-sm text-muted-foreground">管理数据源和绑定</p>
      </div>

      <Tabs defaultValue="sources" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">数据源</TabsTrigger>
          <TabsTrigger value="add">添加</TabsTrigger>
          <TabsTrigger value="cache">缓存</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-3 p-4">
              {dataSources.map((source) => (
                <Card key={source.id} className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDataSourceIcon(source.type)}
                        <CardTitle className="text-sm">{source.name}</CardTitle>
                        {getStatusIcon(source.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handlePreviewDataSource(source)}
                          disabled={loading[source.id]}
                        >
                          {loading[source.id] ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRefreshDataSource(source)}
                          disabled={loading[source.id]}
                        >
                          <RefreshCw
                            className={`h-3 w-3 ${
                              loading[source.id] ? "animate-spin" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setEditingDataSource(source)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteDataSource(source.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {source.type === "static" && "静态数据"}
                      {source.type === "api" && "API接口"}
                      {source.type === "database" && "数据库"}
                      {source.type === "file" && "文件数据"}
                      {source.type === "websocket" && "WebSocket"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      {source.type === "static" && (
                        <div className="text-xs text-muted-foreground">
                          {Array.isArray(source.data)
                            ? `${source.data.length} 条记录`
                            : "对象数据"}
                        </div>
                      )}
                      {source.type === "api" && (
                        <div className="text-xs text-muted-foreground">
                          {source.config?.url}
                        </div>
                      )}
                      {source.type === "database" && (
                        <div className="text-xs text-muted-foreground">
                          {source.config?.connectionString}
                        </div>
                      )}
                      {source.type === "file" && (
                        <div className="text-xs text-muted-foreground">
                          {source.config?.filePath}
                        </div>
                      )}
                      {source.type === "websocket" && (
                        <div className="text-xs text-muted-foreground">
                          {source.config?.wsUrl}
                        </div>
                      )}

                      {source.error && (
                        <div className="text-xs text-red-500">
                          错误: {source.error}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          更新:{" "}
                          {new Date(source.lastUpdated || "").toLocaleString()}
                        </span>
                        {source.config?.cacheEnabled && (
                          <Badge variant="outline" className="text-xs">
                            缓存
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-full text-xs"
                    >
                      绑定到组件
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {dataSources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无数据源</p>
                  <p className="text-xs">点击"添加"创建数据源</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="add" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="data-name">数据源名称</Label>
                <Input
                  id="data-name"
                  placeholder="输入数据源名称"
                  value={newDataSource.name}
                  onChange={(e) =>
                    setNewDataSource({ ...newDataSource, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
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
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        静态数据
                      </div>
                    </SelectItem>
                    <SelectItem value="api">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        API接口
                      </div>
                    </SelectItem>
                    <SelectItem value="database">
                      <div className="flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-purple-500" />
                        数据库
                      </div>
                    </SelectItem>
                    <SelectItem value="file">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-500" />
                        文件数据
                      </div>
                    </SelectItem>
                    <SelectItem value="websocket">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-cyan-500" />
                        WebSocket
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
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
                    <p className="text-xs text-muted-foreground">
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

                    <div className="grid grid-cols-2 gap-2">
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
                                timeout: parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
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

                    <p className="text-xs text-muted-foreground">
                      输入有效的API地址，将在运行时获取数据
                    </p>
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

                    <p className="text-xs text-muted-foreground">
                      输入数据库连接信息和查询语句
                    </p>
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

                    <p className="text-xs text-muted-foreground">
                      输入文件路径和类型
                    </p>
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

                    <p className="text-xs text-muted-foreground">
                      输入WebSocket连接地址
                    </p>
                  </>
                )}
              </div>

              <Button
                onClick={handleAddDataSource}
                disabled={!newDataSource.name || !newDataSource.data}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                添加数据源
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cache" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-4 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">缓存管理</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => DataSourceService.clearCache()}
                  >
                    清除所有缓存
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    缓存状态: {DataSourceService.getCacheStatus().size} 个条目
                  </div>

                  {DataSourceService.getCacheStatus().entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="text-sm">
                        <div className="font-medium">{entry.id}</div>
                        <div className="text-xs text-muted-foreground">
                          年龄: {Math.round(entry.age / 1000)}s, TTL:{" "}
                          {entry.ttl}s
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          DataSourceService.clearDataSourceCache(entry.id)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* 数据预览对话框 */}
      <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>数据预览</DialogTitle>
            <DialogDescription>预览数据源的内容</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-sm bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewData(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑数据源对话框 */}
      <Dialog
        open={!!editingDataSource}
        onOpenChange={() => setEditingDataSource(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑数据源</DialogTitle>
            <DialogDescription>修改数据源配置</DialogDescription>
          </DialogHeader>
          {editingDataSource && (
            <div className="space-y-4">
              <div className="grid gap-2">
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
              </div>

              <div className="grid gap-2">
                <Label>数据源类型</Label>
                <div className="flex items-center gap-2">
                  {getDataSourceIcon(editingDataSource.type)}
                  <span className="text-sm">
                    {editingDataSource.type === "static" && "静态数据"}
                    {editingDataSource.type === "api" && "API接口"}
                    {editingDataSource.type === "database" && "数据库"}
                    {editingDataSource.type === "file" && "文件数据"}
                    {editingDataSource.type === "websocket" && "WebSocket"}
                  </span>
                </div>
              </div>

              {editingDataSource.type === "api" && editingDataSource.config && (
                <div className="space-y-4">
                  <div className="grid gap-2">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                              timeout: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
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
            </div>
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
    </div>
  );
}
