"use client";

import * as React from "react";
import styled from "@emotion/styled";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const StyledSeparator = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background-color: hsl(var(--border));

  &[data-orientation="vertical"] {
    height: 1.5rem;
    width: 1px;
    margin: 0 0.25rem;
  }

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
    margin: 0.25rem 0;
  }
`;

interface ToolbarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  orientation?: "horizontal" | "vertical";
}

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  ToolbarSeparatorProps
>(({ className, orientation = "vertical", decorative = true, ...props }, ref) => {
  return (
    <StyledSeparator
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={className}
      {...props}
    />
  );
});
ToolbarSeparator.displayName = "ToolbarSeparator";

export { ToolbarSeparator };