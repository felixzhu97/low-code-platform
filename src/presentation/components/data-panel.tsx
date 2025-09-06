"use client"

import { useState } from "react"
import { ScrollArea } from "@/presentation/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"
import { Textarea } from "@/presentation/components/ui/textarea"
import { PlusCircle, Database, Globe, Table2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card"

type DataSource = {
  id: string
  name: string
  type: "static" | "api" | "database"
  data: any
}

export function DataPanel() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "static-1",
      name: "用户列表",
      type: "static",
      data: [
        { id: 1, name: "张三", age: 28, role: "管理员" },
        { id: 2, name: "李四", age: 32, role: "编辑" },
        { id: 3, name: "王五", age: 24, role: "用户" },
      ],
    },
    {
      id: "api-1",
      name: "产品数据",
      type: "api",
      data: {
        url: "https://api.example.com/products",
        method: "GET",
      },
    },
  ])

  const [newDataSource, setNewDataSource] = useState({
    name: "",
    type: "static" as const,
    data: "",
  })

  const handleAddDataSource = () => {
    if (!newDataSource.name) return

    let parsedData
    try {
      parsedData =
        newDataSource.type === "static"
          ? JSON.parse(newDataSource.data)
          : newDataSource.type === "api"
            ? { url: newDataSource.data, method: "GET" }
            : { connection: newDataSource.data }
    } catch (e) {
      alert("数据格式不正确，请检查JSON格式")
      return
    }

    const newSource: DataSource = {
      id: `${newDataSource.type}-${Date.now()}`,
      name: newDataSource.name,
      type: newDataSource.type,
      data: parsedData,
    }

    setDataSources([...dataSources, newSource])
    setNewDataSource({
      name: "",
      type: "static",
      data: "",
    })
  }

  return (
    <div className="flex w-64 flex-col border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold">数据源</h2>
      </div>
      <Tabs defaultValue="sources" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources">数据源</TabsTrigger>
          <TabsTrigger value="add">添加数据</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-8.5rem)]">
            <div className="grid gap-4 p-4">
              {dataSources.map((source) => (
                <Card key={source.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      {source.type === "static" && <Database className="h-4 w-4 text-blue-500" />}
                      {source.type === "api" && <Globe className="h-4 w-4 text-green-500" />}
                      {source.type === "database" && <Table2 className="h-4 w-4 text-purple-500" />}
                      <CardTitle className="text-sm">{source.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {source.type === "static" && "静态数据"}
                      {source.type === "api" && "API接口"}
                      {source.type === "database" && "数据库"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {source.type === "static" && (
                      <div className="text-xs text-muted-foreground">
                        {Array.isArray(source.data) ? `${source.data.length} 条记录` : "对象数据"}
                      </div>
                    )}
                    {source.type === "api" && <div className="text-xs text-muted-foreground">{source.data.url}</div>}
                    {source.type === "database" && (
                      <div className="text-xs text-muted-foreground">{source.data.connection}</div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 p-2">
                    <Button variant="ghost" size="sm" className="h-7 w-full text-xs">
                      绑定到组件
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="add" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-8.5rem)]">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="data-name">数据源名称</Label>
                <Input
                  id="data-name"
                  placeholder="输入数据源名称"
                  value={newDataSource.name}
                  onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data-type">数据源类型</Label>
                <Tabs
                  value={newDataSource.type}
                  onValueChange={(value: any) => setNewDataSource({ ...newDataSource, type: value })}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="static">静态数据</TabsTrigger>
                    <TabsTrigger value="api">API接口</TabsTrigger>
                    <TabsTrigger value="database">数据库</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                      onChange={(e) => setNewDataSource({ ...newDataSource, data: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">输入有效的JSON数据，例如数组或对象</p>
                  </>
                )}

                {newDataSource.type === "api" && (
                  <>
                    <Label htmlFor="api-url">API地址</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/data"
                      value={newDataSource.data}
                      onChange={(e) => setNewDataSource({ ...newDataSource, data: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">输入有效的API地址，将在运行时获取数据</p>
                  </>
                )}

                {newDataSource.type === "database" && (
                  <>
                    <Label htmlFor="db-connection">数据库连接</Label>
                    <Input
                      id="db-connection"
                      placeholder="数据库连接字符串"
                      value={newDataSource.data}
                      onChange={(e) => setNewDataSource({ ...newDataSource, data: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">输入数据库连接信息</p>
                  </>
                )}
              </div>

              <Button onClick={handleAddDataSource} disabled={!newDataSource.name || !newDataSource.data}>
                <PlusCircle className="mr-2 h-4 w-4" />
                添加数据源
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
