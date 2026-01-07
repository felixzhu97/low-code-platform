import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { DataSource, DataMapping } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface DataState {
  // 数据状态
  dataSources: DataSource[];
  activeDataSource: string | null;
  dataBindings: Record<string, DataMapping[]>; // componentId -> mappings

  // 数据源操作
  addDataSource: (dataSource: DataSource) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  deleteDataSource: (id: string) => void;
  setActiveDataSource: (id: string | null) => void;
  refreshDataSource: (id: string) => Promise<void>;

  // 数据绑定操作
  bindComponentToDataSource: (
    componentId: string,
    dataSourceId: string,
    mappings?: DataMapping[]
  ) => void;
  unbindComponentFromDataSource: (componentId: string) => void;
  updateDataMappings: (componentId: string, mappings: DataMapping[]) => void;
  getComponentData: (componentId: string) => any;

  // 数据操作
  getDataSourceById: (id: string) => DataSource | null;
  getComponentsByDataSource: (dataSourceId: string) => string[];
  clearAllDataBindings: () => void;
}

export const useDataStore = create<DataState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        dataSources: [],
        activeDataSource: null,
        dataBindings: {},

        // 添加数据源
        addDataSource: (dataSource: DataSource) => {
          set(
            (state) => ({
              dataSources: [...state.dataSources, dataSource],
            }),
            false,
            "addDataSource"
          );
        },

        // 更新数据源
        updateDataSource: (id: string, updates: Partial<DataSource>) => {
          set(
            (state) => ({
              dataSources: state.dataSources.map((ds) =>
                ds.id === id ? { ...ds, ...updates } : ds
              ),
            }),
            false,
            "updateDataSource"
          );
        },

        // 删除数据源
        deleteDataSource: (id: string) => {
          set(
            (state) => ({
              dataSources: state.dataSources.filter((ds) => ds.id !== id),
              activeDataSource:
                state.activeDataSource === id ? null : state.activeDataSource,
              dataBindings: Object.fromEntries(
                Object.entries(state.dataBindings).filter(
                  ([_, mappings]) =>
                    !mappings.some((mapping) => mapping.sourcePath.includes(id))
                )
              ),
            }),
            false,
            "deleteDataSource"
          );
        },

        // 设置活动数据源
        setActiveDataSource: (id: string | null) => {
          set({ activeDataSource: id }, false, "setActiveDataSource");
        },

        // 刷新数据源
        refreshDataSource: async (id: string) => {
          const { dataSources, updateDataSource } = get();
          const dataSource = dataSources.find((ds) => ds.id === id);

          if (!dataSource) return;

          try {
            // 这里可以添加实际的数据获取逻辑
            // 目前只是更新时间戳
            updateDataSource(id, {
              lastUpdated: new Date().toISOString(),
              status: "active",
            });
          } catch (error) {
            updateDataSource(id, {
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },

        // 绑定组件到数据源
        bindComponentToDataSource: (
          componentId: string,
          dataSourceId: string,
          mappings?: DataMapping[]
        ) => {
          set(
            (state) => ({
              dataBindings: {
                ...state.dataBindings,
                [componentId]: mappings || [],
              },
            }),
            false,
            "bindComponentToDataSource"
          );
        },

        // 解绑组件数据源
        unbindComponentFromDataSource: (componentId: string) => {
          set(
            (state) => {
              const newBindings = { ...state.dataBindings };
              delete newBindings[componentId];
              return { dataBindings: newBindings };
            },
            false,
            "unbindComponentFromDataSource"
          );
        },

        // 更新数据映射
        updateDataMappings: (componentId: string, mappings: DataMapping[]) => {
          set(
            (state) => ({
              dataBindings: {
                ...state.dataBindings,
                [componentId]: mappings,
              },
            }),
            false,
            "updateDataMappings"
          );
        },

        // 获取组件数据
        getComponentData: (componentId: string) => {
          const { dataSources, dataBindings } = get();
          const mappings = dataBindings[componentId];

          if (!mappings || mappings.length === 0) return null;

          // 这里需要根据实际的组件结构来获取数据
          // 暂时返回模拟数据
          return DataBindingService.previewDataMapping(
            { sample: "data" },
            mappings,
            5
          );
        },

        // 根据ID获取数据源
        getDataSourceById: (id: string) => {
          const { dataSources } = get();
          return dataSources.find((ds) => ds.id === id) || null;
        },

        // 获取使用指定数据源的组件
        getComponentsByDataSource: (dataSourceId: string) => {
          const { dataBindings } = get();
          return Object.entries(dataBindings)
            .filter(([_, mappings]) =>
              mappings.some((mapping) =>
                mapping.sourcePath.includes(dataSourceId)
              )
            )
            .map(([componentId]) => componentId);
        },

        // 清除所有数据绑定
        clearAllDataBindings: () => {
          set({ dataBindings: {} }, false, "clearAllDataBindings");
        },
      }),
      {
        name: "data-store",
        partialize: (state) => ({
          dataSources: state.dataSources,
          activeDataSource: state.activeDataSource,
          dataBindings: state.dataBindings,
        }),
      }
    ),
    {
      name: "data-store",
    }
  )
);
