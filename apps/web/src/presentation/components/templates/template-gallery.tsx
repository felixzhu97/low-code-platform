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
import type { Component } from "@/domain/component/entities/component.entity";
import type { Template } from "@/presentation/data/templates";
import { store } from "@/infrastructure/state-management/store";
import { useAdapters } from "@/presentation/hooks/use-adapters";

interface TemplateGalleryProps {}

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
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

const TemplateGalleryContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TemplateGridContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 0.25rem;
  margin-right: -0.25rem;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  align-content: start;

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
  padding: 0.75rem 0;
  flex-shrink: 0;
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
  const { theme } = require("@/infrastructure/state-management/stores").useThemeStore();
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

  // 处理模板预览关闭
  const handlePreviewClose = () => {
    setSelectedTemplate(null);
    setIsOpen(false);
  };

  const handleUseTemplate = async (components: Component[]) => {
    const existing = store.getState().component.components;
    await templateAdapter.appendTemplateFromComponents(
      components,
      existing
    );
    // 使用模板后关闭预览弹窗
    setSelectedTemplate(null);
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

          <TemplateGalleryContent>
            <Tabs
              defaultValue="all"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <TabsList css={{ marginBottom: "0.75rem", flexShrink: 0 }}>
                <TabsTrigger value="all">全部模板</TabsTrigger>
                <TabsTrigger value="favorites">我的收藏</TabsTrigger>
              </TabsList>

              <TabsContent
                value="all"
                style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
              >
                <TemplateGridContainer>
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
                </TemplateGridContainer>

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
                style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
              >
                <TemplateGridContainer>
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
                </TemplateGridContainer>
              </TabsContent>
            </Tabs>
          </TemplateGalleryContent>
        </DialogContent>
      </Dialog>

      <TemplatePreview
        template={selectedTemplate}
        isOpen={isOpen && !!selectedTemplate}
        onClose={handlePreviewClose}
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
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
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
