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
      All systems operational
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

/**
 * Glitch-fringed display text: two clipped, offset color copies flicker briefly
 * over a stable base. Disabled entirely under reduced motion.
 */
export function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("zen-glitch", className)} data-text={children}>
      {children}
    </span>
  );
}

/** L-shaped accent ticks pinned to the four corners of a relative parent. */
export function CornerTicks() {
  const base = "pointer-events-none absolute size-2.5 border-[var(--zen-line)]";
  return (
    <>
      <span
        aria-hidden
        className={cn(base, "start-0 top-0 border-s border-t")}
      />
      <span aria-hidden className={cn(base, "end-0 top-0 border-e border-t")} />
      <span
        aria-hidden
        className={cn(base, "bottom-0 start-0 border-b border-s")}
      />
      <span
        aria-hidden
        className={cn(base, "bottom-0 end-0 border-b border-e")}
      />
    </>
  );
}

/**
 * Full-width technical separator between major sections: a 1px rule carrying a
 * mono index and label, capped with a band of diagonal stripes.
 */
export function SectionDivider({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div data-slot="section-divider" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <span className="zen-mono text-xs text-[var(--zen)]">{index}</span>
        <span className="zen-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
        <span aria-hidden className="zen-diagonal h-3 w-20 opacity-50" />
      </div>
    </div>
  );
}
