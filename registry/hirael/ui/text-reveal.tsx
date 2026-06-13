"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

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
  const reduced = useReducedMotion()
  const Tag = (as ?? "p") as React.ElementType

  if (reduced) {
    return (
      <Tag data-slot="text-reveal" className={className} {...props}>
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
      data-slot="text-reveal"
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
            <motion.span
              className="inline-block"
              initial={{ y: "120%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once, amount }}
              transition={{
                duration: duration / 1000,
                delay: (delay + i * stagger) / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {unit === "" ? " " : unit}
            </motion.span>
          </span>
          {by === "word" && i < units.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  )
}

export { TextReveal }
