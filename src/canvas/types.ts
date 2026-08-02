import type { Component } from "@/component/types";

export interface CanvasState {
  components: Component[];
  selectedId: string | null;
}
