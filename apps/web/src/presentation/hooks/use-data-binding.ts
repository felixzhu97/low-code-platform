import { useState, useEffect, useCallback } from "react";
import {
  useDataStore,
  useComponentStore,
} from "@/infrastructure/state-management/stores";
import type { DataSource, DataMapping } from "@/domain/datasource";
import { DataBindingService } from "@/application/services/data-binding.service";
import { DataSourceService } from "@/application/services/data-source.service";

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
    addDataSource,
  } = useDataStore();

  const { components, updateComponent } = useComponentStore();

  const [currentDataSource, setCurrentDataSource] = useState<DataSource | null>(
    null
  );
  const [currentMappings, setCurrentMappings] = useState<DataMapping[]>([]);
  const [currentBoundData, setCurrentBoundData] = useState<any>(null);

  // 获取当前组件
  const currentComponent = componentId
    ? components.find((c) => c.id === componentId)
    : null;

  // 同步组件的数据绑定信息
  useEffect(() => {
    if (!currentComponent) {
      setCurrentDataSource(null);
      setCurrentMappings([]);
      setCurrentBoundData(null);
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

  // 获取组件已绑定的数据
  const getComponentBoundData = useCallback(async () => {
    if (!currentComponent) {
      setCurrentBoundData(null);
      return null;
    }

    // 优先使用组件属性中直接存储的数据（用户通过"应用更改"编辑的数据）
    if (currentComponent.properties?.data !== undefined) {
      setCurrentBoundData(currentComponent.properties.data);
      return currentComponent.properties.data;
    }

    // 如果没有直接数据，且组件绑定了数据源，则从数据源获取
    if (!currentDataSource) {
      setCurrentBoundData(null);
      return null;
    }

    try {
      const data = await DataBindingService.getComponentData(currentComponent, [
        currentDataSource,
      ]);
      setCurrentBoundData(data);
      return data;
    } catch (error) {
      console.error("获取已绑定数据失败:", error);
      setCurrentBoundData(null);
      return null;
    }
  }, [currentComponent, currentDataSource]);

  // 同步已绑定数据
  useEffect(() => {
    if (currentComponent) {
      getComponentBoundData();
    } else {
      setCurrentBoundData(null);
    }
  }, [currentComponent, currentDataSource, getComponentBoundData]);

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
    if (
      !currentComponent ||
      !currentDataSource ||
      currentMappings.length === 0
    ) {
      return null;
    }

    try {
      return await DataBindingService.getComponentData(currentComponent, [
        currentDataSource,
      ]);
    } catch (error) {
      console.error("获取预览数据失败:", error);
      return null;
    }
  }, [currentComponent, currentDataSource, currentMappings]);

  // 直接将数据渲染到组件属性（简化流程，无需映射）
  const renderDataToComponent = useCallback(
    (data: any) => {
      if (!componentId) return;

      // 从 store 中获取最新的组件，而不是使用闭包中的 currentComponent
      const latestComponent = components.find((c) => c.id === componentId);
      if (!latestComponent) return;

      const componentType = latestComponent.type;
      const currentProperties = latestComponent.properties || {};
      let updatedProperties = { ...currentProperties };

      // 根据组件类型智能应用数据
      if (componentType === "text") {
        // 文本组件：取第一个有意义的值
        if (typeof data === "string") {
          updatedProperties.content = data;
        } else if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          if (typeof firstItem === "string") {
            updatedProperties.content = firstItem;
          } else if (typeof firstItem === "object") {
            // 尝试找到name, title, content等字段
            updatedProperties.content =
              firstItem.name ||
              firstItem.title ||
              firstItem.content ||
              firstItem.text ||
              Object.values(firstItem)[0] ||
              "";
          }
        } else if (typeof data === "object" && data !== null) {
          updatedProperties.content =
            data.name ||
            data.title ||
            data.content ||
            data.text ||
            Object.values(data)[0] ||
            "";
        }
      } else if (componentType === "button") {
        // 按钮组件
        if (typeof data === "string") {
          updatedProperties.text = data;
        } else if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          if (typeof firstItem === "string") {
            updatedProperties.text = firstItem;
          } else if (typeof firstItem === "object") {
            updatedProperties.text =
              firstItem.name ||
              firstItem.title ||
              firstItem.text ||
              firstItem.label ||
              Object.values(firstItem)[0] ||
              "";
          }
        } else if (typeof data === "object" && data !== null) {
          updatedProperties.text =
            data.name ||
            data.title ||
            data.text ||
            data.label ||
            Object.values(data)[0] ||
            "";
        }
      } else if (componentType === "data-table") {
        // 数据表格：如果数据是数组，直接使用，并自动设置columns
        if (Array.isArray(data) && data.length > 0) {
          updatedProperties.data = data;
          // 自动生成列配置
          const firstRow = data[0];
          if (typeof firstRow === "object") {
            const columns = Object.keys(firstRow).map((key, index) => ({
              key: `col-${index}`,
              title: key,
              dataIndex: key,
              sortable: true,
              filterable: false,
            }));
            updatedProperties.columns = columns;
          }
        } else if (typeof data === "object" && data !== null) {
          // 如果数据是对象，尝试找到数组字段
          const arrayField = Object.values(data).find((value) =>
            Array.isArray(value)
          ) as any[];
          if (arrayField && arrayField.length > 0) {
            updatedProperties.data = arrayField;
            const firstRow = arrayField[0];
            if (typeof firstRow === "object") {
              const columns = Object.keys(firstRow).map((key, index) => ({
                key: `col-${index}`,
                title: key,
                dataIndex: key,
                sortable: true,
                filterable: false,
              }));
              updatedProperties.columns = columns;
            }
          }
        }
      } else if (componentType === "data-list") {
        // 数据列表：如果数据是数组，直接使用
        if (Array.isArray(data)) {
          updatedProperties.data = data;
        } else if (typeof data === "object" && data !== null) {
          // 如果数据是对象，尝试找到数组字段
          const arrayField = Object.values(data).find((value) =>
            Array.isArray(value)
          ) as any[];
          if (arrayField) {
            updatedProperties.data = arrayField;
          }
        }
      } else if (componentType.includes("chart") || componentType === "gauge") {
        // 图表组件：如果数据是数组，直接使用；如果是对象，尝试提取数组
        if (Array.isArray(data)) {
          updatedProperties.data = data;
        } else if (typeof data === "object" && data !== null) {
          // 对于图表，如果是对象，尝试找到数组字段
          const arrayField = Object.values(data).find((value) =>
            Array.isArray(value)
          ) as any[];
          if (arrayField) {
            updatedProperties.data = arrayField;
          } else {
            // 如果没有数组字段，直接使用对象
            updatedProperties.data = data;
          }
        }
      } else if (componentType === "image") {
        // 图片组件
        if (typeof data === "string") {
          updatedProperties.src = data;
        } else if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          if (typeof firstItem === "string") {
            updatedProperties.src = firstItem;
          } else if (typeof firstItem === "object") {
            updatedProperties.src =
              firstItem.src ||
              firstItem.url ||
              firstItem.image ||
              firstItem.avatar ||
              "";
            updatedProperties.alt = firstItem.alt || firstItem.name || "";
          }
        } else if (typeof data === "object" && data !== null) {
          updatedProperties.src =
            data.src || data.url || data.image || data.avatar || "";
          updatedProperties.alt = data.alt || data.name || "";
        }
      } else if (componentType === "input" || componentType === "textarea") {
        // 输入框组件
        if (typeof data === "string") {
          updatedProperties.defaultValue = data;
          updatedProperties.placeholder = data;
        } else if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          if (typeof firstItem === "string") {
            updatedProperties.defaultValue = firstItem;
          } else if (typeof firstItem === "object") {
            updatedProperties.defaultValue =
              firstItem.value || firstItem.defaultValue || firstItem.name || "";
          }
        } else if (typeof data === "object" && data !== null) {
          updatedProperties.defaultValue =
            data.value || data.defaultValue || data.name || "";
        }
      }

      // 更新组件属性
      updateComponent(componentId, { properties: updatedProperties });
    },
    [componentId, components, updateComponent]
  );

  // 更新组件已绑定的数据
  const updateComponentBoundData = useCallback(
    (data: any) => {
      if (!componentId) return;

      // 直接使用 renderDataToComponent 将数据应用到组件属性
      // renderDataToComponent 会从 store 中获取最新的组件，确保使用最新状态
      renderDataToComponent(data);
      // 更新 currentBoundData 为用户编辑的数据，确保输入框显示的数据与组件实际使用的数据一致
      // 使用 setTimeout 确保在组件更新后再更新 currentBoundData，避免触发 BoundDataEditor 的 useEffect 重置输入框
      setTimeout(() => {
        setCurrentBoundData(data);
      }, 0);
    },
    [componentId, renderDataToComponent]
  );

  // 从JSON创建数据源并直接渲染到组件
  const createDataSourceFromJson = useCallback(
    (jsonData: any, dataSourceName?: string) => {
      if (!componentId) return null;

      // 创建数据源
      const newDataSource = DataSourceService.createDataSource(
        dataSourceName || `快速输入数据-${Date.now()}`,
        "static",
        jsonData
      );

      // 添加到store
      addDataSource(newDataSource);

      // 绑定数据源到组件
      bindComponentToDataSource(componentId, newDataSource.id, []);
      updateComponent(componentId, {
        dataSource: newDataSource.id,
        dataMapping: [],
      });

      // 更新当前状态
      setCurrentDataSource(newDataSource);
      setCurrentMappings([]);

      // 直接渲染数据到组件属性
      renderDataToComponent(jsonData);

      return newDataSource;
    },
    [
      componentId,
      addDataSource,
      bindComponentToDataSource,
      updateComponent,
      renderDataToComponent,
    ]
  );

  return {
    // 数据
    dataSources,
    currentDataSource,
    currentMappings,
    currentComponent,
    currentBoundData,

    // 操作
    bindDataSource,
    updateMappings,
    getPreviewData,
    createDataSourceFromJson,
    renderDataToComponent,
    getComponentBoundData,
    updateComponentBoundData,
  };
}
