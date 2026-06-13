"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

type SpotlightCardProps = React.ComponentProps<"div"> & {
  /** Diameter of the spotlight, in px. */
  size?: number
}

function SpotlightCard({
  className,
  children,
  size = 350,
  ...props
}: SpotlightCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, color-mix(in oklch, var(--foreground) 10%, transparent), transparent 70%)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  return (
    <div
      data-slot="spotlight-card"
      onPointerMove={onPointerMove}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <motion.div
        aria-hidden
        data-slot="spotlight-card-glow"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div data-slot="spotlight-card-content" className="relative">
        {children}
      </div>
    </div>
  )
}

export { SpotlightCard }
