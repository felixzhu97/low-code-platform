import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import styled from "@emotion/styled";

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

const FilterIconButton = styled(Button)`
  width: 2.5rem;
  height: 2.5rem;
`;

const FilterPanel = styled.div`
  padding: 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  background-color: hsl(var(--muted) / 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterSection = styled.div``;

const FilterTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: hsl(var(--muted-foreground));
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const StyledBadge = styled(Badge)`
  cursor: pointer;
  font-size: 0.75rem;
  height: 1.25rem;
  padding: 0 0.5rem;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  padding-top: 0.25rem;
  border-top: 1px solid hsl(var(--border));
`;

const ActionButton = styled(Button)`
  height: 1.75rem;
  font-size: 0.75rem;
`;

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
      <FilterIconButton variant="outline" size="icon" onClick={onToggleFilters}>
        <svg
          css={{ width: "1rem", height: "1rem", fill: "none", stroke: "currentColor" }}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
          />
        </svg>
      </FilterIconButton>
    );
  }

  return (
    <FilterPanel>
      <FilterSection>
        <FilterTitle>类别</FilterTitle>
        <BadgeWrapper>
          <StyledBadge
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => onCategoryChange("all")}
          >
            全部
          </StyledBadge>
          {categories.map((category) => (
            <StyledBadge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </StyledBadge>
          ))}
        </BadgeWrapper>
      </FilterSection>

      {allTags.length > 0 && (
        <FilterSection>
          <FilterTitle>标签</FilterTitle>
          <BadgeWrapper>
            {allTags.map((tag) => (
              <StyledBadge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </StyledBadge>
            ))}
          </BadgeWrapper>
        </FilterSection>
      )}

      <FilterActions>
        <ActionButton variant="ghost" size="sm" onClick={onToggleFilters}>
          收起
        </ActionButton>
        <ActionButton variant="ghost" size="sm" onClick={onResetFilters}>
          重置
        </ActionButton>
      </FilterActions>
    </FilterPanel>
  );
}
