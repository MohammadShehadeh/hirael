"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const FEATURE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const FEATURE_TABS = [
  { label: "Living Electric", id: "electric" },
  { label: "Charge Faster", id: "charge" },
  { label: "Sleep Well", id: "sleep" },
  { label: "Acoustic Comfort", id: "acoustic" },
  { label: "5+ Seasons", id: "seasons" },
];

export function Feature() {
  const [active, setActive] = React.useState("electric");

  return (
    <section className="mx-auto max-w-7xl px-6 py-0 md:px-12">
      <div className="grid min-h-[520px] gap-4 overflow-hidden rounded-2xl md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl bg-card p-10 md:p-14">
          <div>
            <span className="mb-8 inline-block h-8 w-8 rounded-full border border-border" />
            <h2 className="mb-6 text-3xl tracking-[-1px] text-foreground [font-family:var(--font-velorah-serif)] sm:text-5xl">
              100% Electric
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              No more fossil fuels, buzzing generators, and propane tanks.
              Velorah has power for days.
            </p>
          </div>

          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              {FEATURE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs transition-colors",
                    active === tab.id
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-6 h-0.5 w-full rounded-full bg-border">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: "35%" }}
              />
            </div>

            <button
              type="button"
              className="liquid-glass rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Explore the Velorah Flow
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px] overflow-hidden rounded-2xl">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={FEATURE_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>
    </section>
  );
}
