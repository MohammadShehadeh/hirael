"use client"

import * as React from "react"

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

type ScrollRevealDirection = "up" | "down" | "left" | "right"

type ScrollRevealProps = React.ComponentProps<"div"> & {
  /** Direction the content travels in from. */
  direction?: ScrollRevealDirection
  /** Travel distance, in px. */
  distance?: number
  /** Delay before the reveal starts, in ms. */
  delay?: number
  /** Reveal duration, in ms. */
  duration?: number
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number
}

function offsetFor(direction: ScrollRevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`
    case "down":
      return `translateY(${-distance}px)`
    case "left":
      return `translateX(${distance}px)`
    case "right":
      return `translateX(${-distance}px)`
  }
}

function ScrollReveal({
  className,
  style,
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 600,
  once = true,
  amount = 0.3,
  ...props
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.disconnect()
          } else if (!once) {
            setShown(false)
          }
        }
      },
      { threshold: amount }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, amount])

  const visible = shown || reduced

  return (
    <div
      ref={ref}
      data-slot="scroll-reveal"
      data-state={visible ? "shown" : "hidden"}
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: reduced ? "0ms" : `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: reduced ? "0ms" : `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offsetFor(direction, distance),
        ...style,
      }}
      {...props}
    />
  )
}

export { ScrollReveal }
