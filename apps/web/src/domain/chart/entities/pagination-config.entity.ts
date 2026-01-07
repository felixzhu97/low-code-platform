/**
 * 分页配置实体
 * 表示分页组件的配置信息
 */
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

