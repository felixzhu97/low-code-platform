"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const slideInFromTop = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const StyledTooltipContent = styled(TooltipPrimitive.Content)`
  z-index: 50;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.15s ease-out, ${zoomIn} 0.15s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }

  &[data-side="bottom"] {
    animation-name: ${slideInFromTop};
  }
  &[data-side="left"] {
    animation-name: ${slideInFromTop};
  }
  &[data-side="right"] {
    animation-name: ${slideInFromTop};
  }
`

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <StyledTooltipContent
    ref={ref}
    sideOffset={sideOffset}
    className={className}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }