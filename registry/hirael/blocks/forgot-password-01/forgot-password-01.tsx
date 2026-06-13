"use client"

import * as React from "react"
import { ArrowRight, Loader2, MailCheck } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import { Input } from "@/registry/hirael/ui/input"
import { Label } from "@/registry/hirael/ui/label"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  )
}

export default function ForgotPassword01() {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">(
    "idle"
  )

  const send = async () => {
    setStatus("sending")
    await new Promise((r) => setTimeout(r, 900))
    setStatus("sent")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("Enter the email you signed up with.")
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("That doesn't look like a valid email.")
      return
    }
    setError(null)
    await send()
  }

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
          {status === "sent" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-4 px-8 py-10 text-center"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                <MailCheck className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-[-0.025em]">
                  Check your inbox
                </h1>
                <p className="text-xs text-muted-foreground">
                  We sent a reset link to{" "}
                  <span className="font-mono text-foreground">{email}</span>.
                  It expires in 15 minutes.
                </p>
              </div>
              <div className="mt-2 flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={send}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Resend
                  </button>
                </p>
                <a
                  href="#"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to sign in
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 border-b border-border px-8 pb-6 pt-8">
                <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-background">
                  <BrandMark className="size-6 text-foreground" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-semibold tracking-[-0.025em]">
                    Forgot your password?
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Enter your email and we&apos;ll send you a link to reset
                    it.
                  </p>
                </div>
              </div>

              <form
                noValidate
                className="flex flex-col gap-5 p-8"
                onSubmit={onSubmit}
              >
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="forgot01-email"
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="forgot01-email"
                    type="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? "forgot01-email-error" : undefined}
                  />
                  {error ? (
                    <p
                      id="forgot01-email-error"
                      className="text-xs text-destructive"
                    >
                      {error}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={status === "sending"}
                  className="group"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending link…
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="border-t border-border px-8 py-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Remembered it?{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Back to sign in
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Reset links expire after 15 minutes
        </p>
      </div>
    </section>
  )
}
