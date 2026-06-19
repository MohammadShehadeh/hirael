"use client";

import { ArrowRight } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import { MagneticButton } from "@/registry/hirael/ui/magnetic-button";

export default function MagneticButtonDemo() {
  const t = useT();

  return (
    <div className="flex w-full max-w-xl flex-wrap items-center gap-6">
      <MagneticButton>
        {t({ en: "Get started", ar: "ابدأ الآن" })}
      </MagneticButton>

      <MagneticButton strength={0.6}>
        {t({ en: "Stronger pull", ar: "جذب أقوى" })}
        <ArrowRight className="size-4" />
      </MagneticButton>

      <MagneticButton asChild>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t({ en: "As a link", ar: "كرابط" })}
          <ArrowRight className="size-4" />
        </a>
      </MagneticButton>
    </div>
  );
}
