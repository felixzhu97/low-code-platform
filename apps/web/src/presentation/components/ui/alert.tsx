import * as React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

type AlertVariant = "default" | "destructive"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <StyledAlert
      ref={ref}
      role="alert"
      variant={variant}
      className={className}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const StyledAlert = styled.div<{ variant: AlertVariant }>`
  position: relative;
  width: 100%;
  border-radius: var(--radius);
  padding: 1rem;
  ${(p) =>
    p.variant === "destructive"
      ? css`
          border: 1px solid hsl(var(--destructive) / 0.5);
          color: hsl(var(--destructive));
          svg { color: hsl(var(--destructive)); }
        `
      : css`
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        `}

  > svg {
    position: absolute;
    left: 1rem;
    top: 1rem;
    width: 1rem;
    height: 1rem;
  }

  /* sibling selector: icon ~ following sibling */
  &[data-has-icon="true"] {
    padding-left: 2.5rem;
  }
`

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <StyledAlertTitle ref={ref} className={className} {...props} />
))
AlertTitle.displayName = "AlertTitle"

const StyledAlertTitle = styled.h5`
  margin-bottom: 0.25rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.025em;
`

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <StyledAlertDescription ref={ref} className={className} {...props} />
))
AlertDescription.displayName = "AlertDescription"

const StyledAlertDescription = styled.div`
  font-size: 0.875rem;

  p {
    line-height: 1.625;
  }
`

export { Alert, AlertTitle, AlertDescription }