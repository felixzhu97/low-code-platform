import * as React from "react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

const StyledBreadcrumbNav = styled.nav`
  display: contents;
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

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & { separator?: React.ReactNode }
>(({ ...props }, ref) => <StyledBreadcrumbNav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const StyledBreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  list-style: none;

  @media (min-width: 640px) {
    gap: 0.625rem;
  }
`

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <StyledBreadcrumbList ref={ref} className={className} {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

const StyledBreadcrumbItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <StyledBreadcrumbItem ref={ref} className={className} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const StyledBreadcrumbLink = styled.a<{ asChild?: boolean }>`
  color: hsl(var(--foreground));
  transition: color 0.2s;
  &:hover { color: hsl(var(--foreground)); }
`

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"
  return <StyledBreadcrumbLink as={Comp} ref={ref} className={className} {...props} />
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const StyledBreadcrumbPage = styled.span`
  font-weight: 400;
  color: hsl(var(--foreground));
`

const StyledBreadcrumbSeparator = styled.li`
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`

const StyledBreadcrumbEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;
`

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <StyledBreadcrumbPage
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={className}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <StyledBreadcrumbSeparator
    role="presentation"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {children ?? <ChevronRight size={14} />}
  </StyledBreadcrumbSeparator>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <StyledBreadcrumbEllipsis
    role="presentation"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <MoreHorizontal size={16} />
    <VisuallyHidden>More</VisuallyHidden>
  </StyledBreadcrumbEllipsis>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}