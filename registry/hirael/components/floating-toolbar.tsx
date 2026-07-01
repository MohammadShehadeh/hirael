"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FloatingToolbarProps = React.ComponentProps<"div">;

function FloatingToolbar({ className, ...props }: FloatingToolbarProps) {
  return (
    <div
      role="toolbar"
      data-slot="floating-toolbar"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            '[data-slot="floating-toolbar-button"]:not(:disabled)',
          ),
        );
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (index === -1) return;
        event.preventDefault();
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        let delta = event.key === "ArrowRight" ? 1 : -1;
        if (rtl) delta = -delta;
        items[(index + delta + items.length) % items.length]?.focus();
      }}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/80",
        className,
      )}
      {...props}
    />
  );
}

type FloatingToolbarButtonProps = React.ComponentProps<"button"> & {
  active?: boolean;
};

function FloatingToolbarButton({
  className,
  active,
  ...props
}: FloatingToolbarButtonProps) {
  return (
    <button
      type="button"
      data-slot="floating-toolbar-button"
      data-active={active ? "" : undefined}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-accent data-[active]:text-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

type FloatingToolbarSeparatorProps = React.ComponentProps<"div">;

function FloatingToolbarSeparator({
  className,
  ...props
}: FloatingToolbarSeparatorProps) {
  return (
    <div
      aria-hidden
      data-slot="floating-toolbar-separator"
      className={cn("mx-0.5 h-5 w-px shrink-0 bg-border", className)}
      {...props}
    />
  );
}

type FloatingToolbarLabelProps = React.ComponentProps<"span">;

function FloatingToolbarLabel({
  className,
  ...props
}: FloatingToolbarLabelProps) {
  return (
    <span
      data-slot="floating-toolbar-label"
      className={cn(
        "px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarSeparator,
  FloatingToolbarLabel,
};
