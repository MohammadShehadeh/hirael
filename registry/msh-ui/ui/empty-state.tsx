import * as React from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = React.ComponentProps<"div">

function EmptyState({ className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border bg-card/30 p-10 text-center",
        className
      )}
      {...props}
    />
  )
}

type EmptyStateMediaProps = React.ComponentProps<"div">

function EmptyStateMedia({ className, children, ...props }: EmptyStateMediaProps) {
  return (
    <div
      data-slot="empty-state-media"
      className={cn(
        "relative mb-1 inline-flex size-12 items-center justify-center rounded-md border border-border bg-background text-foreground [&_svg]:size-5",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute -inset-2 -z-10 rounded-lg border border-dashed border-border opacity-60"
      />
      {children}
    </div>
  )
}

type EmptyStateTitleProps = React.ComponentProps<"h3">

function EmptyStateTitle({ className, ...props }: EmptyStateTitleProps) {
  return (
    <h3
      data-slot="empty-state-title"
      className={cn(
        "text-base font-semibold tracking-[-0.01em] text-foreground",
        className
      )}
      {...props}
    />
  )
}

type EmptyStateDescriptionProps = React.ComponentProps<"p">

function EmptyStateDescription({
  className,
  ...props
}: EmptyStateDescriptionProps) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "max-w-sm text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type EmptyStateActionsProps = React.ComponentProps<"div">

function EmptyStateActions({ className, ...props }: EmptyStateActionsProps) {
  return (
    <div
      data-slot="empty-state-actions"
      className={cn("mt-2 flex flex-wrap items-center justify-center gap-2", className)}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
}
