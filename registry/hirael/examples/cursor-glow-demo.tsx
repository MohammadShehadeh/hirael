"use client";

import { CursorGlow } from "@/registry/hirael/ui/cursor-glow";

export default function CursorGlowDemo() {
  return (
    <CursorGlow className="w-full max-w-xl rounded-xl border border-border bg-card">
      <div className="flex flex-col items-start gap-3 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Hover anywhere
        </p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          A glow that tracks the cursor
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Drop it behind a hero, a pricing grid, or a feature panel. The light
          follows the pointer and fades out when it leaves.
        </p>
      </div>
    </CursorGlow>
  );
}
