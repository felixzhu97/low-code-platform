import type { DataMapping } from "@/data/types";

export interface Component {
  id: string;
  type: string;
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties?: Record<string, any>;
  children?: (Component | string)[];
  parentId?: string | null;
  dataSource?: string | null;
  dataMapping?: DataMapping[];
}

export interface ComponentCategory {
  id: string;
  name: string;
  /** UI supplies the icon node; keep this type free of React imports. */
  icon: unknown;
  components: {
    id: string;
    name: string;
    type: string;
    isContainer?: boolean;
  }[];
}

export type ComponentEventHandler = (component: Component | null) => void;
export type ComponentUpdateHandler = (id: string, properties: any) => void;
export type ComponentsUpdateHandler = (components: Component[]) => void;
