import * as React from "react";
import styled from "@emotion/styled";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 5rem;
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

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <StyledTextarea className={className} ref={ref} {...props} />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };