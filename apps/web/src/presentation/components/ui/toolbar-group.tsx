"use client";

import * as React from "react";
import styled from "@emotion/styled";
import { ToolbarSeparator } from "./toolbar-separator";

interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  withSeparator?: boolean;
  "aria-label"?: string;
}

const StyledGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
  transition: opacity 0.2s;
`;

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, withSeparator = false, children, ...props }, ref) => (
    <>
      <StyledGroup ref={ref} className={className} {...props}>
        {children}
      </StyledGroup>
      {withSeparator && <ToolbarSeparator />}
    </>
  )
);
ToolbarGroup.displayName = "ToolbarGroup";

export { ToolbarGroup };