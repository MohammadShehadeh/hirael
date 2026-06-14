"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type TextRevealBy = "word" | "char" | "line";

type TextRevealProps = Omit<React.ComponentProps<"span">, "children"> & {
  children: string;
  /** Element to render the text as. */
  as?: React.ElementType;
  /** Split granularity for the staggered reveal. */
  by?: TextRevealBy;
  /** Delay before the first unit reveals, in ms. */
  delay?: number;
  /** Per-unit reveal duration, in ms. */
  duration?: number;
  /** Delay added between units, in ms. */
  stagger?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  // Observe the unclipped container, never the units. Each unit sits in an
  // `overflow-hidden` mask and starts translated fully below it, so an in-view
  // observer on the unit itself would measure it as 100% clipped and never
  // fire — leaving the text stuck offscreen. Watching the container fires
  // reliably, then each unit reveals on its own staggered delay.
  const inView = useInView(ref, { once, amount });
  const Tag = (as ?? "p") as React.ElementType;

  if (reduced) {
    return (
      <Tag data-slot="text-reveal" className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const units =
    by === "char"
      ? Array.from(children)
      : by === "line"
        ? children.split("\n")
        : children.split(" ");

  return (
    <Tag
      ref={ref}
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
              by === "line" ? "flex" : "inline-flex align-bottom",
            )}
          >
            <motion.span
              className="inline-block"
              initial={{ y: "120%", opacity: 0 }}
              animate={
                inView ? { y: 0, opacity: 1 } : { y: "120%", opacity: 0 }
              }
              transition={{
                duration: duration / 1000,
                delay: (delay + i * stagger) / 1000,
                ease: EASE,
              }}
            >
              {unit === "" ? " " : unit}
            </motion.span>
          </span>
          {by === "word" && i < units.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

export { TextReveal };
