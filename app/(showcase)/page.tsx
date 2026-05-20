import Link from "next/link"
import { ArrowRight, LayoutTemplate } from "lucide-react"

import { InlineCodeBlock } from "@/components/showcase/code-block"
import { InstallBlock } from "@/components/showcase/install-block"
import { highlightCode } from "@/lib/highlight"
import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  CATEGORY_LABELS,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

const ORDER: ComponentCategory[] = ["inputs", "pickers", "files"]

const DUAL_API_SNIPPET = `// Compound
<MultiSelect.Root value={value} onValueChange={setValue} options={options}>
  <MultiSelect.Trigger placeholder="Pick…" />
  <MultiSelect.Content searchPlaceholder="Filter…" />
</MultiSelect.Root>

// Single-prop
<MultiSelect options={options} value={value} onChange={setValue} />`

export default async function ShowcaseHome() {
  const stableCount = REGISTRY.filter((r) => r.status === "stable").length
  const dualApiHtml = await highlightCode(DUAL_API_SNIPPET, "tsx")

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-5 border-b-2 border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-forge">
            ◆ sabk · v0.1
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            peer of shadcn, not a replacement
          </span>
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
          shadcn&apos;s missing pieces.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          A registry of the components every real product needs but shadcn
          doesn&apos;t ship. Multi-select, number range, year picker, tag
          input — copied straight into your repo via the shadcn CLI.
          No runtime dependency. Same registry schema.
        </p>
        <InstallBlock name="multi-select" className="mt-2 max-w-2xl" />
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {stableCount} of {REGISTRY.length} Phase&nbsp;1 components shipping ·
          every component ships in two API shapes
        </p>
      </header>

      <section className="grid gap-10">
        {ORDER.map((cat) => {
          const items = REGISTRY_BY_CATEGORY[cat]
          if (!items.length) return null
          return (
            <div key={cat}>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
                  {items.filter((i) => i.status === "stable").length} /{" "}
                  {items.length} ready
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border-2 border-border bg-border sm:grid-cols-2">
                {items.map((entry) => (
                  <li key={entry.name}>
                    <Link
                      href={`/${entry.name}`}
                      className="group flex h-full flex-col justify-between gap-3 bg-card p-4 transition-colors hover:bg-accent"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-medium tracking-[-0.01em]">
                            {entry.title}
                          </h3>
                          {entry.status === "planned" ? (
                            <span className="rounded-sm border-2 border-border px-1.5 py-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                              soon
                            </span>
                          ) : (
                            <span className="size-1.5 rounded-full bg-forge" />
                          )}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-forge">
                        /{entry.name} →
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 border-t-2 border-border pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Blocks
          </h2>
          <Link
            href="/blocks"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-forge"
          >
            view all
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Section-level compositions built on top of the registry —
          heroes, CTAs, FAQs and auth screens, in the same forge
          aesthetic. Copy a block into your repo in one command.
        </p>
        <Link
          href="/blocks"
          className="group flex items-center justify-between gap-4 rounded-sm border-2 border-border bg-card p-4 transition-colors hover:border-forge"
        >
          <div className="flex items-center gap-4">
            <span className="inline-flex size-10 items-center justify-center rounded-sm border-2 border-border bg-background">
              <LayoutTemplate className="size-4 text-forge" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                {REGISTRY_BY_CATEGORY.blocks.length} top-tier blocks ·{" "}
                {BLOCK_KIND_ORDER.length} categories
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {BLOCK_KIND_ORDER.map(
                  (k) => `${BLOCK_KIND_LABELS[k].toLowerCase()}`
                ).join(" · ")}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-forge">
            /blocks
            <ArrowRight className="size-3 transition-transform duration-150 ease-[var(--ease-forge)] group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      <section className="grid gap-3 border-t-2 border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Dual-API contract
        </h2>
        <p className="text-sm text-muted-foreground">
          Every Sabk component ships with two surface areas in the same file.
          Compound is canonical — reach for it when you need control over
          composition, layout, or rendering. Single-prop is the convenience
          wrapper; ninety percent of usage looks like this.
        </p>
        <InlineCodeBlock code={DUAL_API_SNIPPET} html={dualApiHtml} />
      </section>
    </div>
  )
}
