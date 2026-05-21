"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* ============================================================================
 * ScrollProgress · fixed reading progress bar
 *
 * Pixel pipeline: scroll events drive a single rAF per frame that writes
 * `transform: scaleX(...)` straight to the DOM via ref — no React render
 * on scroll, no CSS transition fighting the compositor. The bar is
 * promoted to its own layer via `will-change: transform`.
 * ========================================================================== */

export type ScrollProgressProps = React.ComponentProps<"div"> & {
  /** Element to track. Defaults to document scroll. */
  target?: React.RefObject<HTMLElement | null>
  /** Position. Defaults to "top". */
  position?: "top" | "bottom"
}

function ScrollProgress({
  className,
  style,
  target,
  position = "top",
  ...props
}: ScrollProgressProps) {
  const barRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0
    let lastProgress = -1

    const apply = () => {
      frame = 0
      let progress: number
      if (target?.current) {
        const el = target.current
        const max = el.scrollHeight - el.clientHeight
        progress = max > 0 ? el.scrollTop / max : 0
      } else {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        progress = max > 0 ? doc.scrollTop / max : 0
      }
      // Skip the write when the bar wouldn't visibly move (~sub-pixel).
      if (Math.abs(progress - lastProgress) < 0.001) return
      lastProgress = progress
      bar.style.transform = `scaleX(${progress})`
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    const source: HTMLElement | Window = target?.current ?? window
    apply()
    source.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      source.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [target])

  return (
    <div
      ref={barRef}
      data-slot="scroll-progress"
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 h-1 origin-left bg-foreground/80",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{
        transform: "scaleX(0)",
        willChange: "transform",
        ...style,
      }}
      {...props}
    />
  )
}

export { ScrollProgress }
