"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "../components/ui/use-mobile";

/**
 * 工具栏响应式 Hook
 * 根据屏幕尺寸决定是否折叠工具栏
 */
export function useToolbarResponsive() {
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  return {
    isMobile,
    isTablet,
    shouldCollapse: isMobile || isTablet,
  };
}
