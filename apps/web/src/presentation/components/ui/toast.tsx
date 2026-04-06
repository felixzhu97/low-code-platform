"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { X } from "lucide-react"

type ToastVariant = "default" | "destructive"

const ToastProvider = ToastPrimitives.Provider

const slideInFromTop = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`
const slideInFromBottom = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`
const slideOutToRight = keyframes`
  from { transform: translateX(100%); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`
const fadeOut = keyframes`
  from { opacity: 0.8; }
  to { opacity: 0; }
`

const StyledViewport = styled(ToastPrimitives.Viewport)`
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  max-height: 100vh;
  width: 100%;
  padding: 1rem;

  @media (min-width: 640px) {
    bottom: 0;
    right: 0;
    top: auto;
    flex-direction: column;
    max-width: 28rem;
  }
`

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <StyledViewport ref={ref} className={className} {...props} />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const StyledToast = styled(ToastPrimitives.Root)<{ variant?: ToastVariant }>`
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  padding: 1rem;
  padding-right: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &[data-state="open"] {
    animation: ${slideInFromTop} 0.2s ease-out;
    @media (min-width: 640px) {
      animation: ${slideInFromBottom} 0.2s ease-out;
    }
  }

  &[data-swipe="move"] {
    transition: none;
    transform: translateX(var(--radix-toast-swipe-move-x, 0));
  }

  &[data-swipe="end"] {
    animation: ${slideOutToRight} 0.2s ease-out;
  }

  &[data-swipe="cancel"] {
    transform: translateX(0);
    transition: transform 0.2s;
  }

  ${(p) =>
    p.variant === "destructive"
      ? css`
          border: 1px solid hsl(var(--destructive));
          background-color: hsl(var(--destructive));
          color: hsl(var(--destructive-foreground));
        `
      : css`
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        `}
`

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & { variant?: ToastVariant }
>(({ className, variant = "default", ...props }, ref) => (
  <StyledToast ref={ref} variant={variant} className={className} {...props} />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <StyledAction ref={ref} className={className} {...props} />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const StyledAction = styled(ToastPrimitives.Action)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  flex-shrink: 0;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: transparent;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: hsl(var(--secondary));
  }

  &:focus {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &.destructive & {
    border-color: hsl(var(--destructive) / 0.4);
    &:hover {
      background-color: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
    }
  }
`

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <StyledClose ref={ref} className={className} toast-close="" {...props}>
    <X size={16} />
  </StyledClose>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const StyledClose = styled(ToastPrimitives.Close)`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.25rem;
  color: hsl(var(--foreground) / 0.5);
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: hsl(var(--foreground));
    opacity: 1;
  }

  &:focus {
    outline: 2px solid hsl(var(--ring));
    opacity: 1;
  }

  &[data-state="open"] & {
    opacity: 1;
  }
`

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={className}
    css={css`font-size: 0.875rem; font-weight: 600;`}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={className}
    css={css`font-size: 0.875rem; opacity: 0.9;`}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps, type ToastActionElement,
  ToastProvider, ToastViewport, Toast, ToastTitle,
  ToastDescription, ToastClose, ToastAction,
}