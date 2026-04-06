"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`
const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const StyledPopoverContent = styled(PopoverPrimitive.Content)`
  z-index: 50;
  width: 18rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  outline: none;
  animation: ${fadeIn} 0.15s ease-out, ${zoomIn} 0.15s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }
`

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <StyledPopoverContent
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={className}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }