"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { X } from "lucide-react"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const overlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
  transition: opacity 0.2s ease-out;
`

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)`
  ${overlayStyles}
  &[data-state="closed"] {
    opacity: 0;
  }
  &[data-state="open"] {
    opacity: 1;
  }
`

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <StyledDialogOverlay ref={ref} className={className} {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const contentStyles = css`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  gap: 1rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  border-radius: 0.5rem;

  @media (min-width: 640px) {
    border-radius: 0.5rem;
  }
`

const StyledDialogContent = styled(DialogPrimitive.Content)`
  ${contentStyles}
  &[data-state="closed"] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  &[data-state="open"] {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`

const CloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: hsl(var(--foreground));

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="open"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--muted-foreground));
  }
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <StyledDialogContent ref={ref} className={className} {...props}>
      {children}
      <CloseButton>
        <X size={16} />
        <VisuallyHidden>Close</VisuallyHidden>
      </CloseButton>
    </StyledDialogContent>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const StyledDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledDialogHeader className={className} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const StyledDialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  margin-top: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0;
  }
`

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledDialogFooter className={className} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const StyledDialogTitle = styled(DialogPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
`

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <StyledDialogTitle ref={ref} className={className} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const StyledDialogDescription = styled(DialogPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <StyledDialogDescription ref={ref} className={className} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
