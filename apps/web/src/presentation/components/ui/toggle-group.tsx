"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

type ToggleGroupVariant = "default" | "outline"
type ToggleGroupSize = "default" | "sm" | "lg"

const StyledToggleGroup = styled(ToggleGroupPrimitive.Root)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`

const ToggleGroupContext = React.createContext<{
  variant?: ToggleGroupVariant
  size?: ToggleGroupSize
}>({ variant: "default", size: "default" })

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
    variant?: ToggleGroupVariant
    size?: ToggleGroupSize
  }
>(({ className, variant = "default", size = "default", children, ...props }, ref) => (
  <StyledToggleGroup ref={ref} className={className} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </StyledToggleGroup>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const baseItem = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="on"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`

const StyledToggleGroupItem = styled(ToggleGroupPrimitive.Item)<{
  variant?: ToggleGroupVariant
  size?: ToggleGroupSize
}>`
  ${baseItem}
  ${(p) =>
    p.variant === "outline"
      ? css`
          background-color: transparent;
          border: 1px solid hsl(var(--input));
          &:hover {
            background-color: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
          }
        `
      : css`
          background-color: transparent;
          &:hover {
            background-color: hsl(var(--muted));
            color: hsl(var(--muted-foreground));
          }
        `}

  ${(p) => {
    const sizeMap: Record<string, ReturnType<typeof css>> = {
      default: css`height: 2.5rem; padding: 0 0.75rem;`,
      sm: css`height: 2.25rem; padding: 0 0.625rem;`,
      lg: css`height: 2.75rem; padding: 0 1.25rem;`,
    }
    return sizeMap[p.size || "default"]
  }}
`

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    variant?: ToggleGroupVariant
    size?: ToggleGroupSize
  }
>(({ className, variant, size, children, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  return (
    <StyledToggleGroupItem
      ref={ref}
      className={className}
      variant={context.variant || variant}
      size={context.size || size}
      {...props}
    >
      {children}
    </StyledToggleGroupItem>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }