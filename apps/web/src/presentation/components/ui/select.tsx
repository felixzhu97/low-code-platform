"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const StyledSelectTrigger = styled(SelectPrimitive.Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &::placeholder {
    color: hsl(var(--muted-foreground));
  }

  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  > span {
    line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
  }
`

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <StyledSelectTrigger ref={ref} className={className} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} />
    </SelectPrimitive.Icon>
  </StyledSelectTrigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const StyledScrollButton = styled(SelectPrimitive.ScrollUpButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  cursor: default;

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <StyledScrollButton ref={ref} className={className} {...props}>
    <ChevronUp size={16} />
  </StyledScrollButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <StyledScrollButton ref={ref} className={className} {...props}>
    <ChevronDown size={16} />
  </StyledScrollButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const StyledSelectContent = styled(SelectPrimitive.Content)<{ position?: string }>`
  position: relative;
  z-index: 50;
  max-height: 24rem;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.15s ease-out, ${zoomIn} 0.15s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }

  ${(props) =>
    props.position === "popper" &&
    css`
      &[data-side="bottom"] {
        transform: translateY(4px);
      }
      &[data-side="left"] {
        transform: translateX(-4px);
      }
      &[data-side="right"] {
        transform: translateX(4px);
      }
      &[data-side="top"] {
        transform: translateY(-4px);
      }
    `}
`

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <StyledSelectContent
      ref={ref}
      position={position}
      className={className}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        css={css`
          padding: 0.25rem;
          ${position === "popper" &&
          css`
            height: var(--radix-select-trigger-height);
            width: 100%;
            min-width: var(--radix-select-trigger-width);
          `}
        `}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </StyledSelectContent>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const StyledSelectLabel = styled(SelectPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  padding-left: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
`

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <StyledSelectLabel ref={ref} className={className} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const StyledSelectItem = styled(SelectPrimitive.Item)`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  cursor: default;
  user-select: none;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  padding-left: 2rem;
  font-size: 0.875rem;
  outline: none;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;

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

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <StyledSelectItem ref={ref} className={className} {...props}>
    <span>
      <SelectPrimitive.ItemIndicator>
        <Check size={16} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </StyledSelectItem>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const StyledSelectSeparator = styled(SelectPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <StyledSelectSeparator ref={ref} className={className} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}