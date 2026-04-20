"use client";

import { memo, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BarChart, LineChart, PieChart, AreaChart, GaugeChart, RadarChart } from "@/presentation/components/charts";
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, DollarSign } from "lucide-react";

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
];

const trafficData = [
  { source: "直接访问", value: 335 },
  { source: "搜索引擎", value: 1548 },
  { source: "社交媒体", value: 234 },
  { source: "电子邮件", value: 147 },
  { source: "广告", value: 335 },
];

const userActivityData = [
  { date: "周一", active: 120, new: 20 },
  { date: "周二", active: 132, new: 25 },
  { date: "周三", active: 101, new: 18 },
  { date: "周四", active: 134, new: 29 },
  { date: "周五", active: 190, new: 42 },
  { date: "周六", active: 230, new: 37 },
  { date: "周日", active: 210, new: 30 },
];

const productData = [
  { category: "类别A", sales: 4000, profit: 2400, cost: 1600 },
  { category: "类别B", sales: 3000, profit: 1398, cost: 1602 },
  { category: "类别C", sales: 2000, profit: 980, cost: 1020 },
  { category: "类别D", sales: 2780, profit: 1408, cost: 1372 },
  { category: "类别E", sales: 1890, profit: 980, cost: 910 },
];

const performanceData = [
  { subject: "营销", A: 120, B: 110, fullMark: 150 },
  { subject: "销售", A: 98, B: 130, fullMark: 150 },
  { subject: "开发", A: 86, B: 130, fullMark: 150 },
  { subject: "客服", A: 99, B: 100, fullMark: 150 },
  { subject: "运营", A: 85, B: 90, fullMark: 150 },
  { subject: "财务", A: 65, B: 85, fullMark: 150 },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsl(var(--border));
  padding: 1rem 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SelectTriggerStyled = styled(SelectTrigger)`
  width: 8rem;
`;

const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GridRow = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const GridRowLarge = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const StatCard = styled(Card)`
  grid-column: span 1;
`;

const StatCardHeader = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
`;

const StatCardTitle = styled(CardTitle)`
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatCardContent = styled(CardContent)``;

const StatIcon = styled.span`
  display: flex;
  align-items: center;
  height: 1rem;
  width: 1rem;
  color: hsl(var(--muted-foreground));
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const ChangeIcon = styled.span<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
  height: 1rem;
  width: 1rem;
  color: ${(props) => (props.$positive ? "#10b981" : "#f43f5e")};
`;

const ChangeText = styled.span<{ $positive?: boolean }>`
  color: ${(props) => (props.$positive ? "#10b981" : "#f43f5e")};
`;

const ChartCard = styled(Card)<{ $span?: number }>`
  grid-column: span ${(props) => props.$span || 1};
`;

const ChartCardContent = styled(CardContent)`
  display: flex;
  justify-content: center;
`;

export const DashboardTemplate = memo(() => {
  const [period, setPeriod] = useState("monthly");

  return (
    <Wrapper>
      <Header>
        <Title>销售数据仪表盘</Title>
        <HeaderRight>
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTriggerStyled>
              <SelectValue placeholder="选择时间段" />
            </SelectTriggerStyled>
            <SelectContent>
              <SelectItem value="daily">日报</SelectItem>
              <SelectItem value="weekly">周报</SelectItem>
              <SelectItem value="monthly">月报</SelectItem>
              <SelectItem value="quarterly">季报</SelectItem>
              <SelectItem value="yearly">年报</SelectItem>
            </SelectContent>
          </Select>
        </HeaderRight>
      </Header>

      <Content>
        <GridRow>
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>总收入</StatCardTitle>
              <StatIcon>
                <DollarSign />
              </StatIcon>
            </StatCardHeader>
            <StatCardContent>
              <StatValue>¥45,231.89</StatValue>
              <StatChange>
                <ChangeIcon $positive>
                  <ArrowUpRight />
                </ChangeIcon>
                <ChangeText $positive>+20.1%</ChangeText> 较上期
              </StatChange>
            </StatCardContent>
          </StatCard>
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>订单数</StatCardTitle>
              <StatIcon>
                <CreditCard />
              </StatIcon>
            </StatCardHeader>
            <StatCardContent>
              <StatValue>+2350</StatValue>
              <StatChange>
                <ChangeIcon $positive>
                  <ArrowUpRight />
                </ChangeIcon>
                <ChangeText $positive>+12.2%</ChangeText> 较上期
              </StatChange>
            </StatCardContent>
          </StatCard>
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>活跃用户</StatCardTitle>
              <StatIcon>
                <Users />
              </StatIcon>
            </StatCardHeader>
            <StatCardContent>
              <StatValue>+12,234</StatValue>
              <StatChange>
                <ChangeIcon $positive={false}>
                  <ArrowDownRight />
                </ChangeIcon>
                <ChangeText $positive={false}>-3.1%</ChangeText> 较上期
              </StatChange>
            </StatCardContent>
          </StatCard>
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>转化率</StatCardTitle>
              <StatIcon>
                <Activity />
              </StatIcon>
            </StatCardHeader>
            <StatCardContent>
              <StatValue>24.5%</StatValue>
              <StatChange>
                <ChangeIcon $positive>
                  <ArrowUpRight />
                </ChangeIcon>
                <ChangeText $positive>+4.3%</ChangeText> 较上期
              </StatChange>
            </StatCardContent>
          </StatCard>
        </GridRow>

        <GridRowLarge>
          <ChartCard $span={4}>
            <CardHeader>
              <CardTitle>销售趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={salesData} xField="month" seriesField="type" yField="value" height={350} title="" />
            </CardContent>
          </ChartCard>
          <ChartCard $span={3}>
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
          </ChartCard>
        </GridRowLarge>

        <GridRowLarge>
          <ChartCard $span={3}>
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
          </ChartCard>
          <ChartCard $span={4}>
            <CardHeader>
              <CardTitle>产品类别分析</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={productData} xField="category" seriesField="type" yField="value" height={350} title="" />
            </CardContent>
          </ChartCard>
        </GridRowLarge>

        <GridRowLarge>
          <ChartCard $span={3}>
            <CardHeader>
              <CardTitle>销售目标完成率</CardTitle>
            </CardHeader>
            <ChartCardContent>
              <GaugeChart value={78} min={0} max={100} height={250} title="" unit="%" />
            </ChartCardContent>
          </ChartCard>
          <ChartCard $span={4}>
            <CardHeader>
              <CardTitle>部门绩效对比</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart data={performanceData} nameField="subject" dataFields={["A", "B"]} height={350} title="" />
            </CardContent>
          </ChartCard>
        </GridRowLarge>
      </Content>
    </Wrapper>
  );
});

DashboardTemplate.displayName = "DashboardTemplate";
