import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variants = {
  default: css`
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    &:hover { background-color: hsl(var(--primary) / 0.9); }
  `,
  destructive: css`
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    &:hover { background-color: hsl(var(--destructive) / 0.9); }
  `,
  outline: css`
    border: 1px solid hsl(var(--input));
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    &:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `,
  secondary: css`
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    &:hover { background-color: hsl(var(--secondary) / 0.8); }
  `,
  ghost: css`
    background-color: transparent;
    color: hsl(var(--foreground));
    &:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `,
  link: css`
    background-color: transparent;
    color: hsl(var(--primary));
    text-decoration: underline;
    text-underline-offset: 4px;
    &:hover { text-decoration: underline; }
  `,
};

const sizes = {
  default: css`height: 2.5rem; padding: 0.5rem 1rem;`,
  sm: css`
    height: 2rem;
    min-height: 2rem;
    padding: 0 0.5rem;
    border-radius: calc(var(--radius) - 2px);
    font-size: 0.75rem;
    line-height: 1rem;
    gap: 0.375rem;
    & svg {
      width: 0.875rem;
      height: 0.875rem;
    }
  `,
  lg: css`height: 2.75rem; padding: 0 2rem; border-radius: calc(var(--radius) - 2px);`,
  icon: css`height: 2.5rem; width: 2.5rem;`,
};

const StyledButton = styled.button<{ variant: ButtonVariant; size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

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
    flex-shrink: 0;
    pointer-events: none;
  }

  ${(p) => variants[p.variant || "default"]}
  ${(p) => sizes[p.size || "default"]}
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <StyledButton
        as={Comp as React.ElementType}
        variant={variant}
        size={size}
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, variants as buttonVariants };
export type { ButtonProps, ButtonVariant, ButtonSize };