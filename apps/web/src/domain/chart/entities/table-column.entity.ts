/**
 * 表格列配置实体
 * 表示数据表格组件的列配置
 */
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: string;
}

