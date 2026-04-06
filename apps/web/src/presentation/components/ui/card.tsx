import * as React from "react";
import styled from "@emotion/styled";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <StyledCard ref={ref} className={className} {...props} />
  )
);
Card.displayName = "Card";

const StyledCard = styled.div`
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <StyledCardHeader ref={ref} className={className} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem;
`;

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <StyledCardTitle ref={ref} className={className} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const StyledCardTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
`;

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <StyledCardDescription ref={ref} className={className} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const StyledCardDescription = styled.div`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <StyledCardContent ref={ref} className={className} {...props} />
  )
);
CardContent.displayName = "CardContent";

const StyledCardContent = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`;

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <StyledCardFooter ref={ref} className={className} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
`;

export {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent
};