"use client";

import { useState } from "react";
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

interface TemplateGalleryProps {
  // 移除 props，现在从 store 获取状态
}

export function TemplateGallery(_props: TemplateGalleryProps) {
  // 从 store 获取状态
  const { addComponent } = useComponentStore();
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  );

  // 使用自定义 hook 管理模板状态
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

  // 分页设置
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 处理模板选择
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsOpen(true);
  };

  // 处理使用模板
  const handleUseTemplate = (components: Component[]) => {
    components.forEach((component) => {
      addComponent(component);
    });
    setIsOpen(false);
  };

  // 处理增强预览
  const handleEnhancedPreview = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setIsPreviewOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          浏览模板库
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>模板库</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索模板..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
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
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部模板</TabsTrigger>
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t">
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
                <span className="text-xs text-muted-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
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
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="favorites"
            className="overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            {favoriteTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>您还没有收藏任何模板</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* 模板预览对话框 */}
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

      {/* 增强预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-5xl">
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
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (previewTemplateId) {
                  handleToggleFavorite(previewTemplateId);
                }
              }}
            >
              <Star
                className={`mr-2 h-4 w-4 ${
                  previewTemplateId && favorites.includes(previewTemplateId)
                    ? "fill-yellow-400 text-yellow-400"
                    : ""
                }`}
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
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
