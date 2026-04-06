"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { Check, ChevronRight, Circle } from "lucide-react"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const contentStyles = css`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.25rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
`

const StyledDropdownMenuContent = styled(DropdownMenuPrimitive.Content)`
  ${contentStyles}
  &[data-state="closed"] {
    opacity: 0;
    transform: scale(0.95);
  }
  &[data-state="open"] {
    opacity: 1;
    transform: scale(1);
  }
  &[data-side="bottom"] {
    animation: slideInFromTop 0.15s ease-out;
  }
  &[data-side="top"] {
    animation: slideInFromBottom 0.15s ease-out;
  }

  @keyframes slideInFromTop {
    from {
      transform: translateY(-8px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideInFromBottom {
    from {
      transform: translateY(8px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <StyledDropdownMenuContent
      ref={ref}
      sideOffset={sideOffset}
      className={className}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const itemStyles = css`
  display: flex;
  cursor: default;
  gap: 0.5rem;
  align-items: center;
  user-select: none;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
  color: inherit;
  outline: none;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  cursor: pointer;
  position: relative;

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    pointer-events: none;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`

const StyledDropdownMenuItem = styled(DropdownMenuPrimitive.Item)`
  ${itemStyles}
`

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <StyledDropdownMenuItem
    ref={ref}
    className={className}
    css={inset ? css`
      padding-left: 2rem;
    ` : undefined}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const StyledDropdownMenuCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem)`
  ${itemStyles}
  padding-left: 2rem;
`

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <StyledDropdownMenuCheckboxItem
    ref={ref}
    className={className}
    checked={checked}
    {...props}
  >
    <span style={{
      position: "absolute",
      left: "0.5rem",
      display: "flex",
      height: "0.875rem",
      width: "0.875rem",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={16} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledDropdownMenuCheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const StyledDropdownMenuRadioItem = styled(DropdownMenuPrimitive.RadioItem)`
  ${itemStyles}
  padding-left: 2rem;
`

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <StyledDropdownMenuRadioItem
    ref={ref}
    className={className}
    {...props}
  >
    <span style={{
      position: "absolute",
      left: "0.5rem",
      display: "flex",
      height: "0.875rem",
      width: "0.875rem",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle size={8} style={{ fill: "currentColor" }} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledDropdownMenuRadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const StyledDropdownMenuLabel = styled(DropdownMenuPrimitive.Label)`
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: inherit;
`

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <StyledDropdownMenuLabel
    ref={ref}
    className={className}
    css={inset ? css`
      padding-left: 2rem;
    ` : undefined}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const StyledDropdownMenuSeparator = styled(DropdownMenuPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <StyledDropdownMenuSeparator ref={ref} className={className} {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const StyledDropdownMenuShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  opacity: 0.6;
`

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <StyledDropdownMenuShortcut className={className} {...props} />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={className}
    css={css`
      display: flex;
      cursor: default;
      gap: 0.5rem;
      align-items: center;
      border-radius: 0.25rem;
      padding: 0.375rem 0.5rem;
      font-size: 0.875rem;
      outline: none;
      cursor: pointer;
      svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        pointer-events: none;
      }
      &[data-state="open"] {
        background-color: hsl(var(--accent));
      }
      ${inset ? css`padding-left: 2rem;` : ''}
    `}
    {...props}
  >
    {children}
    <ChevronRight size={16} style={{ marginLeft: "auto" }} />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={className}
    css={css`
      ${contentStyles}
      margin-left: 0.25rem;
    `}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}