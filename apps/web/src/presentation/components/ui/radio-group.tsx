"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import styled from "@emotion/styled"
import { Circle } from "lucide-react"

const StyledRadioGroup = styled(RadioGroupPrimitive.Root)`
  display: grid;
  gap: 0.5rem;
`

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledRadioGroup ref={ref} className={className} {...props} />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const StyledRadioItem = styled(RadioGroupPrimitive.Item)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  border: 1px solid hsl(var(--primary));
  background-color: transparent;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &[data-state="checked"] {
    color: hsl(var(--primary));
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledIndicator = styled(RadioGroupPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    width: 0.625rem;
    height: 0.625rem;
    fill: currentColor;
  }
`

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <StyledRadioItem ref={ref} className={className} {...props}>
    <StyledIndicator>
      <Circle />
    </StyledIndicator>
  </StyledRadioItem>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }