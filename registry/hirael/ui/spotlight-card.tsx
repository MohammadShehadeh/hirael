"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SpotlightCardProps = React.ComponentProps<"div"> & {
  /** Diameter of the spotlight, in px. */
  size?: number
}

function SpotlightCard({
  className,
  children,
  style,
  size = 350,
  ...props
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`)
    el.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      data-slot="spotlight-card"
      onPointerMove={onPointerMove}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      style={{ ["--spotlight-size" as string]: `${size}px`, ...style }}
      {...props}
    >
      <div
        aria-hidden
        data-slot="spotlight-card-glow"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), color-mix(in oklch, var(--foreground) 10%, transparent), transparent 70%)",
        }}
      />
      <div data-slot="spotlight-card-content" className="relative">
        {children}
      </div>
    </div>
  )
}

export { SpotlightCard }
