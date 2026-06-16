"use client";

import { ArrowUpRight } from "lucide-react";

import { SpotlightCard } from "@/registry/hirael/ui/spotlight-card";

export default function SpotlightCardDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      {[
        {
          title: "Edge network",
          body: "Deploy to 300 locations with a single push. Sub-50ms reads, everywhere.",
        },
        {
          title: "Usage-based billing",
          body: "Meter any event, set limits, and invoice automatically at the end of the cycle.",
        },
      ].map((card) => (
        <SpotlightCard key={card.title} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-sm font-medium text-foreground">
              {card.title}
            </h3>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {card.body}
          </p>
        </SpotlightCard>
      ))}
      <p className="col-span-full font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Move your cursor across a card
      </p>
    </div>
  );
}
