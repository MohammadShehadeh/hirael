"use client"

import * as React from "react"

import { Button } from "@/registry/msh-ui/ui/button"
import { Badge } from "@/registry/msh-ui/ui/badge"
import { Input } from "@/registry/msh-ui/ui/input"
import { Label } from "@/registry/msh-ui/ui/label"
import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet"
import { useTheme } from "@/components/showcase/theme-provider"
import { REGISTRY } from "@/registry/msh-ui/registry-meta"

export function ThemePlayground() {
  const { mode, theme } = useTheme()
  const overrideCount =
    Object.keys(theme.dark).length + Object.keys(theme.light).length
  const components = REGISTRY.filter(
    (r) => r.category !== "blocks" && r.status === "stable"
  )

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 md:px-10 md:py-14">
      <header className="flex flex-col gap-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ playground
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            live theme preview
          </span>
        </div>
        <h1 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
          Your theme, every component.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Paste a CSS variable block from your own app — or any shadcn theme
          generator — and watch the entire MSH UI registry re-skin. The active
          theme is persisted in your browser; reset any time.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeSheetTrigger />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            mode · {mode}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            ·
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {overrideCount} override{overrideCount === 1 ? "" : "s"} active
          </span>
        </div>
      </header>

      <Section
        eyebrow="Surfaces"
        title="Backgrounds & cards"
        description="The three surface layers components stack on — background, card, popover. Borders read against each."
      >
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          <Surface label="background" className="bg-background text-foreground" />
          <Surface label="card" className="bg-card text-card-foreground" />
          <Surface label="popover" className="bg-popover text-popover-foreground" />
        </div>
      </Section>

      <Section
        eyebrow="Primitives"
        title="Buttons, badges, inputs"
        description="The base shadcn primitives MSH UI components compose on top of."
      >
        <div className="grid gap-6 rounded-sm border border-border bg-card/40 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="grid max-w-md gap-2">
            <Label htmlFor="theme-preview-input">Email</Label>
            <Input
              id="theme-preview-input"
              placeholder="you@example.com"
              defaultValue="hello@msh-ui.dev"
            />
            <p className="text-xs text-muted-foreground">
              Muted foreground reads against background.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Registry"
        title="MSH UI components"
        description="Every stable component re-renders against the active theme. Edit it and watch them all update at once."
      >
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-2">
          {components.map((entry) => {
            const Demo = entry.Demo
            if (!Demo) return null
            return (
              <article
                key={entry.name}
                className="flex flex-col gap-4 bg-card p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-medium tracking-[-0.01em]">
                    {entry.title}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    /{entry.name}
                  </span>
                </div>
                <div className="flex min-h-[160px] items-center justify-center rounded-sm border border-dashed border-border bg-background/60 p-4">
                  <Demo />
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section
        eyebrow="Accent"
        title="Primary, ring, destructive"
        description="The accents that should only ever appear when something is important. They borrow the ring color for focus states."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-card/40 p-6">
          <Swatch label="primary" varName="--primary" />
          <Swatch label="ring" varName="--ring" />
          <Swatch label="destructive" varName="--destructive" />
          <Swatch label="accent" varName="--accent" />
          <Swatch label="muted" varName="--muted" />
          <Swatch label="border" varName="--border" />
        </div>
      </Section>
    </div>
  )
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {eyebrow}
        </span>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="max-w-2xl text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function Surface({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex flex-col gap-1 p-5 ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-70">
        --{label}
      </span>
      <span className="text-sm">Aa · the quick brown fox</span>
      <span className="text-xs opacity-60">Muted line of secondary copy.</span>
    </div>
  )
}

function Swatch({ label, varName }: { label: string; varName: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-2.5 py-1.5">
      <span
        aria-hidden
        className="size-4 rounded-sm border border-border"
        style={{ background: `var(${varName})` }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
