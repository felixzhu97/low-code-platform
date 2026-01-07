import type { DataSource } from "@/domain/datasource";
import type { IDataSourceRepository } from "@/domain/datasource";
import { useDataStore } from "@/infrastructure/state-management/stores";

/**
 * 数据源仓储实现（基于 Zustand Store）
 */
export class DataSourceRepositoryImpl implements IDataSourceRepository {
  async findById(id: string): Promise<DataSource | null> {
    const state = useDataStore.getState();
    return state.getDataSourceById(id);
  }

  async findAll(): Promise<DataSource[]> {
    return useDataStore.getState().dataSources;
  }

  async findByType(type: DataSource["type"]): Promise<DataSource[]> {
    const dataSources = useDataStore.getState().dataSources;
    return dataSources.filter((ds) => ds.type === type);
  }

  async save(dataSource: DataSource): Promise<DataSource> {
    const state = useDataStore.getState();
    const existing = state.getDataSourceById(dataSource.id);

    if (existing) {
      state.updateDataSource(dataSource.id, dataSource);
    } else {
      state.addDataSource(dataSource);
    }

    return dataSource;
  }

  async saveAll(dataSources: DataSource[]): Promise<DataSource[]> {
    const state = useDataStore.getState();
    dataSources.forEach((ds) => {
      const existing = state.getDataSourceById(ds.id);
      if (existing) {
        state.updateDataSource(ds.id, ds);
      } else {
        state.addDataSource(ds);
      }
    });
    return dataSources;
  }

  async delete(id: string): Promise<void> {
    useDataStore.getState().deleteDataSource(id);
  }

  async deleteAll(ids: string[]): Promise<void> {
    ids.forEach((id) => {
      useDataStore.getState().deleteDataSource(id);
    });
  }

  async clear(): Promise<void> {
    const state = useDataStore.getState();
    const allIds = state.dataSources.map((ds) => ds.id);
    allIds.forEach((id) => {
      state.deleteDataSource(id);
    });
  }
}
