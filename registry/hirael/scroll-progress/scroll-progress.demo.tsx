"use client";

import * as React from "react";

import { ScrollProgress } from "@/registry/hirael/ui/scroll-progress";

export default function ScrollProgressDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Scoped to container · pinned to the top of this preview
      </p>

      <div className="relative h-72 overflow-hidden rounded-md border border-border">
        <ScrollProgress
          target={containerRef}
          className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-foreground/40 via-foreground to-foreground/40"
        />
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-5 py-4 text-sm leading-relaxed text-muted-foreground"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <p key={i} className="mb-4">
              {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue
              ligula ac quam viverra nec consectetur ante hendrerit. Donec et
              mollis dolor.
            </p>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: omit <code className="font-mono">target</code> to track the whole
        document scroll, useful on long blog posts.
      </p>
    </div>
  );
}
