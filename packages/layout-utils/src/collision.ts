/**
 * 矩形接口
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 组件边界接口
 */
export interface ComponentBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 检测两个矩形是否碰撞
 *
 * @param rect1 - 第一个矩形
 * @param rect2 - 第二个矩形
 * @returns 是否碰撞
 */
export function detectCollision(rect1: Rectangle, rect2: Rectangle): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

/**
 * 检测组件是否在区域内
 *
 * @param component - 组件边界
 * @param area - 区域边界
 * @returns 是否在区域内
 */
export function isInArea(
  component: ComponentBounds,
  area: Rectangle
): boolean {
  return (
    component.x >= area.x &&
    component.y >= area.y &&
    component.x + component.width <= area.x + area.width &&
    component.y + component.height <= area.y + area.height
  );
}

/**
 * 获取两个矩形的重叠区域
 *
 * @param rect1 - 第一个矩形
 * @param rect2 - 第二个矩形
 * @returns 重叠区域（如果没有重叠则返回 null）
 */
export function getOverlap(
  rect1: Rectangle,
  rect2: Rectangle
): Rectangle | null {
  if (!detectCollision(rect1, rect2)) {
    return null;
  }

  const x = Math.max(rect1.x, rect2.x);
  const y = Math.max(rect1.y, rect2.y);
  const width =
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - x;
  const height =
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - y;

  return { x, y, width, height };
}

/**
 * 获取矩形中心点
 *
 * @param rect - 矩形
 * @returns 中心点坐标
 */
export function getCenter(rect: Rectangle): { x: number; y: number } {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * 计算两个矩形之间的距离
 *
 * @param rect1 - 第一个矩形
 * @param rect2 - 第二个矩形
 * @returns 距离
 */
export function getDistance(rect1: Rectangle, rect2: Rectangle): number {
  const center1 = getCenter(rect1);
  const center2 = getCenter(rect2);
  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
