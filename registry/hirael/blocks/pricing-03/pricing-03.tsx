"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Shield, Sparkles, Star, Zap } from "lucide-react";

import { AnimatedNumber } from "@/registry/hirael/components/animated-number";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card";
import { cn } from "@/lib/utils";

type Frequency = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  price: Record<Frequency, number | string>;
  description: string;
  features: readonly string[];
  cta: string;
  ctaVariant: "default" | "outline";
  popular?: boolean;
};

const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Star,
    price: { monthly: "Free", yearly: "Free" },
    description: "Everything you need to ship your first project.",
    features: [
      "1,000 generations / month",
      "Base model access",
      "Community support",
      "500MB model storage",
    ],
    cta: "Start free",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    price: { monthly: 90, yearly: 75 },
    description: "For teams shipping to real users.",
    features: [
      "Unlimited generations",
      "Premium model access",
      "Priority support",
      "10GB model storage",
    ],
    cta: "Choose Pro",
    ctaVariant: "default",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Shield,
    price: { monthly: "Custom", yearly: "Custom" },
    description: "Tailored for scale, security and control.",
    features: [
      "Custom models",
      "Dedicated account manager",
      "On-premise deployment",
      "Unlimited secure storage",
    ],
    cta: "Contact sales",
    ctaVariant: "outline",
  },
];

export default function Pricing03() {
  const reduceMotion = useReducedMotion();
  const [frequency, setFrequency] = React.useState<Frequency>("monthly");

  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative overflow-hidden bg-background py-20 text-foreground sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-1/2 h-72 w-3/5 -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-3xl" />
        <div className="absolute -bottom-24 end-[-8%] h-72 w-2/5 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative flex flex-col items-center gap-8">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <motion.div {...reveal(0)}>
            <Badge variant="secondary">
              <Sparkles />
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            {...reveal(0.05)}
            className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl"
          >
            Pick the plan that fits your pace.
          </motion.h2>
          <motion.p
            {...reveal(0.1)}
            className="text-base text-muted-foreground sm:text-lg"
          >
            Flexible plans that scale from a weekend build to production. Switch
            or cancel anytime.
          </motion.p>
        </div>

        <motion.div
          {...reveal(0.15)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
        >
          <Button
            type="button"
            onClick={() => setFrequency("monthly")}
            variant={frequency === "monthly" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full"
            aria-pressed={frequency === "monthly"}
          >
            Monthly
          </Button>
          <Button
            type="button"
            onClick={() => setFrequency("yearly")}
            variant={frequency === "yearly" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full"
            aria-pressed={frequency === "yearly"}
          >
            Yearly
            <Badge variant="default" className="ms-1">
              20% off
            </Badge>
          </Button>
        </motion.div>

        <div className="mt-4 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const amount = plan.price[frequency];
            const Icon = plan.icon;

            return (
              <motion.div key={plan.id} {...reveal(0.2 + index * 0.08)}>
                <Card
                  style={
                    plan.popular
                      ? {
                          backgroundImage:
                            "radial-gradient(120% 90% at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
                        }
                      : undefined
                  }
                  className={cn(
                    "relative h-full gap-6 rounded-xl p-6 text-start transition-all duration-200 hover:-translate-y-1",
                    plan.popular
                      ? "ring-1 ring-foreground/25"
                      : "hover:border-foreground/20",
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 end-6 inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                      <Sparkles className="size-3" />
                      Most popular
                    </span>
                  )}

                  <CardHeader className="gap-3 px-0">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
                        <Icon className="size-4" />
                      </span>
                      <CardTitle className="text-lg font-semibold">
                        {plan.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="pt-1">
                      {typeof amount === "number" ? (
                        <div className="flex items-baseline gap-1">
                          <AnimatedNumber
                            className="text-4xl font-semibold tracking-[-0.04em] text-foreground"
                            format={{
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }}
                            value={amount}
                          />
                          <span className="font-mono text-xs text-muted-foreground">
                            /mo, billed {frequency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                          {amount}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-0">
                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-foreground"
                        >
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <Check className="size-3" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-auto px-0 pt-2">
                    <Button
                      asChild
                      variant={plan.ctaVariant}
                      size="lg"
                      className="group w-full rounded-full"
                    >
                      <a href="#">
                        {plan.cta}
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
