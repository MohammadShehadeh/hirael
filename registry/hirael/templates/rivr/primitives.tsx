"use client";

import { ArrowUpRight } from "lucide-react";
import type { MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

export function fadeUp(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export function RivrMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.3"
      />
      <circle cx="12" cy="12" r="5.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function PillButton({
  label,
  href = "#",
  variant = "solid",
  className,
}: {
  label: string;
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full py-1.5 pe-1.5 ps-5 text-sm font-medium transition-colors",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-card/60 text-foreground backdrop-blur-sm hover:bg-card",
        className,
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full",
          variant === "solid" ? "bg-white/20" : "bg-foreground/10",
        )}
      >
        <ArrowUpRight className="size-4 rtl:-scale-x-100" />
      </span>
    </a>
  );
}
