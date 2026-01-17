/**
 * 懒加载工具
 */

/**
 * 懒加载配置
 */
export interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * 懒加载图像
 *
 * @param element - 图像元素
 * @param src - 图像 URL
 * @param options - Intersection Observer 选项
 * @returns 清理函数
 */
export function lazyLoadImage(
  element: HTMLImageElement,
  src: string,
  options: LazyLoadOptions = {}
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.src = src;
          observer.unobserve(element);
        }
      });
    },
    {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? "0px",
      threshold: options.threshold ?? 0.1,
    }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}

/**
 * 懒加载回调函数类型
 */
export type LazyLoadCallback = () => void | Promise<void>;

/**
 * 创建懒加载观察器
 *
 * @param element - 要观察的元素
 * @param callback - 进入视口时的回调
 * @param options - Intersection Observer 选项
 * @returns 清理函数
 */
export function createLazyLoadObserver(
  element: Element,
  callback: LazyLoadCallback,
  options: LazyLoadOptions = {}
): () => void {
  const observer = new IntersectionObserver(
    async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await callback();
          observer.unobserve(element);
        }
      });
    },
    {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? "0px",
      threshold: options.threshold ?? 0.1,
    }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}
