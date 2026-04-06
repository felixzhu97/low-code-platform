"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Search } from "lucide-react"
import { Dialog, DialogContent } from "./dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <StyledCommand ref={ref} className={className} {...props} />
))
Command.displayName = CommandPrimitive.displayName

const StyledCommand = styled(CommandPrimitive)`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius);
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
`

const CommandDialogContent = styled(DialogContent)`
  overflow: hidden;
  padding: 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <CommandDialogContent>
        <Command
          css={css`
            [cmdk-group-heading] {
              padding: 0.5rem;
              font-weight: 500;
              font-size: 0.75rem;
              color: hsl(var(--muted-foreground));
            }
            [cmdk-group]:not([hidden]) ~ [cmdk-group] {
              padding-top: 0;
            }
            [cmdk-group] {
              padding: 0.25rem 0.5rem;
            }
            [cmdk-input-wrapper] svg {
              height: 1.25rem;
              width: 1.25rem;
            }
            [cmdk-input] {
              height: 3rem;
            }
            [cmdk-item] {
              padding: 0.5rem;
            }
            [cmdk-item] svg {
              height: 1.25rem;
              width: 1.25rem;
            }
          `}
        >
          {children}
        </Command>
      </CommandDialogContent>
    </Dialog>
  )
}

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid hsl(var(--border));
  padding: 0 0.75rem;

  svg {
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
    flex-shrink: 0;
    color: hsl(var(--muted-foreground));
  }
`

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <StyledInputWrapper>
    <Search size={16} />
    <CommandPrimitive.Input
      ref={ref}
      className={className}
      css={css`
        display: flex;
        height: 2.75rem;
        width: 100%;
        background: transparent;
        padding: 0.75rem 0;
        font-size: 0.875rem;
        outline: none;
        color: hsl(var(--foreground));

        &::placeholder {
          color: hsl(var(--muted-foreground));
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}
      {...props}
    />
  </StyledInputWrapper>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={className}
    css={css`
      max-height: 18.75rem;
      overflow-y: auto;
      overflow-x: hidden;
    `}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    css={css`
      padding: 1.5rem 0;
      text-align: center;
      font-size: 0.875rem;
    `}
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={className}
    css={css`
      overflow: hidden;
      padding: 0.25rem;
      color: hsl(var(--foreground));

      [cmdk-group-heading] {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: hsl(var(--muted-foreground));
      }
    `}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={className}
    css={css`
      margin: 0 -0.25rem;
      height: 1px;
      background-color: hsl(var(--border));
    `}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={className}
    css={css`
      position: relative;
      display: flex;
      cursor: default;
      gap: 0.5rem;
      user-select: none;
      align-items: center;
      border-radius: 0.25rem;
      padding: 0.375rem 0.5rem;
      font-size: 0.875rem;
      outline: none;
      cursor: pointer;

      &[data-disabled="true"] {
        pointer-events: none;
        opacity: 0.5;
      }

      &[data-selected="true"] {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      svg {
        pointer-events: none;
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }
    `}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <StyledShortcut className={className} {...props} />
)
CommandShortcut.displayName = "CommandShortcut"

const StyledShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground));
`

export {
  Command, CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandShortcut,
  CommandSeparator,
}
