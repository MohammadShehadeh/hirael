"use client";

import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";

type ScrollRevealDirection = "up" | "down" | "left" | "right";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  /** Direction the content travels in from. */
  direction?: ScrollRevealDirection;
  /** Travel distance, in px. */
  distance?: number;
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  /** Reveal duration, in ms. */
  duration?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
};

function offsetFor(direction: ScrollRevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
}

function ScrollReveal({
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 600,
  once = true,
  amount = 0.3,
  ...props
}: ScrollRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <motion.div data-slot="scroll-reveal" {...props} />;
  }

  return (
    <motion.div
      data-slot="scroll-reveal"
      initial={{ opacity: 0, ...offsetFor(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    />
  );
}

export { ScrollReveal };
