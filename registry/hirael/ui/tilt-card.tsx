"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}

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
  const reduced = usePrefersReducedMotion()
  const innerRef = React.useRef<HTMLDivElement>(null)
  const glareRef = React.useRef<HTMLDivElement>(null)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateX = (0.5 - py) * max * 2
    const rotateY = (px - 0.5) * max * 2
    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty("--tilt-glare-x", `${px * 100}%`)
      glareRef.current.style.setProperty("--tilt-glare-y", `${py * 100}%`)
    }
  }

  const reset = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)"
    }
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
      <div
        ref={innerRef}
        data-slot="tilt-card-inner"
        className="relative size-full rounded-lg border border-border bg-card text-card-foreground [transform-style:preserve-3d]"
        style={{ transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {children}
        {glare ? (
          <div
            ref={glareRef}
            aria-hidden
            data-slot="tilt-card-glare"
            className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--tilt-glare-x, 50%) var(--tilt-glare-y, 50%), color-mix(in oklch, var(--foreground) 16%, transparent), transparent 60%)",
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export { TiltCard }
