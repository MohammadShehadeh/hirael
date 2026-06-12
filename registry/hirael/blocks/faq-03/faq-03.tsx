"use client"

import * as React from "react"
import { ArrowUpRight, LifeBuoy, Mail, Search, SearchX } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/hirael/ui/accordion"
import { Button } from "@/registry/hirael/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/hirael/ui/empty-state"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/registry/hirael/ui/tabs"

type Category = "getting-started" | "billing" | "licensing"

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "getting-started", label: "Getting started" },
  { value: "billing", label: "Billing" },
  { value: "licensing", label: "Licensing" },
]

const CATEGORY_LABELS: Record<Category, string> = {
  "getting-started": "Getting started",
  billing: "Billing",
  licensing: "Licensing",
}

const FAQS: readonly { q: string; a: string; category: Category }[] = [
  {
    q: "How do I install my first block?",
    a: "Run the shadcn CLI with the block's registry URL; the source lands in components/blocks/ and is yours to edit. No package to add, nothing to configure.",
    category: "getting-started",
  },
  {
    q: "Do blocks work without the rest of Hirael?",
    a: "Yes. Each block declares its own dependencies, and the CLI resolves only what that block needs. You can install a single FAQ section into an existing app.",
    category: "getting-started",
  },
  {
    q: "Which frameworks are supported?",
    a: "Anywhere React runs: Next.js App or Pages Router, Remix, Vite. Blocks avoid framework-specific APIs unless the block page says otherwise.",
    category: "getting-started",
  },
  {
    q: "Is there a paid tier?",
    a: "Everything currently published is free. If a pro tier ships later, existing blocks stay free and installed copies are unaffected.",
    category: "billing",
  },
  {
    q: "Do you offer team invoicing?",
    a: "There's nothing to invoice today; installs are free and unmetered. For procurement paperwork, contact us and we'll sort something out.",
    category: "billing",
  },
  {
    q: "Can I use blocks in client work?",
    a: "Yes. Copies installed into a client project belong to that codebase. There's no per-seat or per-project license to track.",
    category: "licensing",
  },
  {
    q: "Can I republish blocks as my own library?",
    a: "Shipping products with blocks inside is encouraged; repackaging the registry itself as a competing collection isn't. When in doubt, ask.",
    category: "licensing",
  },
  {
    q: "Do I need to credit Hirael?",
    a: "No attribution required. A mention is appreciated but never a condition of use.",
    category: "licensing",
  },
]

export default function Faq03() {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<Category | "all">("all")

  const normalized = query.trim().toLowerCase()
  const visible = FAQS.filter((f) => {
    if (category !== "all" && f.category !== category) return false
    if (!normalized) return true
    return (
      f.q.toLowerCase().includes(normalized) ||
      f.a.toLowerCase().includes(normalized)
    )
  })

  const clearFilters = () => {
    setQuery("")
    setCategory("all")
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 md:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
            · help center
          </span>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
            Find the answer before you file the issue.
          </h2>
          <p className="max-w-xl text-balance text-sm text-muted-foreground">
            Search the questions we hear most, or narrow by topic. Anything
            unanswered lands in the inbox below.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <InputGroup className="w-full max-w-md">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
            />
          </InputGroup>
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as Category | "all")}
            className="w-fit"
          >
            <TabsList>
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c.value} value={c.value}>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {visible.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="border-y border-border"
          >
            {visible.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="px-1">
                <AccordionTrigger>
                  <span className="flex flex-1 items-baseline justify-between gap-4">
                    <span>{f.q}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {CATEGORY_LABELS[f.category]}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <EmptyState>
            <EmptyStateMedia>
              <SearchX />
            </EmptyStateMedia>
            <EmptyStateTitle>No matching questions</EmptyStateTitle>
            <EmptyStateDescription>
              Nothing matches &ldquo;{query.trim()}&rdquo;
              {category !== "all"
                ? ` in ${CATEGORY_LABELS[category as Category]}`
                : ""}
              . Try different keywords or clear the filters.
            </EmptyStateDescription>
            <EmptyStateActions>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </EmptyStateActions>
          </EmptyState>
        )}

        <div className="flex flex-col items-start justify-between gap-4 rounded-md border border-border bg-card/40 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
              <LifeBuoy className="size-4" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Still stuck?</span>
              <span className="text-xs text-muted-foreground">
                We answer most questions within a day.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@hirael.com">
                <Mail className="size-3.5" />
                Email support
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#">
                Open an issue
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
