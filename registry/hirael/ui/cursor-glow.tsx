"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type CursorGlowProps = React.ComponentProps<"div"> & {
  /** Diameter of the glow, in px. */
  size?: number
  /** Glow color. Defaults to a soft tint of the foreground token. */
  color?: string
}

function CursorGlow({
  className,
  children,
  style,
  size = 400,
  color = "color-mix(in oklch, var(--foreground) 12%, transparent)",
  ...props
}: CursorGlowProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--cursor-glow-x", `${event.clientX - rect.left}px`)
    el.style.setProperty("--cursor-glow-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      data-slot="cursor-glow"
      onPointerMove={onPointerMove}
      className={cn("group relative overflow-hidden", className)}
      style={{
        ["--cursor-glow-size" as string]: `${size}px`,
        ["--cursor-glow-color" as string]: color,
        ...style,
      }}
      {...props}
    >
      <div
        aria-hidden
        data-slot="cursor-glow-layer"
        className="pointer-events-none absolute inset-0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(var(--cursor-glow-size) circle at var(--cursor-glow-x, 50%) var(--cursor-glow-y, 50%), var(--cursor-glow-color), transparent 70%)",
        }}
      />
      <div data-slot="cursor-glow-content" className="relative">
        {children}
      </div>
    </div>
  )
}

export { CursorGlow }
