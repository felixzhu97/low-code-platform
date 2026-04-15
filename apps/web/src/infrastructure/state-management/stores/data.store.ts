import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as dataActions from "../store/slices/data.slice";
import type { DataSource } from "@/domain/datasource/entities/data-source.entity";
import type { DataMapping } from "@/domain/datasource/entities/data-mapping.entity";
import { DataBindingService } from "@/application/services/data-binding.service";

export const useDataStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.data);

  return {
    ...state,
    addDataSource: (dataSource: DataSource) =>
      dispatch(dataActions.addDataSource(dataSource)),
    updateDataSource: (id: string, updates: Partial<DataSource>) =>
      dispatch(dataActions.updateDataSource({ id, updates })),
    deleteDataSource: (id: string) =>
      dispatch(dataActions.deleteDataSource(id)),
    setActiveDataSource: (id: string | null) =>
      dispatch(dataActions.setActiveDataSource(id)),
    refreshDataSource: async (id: string) => {
      const dataSource = state.dataSources.find((ds) => ds.id === id);
      if (!dataSource) return;

      try {
        dispatch(
          dataActions.refreshDataSource({
            id,
            lastUpdated: new Date().toISOString(),
            status: "active",
          })
        );
      } catch (error) {
        dispatch(
          dataActions.refreshDataSource({
            id,
            lastUpdated: new Date().toISOString(),
            status: "error",
          })
        );
      }
    },
    bindComponentToDataSource: (
      componentId: string,
      dataSourceId: string,
      mappings?: DataMapping[]
    ) =>
      dispatch(
        dataActions.bindComponentToDataSource({
          componentId,
          dataSourceId,
          mappings,
        })
      ),
    unbindComponentFromDataSource: (componentId: string) =>
      dispatch(dataActions.unbindComponentFromDataSource(componentId)),
    updateDataMappings: (componentId: string, mappings: DataMapping[]) =>
      dispatch(
        dataActions.updateDataMappings({ componentId, mappings })
      ),
    getComponentData: (componentId: string) => {
      const mappings = state.dataBindings[componentId];
      if (!mappings || mappings.length === 0) return null;
      return DataBindingService.previewDataMapping(
        { sample: "data" },
        mappings,
        5
      );
    },
    getDataSourceById: (id: string) =>
      state.dataSources.find((ds) => ds.id === id) || null,
    getComponentsByDataSource: (dataSourceId: string) =>
      Object.entries(state.dataBindings)
        .filter(([_, mappings]) =>
          mappings.some((mapping) =>
            mapping.sourcePath.includes(dataSourceId)
          )
        )
        .map(([componentId]) => componentId),
    clearAllDataBindings: () =>
      dispatch(dataActions.clearAllDataBindings()),
  };
};
