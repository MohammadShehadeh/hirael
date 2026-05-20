"use client"

import * as React from "react"
import { ExternalLink, Maximize2, Monitor, Smartphone, Tablet } from "lucide-react"

import { cn } from "@/lib/utils"

type Viewport = "mobile" | "tablet" | "desktop"

const SIZES: Record<Viewport, { width: number; label: string }> = {
  mobile: { width: 380, label: "Mobile" },
  tablet: { width: 768, label: "Tablet" },
  desktop: { width: 0, label: "Desktop" },
}

const ICONS: Record<Viewport, React.ComponentType<{ className?: string }>> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
}

const ORDER: Viewport[] = ["mobile", "tablet", "desktop"]

export function BlockViewer({
  name,
  title,
  minHeight = 800,
}: {
  name: string
  title: string
  minHeight?: number
}) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [key, setKey] = React.useState(0)

  const sizing =
    viewport === "desktop"
      ? { width: "100%", maxWidth: "100%" }
      : { width: `${SIZES[viewport].width}px`, maxWidth: "100%" }

  return (
    <div
      data-slot="block-viewer"
      className="overflow-hidden rounded-sm border border-border bg-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/50 px-3 py-2">
        <div
          role="tablist"
          aria-label="Preview viewport"
          className="flex items-center gap-0.5 rounded-sm border border-border bg-background p-0.5"
        >
          {ORDER.map((v) => {
            const Icon = ICONS[v]
            const active = viewport === v
            return (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`${SIZES[v].label} viewport${
                  v === "desktop" ? "" : ` (${SIZES[v].width}px)`
                }`}
                onClick={() => setViewport(v)}
                className={cn(
                  "inline-flex h-6 items-center gap-1.5 rounded-[2px] px-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3" />
                <span className="hidden sm:inline">{SIZES[v].label}</span>
                {v !== "desktop" && active && (
                  <span className="tabular-nums text-muted-foreground">
                    {SIZES[v].width}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            aria-label="Refresh preview"
            className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Maximize2 className="size-3.5 -rotate-45" />
          </button>
          <a
            href={`/embed/blocks/${name}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open preview in new tab"
            className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto bg-card/20 p-3 sm:p-4">
        <iframe
          key={key}
          src={`/embed/blocks/${name}`}
          title={`${title} preview`}
          loading="lazy"
          className="block border-0 bg-background transition-[width,max-width] duration-300 ease-out"
          style={{ ...sizing, height: minHeight }}
        />
      </div>
    </div>
  )
}
