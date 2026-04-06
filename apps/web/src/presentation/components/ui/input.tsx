import * as React from "react";
import styled from "@emotion/styled";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: hsl(var(--foreground));
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: hsl(var(--muted-foreground));
  }

  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[type="file"] {
    border: 0;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;

    &::file-selector-button {
      margin-right: 0.5rem;
      border: 0;
      background: transparent;
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
      cursor: pointer;
    }
  }

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <StyledInput type={type} className={className} ref={ref} {...props} />
  )
);
Input.displayName = "Input";

export { Input };