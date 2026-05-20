"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

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
        "overflow-hidden rounded-sm border-2 border-border",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b-2 border-border bg-card px-2 py-1.5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(t.label)}
              className={cn(
                "rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                active === t.label
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label.split("/").slice(-1)[0]}
            </button>
          ))}
        </div>
        <CopyButton text={current.code} />
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
        "group relative overflow-hidden rounded-sm border-2 border-border",
        className
      )}
    >
      <CopyButton
        text={code}
        className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div
        className={cn("shiki-scroll overflow-auto", maxHeight)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

function CopyButton({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        } catch {
          // ignore
        }
      }}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm border-2 border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground",
        className
      )}
    >
      {copied ? (
        <Check className="size-3.5 text-forge" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  )
}
