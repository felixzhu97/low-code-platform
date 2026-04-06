"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import styled from "@emotion/styled"

const StyledSwitch = styled(SwitchPrimitive.Root)`
  display: inline-flex;
  align-items: center;
  height: 1.5rem;
  width: 2.75rem;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: background-color 0.2s;
  background-color: hsl(var(--input));

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &[data-state="checked"] {
    background-color: hsl(var(--primary));
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledThumb = styled(SwitchPrimitive.Thumb)`
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: hsl(var(--background));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  transform: translateX(0);

  &[data-state="checked"] {
    transform: translateX(1.25rem);
  }
`

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledSwitch ref={ref} className={className} {...props}>
    <StyledThumb />
  </StyledSwitch>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }