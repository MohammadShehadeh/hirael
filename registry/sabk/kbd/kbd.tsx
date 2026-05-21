import * as React from "react"

import { cn } from "@/lib/utils"

/* ============================================================================
 * Kbd · pressable 3D keycap
 * ========================================================================== */

type KbdProps = React.ComponentProps<"button">

function Kbd({ className, type = "button", ...props }: KbdProps) {
  return (
    <button
      type={type}
      data-slot="kbd"
      className={cn(
        "relative inline-flex select-none touch-manipulation items-center justify-center overflow-hidden",
        "h-8 min-w-8 px-2",
        "font-sans text-sm font-medium text-foreground",
        "rounded-lg border border-input",
        "bg-linear-to-b from-card to-card/80",
        "[-webkit-tap-highlight-color:transparent]",
        "shadow-[0_1px_0_1px_oklch(0%_0_0/0.1),0_2px_4px_-1px_oklch(0%_0_0/0.1),0_4px_6px_-2px_oklch(0%_0_0/0.05)]",
        "dark:shadow-[0_1px_0_1px_oklch(0%_0_0/0.4),0_2px_4px_-1px_oklch(0%_0_0/0.3),0_4px_6px_-2px_oklch(0%_0_0/0.2)]",
        "before:pointer-events-none before:absolute before:inset-x-[2px] before:top-[2px] before:h-[40%] before:rounded-t-md before:bg-linear-to-b before:from-white/15 before:to-transparent",
        "transition-all duration-100 ease-out",
        "hover:brightness-105",
        "hover:shadow-[0_1px_0_1px_oklch(0%_0_0/0.1),0_3px_6px_-1px_oklch(0%_0_0/0.12),0_6px_10px_-2px_oklch(0%_0_0/0.08)]",
        "dark:hover:shadow-[0_1px_0_1px_oklch(0%_0_0/0.4),0_3px_6px_-1px_oklch(0%_0_0/0.35),0_6px_10px_-2px_oklch(0%_0_0/0.25)]",
        "active:translate-y-[2px] active:brightness-95",
        "active:shadow-[0_0_0_1px_oklch(0%_0_0/0.1),0_1px_2px_0_oklch(0%_0_0/0.08)]",
        "dark:active:shadow-[0_0_0_1px_oklch(0%_0_0/0.4),0_1px_2px_0_oklch(0%_0_0/0.3)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================================
 * KbdDisplay · static inline keycap (e.g. inside tooltips, menus)
 * ========================================================================== */

type KbdDisplayProps = React.ComponentProps<"kbd">

function KbdDisplay({ className, ...props }: KbdDisplayProps) {
  return (
    <kbd
      data-slot="kbd-display"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================================
 * KbdGroup · row layout for chords like ⌘ + K
 * ========================================================================== */

type KbdGroupProps = React.ComponentProps<"div">

function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdDisplay, KbdGroup }
