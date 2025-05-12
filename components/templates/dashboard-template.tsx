"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import { BarChart, LineChart, PieChart, AreaChart, GaugeChart, RadarChart } from "@/components/charts"
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, DollarSign } from "lucide-react"

// 模拟数据
const salesData = [
  { month: "1月", sales: 1200, target: 1000, lastYear: 900 },
  { month: "2月", sales: 1900, target: 1300, lastYear: 1200 },
  { month: "3月", sales: 1300, target: 1400, lastYear: 1100 },
  { month: "4月", sales: 1600, target: 1500, lastYear: 1300 },
  { month: "5月", sales: 1200, target: 1600, lastYear: 1000 },
  { month: "6月", sales: 1900, target: 1700, lastYear: 1500 },
  { month: "7月", sales: 2200, target: 1800, lastYear: 1700 },
  { month: "8月", sales: 2500, target: 1900, lastYear: 1900 },
  { month: "9月", sales: 2300, target: 2000, lastYear: 1800 },
  { month: "10月", sales: 2400, target: 2100, lastYear: 2000 },
  { month: "11月", sales: 2600, target: 2200, lastYear: 2100 },
  { month: "12月", sales: 3000, target: 2300, lastYear: 2400 },
]

const trafficData = [
  { source: "直接访问", value: 335 },
  { source: "搜索引擎", value: 1548 },
  { source: "社交媒体", value: 234 },
  { source: "电子邮件", value: 147 },
  { source: "广告", value: 335 },
]

const userActivityData = [
  { date: "周一", active: 120, new: 20 },
  { date: "周二", active: 132, new: 25 },
  { date: "周三", active: 101, new: 18 },
  { date: "周四", active: 134, new: 29 },
  { date: "周五", active: 190, new: 42 },
  { date: "周六", active: 230, new: 37 },
  { date: "周日", active: 210, new: 30 },
]

const productData = [
  { category: "类别A", sales: 4000, profit: 2400, cost: 1600 },
  { category: "类别B", sales: 3000, profit: 1398, cost: 1602 },
  { category: "类别C", sales: 2000, profit: 980, cost: 1020 },
  { category: "类别D", sales: 2780, profit: 1408, cost: 1372 },
  { category: "类别E", sales: 1890, profit: 980, cost: 910 },
]

const performanceData = [
  { subject: "营销", A: 120, B: 110, fullMark: 150 },
  { subject: "销售", A: 98, B: 130, fullMark: 150 },
  { subject: "开发", A: 86, B: 130, fullMark: 150 },
  { subject: "客服", A: 99, B: 100, fullMark: 150 },
  { subject: "运营", A: 85, B: 90, fullMark: 150 },
  { subject: "财务", A: 65, B: 85, fullMark: 150 },
]

export function DashboardTemplate() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-xl font-semibold">销售数据仪表盘</h1>
        <div className="flex items-center gap-4">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="选择时间段" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">日报</SelectItem>
              <SelectItem value="weekly">周报</SelectItem>
              <SelectItem value="monthly">月报</SelectItem>
              <SelectItem value="quarterly">季报</SelectItem>
              <SelectItem value="yearly">年报</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">总收入</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥45,231.89</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+20.1%</span> 较上期
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">订单数</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+12.2%</span> 较上期
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                <span className="text-rose-500">-3.1%</span> 较上期
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">转化率</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+4.3%</span> 较上期
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>销售趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={salesData} xField="month" seriesField="type" yField="value" height={350} title="" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>流量来源</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={trafficData}
                nameField="source"
                valueField="value"
                height={350}
                title=""
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>用户活跃度</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={userActivityData}
                xField="date"
                seriesField="type"
                yField="value"
                height={350}
                title=""
                stacked={true}
              />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>产品类别分析</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={productData} xField="category" seriesField="type" yField="value" height={350} title="" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>销售目标完成率</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <GaugeChart value={78} min={0} max={100} height={250} title="" unit="%" />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>部门绩效对比</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart data={performanceData} nameField="subject" dataFields={["A", "B"]} height={350} title="" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
