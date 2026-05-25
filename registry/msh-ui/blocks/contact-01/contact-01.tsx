"use client"

import * as React from "react"
import {
  ArrowRight,
  Github,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react"

import { Button } from "@/registry/msh-ui/ui/button"
import { Input } from "@/registry/msh-ui/ui/input"
import { Label } from "@/registry/msh-ui/ui/label"
import { Textarea } from "@/registry/msh-ui/ui/textarea"

type ContactChannel = {
  icon: React.ElementType
  label: string
  value: string
  href: string
}

const CHANNELS: readonly ContactChannel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@msh-ui.dev",
    href: "mailto:hello@msh-ui.dev",
  },
  {
    icon: MessageCircle,
    label: "Discord",
    value: "msh-ui · #help",
    href: "#",
  },
  {
    icon: Github,
    label: "Issues",
    value: "MohammadShehadeh/msh-ui",
    href: "#",
  },
]

export default function Contact01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-5 lg:max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · talk to us
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Have a question we haven&apos;t answered yet?
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Drop a note and we&apos;ll route it to the right person.
            Engineering questions, sales, partnerships — all the same form.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <form className="flex flex-col gap-5 lg:col-span-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-name"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Name
                </Label>
                <Input id="contact-name" placeholder="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-email"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Work email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="ada@studio.io"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-company"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Company
              </Label>
              <Input id="contact-company" placeholder="Plinth Labs" />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-message"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Message
              </Label>
              <Textarea
                id="contact-message"
                rows={5}
                placeholder="Tell us what you&rsquo;re building, and what&rsquo;s in your way…"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                we reply within one business day
              </p>
            </div>

            <div className="mt-2 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-muted-foreground">
                By sending, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-foreground">
                  privacy notice
                </a>
                .
              </p>
              <Button type="submit" size="lg" className="group sm:w-fit">
                Send message
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </Button>
            </div>
          </form>

          <aside className="flex flex-col gap-6 lg:col-span-5">
            <div
              className="relative rounded-md border border-border bg-card p-6"
              style={{ boxShadow: "6px 6px 0 0 var(--border)" }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                · other ways to reach us
              </span>
              <ul className="mt-4 flex flex-col">
                {CHANNELS.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        className={`group flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${i < CHANNELS.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                              {c.label}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {c.value}
                            </span>
                          </span>
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-md border border-dashed border-border bg-card/30 p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                  <MapPin className="size-3.5" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Remote, mostly
                  </p>
                  <p className="text-sm text-foreground">
                    Distributed across UTC-5 → UTC+3.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Office hours 09:00–17:00 local time.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
