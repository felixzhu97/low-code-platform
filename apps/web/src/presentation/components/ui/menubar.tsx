"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import styled from "@emotion/styled"
import { Check, ChevronRight, Circle } from "lucide-react"

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarSub = MenubarPrimitive.Sub
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const StyledMenubar = styled(MenubarPrimitive.Root)`
  display: flex;
  align-items: center;
  height: 2.5rem;
  gap: 0.25rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0.25rem;
`

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledMenubar ref={ref} className={className} {...props} />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const StyledMenubarTrigger = styled(MenubarPrimitive.Trigger)`
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: all 0.15s;

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-state="open"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <StyledMenubarTrigger ref={ref} className={className} {...props} />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const StyledSubContent = styled(MenubarPrimitive.SubContent)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <StyledSubContent ref={ref} className={className} {...props} />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const StyledSubTrigger = styled(MenubarPrimitive.SubTrigger)<{ inset?: boolean }>`
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

  svg {
    margin-left: auto;
    width: 1rem;
    height: 1rem;
  }
`

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <StyledSubTrigger ref={ref} inset={inset} className={className} {...props}>
    {children}
    <ChevronRight size={16} />
  </StyledSubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const StyledMenubarContent = styled(MenubarPrimitive.Content)`
  z-index: 50;
  min-width: 12rem;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPortal>
    <StyledMenubarContent
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={className}
      {...props}
    />
  </MenubarPortal>
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const StyledMenubarItem = styled(MenubarPrimitive.Item)<{ inset?: boolean }>`
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

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <StyledMenubarItem ref={ref} inset={inset} className={className} {...props} />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const StyledCheckboxItem = styled(MenubarPrimitive.CheckboxItem)<{ inset?: boolean }>`
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

  > span:first-of-type {
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

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <StyledCheckboxItem ref={ref} checked={checked} className={className} {...props}>
    <span>
      <MenubarPrimitive.ItemIndicator>
        <Check size={16} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledCheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const StyledRadioItem = styled(MenubarPrimitive.RadioItem)<{ inset?: boolean }>`
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

  > span:first-of-type {
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

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <StyledRadioItem ref={ref} className={className} {...props}>
    <span>
      <MenubarPrimitive.ItemIndicator>
        <Circle />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </StyledRadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const StyledMenubarLabel = styled(MenubarPrimitive.Label)<{ inset?: boolean }>`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  ${(p) => p.inset && "padding-left: 2rem;"}
`

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <StyledMenubarLabel ref={ref} inset={inset} className={className} {...props} />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const StyledMenubarSeparator = styled(MenubarPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <StyledMenubarSeparator ref={ref} className={className} {...props} />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const StyledMenubarShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground));
`

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <StyledMenubarShortcut className={className} {...props} />
)
MenubarShortcut.displayName = "MenubarShortcut"

export {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarLabel,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem,
  MenubarPortal, MenubarSubContent, MenubarSubTrigger,
  MenubarGroup, MenubarSub, MenubarShortcut,
}