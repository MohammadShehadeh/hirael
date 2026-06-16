"use client";

import { ArrowRight } from "lucide-react";

import { MagneticButton } from "@/registry/hirael/ui/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <div className="flex w-full max-w-xl flex-wrap items-center gap-6">
      <MagneticButton>Get started</MagneticButton>

      <MagneticButton strength={0.6}>
        Stronger pull
        <ArrowRight className="size-4" />
      </MagneticButton>

      <MagneticButton asChild>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          As a link
          <ArrowRight className="size-4" />
        </a>
      </MagneticButton>
    </div>
  );
}
