"use client"

import { useTheme } from "next-themes"
import styled from "@emotion/styled";
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const ToasterWrapper = styled(SonnerToaster)`
  &.toaster {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    border: 1px solid hsl(var(--border));
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  & .toast {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    border: 1px solid hsl(var(--border));
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  & .description {
    color: hsl(var(--muted-foreground));
  }

  & .actionButton {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  & .cancelButton {
    background-color: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
  }
`

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <ToasterWrapper
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
