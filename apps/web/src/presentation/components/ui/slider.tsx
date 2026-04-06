"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import styled from "@emotion/styled"

const StyledSliderRoot = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  touch-action: none;
  user-select: none;
  cursor: pointer;
`

const StyledSliderTrack = styled(SliderPrimitive.Track)`
  position: relative;
  height: 0.5rem;
  width: 100%;
  flex-grow: 1;
  border-radius: 9999px;
  background-color: hsl(var(--secondary));
  overflow: hidden;
`

const StyledSliderRange = styled(SliderPrimitive.Range)`
  position: absolute;
  height: 100%;
  background-color: hsl(var(--primary));
`

const StyledSliderThumb = styled(SliderPrimitive.Thumb)`
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: 2px solid hsl(var(--primary));
  background-color: hsl(var(--background));
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledSliderRoot ref={ref} className={className} {...props}>
    <StyledSliderTrack>
      <StyledSliderRange />
    </StyledSliderTrack>
    <StyledSliderThumb />
  </StyledSliderRoot>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }