"use client";

import * as React from "react";
import { cn } from "../../../application/services/utils";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 工具栏的方向
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        aria-orientation={orientation}
        className={cn(
          "flex items-center gap-1 rounded-lg border bg-background px-2 py-1 shadow-sm transition-shadow duration-200",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      />
    );
  }
);
Toolbar.displayName = "Toolbar";

export { Toolbar, type ToolbarProps };
