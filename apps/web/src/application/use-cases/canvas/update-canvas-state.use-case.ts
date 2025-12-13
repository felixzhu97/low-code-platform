import type { IStateManagementPort } from "@/application/ports";

/**
 * 更新画布状态用例
 */
export class UpdateCanvasStateUseCase {
  constructor(private readonly stateManagement: IStateManagementPort) {}

  /**
   * 设置预览模式
   */
  executeSetPreviewMode(preview: boolean): void {
    this.stateManagement.setPreviewMode(preview);
  }

  /**
   * 切换网格显示
   */
  executeToggleGrid(): void {
    this.stateManagement.toggleGrid();
  }

  /**
   * 切换网格对齐
   */
  executeToggleSnapToGrid(): void {
    this.stateManagement.toggleSnapToGrid();
  }

  /**
   * 设置视口宽度
   */
  executeSetViewportWidth(width: number): void {
    this.stateManagement.setViewportWidth(width);
  }

  /**
   * 设置活动设备
   */
  executeSetActiveDevice(device: string): void {
    this.stateManagement.setActiveDevice(device);
  }
}

