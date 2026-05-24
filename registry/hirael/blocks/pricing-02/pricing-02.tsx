"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import { cn } from "@/lib/utils"

type Cell = boolean | string

type Row = {
  feature: string
  hobby: Cell
  pro: Cell
  team: Cell
}

type Tier = {
  key: "hobby" | "pro" | "team"
  name: string
  price: string
  cta: string
  ctaVariant: "default" | "outline"
  featured?: boolean
}

const TIERS: readonly Tier[] = [
  { key: "hobby", name: "Hobby", price: "$0", cta: "Start free", ctaVariant: "outline" },
  { key: "pro", name: "Pro", price: "$18", cta: "Start trial", ctaVariant: "default", featured: true },
  { key: "team", name: "Team", price: "$48", cta: "Contact", ctaVariant: "outline" },
]

const ROWS: readonly Row[] = [
  { feature: "Registry components", hobby: "Up to 5", pro: "Unlimited", team: "Unlimited" },
  { feature: "Theme presets", hobby: "3", pro: "Unlimited", team: "Unlimited" },
  { feature: "Private registry mirror", hobby: false, pro: true, team: true },
  { feature: "Shared workspace", hobby: false, pro: false, team: true },
  { feature: "SSO & audit log", hobby: false, pro: false, team: true },
  { feature: "Priority response", hobby: false, pro: true, team: true },
  { feature: "SLA support", hobby: false, pro: false, team: true },
  { feature: "MIT source license", hobby: true, pro: true, team: true },
]

function CellContent({ value }: { value: Cell }) {
  if (value === true) {
    return <Check className="size-4 text-foreground" aria-label="Included" />
  }
  if (value === false) {
    return (
      <Minus
        className="size-4 text-muted-foreground/50"
        aria-label="Not included"
      />
    )
  }
  return (
    <span className="font-mono text-xs tabular-nums text-foreground">
      {value}
    </span>
  )
}

export default function Pricing02() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · compare plans
          </span>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Every feature, side by side.
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            One table, no marketing fog. See what each tier ships before you
            spend a dollar.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border">
                <th className="w-2/5 px-5 py-5 align-bottom">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    · plan
                  </span>
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t.key}
                    className={cn(
                      "px-5 py-5 align-bottom",
                      t.featured && "bg-background/40",
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base font-semibold tracking-[-0.01em]">
                          {t.name}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {t.price}
                          <span className="text-muted-foreground">/mo</span>
                        </span>
                      </div>
                      <Button
                        asChild
                        variant={t.ctaVariant}
                        size="sm"
                        className="w-full"
                      >
                        <a href="#">{t.cta}</a>
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.feature} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-4 font-mono text-xs uppercase tracking-[0.08em] text-foreground">
                    {r.feature}
                  </td>
                  {(["hobby", "pro", "team"] as const).map((k) => (
                    <td
                      key={k}
                      className={cn(
                        "px-5 py-4",
                        k === "pro" && "bg-background/40",
                      )}
                    >
                      <CellContent value={r[k]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
