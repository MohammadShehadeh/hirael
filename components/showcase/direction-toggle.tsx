"use client";

import { cn } from "@/lib/utils";

export function DirectionToggle({
  rtl,
  onToggle,
  className,
}: {
  rtl: boolean;
  onToggle: (rtl: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={rtl}
      aria-label="Toggle right-to-left preview"
      onClick={() => onToggle(!rtl)}
      className={cn(
        "inline-flex h-6 items-center rounded-sm border border-border px-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
        rtl
          ? "bg-accent text-foreground"
          : "bg-background text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      RTL
    </button>
  );
}
