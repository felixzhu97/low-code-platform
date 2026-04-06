"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { X } from "lucide-react"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideInFromRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`

const slideInFromTop = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`

const slideInFromBottom = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const StyledSheetOverlay = styled(SheetPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.2s ease-out;

  &[data-state="closed"] {
    animation: none;
    opacity: 0;
  }
`

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <StyledSheetOverlay ref={ref} className={className} {...props} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

type SheetSide = "top" | "bottom" | "left" | "right"

const getSideStyles = (side: SheetSide) => {
  const base = css`
    position: fixed;
    z-index: 50;
    gap: 1rem;
    background-color: hsl(var(--background));
    padding: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
  `

  const sides = {
    top: css`
      top: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid hsl(var(--border));
      animation: ${slideInFromTop} 0.3s ease-out;

      &[data-state="closed"] {
        transform: translateY(-100%);
      }
    `,
    bottom: css`
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid hsl(var(--border));
      animation: ${slideInFromBottom} 0.3s ease-out;

      &[data-state="closed"] {
        transform: translateY(100%);
      }
    `,
    left: css`
      top: 0;
      left: 0;
      height: 100%;
      width: 75%;
      max-width: 24rem;
      border-right: 1px solid hsl(var(--border));
      animation: ${slideInFromLeft} 0.3s ease-out;

      &[data-state="closed"] {
        transform: translateX(-100%);
      }
    `,
    right: css`
      top: 0;
      right: 0;
      height: 100%;
      width: 75%;
      max-width: 24rem;
      border-left: 1px solid hsl(var(--border));
      animation: ${slideInFromRight} 0.3s ease-out;

      &[data-state="closed"] {
        transform: translateX(100%);
      }
    `,
  }

  return css`
    ${base}
    ${sides[side]}
  `
}

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: SheetSide
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={className}
      css={getSideStyles(side)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        css={css`
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
            background-color: hsl(var(--secondary));
          }

          svg {
            width: 1rem;
            height: 1rem;
          }
        `}
      >
        <X size={16} />
        <span css={css`position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;`}>Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const StyledSheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledSheetHeader className={className} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const StyledSheetFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  margin-top: auto;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledSheetFooter className={className} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const StyledSheetTitle = styled(SheetPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(var(--foreground));
`

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <StyledSheetTitle ref={ref} className={className} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const StyledSheetDescription = styled(SheetPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <StyledSheetDescription ref={ref} className={className} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}