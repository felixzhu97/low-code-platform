"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DialogTrigger,
  EnhancedTemplatePreview,
} from "@/presentation/components/ui";
import { Search, X, Star } from "lucide-react";
import { TemplatePreview } from "./template-preview";
import { TemplateCard } from "./template-card";
import { TemplateFilters } from "./template-filters";
import { useTemplateGallery } from "../../hooks/use-template-gallery";
import type { Component } from "@/domain/component";
import type { Template } from "@/presentation/data/templates";
import {
  useComponentStore,
  useThemeStore,
} from "@/infrastructure/state-management/stores";
import { useAdapters } from "@/presentation/hooks/use-adapters";

interface TemplateGalleryProps {}

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: hsl(var(--muted-foreground));
`;

const SearchInputStyled = styled(Input)`
  padding-left: 2rem;
  height: 2.25rem;
`;

const ClearButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  height: 2.25rem;
  width: 2.25rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
`;

const PageInfo = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  padding: 0 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: hsl(var(--muted-foreground));
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FavoriteIcon = styled(Star)<{ isFavorite: boolean }>`
  width: 1rem;
  height: 1rem;
  ${(p) =>
    p.isFavorite
      ? `
    fill: #facc15;
    color: #facc15;
  `
      : ""}
`;

export function TemplateGallery(_props: TemplateGalleryProps) {
  const { templateAdapter } = useAdapters();
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  );

  const {
    activeCategory,
    searchQuery,
    favorites,
    selectedTags,
    currentPage,
    showFilters,
    categories,
    allTags,
    filteredTemplates,
    favoriteTemplates,
    setActiveCategory,
    setSearchQuery,
    setCurrentPage,
    setShowFilters,
    resetFilters,
    handleToggleFavorite,
    handleTagSelect,
  } = useTemplateGallery();

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsOpen(true);
  };

  const handleUseTemplate = async (components: Component[]) => {
    const existing = useComponentStore.getState().components;
    await templateAdapter.appendTemplateFromComponents(
      components,
      existing
    );
    setIsOpen(false);
  };

  const handleEnhancedPreview = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            浏览模板库
          </Button>
        </DialogTrigger>
        <DialogContent
          css={css`
            max-width: 80rem;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          `}
        >
          <DialogHeader>
            <DialogTitle>模板库</DialogTitle>
          </DialogHeader>

          <SearchWrapper>
            <SearchRow>
              <SearchInputWrapper>
                <SearchIcon />
                <SearchInputStyled
                  placeholder="搜索模板..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <ClearButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                  >
                    <X css={{ width: "0.875rem", height: "0.875rem" }} />
                  </ClearButton>
                )}
              </SearchInputWrapper>
              <TemplateFilters
                showFilters={showFilters}
                categories={categories}
                allTags={allTags}
                activeCategory={activeCategory}
                selectedTags={selectedTags}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onCategoryChange={setActiveCategory}
                onTagSelect={handleTagSelect}
                onResetFilters={resetFilters}
              />
            </SearchRow>
          </SearchWrapper>

          <Tabs defaultValue="all">
            <TabsList css={{ marginBottom: "1rem" }}>
              <TabsTrigger value="all">全部模板</TabsTrigger>
              <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            </TabsList>

            <TabsContent
              value="all"
              css={{
                overflow: "auto",
                maxHeight: "60vh",
              }}
            >
              <TemplateGrid>
                {paginatedTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isFavorite={favorites.includes(template.id)}
                    onSelect={handleSelectTemplate}
                    onToggleFavorite={handleToggleFavorite}
                    onPreview={handleEnhancedPreview}
                  />
                ))}
              </TemplateGrid>

              {totalPages > 1 && (
                <PaginationWrapper>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  <PageInfo>
                    {currentPage} / {totalPages}
                  </PageInfo>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    下一页
                  </Button>
                </PaginationWrapper>
              )}
            </TabsContent>

            <TabsContent
              value="favorites"
              css={{
                overflow: "auto",
                maxHeight: "60vh",
              }}
            >
              {favoriteTemplates.length === 0 ? (
                <EmptyState>
                  <p>您还没有收藏任何模板</p>
                </EmptyState>
              ) : (
                <TemplateGrid>
                  {favoriteTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isFavorite={true}
                      onSelect={handleSelectTemplate}
                      onToggleFavorite={handleToggleFavorite}
                      onPreview={handleEnhancedPreview}
                    />
                  ))}
                </TemplateGrid>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <TemplatePreview
        template={selectedTemplate}
        isOpen={isOpen && !!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onUse={handleUseTemplate}
        isFavorite={
          selectedTemplate ? favorites.includes(selectedTemplate.id) : false
        }
        onToggleFavorite={handleToggleFavorite}
      />

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          css={css`
            max-width: 80rem;
            z-index: 1101;
          `}
        >
          <DialogHeader>
            <DialogTitle>
              {previewTemplateId
                ? filteredTemplates.find((t) => t.id === previewTemplateId)
                    ?.name || "模板预览"
                : "模板预览"}
            </DialogTitle>
          </DialogHeader>
          {previewTemplateId && (
            <EnhancedTemplatePreview
              templateId={previewTemplateId}
              templates={filteredTemplates}
              theme={theme}
            />
          )}
          <FooterActions>
            <Button
              variant="outline"
              onClick={() => {
                if (previewTemplateId) {
                  handleToggleFavorite(previewTemplateId);
                }
              }}
            >
              <FavoriteIcon
                isFavorite={
                  previewTemplateId
                    ? favorites.includes(previewTemplateId)
                    : false
                }
              />
              {previewTemplateId && favorites.includes(previewTemplateId)
                ? "取消收藏"
                : "收藏"}
            </Button>
            <Button
              onClick={() => {
                const template = filteredTemplates.find(
                  (t) => t.id === previewTemplateId
                );
                if (template) {
                  handleUseTemplate(template.components);
                  setIsPreviewOpen(false);
                }
              }}
            >
              使用此模板
            </Button>
          </FooterActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
