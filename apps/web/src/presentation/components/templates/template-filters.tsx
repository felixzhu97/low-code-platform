import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TemplateFiltersProps {
  readonly showFilters: boolean;
  readonly categories: string[];
  readonly allTags: string[];
  readonly activeCategory: string;
  readonly selectedTags: string[];
  readonly onToggleFilters: () => void;
  readonly onCategoryChange: (category: string) => void;
  readonly onTagSelect: (tag: string) => void;
  readonly onResetFilters: () => void;
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
    <div className="p-3 border rounded-md bg-muted/30 space-y-3">
      <div>
        <h4 className="text-xs font-medium mb-1.5 text-muted-foreground">
          类别
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={activeCategory === "all" ? "default" : "outline"}
            className="cursor-pointer text-xs h-5 px-2"
            onClick={() => onCategoryChange("all")}
          >
            全部
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer text-xs h-5 px-2"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-1.5 text-muted-foreground">
            标签
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer text-xs h-5 px-2"
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-1.5 pt-1 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onToggleFilters}
        >
          收起
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onResetFilters}
        >
          重置
        </Button>
      </div>
    </div>
  );
}
