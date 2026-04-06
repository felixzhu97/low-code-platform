"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import styled from "@emotion/styled"

const StyledAvatar = styled(AvatarPrimitive.Root)`
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
`

const StyledAvatarImage = styled(AvatarPrimitive.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StyledAvatarFallback = styled(AvatarPrimitive.Fallback)`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: hsl(var(--muted));
`

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledAvatar ref={ref} className={className} {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <StyledAvatarImage ref={ref} className={className} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <StyledAvatarFallback ref={ref} className={className} {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }