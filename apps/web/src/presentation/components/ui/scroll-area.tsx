"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import styled from "@emotion/styled"

const StyledScrollAreaRoot = styled(ScrollAreaPrimitive.Root)`
  position: relative;
  overflow: hidden;
`

const StyledScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)`
  height: 100%;
  width: 100%;
  border-radius: inherit;
`

const StyledScrollAreaScrollbar = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)`
  display: flex;
  touch-action: none;
  user-select: none;
  transition: background-color 0.2s ease-in-out;
  padding: 1px;

  &[data-orientation="vertical"] {
    height: 100%;
    width: 0.625rem;
    border-left: 1px solid transparent;
  }

  &[data-orientation="horizontal"] {
    height: 0.625rem;
    flex-direction: column;
    border-top: 1px solid transparent;
  }
`

const StyledScrollAreaThumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  position: relative;
  flex: 1;
  border-radius: 9999px;
  background-color: hsl(var(--border));
`

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  preview?: boolean;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, preview, ...props }, ref) => (
  <StyledScrollAreaRoot
    ref={ref}
    className={className}
    data-preview={preview}
    {...props}
  >
    <StyledScrollAreaViewport>{children}</StyledScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </StyledScrollAreaRoot>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <StyledScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={className}
    {...props}
  >
    <StyledScrollAreaThumb />
  </StyledScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }