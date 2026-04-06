"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import styled from "@emotion/styled"

const StyledProgressRoot = styled(ProgressPrimitive.Root)`
  position: relative;
  height: 1rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: hsl(var(--secondary));
`

const StyledProgressIndicator = styled(ProgressPrimitive.Indicator)`
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: hsl(var(--primary));
  transition: transform 0.2s ease-in-out;
`

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <StyledProgressRoot ref={ref} className={className} {...props}>
    <StyledProgressIndicator
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </StyledProgressRoot>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }