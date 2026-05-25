"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type AnnouncementBarProps = React.ComponentProps<"div"> & {
  tone?: "default" | "primary" | "muted"
  dismissible?: boolean
  onDismiss?: () => void
  storageKey?: string
}

const toneClasses: Record<NonNullable<AnnouncementBarProps["tone"]>, string> = {
  default: "border-border bg-card text-card-foreground",
  primary: "border-foreground/15 bg-foreground text-background",
  muted: "border-border bg-muted text-foreground",
}

function AnnouncementBar({
  className,
  tone = "default",
  dismissible = false,
  onDismiss,
  storageKey,
  children,
  ...props
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        if (window.localStorage.getItem(storageKey) === "1") {
          setDismissed(true)
        }
      } catch {}
    }
  }, [storageKey])

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    if (storageKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(storageKey, "1")
      } catch {}
    }
    onDismiss?.()
  }

  const isPrimary = tone === "primary"

  return (
    <div
      data-slot="announcement-bar"
      data-tone={tone}
      className={cn(
        "relative isolate flex w-full items-center justify-center gap-3 border-b px-4 py-2 text-sm",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center justify-center gap-2 text-center">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className={cn(
            "absolute right-2 inline-flex size-7 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isPrimary
              ? "text-background/70 hover:bg-background/10 hover:text-background"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

type AnnouncementBarBadgeProps = React.ComponentProps<"span">

function AnnouncementBarBadge({ className, ...props }: AnnouncementBarBadgeProps) {
  return (
    <span
      data-slot="announcement-bar-badge"
      className={cn(
        "inline-flex items-center rounded-sm border border-current/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] opacity-80",
        className
      )}
      {...props}
    />
  )
}

type AnnouncementBarLinkProps = React.ComponentProps<"a">

function AnnouncementBarLink({ className, ...props }: AnnouncementBarLinkProps) {
  return (
    <a
      data-slot="announcement-bar-link"
      className={cn(
        "inline-flex items-center gap-1 underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
}

export { AnnouncementBar, AnnouncementBarBadge, AnnouncementBarLink }
