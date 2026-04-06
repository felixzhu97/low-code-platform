"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

const StyledOverlay = styled(DrawerPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <StyledOverlay ref={ref} className={className} {...props} />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const StyledContent = styled(DrawerPrimitive.Content)`
  position: fixed;
  inset-x: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: auto;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  margin-top: 1.5rem;

  &[data-scale-background="true"] {
    border-radius: 0.5rem 0.5rem 0 0;
  }
`

const StyledContentHandle = styled.div`
  margin: 0.5rem auto;
  width: 5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: hsl(var(--muted));
`

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <StyledContent ref={ref} className={className} {...props}>
      <StyledContentHandle />
      {children}
    </StyledContent>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const StyledHeader = styled.div`
  display: grid;
  gap: 0.375rem;
  padding: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledHeader className={className} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const StyledFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledFooter className={className} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={className}
    css={css`
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.025em;
    `}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={className}
    css={css`
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    `}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger,
  DrawerClose, DrawerContent, DrawerHeader, DrawerFooter,
  DrawerTitle, DrawerDescription,
}