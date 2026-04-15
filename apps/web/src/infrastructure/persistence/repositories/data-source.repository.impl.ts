import type { DataSource } from "@/domain/datasource/entities/data-source.entity";
import type { IDataSourceRepository } from "@/domain/repositories/data-source.repository";
import { store } from "@/infrastructure/state-management/store";
import * as dataActions from "@/infrastructure/state-management/store/slices/data.slice";

export class DataSourceRepositoryImpl implements IDataSourceRepository {
  private getState() {
    return store.getState().data;
  }

  async findById(id: string): Promise<DataSource | null> {
    return this.getState().dataSources.find((ds) => ds.id === id) || null;
  }

  async findAll(): Promise<DataSource[]> {
    return this.getState().dataSources;
  }

  async findByType(type: DataSource["type"]): Promise<DataSource[]> {
    const dataSources = this.getState().dataSources;
    return dataSources.filter((ds) => ds.type === type);
  }

  async save(dataSource: DataSource): Promise<DataSource> {
    const state = this.getState();
    const existing = state.dataSources.find((ds) => ds.id === dataSource.id);

    if (existing) {
      store.dispatch(dataActions.updateDataSource({ id: dataSource.id, updates: dataSource }));
    } else {
      store.dispatch(dataActions.addDataSource(dataSource));
    }

    return dataSource;
  }

  async saveAll(dataSources: DataSource[]): Promise<DataSource[]> {
    dataSources.forEach((ds) => {
      const state = this.getState();
      const existing = state.dataSources.find((d) => d.id === ds.id);
      if (existing) {
        store.dispatch(dataActions.updateDataSource({ id: ds.id, updates: ds }));
      } else {
        store.dispatch(dataActions.addDataSource(ds));
      }
    });
    return dataSources;
  }

  async delete(id: string): Promise<void> {
    store.dispatch(dataActions.deleteDataSource(id));
  }

  async deleteAll(ids: string[]): Promise<void> {
    ids.forEach((id) => {
      store.dispatch(dataActions.deleteDataSource(id));
    });
  }

  async clear(): Promise<void> {
    const state = this.getState();
    const allIds = state.dataSources.map((ds) => ds.id);
    allIds.forEach((id) => {
      store.dispatch(dataActions.deleteDataSource(id));
    });
  }
}
