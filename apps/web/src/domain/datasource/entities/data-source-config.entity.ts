/**
 * 数据源配置实体
 * 包含不同类型数据源的具体配置信息
 */
export interface DataSourceConfig {
  // API配置
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  retryCount?: number;

  // 数据库配置
  connectionString?: string;
  query?: string;
  table?: string;

  // 文件配置
  fileType?: "json" | "csv" | "xml";
  filePath?: string;

  // WebSocket配置
  wsUrl?: string;
  protocols?: string[];

  // 通用配置
  refreshInterval?: number; // 自动刷新间隔（秒）
  cacheEnabled?: boolean;
  cacheTTL?: number; // 缓存生存时间（秒）
}

