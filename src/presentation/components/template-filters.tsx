import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";

interface TemplateFiltersProps {
  showFilters: boolean;
  categories: string[];
  allTags: string[];
  activeCategory: string;
  selectedTags: string[];
  onToggleFilters: () => void;
  onCategoryChange: (category: string) => void;
  onTagSelect: (tag: string) => void;
  onResetFilters: () => void;
}

export function TemplateFilters({
  showFilters,
  categories,
  allTags,
  activeCategory,
  selectedTags,
  onToggleFilters,
  onCategoryChange,
  onTagSelect,
  onResetFilters,
}: TemplateFiltersProps) {
  if (!showFilters) {
    return (
      <Button variant="outline" size="icon" onClick={onToggleFilters}>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
          />
        </svg>
      </Button>
    );
  }

  return (
    <div className="mb-4 p-4 border rounded-md bg-muted/50">
      <div className="mb-3">
        <h4 className="text-sm font-medium mb-2">类别</h4>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onCategoryChange("all")}
          >
            全部
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">标签</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onToggleFilters}>
          收起
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          重置过滤器
        </Button>
      </div>
    </div>
  );
}
