"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { ChevronDown } from "lucide-react"

const Accordion = AccordionPrimitive.Root

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  border: none;
  border-radius: calc(var(--radius));

  & + & {
    margin-top: 0.125rem;
  }
`

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <StyledAccordionItem ref={ref} className={className} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const StyledAccordionHeader = styled(AccordionPrimitive.Header)`
  display: flex;
`

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger)`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 0.5rem;
  margin: 0 -0.5rem;
  border: none;
  border-radius: calc(var(--radius));
  background: transparent;
  box-shadow: none;
  appearance: none;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: hsl(var(--foreground));
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    text-decoration: none;
    background-color: hsl(var(--muted) / 0.5);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &[data-state="open"] {
    background-color: hsl(var(--muted) / 0.35);
  }

  &[data-state="open"] > svg {
    transform: rotate(180deg);
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: hsl(var(--muted-foreground));
    transition: transform 0.2s ease-in-out;
  }
`

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <StyledAccordionHeader>
    <StyledAccordionTrigger ref={ref} className={className} {...props}>
      {children}
      <ChevronDown size={16} />
    </StyledAccordionTrigger>
  </StyledAccordionHeader>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const StyledAccordionContent = styled(AccordionPrimitive.Content)`
  overflow: hidden;
  font-size: 0.875rem;
  transition: all 0.2s ease-out;

  &[data-state="closed"] {
    height: 0;
    opacity: 0;
  }

  &[data-state="open"] {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
`

const StyledAccordionInner = styled.div`
  padding: 0 0 0.875rem;
  padding-top: 0.25rem;
`

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <StyledAccordionContent ref={ref} className={className} {...props}>
    <StyledAccordionInner className={className}>{children}</StyledAccordionInner>
  </StyledAccordionContent>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }