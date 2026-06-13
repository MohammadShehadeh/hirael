"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

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
  size = 400,
  color = "color-mix(in oklch, var(--foreground) 12%, transparent)",
  ...props
}: CursorGlowProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  return (
    <div
      data-slot="cursor-glow"
      onPointerMove={onPointerMove}
      className={cn("group relative overflow-hidden", className)}
      {...props}
    >
      <motion.div
        aria-hidden
        data-slot="cursor-glow-layer"
        className="pointer-events-none absolute inset-0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      <div data-slot="cursor-glow-content" className="relative">
        {children}
      </div>
    </div>
  )
}

export { CursorGlow }
