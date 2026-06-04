"use client"

import * as React from "react"
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion"
import { Button } from "@/registry/new-york/ui/button"
import { Card, CardContent } from "@/registry/new-york/ui/card"

const FAQS = [
  {
    q: "How is MSH UI different from shadcn/ui?",
    a: "MSH UI is a peer, not a replacement. shadcn/ui covers the canonical primitives — Button, Dialog, Select. MSH UI ships the dense, real-world components every product still has to build: multi-select, tag input, year picker, combobox with async loading, password strength. Both registries use the same CLI and the same install URL pattern, so you can mix and match.",
  },
  {
    q: "Is MSH UI a dependency I install?",
    a: "No. MSH UI is a registry, not a package. `npx shadcn add` copies the component source straight into your repo at components/ui/*. You own the code, you can edit it, and there is zero runtime dependency on MSH UI.",
  },
  {
    q: "What is the dual-API contract?",
    a: "Every MSH UI component ships two surface areas in the same file: a compound API (Root + named parts, for full layout control) and a single-prop API (one component, options-as-prop, for the 90% case). They share state — you can drop in either depending on the use case.",
  },
  {
    q: "Can I theme it?",
    a: "Yes. MSH UI reads the same CSS variables as shadcn/ui. The /theme playground lets you tune the accent live; every component re-skins in place. Drop-in compatible with any shadcn theme.",
  },
  {
    q: "Does it work with React Server Components?",
    a: "Yes. Components that need client interactivity are marked 'use client' at the top of their file. Static components can render on the server. Both work in App Router and Pages Router.",
  },
  {
    q: "Is it production-ready?",
    a: "Yes. Every shipped component is typed end-to-end, keyboard-accessible, and SSR-safe. We don't tag a component as stable until it has both API shapes, focus-management coverage, and a working demo in the registry.",
  },
] as const

export default function Faq01() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="sticky top-12 flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
              <span className="size-1 rounded-full bg-foreground" />
              FAQ · the short answers
            </span>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
              Frequently{" "}
              <span className="text-foreground">unobvious</span> questions.
            </h2>
            <p className="text-sm text-muted-foreground">
              The questions teams ask in their first ten minutes with MSH UI —
              answered the way we&apos;d want them answered. If something
              isn&apos;t here, the issue tracker is open.
            </p>

            <Card className="mt-2 gap-3 py-5">
              <CardContent className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2">
                  <MessageCircleQuestion className="size-4 text-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    still stuck?
                  </span>
                </div>
                <p className="text-sm">
                  Drop a question in the repo. Responses usually within a day.
                </p>
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <a href="#">
                    Open an issue
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Accordion type="single" collapsible defaultValue="item-0" className="border-y border-border">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="px-1">
                <AccordionTrigger>
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ml-10 max-w-2xl">{f.a}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
