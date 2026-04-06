import * as React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const StyledSkeleton = styled.div`
  border-radius: var(--radius);
  background-color: hsl(var(--muted));
  animation: ${pulse} 2s ease-in-out infinite;
`

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <StyledSkeleton className={className} {...props} />
)

export { Skeleton }