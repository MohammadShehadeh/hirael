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

type TextRevealBy = "word" | "char" | "line"

type TextRevealProps = Omit<React.ComponentProps<"span">, "children"> & {
  children: string
  /** Element to render the text as. */
  as?: React.ElementType
  /** Split granularity for the staggered reveal. */
  by?: TextRevealBy
  /** Delay before the first unit reveals, in ms. */
  delay?: number
  /** Per-unit reveal duration, in ms. */
  duration?: number
  /** Delay added between units, in ms. */
  stagger?: number
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number
}

function TextReveal({
  children,
  as,
  by = "word",
  delay = 0,
  duration = 600,
  stagger = 60,
  once = true,
  amount = 0.5,
  className,
  ...props
}: TextRevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLElement>(null)
  const [shown, setShown] = React.useState(false)
  const Tag = (as ?? "p") as React.ElementType

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

  if (reduced) {
    return (
      <Tag ref={ref} data-slot="text-reveal" className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const units =
    by === "char"
      ? Array.from(children)
      : by === "line"
        ? children.split("\n")
        : children.split(" ")

  return (
    <Tag
      ref={ref}
      data-slot="text-reveal"
      data-state={shown ? "shown" : "hidden"}
      className={cn(by === "line" && "flex flex-col", className)}
      {...props}
    >
      {units.map((unit, i) => (
        <React.Fragment key={i}>
          <span
            data-slot="text-reveal-unit"
            className={cn(
              "overflow-hidden pb-[0.12em]",
              by === "line" ? "flex" : "inline-flex align-bottom"
            )}
          >
            <span
              className="inline-block"
              style={{
                transitionProperty: "transform, opacity",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: `${delay + i * stagger}ms`,
                transform: shown ? "translateY(0)" : "translateY(120%)",
                opacity: shown ? 1 : 0,
              }}
            >
              {unit === "" ? " " : unit}
            </span>
          </span>
          {by === "word" && i < units.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  )
}

export { TextReveal }
