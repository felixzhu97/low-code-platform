/**
 * 数据源实体
 * 表示低代码平台中的数据源配置
 */
export interface DataSource {
  id: string;
  name: string;
  type: "static" | "api" | "database" | "file" | "websocket";
  data: any;
  config?: DataSourceConfig;
  lastUpdated?: string;
  status?: "active" | "inactive" | "error";
  error?: string;
}

