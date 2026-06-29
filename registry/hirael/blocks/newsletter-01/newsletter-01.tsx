"use client";

import * as React from "react";
import { Check, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter01() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubscribed(true);
  }

  return (
    <section
      data-slot="newsletter"
      className="bg-background px-4 py-20 sm:py-28"
    >
      <div
        data-slot="newsletter-panel"
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card p-8 text-center sm:p-12"
        style={{
          boxShadow:
            "0 24px 60px -34px color-mix(in oklch, var(--foreground) 24%, transparent)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 50% -10%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <span className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-background">
            <Mail className="size-5" />
          </span>

          {subscribed ? (
            <div
              data-slot="newsletter-success"
              className="flex flex-col items-center gap-2"
            >
              <h2 className="flex items-center gap-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                <Check className="size-6" />
                You&apos;re on the list.
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Check your inbox to confirm the subscription.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                  New components, in your inbox.
                </h2>
                <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                  A short note when we ship something. New components, blocks,
                  and the occasional deep dive.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <div className="flex w-full flex-col gap-1.5 text-start">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "newsletter-error" : undefined}
                    className={cn(error && "border-destructive")}
                  />
                  {error ? (
                    <p
                      id="newsletter-error"
                      className="text-xs text-destructive"
                    >
                      {error}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {["MS", "AK", "JD", "RL"].map((initials) => (
                    <span
                      key={initials}
                      className="inline-flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted font-mono text-[10px] font-medium text-muted-foreground"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  Join 1,200+ developers on the list.
                </span>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Only release notes. Unsubscribe in one click.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
