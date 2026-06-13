"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

import { cn } from "@/lib/utils"

type TiltCardProps = React.ComponentProps<"div"> & {
  /** Maximum tilt on each axis, in degrees. */
  max?: number
  /** Scale applied while pointing. */
  scale?: number
  /** Perspective depth, in px. */
  perspective?: number
  /** Render a cursor-following glare highlight. */
  glare?: boolean
}

const SPRING = { stiffness: 200, damping: 18, mass: 0.3 }

function TiltCard({
  className,
  children,
  style,
  max = 12,
  scale = 1,
  perspective = 800,
  glare = false,
  ...props
}: TiltCardProps) {
  const reduced = useReducedMotion()
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, color-mix(in oklch, var(--foreground) 16%, transparent), transparent 60%)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateX.set((0.5 - py) * max * 2)
    rotateY.set((px - 0.5) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      data-slot="tilt-card"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn("group", className)}
      style={{ perspective: `${perspective}px`, ...style }}
      {...props}
    >
      <motion.div
        data-slot="tilt-card-inner"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? undefined : { scale }}
        className="relative size-full rounded-lg border border-border bg-card text-card-foreground"
      >
        {children}
        {glare ? (
          <motion.div
            aria-hidden
            data-slot="tilt-card-glare"
            className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBackground }}
          />
        ) : null}
      </motion.div>
    </div>
  )
}

export { TiltCard }
