"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/showcase/copy-button"

export type CodeBlockTab = {
  /** Tab label (e.g. filename). */
  label: string
  /** Raw source — used for copy + clipboard. */
  code: string
  /** Pre-highlighted shiki HTML for `code`. */
  html: string
}

export function CodeBlock({
  tabs,
  defaultTab,
  className,
  maxHeight = "max-h-[640px]",
}: {
  tabs: CodeBlockTab[]
  defaultTab?: string
  className?: string
  /** Tailwind max-h class for the scroll area. */
  maxHeight?: string
}) {
  const [active, setActive] = React.useState(
    () => defaultTab ?? tabs[0]?.label
  )
  const current = tabs.find((t) => t.label === active) ?? tabs[0]

  if (!current) return null

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-1 py-1">
        <div
          role="tablist"
          aria-label="Source files"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto"
        >
          {tabs.map((t) => {
            const isActive = active === t.label
            const filename = t.label.split("/").slice(-1)[0]
            return (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                title={t.label}
                onClick={() => setActive(t.label)}
                className={cn(
                  "shrink-0 rounded-sm px-2.5 py-1 font-mono text-[11px] tracking-tight transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filename}
              </button>
            )
          })}
        </div>
        <CopyButton text={current.code} label="Copy code" className="mr-0.5" />
      </div>
      <div
        className={cn("shiki-scroll overflow-auto", maxHeight)}
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </div>
  )
}

export function InlineCodeBlock({
  html,
  code,
  className,
  maxHeight = "max-h-[640px]",
}: {
  html: string
  code: string
  className?: string
  maxHeight?: string
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-border bg-card",
        className
      )}
    >
      <CopyButton
        text={code}
        label="Copy code"
        className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div
        className={cn("shiki-scroll overflow-auto", maxHeight)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
