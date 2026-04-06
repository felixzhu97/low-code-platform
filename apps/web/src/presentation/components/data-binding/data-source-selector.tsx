"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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
  componentType?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SelectorCard = styled(Card)`
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CardHeaderStyled = styled(CardHeader)`
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const IconWrapper = styled.div`
  border-radius: calc(var(--radius) / 2);
  background-color: hsl(var(--primary) / 0.1);
  padding: 0.375rem;
`;

const DatabaseIcon = styled(Database)`
  width: 1rem;
  height: 1rem;
  color: hsl(var(--primary));
`;

const HeaderLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 600;
`;

const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const SmallButton = styled(Button)`
  height: 1.75rem;
  gap: 0.375rem;
  font-size: 0.75rem;
`;

const ClearButton = styled(Button)`
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
`;

const CardContentStyled = styled(CardContent)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-top: 0;
`;

const EmptyState = styled.div`
  border-radius: calc(var(--radius));
  border: 1px dashed hsl(var(--border));
  background-color: hsl(var(--muted) / 0.3);
  padding: 1.5rem;
  text-align: center;
`;

const EmptyIcon = styled(Database)`
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.5rem;
  color: hsl(var(--muted-foreground) / 0.5);
`;

const EmptyTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 0.25rem;
`;

const EmptySubtitle = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground) / 0.7);
`;

const SelectTriggerStyled = styled(SelectTrigger)`
  width: 100%;
  height: 2.25rem;
  font-size: 0.875rem;
`;

const SelectContentStyled = styled(SelectContent)`
  max-height: 18.75rem;
`;

const SelectItemStyled = styled(SelectItem)`
  padding-top: 0.5rem;
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  min-width: 0;
`;

const ItemTextWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const ItemTextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

const ItemName = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const StyledBadge = styled(Badge)`
  font-size: 0.75rem;
  height: 1rem;
  padding: 0 0.375rem;
  font-weight: 400;
  flex-shrink: 0;
`;

const StatusIcon = styled.div<{ status: string }>`
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
`;

const QuickInputCard = styled(Card)`
  border-color: hsl(var(--primary) / 0.3);
  background: linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--primary) / 0.1));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const QuickInputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  padding: 0.375rem 0.25rem;
`;

const StatusDot = styled.div<{ status?: string }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background-color: ${(p) =>
    p.status === "active"
      ? "hsl(142 76% 36%)"
      : p.status === "error"
      ? "hsl(var(--destructive))"
      : "hsl(var(--muted-foreground))"};
`;

const StatusName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const StatusTime = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground) / 0.7);
  flex-shrink: 0;
`;

const CollapsibleContentStyled = styled(CollapsibleContent)`
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
    if (onCreateDataSourceFromJson) {
      onCreateDataSourceFromJson(data);
    } else {
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

  return (
    <Wrapper>
      <SelectorCard>
        <CardHeaderStyled>
          <HeaderContent>
            <HeaderLeft>
              <IconWrapper>
                <DatabaseIcon />
              </IconWrapper>
              <HeaderLabel htmlFor="data-source-select">数据源</HeaderLabel>
            </HeaderLeft>
            <HeaderButtonGroup>
              <SmallButton
                variant="outline"
                size="sm"
                onClick={() => setShowQuickInput(!showQuickInput)}
              >
                <Plus css={{ width: "0.75rem", height: "0.75rem" }} />
                快速输入
              </SmallButton>
              {selectedId && (
                <ClearButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  title="清除绑定"
                >
                  <X css={{ width: "0.875rem", height: "0.875rem" }} />
                </ClearButton>
              )}
            </HeaderButtonGroup>
          </HeaderContent>
        </CardHeaderStyled>
        <CardContentStyled>
          {dataSources.length === 0 ? (
            <EmptyState>
              <EmptyIcon />
              <EmptyTitle>暂无可用数据源</EmptyTitle>
              <EmptySubtitle>
                请在左侧"数据"面板中创建数据源，或使用快速输入功能
              </EmptySubtitle>
            </EmptyState>
          ) : (
            <Select value={selectedId || "none"} onValueChange={handleChange}>
              <SelectTriggerStyled id="data-source-select">
                <SelectValue placeholder="选择数据源">
                  {selectedId && selectedDataSource ? (
                    <span css={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedDataSource.name}
                    </span>
                  ) : (
                    "选择数据源"
                  )}
                </SelectValue>
              </SelectTriggerStyled>
              <SelectContentStyled>
                <SelectItem value="none">
                  <span css={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                    无
                  </span>
                </SelectItem>
                {dataSources.map((dataSource) => (
                  <SelectItemStyled
                    key={dataSource.id}
                    value={dataSource.id}
                  >
                    <ItemContent>
                      <ItemTextWrapper>
                        <ItemTextRow>
                          <ItemName>{dataSource.name}</ItemName>
                          <StyledBadge variant="outline">
                            {dataSource.type}
                          </StyledBadge>
                        </ItemTextRow>
                      </ItemTextWrapper>
                      {dataSource.status === "error" && (
                        <StatusIcon status="error">
                          <AlertCircle css={{ width: "0.875rem", height: "0.875rem", color: "hsl(var(--destructive))" }} />
                        </StatusIcon>
                      )}
                      {dataSource.status === "active" && (
                        <StatusIcon status="active">
                          <CheckCircle2 css={{ width: "0.875rem", height: "0.875rem", color: "hsl(142 76% 36%)" }} />
                        </StatusIcon>
                      )}
                    </ItemContent>
                  </SelectItemStyled>
                ))}
              </SelectContentStyled>
            </Select>
          )}
        </CardContentStyled>
      </SelectorCard>

      <Collapsible open={showQuickInput} onOpenChange={setShowQuickInput}>
        <CollapsibleContentStyled>
          <QuickInputCard>
            <QuickInputContent>
              <JsonDataInput
                onConfirm={handleJsonConfirm}
                showTemplateSelector={true}
                placeholder="输入JSON数据，或从模板中选择..."
                minHeight="150px"
                componentType={componentType}
              />
            </QuickInputContent>
          </QuickInputCard>
        </CollapsibleContentStyled>
      </Collapsible>

      {selectedDataSource && (
        <StatusIndicator>
          <StatusDot status={selectedDataSource.status} />
          <StatusName>{selectedDataSource.name}</StatusName>
          {selectedDataSource.lastUpdated && (
            <StatusTime>
              {new Date(selectedDataSource.lastUpdated).toLocaleTimeString(
                "zh-CN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </StatusTime>
          )}
        </StatusIndicator>
      )}
    </Wrapper>
  );
}
