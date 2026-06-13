"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type ExpandableCardContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  triggerId: string
}

const ExpandableCardContext =
  React.createContext<ExpandableCardContextValue | null>(null)

function useExpandableCard() {
  const ctx = React.useContext(ExpandableCardContext)
  if (!ctx) {
    throw new Error("ExpandableCard parts must be used within <ExpandableCard>")
  }
  return ctx
}

type ExpandableCardProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function ExpandableCard({
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...props
}: ExpandableCardProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false)
  const open = openProp ?? uncontrolled
  const reactId = React.useId()

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const value = React.useMemo<ExpandableCardContextValue>(
    () => ({
      open,
      setOpen,
      contentId: `${reactId}-content`,
      triggerId: `${reactId}-trigger`,
    }),
    [open, setOpen, reactId]
  )

  return (
    <ExpandableCardContext.Provider value={value}>
      <div
        data-slot="expandable-card"
        data-state={open ? "open" : "closed"}
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ExpandableCardContext.Provider>
  )
}

type ExpandableCardTriggerProps = React.ComponentProps<"button">

function ExpandableCardTrigger({
  className,
  children,
  ...props
}: ExpandableCardTriggerProps) {
  const { open, setOpen, contentId, triggerId } = useExpandableCard()
  return (
    <button
      type="button"
      id={triggerId}
      data-slot="expandable-card-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center justify-between gap-3 p-4 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  )
}

type ExpandableCardContentProps = React.ComponentProps<"div">

function ExpandableCardContent({
  className,
  children,
  ...props
}: ExpandableCardContentProps) {
  const { open, contentId, triggerId } = useExpandableCard()
  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-slot="expandable-card-content"
      data-state={open ? "open" : "closed"}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className={cn("border-t border-border p-4", className)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export { ExpandableCard, ExpandableCardTrigger, ExpandableCardContent }
