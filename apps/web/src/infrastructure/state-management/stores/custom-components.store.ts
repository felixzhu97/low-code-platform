import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as customComponentsActions from "../store/slices/custom-components.slice";
import type { CustomComponent } from "../store/slices/custom-components.slice";

export const useCustomComponentsStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.customComponents);

  return {
    ...state,
    addCustomComponent: (component: CustomComponent) =>
      dispatch(customComponentsActions.addCustomComponent(component)),
    removeCustomComponent: (componentId: string) =>
      dispatch(customComponentsActions.removeCustomComponent(componentId)),
    updateCustomComponent: (
      componentId: string,
      updates: Partial<CustomComponent>
    ) =>
      dispatch(
        customComponentsActions.updateCustomComponent({ componentId, updates })
      ),
    toggleFavorite: (componentId: string) =>
      dispatch(customComponentsActions.toggleFavorite(componentId)),
    setSearchTerm: (term: string) =>
      dispatch(customComponentsActions.setSearchTerm(term)),
    setSelectedCategory: (category: string) =>
      dispatch(customComponentsActions.setSelectedCategory(category)),
    setBuilderOpen: (open: boolean) =>
      dispatch(customComponentsActions.setBuilderOpen(open)),
    setLibraryOpen: (open: boolean) =>
      dispatch(customComponentsActions.setLibraryOpen(open)),
    importCustomComponents: (components: CustomComponent[]) =>
      dispatch(customComponentsActions.importCustomComponents(components)),
    exportCustomComponents: () => state.customComponents,
    clearAllCustomComponents: () =>
      dispatch(customComponentsActions.clearAllCustomComponents()),
    getFilteredComponents: () => {
      let filtered = state.customComponents;
      if (state.selectedCategory !== "all") {
        filtered = filtered.filter((c) => c.category === state.selectedCategory);
      }
      if (state.searchTerm) {
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            c.metadata?.tags?.some((tag) =>
              tag.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
        );
      }
      return filtered;
    },
    getComponentsByCategory: (category: string) =>
      state.customComponents.filter((c) => c.category === category),
    getFavoriteComponents: () =>
      state.customComponents.filter((c) => state.favorites.includes(c.id)),
  };
};
