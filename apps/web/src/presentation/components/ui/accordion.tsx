"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { ChevronDown } from "lucide-react"

const Accordion = AccordionPrimitive.Root

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  border-bottom: 1px solid hsl(var(--border));
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
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
  }

  &[data-state="open"] > svg {
    transform: rotate(180deg);
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
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
  padding: 1rem 0;
  padding-top: 0;
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