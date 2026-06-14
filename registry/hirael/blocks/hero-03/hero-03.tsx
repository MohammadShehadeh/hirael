"use client"

import * as React from "react"
import { ArrowRight, Check, Star } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import { Input } from "@/registry/hirael/ui/input"

const PROOF = [
  { initials: "PL", tone: "bg-primary text-primary-foreground" },
  { initials: "HX", tone: "bg-foreground text-background" },
  { initials: "BR", tone: "bg-muted text-foreground" },
  { initials: "VB", tone: "bg-primary/80 text-primary-foreground" },
] as const

const CHECKS = ["No credit card", "Free forever tier", "Cancel anytime"] as const

export default function Hero03() {
  const [email, setEmail] = React.useState("")
  const [sent, setSent] = React.useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(ellipse_at_bottom_left,black_25%,transparent_70%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 start-1/3 -z-10 size-[480px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center md:px-10 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
          <span className="inline-flex items-center gap-0.5 text-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
          </span>
          <span className="text-muted-foreground">trusted by 4,000+ builders</span>
        </span>

        <h1 className="max-w-3xl text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          The registry your{" "}
          <span className="italic text-foreground">design system</span> was
          missing.
        </h1>

        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Get new Hirael components, blocks, and templates the moment they
          ship. One email, no noise.
        </p>

        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          {sent ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm">
              <Check className="size-4 text-foreground" />
              <span className="font-medium">You&apos;re on the list</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                · check your inbox
              </span>
            </div>
          ) : (
            <>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                className="h-12 flex-1 rounded-full bg-card/70 px-5 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="lg"
                className="group h-12 shrink-0 rounded-full px-7"
              >
                Get early access
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>
            </>
          )}
        </form>

        <div className="flex flex-col items-center gap-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {CHECKS.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
              >
                <Check className="size-3.5 text-foreground" />
                {c}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {PROOF.map((p) => (
                <span
                  key={p.initials}
                  className={`inline-flex size-7 items-center justify-center rounded-full border-2 border-background font-mono text-[10px] font-medium ${p.tone}`}
                >
                  {p.initials}
                </span>
              ))}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              joined this week
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
