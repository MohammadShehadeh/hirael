"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type AuditLogProps = React.ComponentProps<"ul">

function AuditLog({ className, ...props }: AuditLogProps) {
  return (
    <ul
      data-slot="audit-log"
      className={cn(
        "divide-y divide-border overflow-hidden rounded-md border border-border bg-card",
        className
      )}
      {...props}
    />
  )
}

type AuditLogItemContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  triggerId: string
}

const AuditLogItemContext =
  React.createContext<AuditLogItemContextValue | null>(null)

function useAuditLogItem() {
  const ctx = React.useContext(AuditLogItemContext)
  if (!ctx) {
    throw new Error("AuditLog parts must be used within <AuditLogItem>")
  }
  return ctx
}

type AuditLogItemProps = Omit<React.ComponentProps<"li">, "onToggle"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function AuditLogItem({
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...props
}: AuditLogItemProps) {
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

  const value = React.useMemo<AuditLogItemContextValue>(
    () => ({
      open,
      setOpen,
      contentId: `${reactId}-content`,
      triggerId: `${reactId}-trigger`,
    }),
    [open, setOpen, reactId]
  )

  return (
    <AuditLogItemContext.Provider value={value}>
      <li
        data-slot="audit-log-item"
        data-state={open ? "open" : "closed"}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </li>
    </AuditLogItemContext.Provider>
  )
}

type AuditLogTriggerProps = React.ComponentProps<"button">

function AuditLogTrigger({ className, children, ...props }: AuditLogTriggerProps) {
  const { open, setOpen, contentId, triggerId } = useAuditLogItem()
  return (
    <button
      type="button"
      id={triggerId}
      data-slot="audit-log-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <ChevronRight
        aria-hidden
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
          open ? "rotate-90" : "rtl:rotate-180"
        )}
      />
      {children}
    </button>
  )
}

type AuditLogActorProps = React.ComponentProps<"span">

function AuditLogActor({ className, ...props }: AuditLogActorProps) {
  return (
    <span
      data-slot="audit-log-actor"
      className={cn("shrink-0 text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

type AuditLogActionProps = React.ComponentProps<"span">

function AuditLogAction({ className, ...props }: AuditLogActionProps) {
  return (
    <span
      data-slot="audit-log-action"
      className={cn("truncate text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

type AuditLogTimeProps = React.ComponentProps<"time">

function AuditLogTime({ className, ...props }: AuditLogTimeProps) {
  return (
    <time
      data-slot="audit-log-time"
      className={cn(
        "ms-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type AuditLogStatusTone = "default" | "success" | "warning" | "danger"

type AuditLogStatusProps = React.ComponentProps<"span"> & {
  tone?: AuditLogStatusTone
}

const statusToneClasses: Record<AuditLogStatusTone, string> = {
  default: "border-border text-muted-foreground",
  success: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/30 text-amber-600 dark:text-amber-400",
  danger: "border-red-500/30 text-red-600 dark:text-red-400",
}

function AuditLogStatus({
  tone = "default",
  className,
  ...props
}: AuditLogStatusProps) {
  return (
    <span
      data-slot="audit-log-status"
      data-tone={tone}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em]",
        statusToneClasses[tone],
        className
      )}
      {...props}
    />
  )
}

type AuditLogDetailProps = React.ComponentProps<"dl">

function AuditLogDetail({ className, children, ...props }: AuditLogDetailProps) {
  const { open, contentId, triggerId } = useAuditLogItem()
  return (
    <dl
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-slot="audit-log-detail"
      hidden={!open}
      className={cn(
        "grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 border-t border-border bg-muted/30 px-4 py-3 ps-11",
        className
      )}
      {...props}
    >
      {children}
    </dl>
  )
}

type AuditLogFieldProps = React.ComponentProps<"div"> & {
  label: React.ReactNode
}

function AuditLogField({
  label,
  className,
  children,
  ...props
}: AuditLogFieldProps) {
  return (
    <div data-slot="audit-log-field" className={cn("contents", className)} {...props}>
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 break-words font-mono text-[12px] text-foreground">
        {children}
      </dd>
    </div>
  )
}

export {
  AuditLog,
  AuditLogItem,
  AuditLogTrigger,
  AuditLogActor,
  AuditLogAction,
  AuditLogTime,
  AuditLogStatus,
  AuditLogDetail,
  AuditLogField,
}
