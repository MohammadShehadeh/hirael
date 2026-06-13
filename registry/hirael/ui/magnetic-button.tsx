"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

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

type MagneticButtonProps = React.ComponentProps<"button"> & {
  /** Pull strength as a fraction of the cursor's distance from center. */
  strength?: number
  /** Render the child element instead of a button (e.g. a link). */
  asChild?: boolean
}

function MagneticButton({
  className,
  strength = 0.4,
  asChild = false,
  style,
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const reduced = usePrefersReducedMotion()

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = "translate(0px, 0px)"
  }

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="magnetic-button"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn(
        !asChild &&
          "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      style={{
        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        ...style,
      }}
      {...props}
    />
  )
}

export { MagneticButton }
