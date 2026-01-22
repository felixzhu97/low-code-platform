"use client";

import * as React from "react";
import { Separator } from "./separator";
import { cn } from "../../../application/services/utils";

interface ToolbarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof Separator> {
  /**
   * 分隔符方向
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";
}

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  ToolbarSeparatorProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      orientation={orientation}
      className={cn(
        orientation === "vertical" ? "h-6 w-px mx-1" : "h-px w-full my-1",
        className
      )}
      {...props}
    />
  );
});
ToolbarSeparator.displayName = "ToolbarSeparator";

export { ToolbarSeparator, type ToolbarSeparatorProps };
