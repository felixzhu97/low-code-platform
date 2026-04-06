"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import {
  Button,
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  Card,
  CardHeader,
  CardContent,
} from "@/presentation/components/ui";
import { Link2, Plus, Database, FileJson, Loader2 } from "lucide-react";
import { DataMappingEditor } from "./data-mapping-editor";
import { JsonDataInput } from "./json-data-input";
import type { DataMapping, DataSource } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataMappingListProps {
  mappings: DataMapping[];
  dataSource: DataSource | null;
  componentType?: string;
  onChange: (mappings: DataMapping[]) => void;
  onCreateDataSourceFromJson?: (dataSource: DataSource) => void;
  onQuickInput?: (data: any) => void;
}

const CardDashed = styled(Card)`
  border-style: dashed;
`;

const CardContentStyled = styled(CardContent)`
  padding-top: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const IconWrapper = styled.div`
  border-radius: 9999px;
  background-color: hsl(var(--muted));
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 1.5rem;
  max-width: 20rem;
`;

const CollapsibleContentStyled = styled(CollapsibleContent)`
  width: 100%;
  animation: slideInFromTop 0.2s ease-out;

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardNested = styled(Card)`
  margin-top: 1rem;
  border-color: hsl(var(--primary) / 0.2);
  background-color: hsl(var(--primary) / 0.05);
`;

const ButtonStyled = styled(Button)`
  gap: 0.5rem;
`;

const ButtonIcon = styled.span`
  display: flex;
  height: 1rem;
  width: 1rem;
`;

const CardHeaderStyled = styled(CardHeader)`
  padding-bottom: 0.75rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderIcon = styled.span`
  display: flex;
  height: 1rem;
  width: 1rem;
  color: hsl(var(--primary));
`;

const HeaderTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
`;

const CardContentStyled2 = styled(CardContent)`
  padding-top: 0;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerIcon = styled(Loader2)`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  animation: ${spin} 1s linear infinite;
`;

const EmptyState2 = styled.div`
  border-radius: 0.5rem;
  border: 1px dashed hsl(var(--border));
  background-color: hsl(var(--muted) / 0.3);
  padding: 2rem;
  text-align: center;
`;

const EmptyIcon2 = styled(Link2)`
  height: 2rem;
  width: 2rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.75rem;
  color: hsl(var(--muted-foreground) / 0.5);
`;

const EmptyTitle2 = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 0.25rem;
`;

const EmptyDescription2 = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground) / 0.7);
  margin-bottom: 1rem;
`;

const ScrollAreaStyled = styled(ScrollArea)`
  max-height: 400px;
`;

const MappingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 1rem;
`;

export function DataMappingList({
  mappings,
  dataSource,
  componentType,
  onChange,
  onCreateDataSourceFromJson,
  onQuickInput,
}: DataMappingListProps) {
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuickInput, setShowQuickInput] = useState(false);

  useEffect(() => {
    const loadPaths = async () => {
      if (!dataSource) {
        setAvailablePaths([]);
        return;
      }

      setLoading(true);
      try {
        const paths = await DataBindingService.getDataSourceStructure(dataSource);
        setAvailablePaths(paths);
      } catch (error) {
        console.error("加载数据源路径失败:", error);
        setAvailablePaths([]);
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, [dataSource]);

  const getTargetPathSuggestions = (): string[] => {
    const suggestions: string[] = [];
    if (!componentType) return suggestions;

    switch (componentType) {
      case "text":
        suggestions.push("properties.content");
        break;
      case "button":
        suggestions.push("properties.text");
        break;
      case "image":
        suggestions.push("properties.src");
        suggestions.push("properties.alt");
        break;
      case "input":
        suggestions.push("properties.defaultValue");
        suggestions.push("properties.placeholder");
        break;
      default:
        suggestions.push("properties.value");
        suggestions.push("properties.content");
        suggestions.push("properties.text");
    }

    return suggestions;
  };

  const handleAddMapping = () => {
    const newMapping: DataMapping = {
      field: `field_${mappings.length + 1}`,
      sourcePath: "",
      targetPath: "",
    };
    onChange([...mappings, newMapping]);
  };

  const handleUpdateMapping = (index: number, mapping: DataMapping) => {
    const updated = [...mappings];
    updated[index] = mapping;
    onChange(updated);
  };

  const handleDeleteMapping = (index: number) => {
    const updated = mappings.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleJsonConfirm = (data: any) => {
    if (onQuickInput) {
      onQuickInput(data);
    } else if (onCreateDataSourceFromJson) {
      onCreateDataSourceFromJson(data);
    }

    setShowQuickInput(false);
  };

  if (!dataSource) {
    return (
      <CardDashed>
        <CardContentStyled>
          <EmptyState>
            <IconWrapper>
              <Database css={{ height: "1.5rem", width: "1.5rem", color: "hsl(var(--muted-foreground))" }} />
            </IconWrapper>
            <EmptyTitle>请先选择数据源</EmptyTitle>
            <EmptyDescription>
              选择数据源后即可配置数据映射，或使用快速输入功能直接输入数据
            </EmptyDescription>

            <Collapsible open={showQuickInput} onOpenChange={setShowQuickInput}>
              <CollapsibleContentStyled>
                <CardNested>
                  <JsonDataInput
                    onConfirm={handleJsonConfirm}
                    showTemplateSelector={true}
                    placeholder="输入JSON数据，或从模板中选择..."
                    minHeight="200px"
                    componentType={componentType}
                  />
                </CardNested>
              </CollapsibleContentStyled>
            </Collapsible>

            {!showQuickInput && (
              <ButtonStyled
                variant="outline"
                size="sm"
                onClick={() => setShowQuickInput(true)}
              >
                <ButtonIcon>
                  <FileJson />
                </ButtonIcon>
                快速输入数据
              </ButtonStyled>
            )}
          </EmptyState>
        </CardContentStyled>
      </CardDashed>
    );
  }

  return (
    <Card>
      <CardHeaderStyled>
        <HeaderRow>
          <HeaderLeft>
            <HeaderIcon>
              <Link2 />
            </HeaderIcon>
            <HeaderTitle>数据映射</HeaderTitle>
          </HeaderLeft>
          <ButtonStyled size="sm" onClick={handleAddMapping} css={{ height: "1.75rem" }}>
            <ButtonIcon css={{ height: "0.75rem", width: "0.75rem" }}>
              <Plus />
            </ButtonIcon>
            添加映射
          </ButtonStyled>
        </HeaderRow>
      </CardHeaderStyled>
      <CardContentStyled2>
        {loading && (
          <LoadingState>
            <SpinnerIcon />
            加载数据源结构...
          </LoadingState>
        )}

        {!loading && mappings.length === 0 && (
          <EmptyState2>
            <EmptyIcon2 />
            <EmptyTitle2>暂无数据映射</EmptyTitle2>
            <EmptyDescription2>点击"添加映射"按钮开始配置数据绑定关系</EmptyDescription2>
            <ButtonStyled variant="outline" size="sm" onClick={handleAddMapping}>
              <ButtonIcon css={{ height: "0.75rem", width: "0.75rem" }}>
                <Plus />
              </ButtonIcon>
              添加映射
            </ButtonStyled>
          </EmptyState2>
        )}

        {!loading && mappings.length > 0 && (
          <ScrollAreaStyled>
            <MappingList>
              {mappings.map((mapping, index) => (
                <DataMappingEditor
                  key={index}
                  mapping={mapping}
                  dataSource={dataSource}
                  availablePaths={availablePaths}
                  targetPathSuggestions={getTargetPathSuggestions()}
                  onChange={(updatedMapping) => handleUpdateMapping(index, updatedMapping)}
                  onDelete={() => handleDeleteMapping(index)}
                />
              ))}
            </MappingList>
          </ScrollAreaStyled>
        )}
      </CardContentStyled2>
    </Card>
  );
}
