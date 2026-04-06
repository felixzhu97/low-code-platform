"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

type ToggleVariant = "default" | "outline"
type ToggleSize = "default" | "sm" | "lg"

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: ToggleVariant
  size?: ToggleSize
}

const StyledToggle = styled(TogglePrimitive.Root)<{ variant?: ToggleVariant; size?: ToggleSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.5rem;
  border-radius: var(--radius);
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="on"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  svg {
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    flex-shrink: 0;
  }

  ${(p) => {
    if (p.variant === "outline") {
      return css`
        background-color: transparent;
        border: 1px solid hsl(var(--input));
        &:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      `
    }
    return css`
      background-color: transparent;
      &:hover {
        background-color: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
      }
    `
  }}

  ${(p) => {
    const sizeMap = {
      default: css`height: 2.5rem; padding: 0 0.75rem; min-width: 2.5rem;`,
      sm: css`height: 2.25rem; padding: 0 0.625rem; min-width: 2.25rem;`,
      lg: css`height: 2.75rem; padding: 0 1.25rem; min-width: 2.75rem;`,
    }
    return sizeMap[p.size || "default"]
  }}
`

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <StyledToggle ref={ref} className={className} variant={variant} size={size} {...props} />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle };
export type { ToggleVariant, ToggleSize };