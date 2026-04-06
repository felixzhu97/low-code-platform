"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { Check, ChevronRight, Circle } from "lucide-react"

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`
const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const StyledSubContent = styled(ContextMenuPrimitive.SubContent)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.15s ease-out, ${zoomIn} 0.15s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }
`

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <StyledSubContent ref={ref} className={className} {...props} />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const StyledSubTrigger = styled(ContextMenuPrimitive.SubTrigger)<{ inset?: boolean }>`
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;

  ${(p) => p.inset && "padding-left: 2rem;"}

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-state="open"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  svg:last-child {
    margin-left: auto;
    width: 1rem;
    height: 1rem;
  }
`

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <StyledSubTrigger ref={ref} inset={inset} className={className} {...props}>
    {children}
    <ChevronRight size={16} />
  </StyledSubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const StyledContent = styled(ContextMenuPrimitive.Content)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.15s ease-out, ${zoomIn} 0.15s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }
`

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPortal>
    <StyledContent ref={ref} className={className} {...props} />
  </ContextMenuPortal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const StyledItem = styled(ContextMenuPrimitive.Item)<{ inset?: boolean }>`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;

  ${(p) => p.inset && "padding-left: 2rem;"}

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <StyledItem ref={ref} inset={inset} className={className} {...props} />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const StyledCheckboxItem = styled(ContextMenuPrimitive.CheckboxItem)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  padding-left: 2rem;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  > span:first-child {
    position: absolute;
    left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.875rem;
    height: 0.875rem;
    svg { width: 1rem; height: 1rem; }
  }
`

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <StyledCheckboxItem ref={ref} checked={checked} className={className} {...props}>
    <span>
      <ContextMenuPrimitive.ItemIndicator>
        <Check size={16} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledCheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const StyledRadioItem = styled(ContextMenuPrimitive.RadioItem)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  padding-left: 2rem;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  > span:first-child {
    position: absolute;
    left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.875rem;
    height: 0.875rem;
    svg { width: 0.5rem; height: 0.5rem; fill: currentColor; }
  }
`

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <StyledRadioItem ref={ref} className={className} {...props}>
    <span>
      <ContextMenuPrimitive.ItemIndicator>
        <Circle />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledRadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const StyledLabel = styled(ContextMenuPrimitive.Label)<{ inset?: boolean }>`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  ${(p) => p.inset && "padding-left: 2rem;"}
`

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <StyledLabel ref={ref} inset={inset} className={className} {...props} />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const StyledSeparator = styled(ContextMenuPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--border));
`

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <StyledSeparator ref={ref} className={className} {...props} />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const StyledShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground));
`

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <StyledShortcut className={className} {...props} />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel,
  ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup,
  ContextMenuPortal, ContextMenuSub, ContextMenuSubContent,
  ContextMenuSubTrigger, ContextMenuRadioGroup,
}