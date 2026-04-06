import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles = {
  default: css`
    border-color: transparent;
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    &:hover { background-color: hsl(var(--primary) / 0.8); }
  `,
  secondary: css`
    border-color: transparent;
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    &:hover { background-color: hsl(var(--secondary) / 0.8); }
  `,
  destructive: css`
    border-color: transparent;
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    &:hover { background-color: hsl(var(--destructive) / 0.8); }
  `,
  outline: css`
    border-color: hsl(var(--border));
    background-color: transparent;
    color: hsl(var(--foreground));
  `,
};

const StyledBadge = styled.div<{ variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  ${(p) => variantStyles[p.variant || "default"]}
`;

const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <StyledBadge variant={variant} className={className} {...props} />
);
Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps, BadgeVariant };