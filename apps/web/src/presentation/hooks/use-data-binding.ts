import { useState, useEffect, useCallback } from "react";
import { useDataStore } from "@/infrastructure/state-management/stores";
import { useComponentStore } from "@/infrastructure/state-management/stores";
import type { DataSource, DataMapping } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";

interface UseDataBindingOptions {
  componentId: string | null;
}

export function useDataBinding({ componentId }: UseDataBindingOptions) {
  const {
    dataSources,
    dataBindings,
    bindComponentToDataSource,
    unbindComponentFromDataSource,
    updateDataMappings,
  } = useDataStore();

  const { components, updateComponent } = useComponentStore();

  const [currentDataSource, setCurrentDataSource] = useState<DataSource | null>(
    null
  );
  const [currentMappings, setCurrentMappings] = useState<DataMapping[]>([]);

  // 获取当前组件
  const currentComponent = componentId
    ? components.find((c) => c.id === componentId)
    : null;

  // 同步组件的数据绑定信息
  useEffect(() => {
    if (!currentComponent) {
      setCurrentDataSource(null);
      setCurrentMappings([]);
      return;
    }

    // 从组件中获取数据源ID
    const dataSourceId = currentComponent.dataSource || null;
    if (dataSourceId) {
      const dataSource = dataSources.find((ds) => ds.id === dataSourceId);
      setCurrentDataSource(dataSource || null);
    } else {
      setCurrentDataSource(null);
    }

    // 从组件或store中获取映射
    const mappings =
      currentComponent.dataMapping ||
      (componentId ? dataBindings[componentId] : []) ||
      [];
    setCurrentMappings(mappings);
  }, [currentComponent, dataSources, dataBindings, componentId]);

  // 绑定数据源
  const bindDataSource = useCallback(
    (dataSourceId: string | null) => {
      if (!componentId) return;

      if (dataSourceId === null) {
        // 解绑
        unbindComponentFromDataSource(componentId);
        updateComponent(componentId, {
          dataSource: null,
          dataMapping: [],
        });
        setCurrentDataSource(null);
        setCurrentMappings([]);
      } else {
        const dataSource = dataSources.find((ds) => ds.id === dataSourceId);
        if (!dataSource) return;

        // 绑定数据源
        bindComponentToDataSource(componentId, dataSourceId, []);
        updateComponent(componentId, {
          dataSource: dataSourceId,
          dataMapping: [],
        });
        setCurrentDataSource(dataSource);
        setCurrentMappings([]);
      }
    },
    [
      componentId,
      dataSources,
      bindComponentToDataSource,
      unbindComponentFromDataSource,
      updateComponent,
    ]
  );

  // 更新数据映射
  const updateMappings = useCallback(
    (mappings: DataMapping[]) => {
      if (!componentId) return;

      // 更新store
      updateDataMappings(componentId, mappings);

      // 更新组件
      updateComponent(componentId, {
        dataMapping: mappings,
      });

      setCurrentMappings(mappings);
    },
    [componentId, updateDataMappings, updateComponent]
  );

  // 获取组件数据预览
  const getPreviewData = useCallback(async () => {
    if (!currentComponent || !currentDataSource || currentMappings.length === 0) {
      return null;
    }

    try {
      return await DataBindingService.getComponentData(
        currentComponent,
        [currentDataSource]
      );
    } catch (error) {
      console.error("获取预览数据失败:", error);
      return null;
    }
  }, [currentComponent, currentDataSource, currentMappings]);

  return {
    // 数据
    dataSources,
    currentDataSource,
    currentMappings,
    currentComponent,

    // 操作
    bindDataSource,
    updateMappings,
    getPreviewData,
  };
}
