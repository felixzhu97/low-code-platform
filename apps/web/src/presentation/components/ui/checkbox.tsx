"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import styled from "@emotion/styled"
import { Check } from "lucide-react"

const StyledCheckbox = styled(CheckboxPrimitive.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--primary));
  background-color: transparent;
  transition: all 0.2s;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &[data-state="checked"] {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledIndicator = styled(CheckboxPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: currentColor;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledCheckbox ref={ref} className={className} {...props}>
    <StyledIndicator>
      <Check size={12} />
    </StyledIndicator>
  </StyledCheckbox>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }