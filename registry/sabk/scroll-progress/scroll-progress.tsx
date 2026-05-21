"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* ============================================================================
 * ScrollProgress · fixed reading progress bar
 * Tracks document scroll (default) or a scoped container element via `target`.
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
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const update = () => {
      if (target?.current) {
        const el = target.current
        const max = el.scrollHeight - el.clientHeight
        setProgress(max > 0 ? el.scrollTop / max : 0)
        return
      }
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? doc.scrollTop / max : 0)
    }

    const source: HTMLElement | Window = target?.current ?? window
    update()
    source.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      source.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [target])

  return (
    <div
      data-slot="scroll-progress"
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 h-1 origin-left bg-foreground/80",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{
        transform: `scaleX(${progress})`,
        transition: "transform 80ms linear",
        ...style,
      }}
      {...props}
    />
  )
}

export { ScrollProgress }
