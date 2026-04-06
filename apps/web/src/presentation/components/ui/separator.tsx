"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import styled from "@emotion/styled"

const StyledSeparator = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background-color: hsl(var(--border));

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    width: 1px;
  }
`

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <StyledSeparator
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={className}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }