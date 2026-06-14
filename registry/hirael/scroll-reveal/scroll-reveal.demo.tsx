"use client";

import { ScrollReveal } from "@/registry/hirael/ui/scroll-reveal";

const ITEMS = [
  { dir: "up" as const, label: "Up" },
  { dir: "right" as const, label: "Right" },
  { dir: "left" as const, label: "Left" },
  { dir: "down" as const, label: "Down" },
];

export default function ScrollRevealDemo() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <ScrollReveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Reveal on scroll
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-2 gap-3">
        {ITEMS.map((item, i) => (
          <ScrollReveal key={item.label} direction={item.dir} delay={i * 100}>
            <div className="flex h-24 flex-col justify-between rounded-md border border-border bg-card p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                from {item.label.toLowerCase()}
              </span>
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
