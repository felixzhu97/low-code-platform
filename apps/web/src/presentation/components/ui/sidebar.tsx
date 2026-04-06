"use client";

import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "../../hooks/use-mobile";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Sheet, SheetContent } from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <SidebarProviderWrapper
            ref={ref}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={className}
            data-has-inset={undefined}
            {...props}
          >
            {children}
          </SidebarProviderWrapper>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

const SidebarProviderWrapper = styled.div<{ "data-has-inset"?: boolean }>`
  display: flex;
  min-height: 100svh;
  width: 100%;
  ${(props) =>
    props["data-has-inset"] !== undefined &&
    css`
      background-color: hsl(var(--sidebar));
    `}
`;

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <SidebarWrapper
          ref={ref}
          className={className}
          style={{ width: "var(--sidebar-width)" }}
          data-variant={variant}
          data-side={side}
        >
          {children}
        </SidebarWrapper>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            style={{ width: "var(--sidebar-width)", padding: 0 }}
            data-variant={variant}
            side={side}
          >
            <MobileContent>{children}</MobileContent>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <SidebarDesktop
        ref={ref}
        className={className}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <SidebarGap
          data-collapsible={collapsible}
          data-variant={variant}
          data-side={side}
        />
        <SidebarFixed
          side={side}
          variant={variant}
          collapsible={collapsible}
          data-collapsible={collapsible}
          data-variant={variant}
          data-side={side}
          data-state={state}
        >
          <SidebarInner data-variant={variant}>{children}</SidebarInner>
        </SidebarFixed>
      </SidebarDesktop>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarWrapper = styled.div`
  display: flex;
  height: 100%;
  width: var(--sidebar-width);
  flex-direction: column;
  background-color: hsl(var(--sidebar));
  color: hsl(var(--sidebar-foreground));
`;

const MobileContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

const SidebarDesktop = styled.div`
  position: relative;
  display: none;
  width: 100%;
  color: hsl(var(--sidebar-foreground));

  @media (min-width: 768px) {
    display: block;
  }
`;

const SidebarGap = styled.div<{
  "data-collapsible"?: string;
  "data-variant"?: string;
  "data-side"?: string;
}>`
  position: relative;
  height: 100svh;
  width: var(--sidebar-width);
  background-color: transparent;
  transition: width 0.2s ease linear;
  flex-shrink: 0;

  ${(props) =>
    props["data-side"] === "right" &&
    css`
      transform: rotate(180deg);
    `}

  ${(props) =>
    props["data-variant"] === "floating" || props["data-variant"] === "inset"
      ? css`
          &[data-collapsible="icon"] {
            width: calc(var(--sidebar-width-icon) + 1rem);
          }
        `
      : css`
          &[data-collapsible="icon"] {
            width: var(--sidebar-width-icon);
          }
        `}
`;

const SidebarFixed = styled.div<{
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  "data-collapsible"?: string;
  "data-variant"?: string;
  "data-side"?: string;
  "data-state"?: string;
}>`
  position: fixed;
  inset-y: 0;
  z-index: 10;
  height: 100svh;
  width: var(--sidebar-width);
  display: none;
  flex-direction: column;
  transition: left 0.2s ease linear, right 0.2s ease linear,
    width 0.2s ease linear;

  @media (min-width: 768px) {
    display: flex;
  }

  ${(props) =>
    props.side === "left"
      ? css`
          left: 0;
          &[data-collapsible="offcanvas"] {
            left: calc(var(--sidebar-width) * -1);
          }
        `
      : css`
          right: 0;
          &[data-collapsible="offcanvas"] {
            right: calc(var(--sidebar-width) * -1);
          }
        `}

  ${(props) =>
    props["data-variant"] === "floating" || props["data-variant"] === "inset"
      ? css`
          padding: 0.5rem;
          &[data-collapsible="icon"] {
            width: calc(var(--sidebar-width-icon) + 1rem + 4px);
          }
        `
      : css`
          &[data-collapsible="icon"] {
            width: var(--sidebar-width-icon);
          }
          &[data-side="left"] {
            border-right: 1px solid hsl(var(--sidebar-border));
          }
          &[data-side="right"] {
            border-left: 1px solid hsl(var(--sidebar-border));
          }
        `}
`;

const SidebarInner = styled.div<{ "data-variant"?: string }>`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  background-color: hsl(var(--sidebar));

  ${(props) =>
    props["data-variant"] === "floating" &&
    css`
      border-radius: 0.5rem;
      border: 1px solid hsl(var(--sidebar-border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    `}
`;

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      css={css`
        height: 1.75rem;
        width: 1.75rem;
      `}
      {...props}
    >
      <PanelLeft />
      <span css={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" }}>
        Toggle Sidebar
      </span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarRailButton
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={className}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarRailButton = styled.button`
  position: absolute;
  inset-y: 0;
  z-index: 20;
  width: 1rem;
  transform: translateX(-50%);
  transition: all 0.2s ease linear;
  background-color: transparent;
  display: none;
  cursor: ew-resize;

  &::after {
    content: "";
    position: absolute;
    inset-y: 0;
    left: 50%;
    width: 2px;
    background-color: transparent;
  }

  &:hover::after {
    background-color: hsl(var(--sidebar-border));
  }

  &[data-side="right"] & {
    left: 0;
  }

  @media (min-width: 640px) {
    display: flex;
  }

  &[data-collapsible="offcanvas"] {
    transform: translateX(0);
  }

  &[data-collapsible="offcanvas"]::after {
    left: 100%;
  }

  &[data-collapsible="offcanvas"]:hover {
    background-color: hsl(var(--sidebar));
  }

  &[data-side="left"][data-collapsible="offcanvas"] {
    right: -0.5rem;
  }

  &[data-side="right"][data-collapsible="offcanvas"] {
    left: -0.5rem;
  }
`;

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <SidebarInsetMain
      ref={ref}
      className={className}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInsetMain = styled.main`
  position: relative;
  display: flex;
  min-height: 100svh;
  flex: 1;
  flex-direction: column;
  background-color: hsl(var(--background));

  @media (min-width: 768px) {
    &[data-variant="inset"] {
      min-height: calc(100svh - 1rem);
      margin: 0.5rem;

      &[data-state="collapsed"][data-variant="inset"] {
        margin-left: 0.5rem;
      }
    }
  }

  @media (min-width: 768px) {
    &[data-variant="inset"] {
      margin-left: 0;
      margin-right: 0;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
  }
`;

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      css={css`
        height: 2rem;
        width: 100%;
        background-color: hsl(var(--background));
        box-shadow: none;

        &:focus-visible {
          ring: 2px;
          ring-color: hsl(var(--sidebar-ring));
        }
      `}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
      `}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
      `}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      css={css`
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        width: auto;
        background-color: hsl(var(--sidebar-border));
      `}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      css={css`
        display: flex;
        min-height: 0;
        flex: 1;
        flex-direction: column;
        gap: 0.5rem;
        overflow: auto;

        &[data-collapsible="icon"] {
          overflow: hidden;
        }
      `}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      css={css`
        position: relative;
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        padding: 0.5rem;
      `}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      css={css`
        display: flex;
        height: 2rem;
        shrink: 0;
        align-items: center;
        border-radius: 0.375rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: hsl(var(--sidebar-foreground) / 0.7);
        outline: none;
        transition: margin 0.2s ease linear, opacity 0.2s ease linear;

        &:focus-visible {
          ring: 2px;
          ring-color: hsl(var(--sidebar-ring));
        }

        svg {
          height: 1rem;
          width: 1rem;
          shrink: 0;
        }

        &[data-collapsible="icon"] {
          margin-top: -2rem;
          opacity: 0;
        }
      `}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      css={css`
        position: absolute;
        right: 0.75rem;
        top: 0.875rem;
        display: flex;
        aspect-ratio: 1;
        width: 1.25rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        padding: 0;
        background-color: transparent;
        color: hsl(var(--sidebar-foreground));
        outline: none;
        transition: transform 0.2s ease;
        box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));

        &:hover {
          background-color: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }

        &:focus-visible {
          box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));
        }

        &::after {
          content: "";
          position: absolute;
          inset: -0.5rem;

          @media (min-width: 768px) {
            display: none;
          }
        }

        &[data-collapsible="icon"] {
          display: none;
        }
      `}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    css={css`
      width: 100%;
      font-size: 0.875rem;
    `}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    css={css`
      display: flex;
      width: 100%;
      min-width: 0;
      flex-direction: column;
      gap: 0.25rem;
    `}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    css={css`
      position: relative;
    `}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <SidebarMenuButtonInner
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        variant={variant}
        size={size}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuButtonInner = styled.button<{
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  "data-active"?: boolean;
}>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  border-radius: 0.375rem;
  padding: 0.5rem;
  text-align: left;
  font-size: 0.875rem;
  outline: none;
  transition: width 0.2s ease, height 0.2s ease, padding 0.2s ease;
  box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));
  cursor: pointer;

  &:hover {
    background-color: hsl(var(--sidebar-accent));
    color: hsl(var(--sidebar-accent-foreground));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));
  }

  &:active {
    background-color: hsl(var(--sidebar-accent));
    color: hsl(var(--sidebar-accent-foreground));
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-active="true"] {
    background-color: hsl(var(--sidebar-accent));
    font-weight: 500;
    color: hsl(var(--sidebar-accent-foreground));
  }

  &[data-state="open"]:hover {
    background-color: hsl(var(--sidebar-accent));
    color: hsl(var(--sidebar-accent-foreground));
  }

  &[data-collapsible="icon"] {
    height: 2rem;
    width: 2rem;
    padding: 0.25rem;
  }

  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    height: 1rem;
    width: 1rem;
    shrink: 0;
  }

  ${(props) =>
    props.variant === "default" &&
    css`
      &:hover {
        background-color: hsl(var(--sidebar-accent));
        color: hsl(var(--sidebar-accent-foreground));
      }
    `}

  ${(props) =>
    props.variant === "outline" &&
    css`
      background-color: hsl(var(--background));
      box-shadow: 0 0 0 1px hsl(var(--sidebar-border));

      &:hover {
        background-color: hsl(var(--sidebar-accent));
        box-shadow: 0 0 0 1px hsl(var(--sidebar-accent));
      }
    `}

  ${(props) =>
    props.size === "default" &&
    css`
      height: 2rem;
      font-size: 0.875rem;
    `}

  ${(props) =>
    props.size === "sm" &&
    css`
      height: 1.75rem;
      font-size: 0.75rem;
    `}

  ${(props) =>
    props.size === "lg" &&
    css`
      height: 3rem;
      font-size: 0.875rem;

      &[data-collapsible="icon"] {
        padding: 0;
      }
    `}

  &:has([data-sidebar="menu-action"]) {
    padding-right: 2rem;
  }

  &[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      css={css`
        position: absolute;
        right: 0.25rem;
        top: 0.375rem;
        display: flex;
        aspect-ratio: 1;
        width: 1.25rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        padding: 0;
        background-color: transparent;
        color: hsl(var(--sidebar-foreground));
        outline: none;
        transition: transform 0.2s ease;
        box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));

        &:hover {
          background-color: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }

        &:focus-visible {
          box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));
        }

        &::after {
          content: "";
          position: absolute;
          inset: -0.5rem;

          @media (min-width: 768px) {
            display: none;
          }
        }

        &[data-size="sm"] {
          top: 0.25rem;
        }

        &[data-size="default"] {
          top: 0.375rem;
        }

        &[data-size="lg"] {
          top: 0.625rem;
        }

        &[data-collapsible="icon"] {
          display: none;
        }

        ${showOnHover &&
        css`
          opacity: 0;

          &:focus-within,
          :hover {
            opacity: 1;
          }

          &[data-state="open"] {
            opacity: 1;
          }

          &[data-active="true"] {
            color: hsl(var(--sidebar-accent-foreground));
          }

          @media (min-width: 768px) {
            opacity: 0;
          }
        `}
      `}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    css={css`
      position: absolute;
      right: 0.25rem;
      display: flex;
      height: 1.25rem;
      min-width: 1.25rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      color: hsl(var(--sidebar-foreground));
      user-select: none;
      pointer-events: none;

      &:hover {
        color: hsl(var(--sidebar-accent-foreground));
      }

      &[data-active="true"] {
        color: hsl(var(--sidebar-accent-foreground));
      }

      &[data-size="sm"] {
        top: 0.25rem;
      }

      &[data-size="default"] {
        top: 0.375rem;
      }

      &[data-size="lg"] {
        top: 0.625rem;
      }

      &[data-collapsible="icon"] {
        display: none;
      }
    `}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      css={css`
        display: flex;
        height: 2rem;
        gap: 0.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        align-items: center;
        border-radius: 0.375rem;
      `}
      {...props}
    >
      {showIcon && (
        <Skeleton
          css={css`
            height: 1rem;
            width: 1rem;
            border-radius: 0.25rem;
          `}
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        css={css`
          height: 1rem;
          flex: 1;
          max-width: var(--skeleton-width);
        `}
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    css={css`
      margin-left: 0.875rem;
      display: flex;
      min-width: 0;
      transform: translateX(1px);
      flex-direction: column;
      gap: 0.25rem;
      border-left: 1px solid hsl(var(--sidebar-border));
      padding-left: 0.625rem;
      padding-right: 0.5rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;

      &[data-collapsible="icon"] {
        display: none;
      }
    `}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      css={css`
        display: flex;
        height: 1.75rem;
        min-width: 0;
        transform: translateX(-1px);
        align-items: center;
        gap: 0.5rem;
        overflow: hidden;
        border-radius: 0.375rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        color: hsl(var(--sidebar-foreground));
        outline: none;

        &:hover {
          background-color: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }

        &:focus-visible {
          box-shadow: 0 0 0 2px hsl(var(--sidebar-ring));
        }

        &:active {
          background-color: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }

        &:disabled {
          pointer-events: none;
          opacity: 0.5;
        }

        &[aria-disabled="true"] {
          pointer-events: none;
          opacity: 0.5;
        }

        & > span:last-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        svg {
          height: 1rem;
          width: 1rem;
          shrink: 0;
          color: hsl(var(--sidebar-accent-foreground));
        }

        &[data-active="true"] {
          background-color: hsl(var(--sidebar-accent));
          color: hsl(var(--sidebar-accent-foreground));
        }

        ${size === "sm" &&
        css`
          font-size: 0.75rem;
        `}

        ${size === "md" &&
        css`
          font-size: 0.875rem;
        `}

        &[data-collapsible="icon"] {
          display: none;
        }
      `}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
