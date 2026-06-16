"use client";

import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";

type BlurRevealProps = HTMLMotionProps<"div"> & {
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  /** Reveal duration, in ms. */
  duration?: number;
  /** Reveal once and stay, or replay every time it re-enters the viewport. */
  once?: boolean;
  /** Visible fraction (0–1) that triggers the reveal. */
  amount?: number;
  /** Starting blur, in px. */
  blur?: number;
  /** Starting vertical offset, in px. */
  y?: number;
};

function BlurReveal({
  delay = 0,
  duration = 600,
  once = true,
  amount = 0.3,
  blur = 8,
  y = 8,
  ...props
}: BlurRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <motion.div data-slot="blur-reveal" {...props} />;
  }

  return (
    <motion.div
      data-slot="blur-reveal"
      initial={{ opacity: 0, filter: `blur(${blur}px)`, y }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
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

export { BlurReveal };
