"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Scroll-into-view entrance: fade plus an optional slide from `y`, played once.
 * Transforms drop automatically under reduced motion via the root MotionConfig,
 * leaving a plain fade.
 */
export function reveal({
  y = 16,
  duration = 0.6,
  delay = 0,
}: { y?: number; duration?: number; delay?: number } = {}): MotionProps {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration, delay, ease: "easeOut" },
  };
}

/** Tracks scroll past a threshold for the navbar's solidify transition. */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Node-and-links brand mark: a center node wired to four satellites. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <g stroke="var(--zen)" strokeWidth="1.4">
        <path d="M12 12 4 5M12 12l8-7M12 12l-8 7M12 12l8 7" opacity="0.55" />
      </g>
      <g fill="var(--zen)">
        <circle cx="12" cy="12" r="2.6" />
        <circle cx="4" cy="5" r="1.7" />
        <circle cx="20" cy="5" r="1.7" />
        <circle cx="4" cy="19" r="1.7" />
        <circle cx="20" cy="19" r="1.7" />
      </g>
    </svg>
  );
}

/** Brand mark plus wordmark, used in the navbar and footer. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5", className)}>
      <Logo className="size-6" />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Infrazen
      </span>
    </a>
  );
}

/** Mono eyebrow with a leading signal dot, e.g. `· FEATURES`. */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "zen-mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--zen)]",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-[var(--zen)]" aria-hidden />
      {children}
    </span>
  );
}

/** Live-network status chip with a pulsing dot. */
export function StatusPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "zen-mono inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="zen-pulse absolute inline-flex size-full rounded-full bg-[var(--zen)]" />
        <span className="relative inline-flex size-2 rounded-full bg-[var(--zen)]" />
      </span>
      Network: live
    </span>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  withArrow?: boolean;
  className?: string;
};

/** Shared CTA button: a solid accent fill or a hairline ghost. */
export function Button({
  children,
  href = "#",
  variant = "primary",
  withArrow,
  className,
}: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-[var(--zen-strong)]"
          : "border border-border text-foreground hover:bg-secondary",
        className,
      )}
    >
      {children}
      {withArrow ? (
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
      ) : null}
    </a>
  );
}
