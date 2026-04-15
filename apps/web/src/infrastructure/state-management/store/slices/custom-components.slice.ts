import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  customComponents: CustomComponent[];
  favorites: string[];
  searchTerm: string;
  selectedCategory: string;
  isBuilderOpen: boolean;
  isLibraryOpen: boolean;
}

const initialState: CustomComponentsState = {
  customComponents: [],
  favorites: [],
  searchTerm: "",
  selectedCategory: "all",
  isBuilderOpen: false,
  isLibraryOpen: false,
};

const customComponentsSlice = createSlice({
  name: "customComponents",
  initialState,
  reducers: {
    addCustomComponent: (state, action: PayloadAction<CustomComponent>) => {
      state.customComponents.push(action.payload);
    },
    removeCustomComponent: (state, action: PayloadAction<string>) => {
      const componentId = action.payload;
      state.customComponents = state.customComponents.filter(
        (c) => c.id !== componentId
      );
      state.favorites = state.favorites.filter((id) => id !== componentId);
    },
    updateCustomComponent: (
      state,
      action: PayloadAction<{ componentId: string; updates: Partial<CustomComponent> }>
    ) => {
      const index = state.customComponents.findIndex(
        (c) => c.id === action.payload.componentId
      );
      if (index !== -1) {
        state.customComponents[index] = {
          ...state.customComponents[index],
          ...action.payload.updates,
          metadata: {
            ...state.customComponents[index].metadata,
            updatedAt: new Date().toISOString(),
          },
        };
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const componentId = action.payload;
      if (state.favorites.includes(componentId)) {
        state.favorites = state.favorites.filter((id) => id !== componentId);
      } else {
        state.favorites.push(componentId);
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setBuilderOpen: (state, action: PayloadAction<boolean>) => {
      state.isBuilderOpen = action.payload;
    },
    setLibraryOpen: (state, action: PayloadAction<boolean>) => {
      state.isLibraryOpen = action.payload;
    },
    importCustomComponents: (
      state,
      action: PayloadAction<CustomComponent[]>
    ) => {
      state.customComponents.push(...action.payload);
    },
    clearAllCustomComponents: (state) => {
      state.customComponents = [];
      state.favorites = [];
    },
  },
});

export const {
  addCustomComponent,
  removeCustomComponent,
  updateCustomComponent,
  toggleFavorite,
  setSearchTerm,
  setSelectedCategory,
  setBuilderOpen,
  setLibraryOpen,
  importCustomComponents,
  clearAllCustomComponents,
} = customComponentsSlice.actions;

export default customComponentsSlice.reducer;

export const selectCustomComponents = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.customComponents;
export const selectFavorites = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.favorites;
export const selectSearchTerm = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.searchTerm;
export const selectSelectedCategory = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.selectedCategory;
export const selectIsBuilderOpen = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.isBuilderOpen;
export const selectIsLibraryOpen = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.isLibraryOpen;

export const selectFilteredComponents = (state: { customComponents: CustomComponentsState }) => {
  const { customComponents, searchTerm, selectedCategory } = state.customComponents;
  let filtered = customComponents;

  if (selectedCategory !== "all") {
    filtered = filtered.filter((c) => c.category === selectedCategory);
  }

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
};

export const selectComponentsByCategory = (
  state: { customComponents: CustomComponentsState },
  category: string
) => state.customComponents.customComponents.filter((c) => c.category === category);

export const selectFavoriteComponents = (state: { customComponents: CustomComponentsState }) =>
  state.customComponents.customComponents.filter((c) =>
    state.customComponents.favorites.includes(c.id)
  );
