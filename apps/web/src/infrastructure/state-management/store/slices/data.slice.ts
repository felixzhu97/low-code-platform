import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DataSource } from "@/domain/datasource/entities/data-source.entity";
import type { DataMapping } from "@/domain/datasource/entities/data-mapping.entity";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataState {
  dataSources: DataSource[];
  activeDataSource: string | null;
  dataBindings: Record<string, DataMapping[]>;
}

const initialState: DataState = {
  dataSources: [],
  activeDataSource: null,
  dataBindings: {},
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addDataSource: (state, action: PayloadAction<DataSource>) => {
      const exists = state.dataSources.some((ds) => ds.id === action.payload.id);
      if (!exists) {
        state.dataSources.push(action.payload);
      }
    },
    updateDataSource: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<DataSource> }>
    ) => {
      const index = state.dataSources.findIndex(
        (ds) => ds.id === action.payload.id
      );
      if (index !== -1) {
        state.dataSources[index] = {
          ...state.dataSources[index],
          ...action.payload.updates,
        };
      }
    },
    deleteDataSource: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.dataSources = state.dataSources.filter((ds) => ds.id !== id);
      if (state.activeDataSource === id) {
        state.activeDataSource = null;
      }
      Object.keys(state.dataBindings).forEach((key) => {
        state.dataBindings[key] = state.dataBindings[key].filter(
          (mapping) => !mapping.sourcePath.includes(id)
        );
      });
    },
    setActiveDataSource: (state, action: PayloadAction<string | null>) => {
      state.activeDataSource = action.payload;
    },
    refreshDataSource: (
      state,
      action: PayloadAction<{ id: string; lastUpdated: string; status: string }>
    ) => {
      const index = state.dataSources.findIndex(
        (ds) => ds.id === action.payload.id
      );
      if (index !== -1) {
        state.dataSources[index].lastUpdated = action.payload.lastUpdated;
        state.dataSources[index].status = action.payload.status as DataSource["status"];
      }
    },
    bindComponentToDataSource: (
      state,
      action: PayloadAction<{
        componentId: string;
        dataSourceId: string;
        mappings?: DataMapping[];
      }>
    ) => {
      const { componentId, mappings = [] } = action.payload;
      state.dataBindings[componentId] = mappings;
    },
    unbindComponentFromDataSource: (state, action: PayloadAction<string>) => {
      delete state.dataBindings[action.payload];
    },
    updateDataMappings: (
      state,
      action: PayloadAction<{ componentId: string; mappings: DataMapping[] }>
    ) => {
      state.dataBindings[action.payload.componentId] = action.payload.mappings;
    },
    clearAllDataBindings: (state) => {
      state.dataBindings = {};
    },
  },
});

export const {
  addDataSource,
  updateDataSource,
  deleteDataSource,
  setActiveDataSource,
  refreshDataSource,
  bindComponentToDataSource,
  unbindComponentFromDataSource,
  updateDataMappings,
  clearAllDataBindings,
} = dataSlice.actions;

export default dataSlice.reducer;

export const selectDataSources = (state: { data: DataState }) =>
  state.data.dataSources;
export const selectActiveDataSource = (state: { data: DataState }) =>
  state.data.activeDataSource;
export const selectDataBindings = (state: { data: DataState }) =>
  state.data.dataBindings;

export const selectDataSourceById = (state: { data: DataState }, id: string) =>
  state.data.dataSources.find((ds) => ds.id === id) || null;

export const selectDataBindingsByComponentId = (
  state: { data: DataState },
  componentId: string
) => state.data.dataBindings[componentId] || [];

export const selectComponentsByDataSourceId = (
  state: { data: DataState },
  dataSourceId: string
) =>
  Object.entries(state.data.dataBindings)
    .filter(([_, mappings]) =>
      mappings.some((mapping) => mapping.sourcePath.includes(dataSourceId))
    )
    .map(([componentId]) => componentId);

export const selectComponentData = (
  state: { data: DataState },
  componentId: string
) => {
  const mappings = state.data.dataBindings[componentId];
  if (!mappings || mappings.length === 0) return null;
  return DataBindingService.previewDataMapping({ sample: "data" }, mappings, 5);
};
