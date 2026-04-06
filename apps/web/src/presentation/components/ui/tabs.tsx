"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

const Tabs = TabsPrimitive.Root

const StyledTabsList = styled(TabsPrimitive.List)`
  display: inline-flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: hsl(var(--muted));
  padding: 0.25rem;
  color: hsl(var(--muted-foreground));
`

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <StyledTabsList ref={ref} className={className} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const StyledTabsTrigger = styled(TabsPrimitive.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  color: inherit;
  background-color: transparent;
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

  &[data-state="active"] {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <StyledTabsTrigger ref={ref} className={className} {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const StyledTabsContent = styled(TabsPrimitive.Content)`
  margin-top: 0.5rem;
  outline: none;

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
`

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <StyledTabsContent ref={ref} className={className} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }