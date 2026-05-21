"use client"

import * as React from "react"

const LOGOS = ["Linear", "Vercel", "Resend", "Cal.com", "Raycast"] as const

export default function Testimonial01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-10 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · testimonial
          </span>

          <blockquote className="relative">
            <span
              aria-hidden
              className="absolute -left-2 -top-6 font-serif text-6xl leading-none text-muted-foreground/40 sm:-left-4 sm:-top-8 sm:text-7xl"
            >
              &ldquo;
            </span>
            <p className="text-balance text-2xl font-medium leading-[1.25] tracking-[-0.02em] sm:text-3xl">
              We swapped three hand-rolled multi-selects for the msh ui one in an
              afternoon. The compound API let us keep our existing layout, and
              the keyboard nav was finally not embarrassing.
            </p>
          </blockquote>

          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted font-mono text-sm font-medium text-foreground">
              MR
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold tracking-[-0.01em]">
                Maya Renner
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Staff engineer · Plinth Labs
              </span>
            </div>
          </div>

          <div className="w-full border-t border-border pt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              {LOGOS.map((l, i) => (
                <React.Fragment key={l}>
                  <span>{l}</span>
                  {i < LOGOS.length - 1 && (
                    <span aria-hidden className="text-muted-foreground/40">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
