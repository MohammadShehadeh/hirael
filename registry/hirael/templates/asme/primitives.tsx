"use client";

import * as React from "react";
import type { MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealOptions = {
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
};

/**
 * Scroll-into-view entrance: fade plus an optional slide from `x`/`y`, played
 * once when the element crosses into the viewport. Transforms are dropped
 * automatically under reduced motion by the root MotionConfig, leaving a plain
 * fade.
 */
export function reveal({
  x = 0,
  y = 0,
  duration = 0.6,
  delay = 0,
}: RevealOptions = {}): MotionProps {
  return {
    initial: { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration, delay, ease: "easeOut" },
  };
}

/** Italic serif accent word, set in Instrument Serif. */
export function Serif({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-normal italic [font-family:var(--font-asme-serif)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

type IconProps = { className?: string };

/**
 * Social marks drawn as monochrome glyphs rather than imported brand icons,
 * which the icon library no longer ships.
 */
export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.79.47-1.67.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.46-4.29 4.1 4.1 0 0 0 1.27 5.48c-.65-.02-1.27-.2-1.81-.5v.05a4.1 4.1 0 0 0 3.29 4.02c-.6.16-1.23.18-1.84.07a4.11 4.11 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.4a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.67l-.01-.53A8.3 8.3 0 0 0 22 5.92Z" />
    </svg>
  );
}
