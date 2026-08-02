import type { Component } from "@/component/domain/types";

export interface CanvasState {
  components: Component[];
  selectedId: string | null;
}
