"use client";

import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const StyledToolbar = styled.div<{ $orientation: "horizontal" | "vertical" }>`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0.125rem 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
  ${(p) =>
    p.$orientation === "vertical"
      ? css`flex-direction: column;`
      : css`flex-direction: row;`}
`;

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <StyledToolbar
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      $orientation={orientation}
      className={className}
      {...props}
    />
  )
);
Toolbar.displayName = "Toolbar";

export { Toolbar };