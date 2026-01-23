"use client";

import * as React from "react";
import { cn } from "../../../application/services/utils";

interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否显示分隔符（在组后）
   * @default false
   */
  withSeparator?: boolean;
  /**
   * 组标签（用于可访问性）
   */
  "aria-label"?: string;
}

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, withSeparator = false, children, ...props }, ref) => {
    return (
      <>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            className
          )}
          {...props}
        >
          {children}
        </div>
        {withSeparator && (
          <div
            className="h-6 w-px bg-border mx-1"
            role="separator"
            aria-orientation="vertical"
          />
        )}
      </>
    );
  }
);
ToolbarGroup.displayName = "ToolbarGroup";

export { ToolbarGroup, type ToolbarGroupProps };
