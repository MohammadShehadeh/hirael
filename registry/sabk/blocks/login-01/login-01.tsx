"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/registry/sabk/ui/button"
import { Input } from "@/registry/sabk/ui/input"
import { Label } from "@/registry/sabk/ui/label"
import {
  PasswordInput,
  PasswordInputField,
} from "@/registry/sabk/password-input/password-input"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.2h5.34c-.23 1.4-1.66 4.1-5.34 4.1A6.4 6.4 0 1 1 12 5.6c1.83 0 3.05.78 3.75 1.45l2.55-2.46C16.74 3.05 14.55 2 12 2 6.95 2 2.85 6.1 2.85 11.15S6.95 20.3 12 20.3c6.93 0 9.5-4.86 9.5-7.4 0-.5-.06-.88-.15-1.8Z"
      />
    </svg>
  )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  )
}

export default function Login01() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)

  return (
    <section className="relative isolate flex min-h-[640px] items-center justify-center bg-background py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          className="rounded-sm border border-border bg-card"
          style={{ boxShadow: "8px 8px 0 0 var(--border)" }}
        >
          <div className="flex flex-col items-center gap-4 border-b border-border px-8 pb-6 pt-8">
            <div className="relative flex size-10 items-center justify-center rounded-sm border border-border bg-background">
              <span className="text-lg font-semibold tracking-[-0.04em] text-foreground">
                ◆
              </span>
              <span
                aria-hidden
                className="absolute -bottom-1 -right-1 size-1.5 rounded-full bg-foreground"
              />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.025em]">
                Welcome back
              </h1>
              <p className="text-xs text-muted-foreground">
                Sign in to your forgecn workspace to continue.
              </p>
            </div>
          </div>

          <form
            className="flex flex-col gap-5 p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-1.5">
              <Label
                htmlFor="login01-email"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="login01-email"
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
                  htmlFor="login01-password"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot?
                </a>
              </div>
              <PasswordInput
                id="login01-password"
                value={password}
                onValueChange={setPassword}
              >
                <PasswordInputField placeholder="••••••••" />
              </PasswordInput>
            </div>

            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-muted-foreground">
              <span
                role="checkbox"
                aria-checked={remember}
                tabIndex={0}
                onClick={() => setRemember(!remember)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault()
                    setRemember(!remember)
                  }
                }}
                className="relative inline-flex size-4 items-center justify-center rounded-[2px] border border-border bg-transparent transition-colors data-[checked=true]:border-primary data-[checked=true]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                data-checked={remember}
              >
                {remember && (
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden
                    className="size-2.5 text-primary-foreground"
                  >
                    <path
                      d="M2 6.5 5 9.5 10 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              Keep me signed in
            </label>

            <Button type="submit" variant="default" size="lg" className="group">
              Sign in
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                <GithubIcon className="size-4" />
                GitHub
              </Button>
              <Button type="button" variant="outline">
                <GoogleIcon className="size-4" />
                Google
              </Button>
            </div>
          </form>

          <div className="border-t border-border px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              No account yet?{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Protected by single-tenant auth · SOC2 in progress
        </p>
      </div>
    </section>
  )
}
