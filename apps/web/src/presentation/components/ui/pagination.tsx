import * as React from "react"
import styled from "@emotion/styled"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <StyledNav className={className} role="navigation" aria-label="pagination" {...props} />
)
Pagination.displayName = "Pagination"

const StyledNav = styled.nav`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  display: flex;
  justify-content: center;
`

const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
`

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <StyledUl ref={ref} className={className} {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

const StyledPaginationLink = styled.a<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  height: 2.5rem;
  padding: 0 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(p) => p.isActive ? "hsl(var(--input))" : "transparent"};
  background-color: ${(p) => p.isActive ? "hsl(var(--background))" : "transparent"};
  color: hsl(var(--foreground));

  &:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <StyledPaginationLink
      ref={ref}
      isActive={isActive}
      className={className}
      {...props}
    />
  )
)
PaginationLink.displayName = "PaginationLink"

const StyledPreviousButton = styled(StyledPaginationLink)`
  padding-left: 0.625rem;
`

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<"a">) => (
  <StyledPreviousButton
    aria-label="Go to previous page"
    className={className}
    {...props}
  >
    <ChevronLeft size={16} />
    <span>Previous</span>
  </StyledPreviousButton>
)
PaginationPrevious.displayName = "PaginationPrevious"

const StyledNextButton = styled(StyledPaginationLink)`
  padding-right: 0.625rem;
`

const PaginationNext = ({ className, ...props }: React.ComponentProps<"a">) => (
  <StyledNextButton
    aria-label="Go to next page"
    className={className}
    {...props}
  >
    <span>Next</span>
    <ChevronRight size={16} />
  </StyledNextButton>
)
PaginationNext.displayName = "PaginationNext"

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

const StyledEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <StyledEllipsis className={className} aria-hidden {...props}>
    <MoreHorizontal size={16} />
    <VisuallyHidden>More pages</VisuallyHidden>
  </StyledEllipsis>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
