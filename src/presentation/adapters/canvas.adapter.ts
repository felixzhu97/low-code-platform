import type { IStateManagementPort } from "@/application/ports";
import { UpdateCanvasStateUseCase } from "@/application/use-cases";

/**
 * 画布适配器
 * 表现层与画布用例之间的适配器
 */
export class CanvasAdapter {
  private updateCanvasStateUseCase: UpdateCanvasStateUseCase;

  constructor(stateManagement: IStateManagementPort) {
    this.updateCanvasStateUseCase = new UpdateCanvasStateUseCase(
      stateManagement
    );
  }

  /**
   * 设置预览模式
   */
  setPreviewMode(preview: boolean): void {
    this.updateCanvasStateUseCase.executeSetPreviewMode(preview);
  }

  /**
   * 切换网格显示
   */
  toggleGrid(): void {
    this.updateCanvasStateUseCase.executeToggleGrid();
  }

  /**
   * 切换网格对齐
   */
  toggleSnapToGrid(): void {
    this.updateCanvasStateUseCase.executeToggleSnapToGrid();
  }

  /**
   * 设置视口宽度
   */
  setViewportWidth(width: number): void {
    this.updateCanvasStateUseCase.executeSetViewportWidth(width);
  }

  /**
   * 设置活动设备
   */
  setActiveDevice(device: string): void {
    this.updateCanvasStateUseCase.executeSetActiveDevice(device);
  }

  /**
   * 获取画布状态
   */
  getCanvasState() {
    // 这里需要访问 stateManagement，但为了保持适配器的简洁性
    // 我们可以通过依赖注入的方式获取
    // 暂时返回一个函数，让调用者传入 stateManagement
    return (stateManagement: IStateManagementPort) => {
      return stateManagement.getCanvasState();
    };
  }
}
