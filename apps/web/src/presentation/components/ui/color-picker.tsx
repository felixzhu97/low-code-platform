"use client"

import { useState } from "react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const presetColors = [
  "#000000", "#ffffff", "#f44336", "#e91e63", "#9c27b0",
  "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
  "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b",
  "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b",
]

const ColorSwatchButton = styled.button<{ active?: boolean }>`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  cursor: pointer;
  transition: all 0.15s;
  ${(p) =>
    p.active &&
    `outline: 2px solid hsl(var(--ring)); outline-offset: 2px;`}
`

const ColorSwatchRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color)

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          css={css`
            width: 100%;
            justify-content: flex-start;
            text-align: left;
            font-weight: 400;
          `}
        >
          <ColorSwatchPreview color={localColor} />
          <span>{localColor}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <StyledPickerContent>
          <ColorPreviewBlock color={localColor} />
          <ColorInputSection>
            <Label htmlFor="color-input">颜色值</Label>
            <Input
              id="color-input"
              type="text"
              value={localColor}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </ColorInputSection>
          <ColorPresetSection>
            <Label>预设颜色</Label>
            <ColorSwatchRow>
              {presetColors.map((presetColor) => (
                <ColorSwatchButton
                  key={presetColor}
                  active={localColor === presetColor}
                  onClick={() => handleColorChange(presetColor)}
                />
              ))}
            </ColorSwatchRow>
          </ColorPresetSection>
        </StyledPickerContent>
      </PopoverContent>
    </Popover>
  )
}

const ColorSwatchPreview = styled.div<{ color: string }>`
  height: 1rem;
  width: 1rem;
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  background-color: ${(p) => p.color};
  margin-right: 0.5rem;
  flex-shrink: 0;
`

const StyledPickerContent = styled.div`
  display: grid;
  gap: 1rem;
`

const ColorPreviewBlock = styled.div<{ color: string }>`
  height: 6rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: ${(p) => p.color};
`

const ColorInputSection = styled.div`
  display: grid;
  gap: 0.5rem;
`

const ColorPresetSection = styled.div`
  display: grid;
  gap: 0.5rem;
`