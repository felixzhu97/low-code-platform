/**
 * Component type definitions
 */

export interface Component {
  id: string;
  type: string;
  name: string;
  position?: { x: number; y: number };
  properties?: Record<string, unknown>;
  children?: (Component | string)[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: unknown[];
}

export interface ComponentWithChildren extends Component {
  children?: ComponentWithChildren[];
}
