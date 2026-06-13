"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type FabSide = "top" | "bottom" | "left" | "right"

type FabContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  side: FabSide
}

const FabContext = React.createContext<FabContextValue | null>(null)

function useFab() {
  const ctx = React.useContext(FabContext)
  if (!ctx) {
    throw new Error(
      "FloatingActionButton parts must be used within <FloatingActionButton>"
    )
  }
  return ctx
}

const listSideClasses: Record<FabSide, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2 flex-col-reverse",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2 flex-col",
  left: "right-full top-1/2 me-3 -translate-y-1/2 flex-row-reverse",
  right: "left-full top-1/2 ms-3 -translate-y-1/2 flex-row",
}

const itemHiddenTransform: Record<FabSide, string> = {
  top: "translateY(0.75rem)",
  bottom: "translateY(-0.75rem)",
  left: "translateX(0.75rem)",
  right: "translateX(-0.75rem)",
}

type FloatingActionButtonProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: FabSide
}

function FloatingActionButton({
  open: openProp,
  defaultOpen,
  onOpenChange,
  side = "top",
  className,
  children,
  ...props
}: FloatingActionButtonProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false)
  const open = openProp ?? uncontrolled

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const value = React.useMemo<FabContextValue>(
    () => ({ open, setOpen, side }),
    [open, setOpen, side]
  )

  return (
    <FabContext.Provider value={value}>
      <div
        data-slot="floating-action-button"
        data-state={open ? "open" : "closed"}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        {children}
      </div>
    </FabContext.Provider>
  )
}

type FloatingActionButtonTriggerProps = React.ComponentProps<"button">

function FloatingActionButtonTrigger({
  className,
  children,
  ...props
}: FloatingActionButtonTriggerProps) {
  const { open, setOpen } = useFab()
  return (
    <button
      type="button"
      data-slot="floating-action-button-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={() => setOpen(!open)}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-[transform,background-color] duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:rotate-45 [&_svg]:size-5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

type FloatingActionButtonListProps = React.ComponentProps<"div">

function FloatingActionButtonList({
  className,
  ...props
}: FloatingActionButtonListProps) {
  const { open, side } = useFab()
  return (
    <div
      role="menu"
      data-slot="floating-action-button-list"
      data-state={open ? "open" : "closed"}
      className={cn(
        "absolute z-10 flex items-center gap-2",
        listSideClasses[side],
        !open && "pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

type FloatingActionButtonItemProps = React.ComponentProps<"button"> & {
  /** Stagger order; later items reveal slightly after earlier ones. */
  index?: number
}

function FloatingActionButtonItem({
  className,
  index = 0,
  style,
  ...props
}: FloatingActionButtonItemProps) {
  const { open, side } = useFab()
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={open ? 0 : -1}
      data-slot="floating-action-button-item"
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${(open ? index : 0) * 40}ms`,
        opacity: open ? 1 : 0,
        transform: open ? "none" : itemHiddenTransform[side],
        ...style,
      }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none [&_svg]:size-4",
        className
      )}
      {...props}
    />
  )
}

export {
  FloatingActionButton,
  FloatingActionButtonTrigger,
  FloatingActionButtonList,
  FloatingActionButtonItem,
}
