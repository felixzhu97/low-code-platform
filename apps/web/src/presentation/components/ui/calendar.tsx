"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import styled from "@emotion/styled"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const StyledDayPicker = styled(DayPicker)`
  p {
    display: flex;
    flex-direction: column;
    @media (min-width: 640px) {
      flex-direction: row;
      gap: 1rem;
    }
  }

  [data-month] {
    flex: 1;
  }

  .caption {
    display: flex;
    justify-content: center;
    padding-top: 0.25rem;
    position: relative;
    align-items: center;
  }

  [data-caption-label] {
    font-size: 0.875rem;
    font-weight: 500;
  }

  nav {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  [data-nav] button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    background: transparent;
    padding: 0;
    border-radius: var(--radius);
    border: 1px solid hsl(var(--input));
    opacity: 0.5;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover { opacity: 1; }
    svg { width: 1rem; height: 1rem; }
  }

  [data-nav-prev] { position: absolute; left: 0.25rem; }
  [data-nav-next] { position: absolute; right: 0.25rem; }

  table {
    width: 100%;
    border-collapse: collapse;
    tr + tr { margin-top: 0.25rem; }
  }

  thead tr {
    display: flex;
    width: 100%;
  }

  th {
    flex: 1;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 400;
    color: hsl(var(--muted-foreground));
    padding: 0.5rem;
  }

  tbody tr {
    display: flex;
    width: 100%;
    margin-top: 0.5rem;
  }

  td {
    flex: 1;
    height: 2.25rem;
    width: 2.25rem;
    text-align: center;
    font-size: 0.875rem;
    padding: 0;
    position: relative;

    &:has([aria-selected].day-range-end) {
      border-top-right-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
    &:has([aria-selected].day-outside) {
      background-color: hsl(var(--accent) / 0.5);
    }
    &:has([aria-selected]) {
      background-color: hsl(var(--accent));
    }
    &:first-of-type:has([aria-selected]) {
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }
    &:last-of-type:has([aria-selected]) {
      border-top-right-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 2.25rem;
    padding: 0;
    font-weight: 400;
    border: none;
    background: transparent;
    border-radius: var(--radius);
    cursor: pointer;

    &[aria-selected] {
      opacity: 1;
    }

    &[data-today] {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }

    &[data-selected] {
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }

    &[disabled] {
      color: hsl(var(--muted-foreground));
      opacity: 0.5;
    }

    &[data-outside] {
      color: hsl(var(--muted-foreground));
      background-color: hsl(var(--accent) / 0.5);
    }
  }
`

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <StyledDayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      components={{
        IconLeft: () => <ChevronLeft size={16} />,
        IconRight: () => <ChevronRight size={16} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }