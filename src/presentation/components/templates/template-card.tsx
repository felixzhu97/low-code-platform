import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import type { Template } from "@/presentation/data/templates";

interface TemplateCardProps {
  template: Template;
  isFavorite: boolean;
  onSelect: (template: Template) => void;
  onToggleFavorite: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

export function TemplateCard({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onPreview,
}: TemplateCardProps) {
  return (
    <Card className="overflow-hidden h-64">
      <div
        className="relative h-40 cursor-pointer"
        onClick={() => onSelect(template)}
      >
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
        >
          <Star
            className={`h-4 w-4 ${
              isFavorite ? "fill-yellow-400 text-yellow-400" : ""
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium truncate">{template.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {template.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(template.id)}
          >
            预览
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
