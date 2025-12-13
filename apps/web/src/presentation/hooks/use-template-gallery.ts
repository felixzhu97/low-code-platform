import { useState, useEffect, useMemo } from "react";
import {
  ALL_TEMPLATES,
  getAllCategories,
  getAllTags,
} from "@/presentation/data/templates";
import type { Template } from "@/presentation/data/templates";

export function useTemplateGallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // 获取类别和标签
  const categories = useMemo(() => getAllCategories(), []);
  const allTags = useMemo(() => getAllTags(), []);

  // 过滤模板
  const filteredTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter((template) => {
      // 类别过滤
      if (activeCategory !== "all" && template.category !== activeCategory) {
        return false;
      }

      // 标签过滤
      if (selectedTags.length > 0) {
        const templateTags = template.tags || [];
        if (!selectedTags.some((tag) => templateTags.includes(tag))) {
          return false;
        }
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          (template.tags || []).some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [activeCategory, selectedTags, searchQuery]);

  // 收藏的模板
  const favoriteTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter((template) => favorites.includes(template.id));
  }, [favorites]);

  // 重置过滤器
  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // 处理收藏切换
  const handleToggleFavorite = (templateId: string) => {
    setFavorites((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // 当过滤条件改变时，重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, selectedTags]);

  return {
    // 状态
    activeCategory,
    searchQuery,
    favorites,
    selectedTags,
    currentPage,
    showFilters,

    // 计算值
    categories,
    allTags,
    filteredTemplates,
    favoriteTemplates,

    // 操作方法
    setActiveCategory,
    setSearchQuery,
    setCurrentPage,
    setShowFilters,
    resetFilters,
    handleToggleFavorite,
    handleTagSelect,
  };
}
