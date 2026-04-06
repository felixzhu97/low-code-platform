"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import styled from "@emotion/styled"

const StyledPanelGroup = styled(ResizablePrimitive.PanelGroup)`
  display: flex;
  height: 100%;
  width: 100%;

  &[data-panel-group-direction="vertical"] {
    flex-direction: column;
  }
`

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <StyledPanelGroup className={className} {...props} />
)

const ResizablePanel = ResizablePrimitive.Panel

const StyledHandle = styled(ResizablePrimitive.PanelResizeHandle)<{ withHandle?: boolean }>`
  position: relative;
  display: flex;
  width: 1px;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--border));
  transition: background-color 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    transform: translateX(-50%);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &[data-panel-group-direction="vertical"] {
    width: 100%;
    height: 1px;

    &::after {
      top: 50%;
      left: 0;
      right: 0;
      width: 100%;
      height: 4px;
      transform: translateY(-50%);
    }
  }
`

const StyledHandleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1rem;
  width: 0.75rem;
  border-radius: 0.125rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--border));
  z-index: 10;

  svg {
    width: 0.625rem;
    height: 0.625rem;
  }
`

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <StyledHandle withHandle={withHandle} className={className} {...props}>
    {withHandle && (
      <StyledHandleButton>
        <GripVertical />
      </StyledHandleButton>
    )}
  </StyledHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }