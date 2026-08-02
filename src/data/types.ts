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

export interface DataSourceConfig {
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  retryCount?: number;
  connectionString?: string;
  query?: string;
  table?: string;
  fileType?: "json" | "csv" | "xml";
  filePath?: string;
  wsUrl?: string;
  protocols?: string[];
  refreshInterval?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface DataMapping {
  field: string;
  sourcePath: string;
  targetPath: string;
  transform?: "string" | "number" | "boolean" | "date" | "json";
  defaultValue?: any;
}

export interface DataField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  path: string;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: string;
}

export interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
  icon?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}
