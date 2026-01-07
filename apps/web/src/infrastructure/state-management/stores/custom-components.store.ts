import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Component } from "@/domain/component";

export interface CustomComponent {
  id: string;
  name: string;
  type: string;
  category: string;
  isContainer: boolean;
  isCustom: boolean;
  childComponents?: string[];
  properties?: Record<string, any>;
  metadata?: {
    description?: string;
    tags?: string[];
    version?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface CustomComponentsState {
  // 状态
  customComponents: CustomComponent[];
  favorites: string[];
  searchTerm: string;
  selectedCategory: string;
  isBuilderOpen: boolean;
  isLibraryOpen: boolean;

  // 操作
  addCustomComponent: (component: CustomComponent) => void;
  removeCustomComponent: (componentId: string) => void;
  updateCustomComponent: (
    componentId: string,
    updates: Partial<CustomComponent>
  ) => void;
  toggleFavorite: (componentId: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setBuilderOpen: (open: boolean) => void;
  setLibraryOpen: (open: boolean) => void;

  // 导入导出
  importCustomComponents: (components: CustomComponent[]) => void;
  exportCustomComponents: () => CustomComponent[];
  clearAllCustomComponents: () => void;

  // 搜索和过滤
  getFilteredComponents: () => CustomComponent[];
  getComponentsByCategory: (category: string) => CustomComponent[];
  getFavoriteComponents: () => CustomComponent[];
}

export const useCustomComponentsStore = create<CustomComponentsState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        customComponents: [],
        favorites: [],
        searchTerm: "",
        selectedCategory: "all",
        isBuilderOpen: false,
        isLibraryOpen: false,

        // 添加自定义组件
        addCustomComponent: (component) =>
          set((state) => ({
            customComponents: [...state.customComponents, component],
          })),

        // 删除自定义组件
        removeCustomComponent: (componentId) =>
          set((state) => ({
            customComponents: state.customComponents.filter(
              (c) => c.id !== componentId
            ),
            favorites: state.favorites.filter((id) => id !== componentId),
          })),

        // 更新自定义组件
        updateCustomComponent: (componentId, updates) =>
          set((state) => ({
            customComponents: state.customComponents.map((c) =>
              c.id === componentId
                ? {
                    ...c,
                    ...updates,
                    metadata: {
                      ...c.metadata,
                      updatedAt: new Date().toISOString(),
                    },
                  }
                : c
            ),
          })),

        // 切换收藏状态
        toggleFavorite: (componentId) =>
          set((state) => ({
            favorites: state.favorites.includes(componentId)
              ? state.favorites.filter((id) => id !== componentId)
              : [...state.favorites, componentId],
          })),

        // 设置搜索词
        setSearchTerm: (term) => set({ searchTerm: term }),

        // 设置选中的分类
        setSelectedCategory: (category) => set({ selectedCategory: category }),

        // 设置构建器打开状态
        setBuilderOpen: (open) => set({ isBuilderOpen: open }),

        // 设置库打开状态
        setLibraryOpen: (open) => set({ isLibraryOpen: open }),

        // 导入自定义组件
        importCustomComponents: (components) =>
          set((state) => ({
            customComponents: [...state.customComponents, ...components],
          })),

        // 导出自定义组件
        exportCustomComponents: () => get().customComponents,

        // 清空所有自定义组件
        clearAllCustomComponents: () =>
          set({
            customComponents: [],
            favorites: [],
          }),

        // 获取过滤后的组件
        getFilteredComponents: () => {
          const { customComponents, searchTerm, selectedCategory } = get();

          let filtered = customComponents;

          // 按分类过滤
          if (selectedCategory !== "all") {
            filtered = filtered.filter((c) => c.category === selectedCategory);
          }

          // 按搜索词过滤
          if (searchTerm) {
            filtered = filtered.filter(
              (c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.metadata?.tags?.some((tag) =>
                  tag.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
          }

          return filtered;
        },

        // 按分类获取组件
        getComponentsByCategory: (category) =>
          get().customComponents.filter((c) => c.category === category),

        // 获取收藏的组件
        getFavoriteComponents: () => {
          const { customComponents, favorites } = get();
          return customComponents.filter((c) => favorites.includes(c.id));
        },
      }),
      {
        name: "custom-components-store",
        partialize: (state) => ({
          customComponents: state.customComponents,
          favorites: state.favorites,
        }),
      }
    ),
    {
      name: "custom-components-store",
    }
  )
);
