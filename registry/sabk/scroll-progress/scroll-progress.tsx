"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type ScrollProgressProps = React.ComponentProps<"div"> & {
  target?: React.RefObject<HTMLElement | null>
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
