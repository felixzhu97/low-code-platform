"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import styled from "@emotion/styled"
import { ChevronDown } from "lucide-react"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <StyledNav ref={ref} className={className} {...props}>
    {children}
  </StyledNav>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const StyledNav = styled(NavigationMenuPrimitive.Root)`
  position: relative;
  z-index: 10;
  display: flex;
  max-width: max-content;
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledNavList = styled(NavigationMenuPrimitive.List)`
  display: flex;
  flex: 1;
  list-style: none;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <StyledNavList ref={ref} className={className} {...props} />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const StyledNavTrigger = styled(NavigationMenuPrimitive.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  max-width: max-content;
  border-radius: var(--radius);
  background-color: hsl(var(--background));
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    outline: none;
  }

  &[data-active] {
    background-color: hsl(var(--accent) / 0.5);
  }

  &[data-state="open"] {
    background-color: hsl(var(--accent) / 0.5);
  }

  svg {
    position: relative;
    top: 1px;
    margin-left: 0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    transition: transform 0.2s;
  }

  &[data-state="open"] svg {
    transform: rotate(180deg);
  }
`

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <StyledNavTrigger ref={ref} className={className} {...props}>
    {children} <ChevronDown size={12} aria-hidden />
  </StyledNavTrigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const StyledNavContent = styled(NavigationMenuPrimitive.Content)`
  left: 0;
  top: 0;
  w-full;
  position: absolute;
  display: flex;
  justify-content: center;

  &[data-motion="from-start"] {
    animation: fadeIn 0.2s ease-out;
  }
  &[data-motion="from-end"] {
    animation: fadeIn 0.2s ease-out;
  }
  &[data-motion="to-start"] {
    animation: fadeOut 0.2s ease-out;
  }
  &[data-motion="to-end"] {
    animation: fadeOut 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(0); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @media (min-width: 768px) {
    position: absolute;
    width: auto;
  }
`

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <StyledNavContent ref={ref} className={className} {...props} />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const StyledViewport = styled.div`
  position: relative;
  left: 0;
  top: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.375rem;
`

const StyledViewportInner = styled(NavigationMenuPrimitive.Viewport)`
  position: relative;
  margin-top: 0.375rem;
  height: var(--radix-navigation-menu-viewport-height, 400px);
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: width 0.3s, height 0.3s;

  @media (min-width: 768px) {
    width: var(--radix-navigation-menu-viewport-width);
  }
`

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <StyledViewport>
    <StyledViewportInner ref={ref} className={className} {...props} />
  </StyledViewport>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const StyledIndicator = styled(NavigationMenuPrimitive.Indicator)`
  top: 100%;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  height: 0.625rem;
`

const StyledIndicatorDot = styled.div`
  position: relative;
  top: 60%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.125rem;
  background-color: hsl(var(--border));
  transform: rotate(45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <StyledIndicator ref={ref} className={className} {...props}>
    <StyledIndicatorDot />
  </StyledIndicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

export {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink,
  NavigationMenuIndicator, NavigationMenuViewport,
}