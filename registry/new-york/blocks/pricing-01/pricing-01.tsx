"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/new-york/ui/card"
import { Separator } from "@/registry/new-york/ui/separator"
import { cn } from "@/lib/utils"

type Tier = {
  name: string
  price: string
  blurb: string
  features: readonly string[]
  cta: string
  featured?: boolean
  ctaVariant: "default" | "outline"
}

const TIERS: readonly Tier[] = [
  {
    name: "Hobby",
    price: "$0",
    blurb: "For weekend projects and solo prototypes.",
    features: [
      "Full registry access",
      "Up to 3 themes",
      "Community support",
      "MIT license",
    ],
    cta: "Start free",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    price: "$18",
    blurb: "For shipping real products with real users.",
    features: [
      "Everything in Hobby",
      "Unlimited themes",
      "Private registry mirror",
      "Priority response",
    ],
    cta: "Start Pro trial",
    featured: true,
    ctaVariant: "default",
  },
  {
    name: "Team",
    price: "$48",
    blurb: "For studios and product teams shipping side-by-side.",
    features: [
      "Everything in Pro",
      "Shared workspace",
      "SSO & audit log",
      "SLA support",
    ],
    cta: "Contact sales",
    ctaVariant: "outline",
  },
]

export default function Pricing01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · pricing
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Pay for the parts you actually use.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Source code stays free. Pay only when you need private mirrors,
            shared themes, or team-level controls.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative gap-6 rounded-md p-6",
                tier.featured && "ring-1 ring-foreground/20",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-2.5 right-6 inline-flex items-center rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                  Most popular
                </span>
              )}

              <CardHeader className="flex flex-col gap-2 px-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-[-0.04em]">
                    {tier.price}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.blurb}</p>
              </CardHeader>

              <Separator className="border-dashed" />

              <CardContent className="px-0">
                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto px-0 pt-2">
                <Button
                  asChild
                  variant={tier.ctaVariant}
                  size="lg"
                  className="w-full"
                >
                  <a href="#">{tier.cta}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
