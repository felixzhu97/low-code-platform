"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { Slot } from "@radix-ui/react-slot"
import { Dot } from "lucide-react"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={containerClassName}
    className={className}
    css={css`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      &[data-disabled] { opacity: 0.5; }
      &[data-invalid] { }
    `}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <StyledGroup ref={ref} className={className} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const StyledGroup = styled.div`
  display: flex;
  align-items: center;
`

const caretBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <StyledSlot
      ref={ref}
      className={className}
      data-active={isActive || undefined}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <StyledCaret>
          <StyledCaretInner />
        </StyledCaret>
      )}
    </StyledSlot>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const StyledSlot = styled.div<{ "data-active"?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-top: 1px solid hsl(var(--input));
  border-right: 1px solid hsl(var(--input));
  border-bottom: 1px solid hsl(var(--input));
  font-size: 0.875rem;
  transition: all 0.15s;

  &:first-of-type {
    border-left: 1px solid hsl(var(--input));
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }

  &:last-of-type {
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }

  ${(p) =>
    p["data-active"] &&
    `
    z-index: 10;
    outline: 2px solid hsl(var(--ring));
    outline-offset: -2px;
    background-color: hsl(var(--accent));
  `}
`

const StyledCaret = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const StyledCaretInner = styled.div`
  width: 1px;
  height: 1rem;
  background-color: hsl(var(--foreground));
  animation: ${caretBlink} 1s ease-in-out infinite;
`

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }