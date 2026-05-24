"use client"

import * as React from "react"
import { ArrowRight, Quote } from "lucide-react"

import { Button } from "@/registry/msh-ui/ui/button"
import { Input } from "@/registry/msh-ui/ui/input"
import { Label } from "@/registry/msh-ui/ui/label"
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from "@/registry/msh-ui/ui/password-input"

export default function Login02() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  return (
    <section className="grid min-h-[640px] grid-cols-1 bg-background md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 md:px-10 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-card text-base font-semibold text-foreground">
              ◆
            </span>
            <span className="text-base font-semibold tracking-[-0.025em]">
              Hirael
            </span>
          </div>

          <div className="mb-8 flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
              ◆ sign in
            </span>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Welcome back.
            </h1>
            <p className="text-sm text-muted-foreground">
              Use the email you signed up with. We&apos;ll fetch your
              workspace from there.
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-1.5">
              <Label
                htmlFor="login02-email"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Work email
              </Label>
              <Input
                id="login02-email"
                type="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="login02-password"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Reset
                </a>
              </div>
              <PasswordInput
                id="login02-password"
                value={password}
                onValueChange={setPassword}
              >
                <PasswordInputField placeholder="••••••••" />
                <PasswordInputStrength />
              </PasswordInput>
            </div>

            <Button type="submit" variant="default" size="lg" className="group mt-2">
              Continue
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </Button>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              No account yet?{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Start a workspace
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className="relative isolate hidden overflow-hidden border-l border-border bg-card md:flex md:items-center md:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 -z-10 size-[420px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "var(--primary)" }}
        />

        <div className="flex w-full max-w-md flex-col gap-8 px-8 py-12 md:gap-10 md:px-10 lg:px-12 lg:py-16">
          <Quote className="size-7 text-foreground md:size-8" strokeWidth={1.5} />

          <blockquote className="text-balance text-xl font-medium leading-[1.3] tracking-[-0.02em] md:text-2xl lg:text-3xl">
            Hirael gave us back the week we were going to spend rebuilding
            a <span className="text-foreground">multi-select</span> for the
            fourth time.
          </blockquote>

          <div className="flex items-center gap-4 border-t border-border pt-6">
            <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-background font-mono text-sm font-medium text-foreground">
              MR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Mara Riviera</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Eng lead · Helix
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
            {[
              ["12", "components"],
              ["0", "runtime deps"],
            ].map(([n, label]) => (
              <div key={label} className="bg-card px-4 py-3">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 font-mono text-xl font-medium tabular-nums">
                  {n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
