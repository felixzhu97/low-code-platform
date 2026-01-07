/**
 * 树节点实体
 * 表示树形组件的节点配置
 */
export interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
  icon?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

