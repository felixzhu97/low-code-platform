import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import styled from "@emotion/styled";
import type { Template } from "@/presentation/data/templates";

interface TemplateCardProps {
  readonly template: Template;
  readonly isFavorite: boolean;
  readonly onSelect: (template: Template) => void;
  readonly onToggleFavorite: (templateId: string) => void;
  readonly onPreview: (templateId: string) => void;
}

const ThumbnailButton = styled.button`
  position: relative;
  height: 8rem;
  width: 100%;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: transparent;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const FavoriteButton = styled(Button)`
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  height: 1.75rem;
  width: 1.75rem;
  background-color: hsl(var(--background) / 0.9);
  backdrop-filter: blur(4px);

  &:hover {
    background-color: hsl(var(--background));
  }
`;

const ActionButton = styled(Button)`
  height: 1.75rem;
  font-size: 0.75rem;
  padding: 0 0.5rem;
`;

const CardWrapper = styled(Card)`
  overflow: hidden;
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  height: 8rem;
  width: 100%;
  overflow: hidden;
  background-color: hsl(var(--muted));
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.25rem;
`;

const TitleText = styled.h3`
  font-weight: 500;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DescriptionText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5rem;
`;

export function TemplateCard({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onPreview,
}: TemplateCardProps) {
  return (
    <CardWrapper>
      <ThumbnailWrapper>
        <button
          type="button"
          onClick={() => onSelect(template)}
          style={{ border: 0, padding: 0, background: "transparent", width: "100%", height: "100%", cursor: "pointer" }}
        >
          <ThumbnailImage
            src={template.thumbnail || "/placeholder.svg"}
            alt={template.name}
          />
        </button>
        <FavoriteButton
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
          title={isFavorite ? "取消收藏" : "收藏"}
        >
          <Star
            css={{
              width: "0.875rem",
              height: "0.875rem",
              ...(isFavorite
                ? { fill: "#facc15", color: "#facc15" }
                : {}),
            }}
          />
        </FavoriteButton>
      </ThumbnailWrapper>
      <CardContent css={{
        padding: "0.625rem",
      }}>
        <div css={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <TitleText>{template.name}</TitleText>
          <DescriptionText>
            {template.description}
          </DescriptionText>
          <CardActions>
            <ActionButton
              variant="ghost"
              size="sm"
              css={{ height: "1.75rem", fontSize: "0.75rem", padding: "0 0.5rem" }}
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template.id);
              }}
            >
              预览
            </ActionButton>
            <ActionButton
              variant="default"
              size="sm"
              css={{ height: "1.75rem", fontSize: "0.75rem", padding: "0 0.75rem" }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(template);
              }}
            >
              使用
            </ActionButton>
          </CardActions>
        </div>
      </CardContent>
    </CardWrapper>
  );
}
