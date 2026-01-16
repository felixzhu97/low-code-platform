import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import type { Template } from "@/presentation/data/templates";

interface TemplateCardProps {
  readonly template: Template;
  readonly isFavorite: boolean;
  readonly onSelect: (template: Template) => void;
  readonly onToggleFavorite: (templateId: string) => void;
  readonly onPreview: (templateId: string) => void;
}

export function TemplateCard({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onPreview,
}: TemplateCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        className="relative h-32 w-full cursor-pointer group border-0 p-0 bg-transparent"
        onClick={() => onSelect(template)}
      >
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1.5 right-1.5 h-7 w-7 bg-background/90 hover:bg-background backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
          title={isFavorite ? "取消收藏" : "收藏"}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              isFavorite ? "fill-yellow-400 text-yellow-400" : ""
            }`}
          />
        </Button>
      </button>
      <CardContent className="p-2.5">
        <div className="space-y-1">
          <h3 className="font-medium text-sm truncate">{template.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {template.description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template.id);
              }}
            >
              预览
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-7 text-xs px-3"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(template);
              }}
            >
              使用
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
