"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import { FieldSeparator } from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";
import { Label } from "@/registry/hirael/ui/label";
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from "@/registry/hirael/ui/password-input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.2h5.34c-.23 1.4-1.66 4.1-5.34 4.1A6.4 6.4 0 1 1 12 5.6c1.83 0 3.05.78 3.75 1.45l2.55-2.46C16.74 3.05 14.55 2 12 2 6.95 2 2.85 6.1 2.85 11.15S6.95 20.3 12 20.3c6.93 0 9.5-4.86 9.5-7.4 0-.5-.06-.88-.15-1.8Z"
      />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

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
  );
}

type Errors = Partial<{
  name: string;
  email: string;
  password: string;
  terms: string;
}>;

export default function Signup01() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Tell us your name.";
    if (!email.trim()) next.email = "We need an email for your workspace.";
    else if (!EMAIL_PATTERN.test(email))
      next.email = "That doesn't look like a valid email.";
    if (!password) next.password = "Pick a password.";
    if (!terms) next.terms = "Please accept the terms to continue.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    setPending(false);
  };

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
            <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-background">
              <BrandMark className="size-6 text-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="font-serif text-3xl font-medium tracking-tight">
                Create your account
              </h1>
              <p className="text-xs text-muted-foreground">
                Start a Hirael workspace in under a minute.
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
                htmlFor="signup01-name"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="signup01-name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.name) || undefined}
                aria-describedby={
                  errors.name ? "signup01-name-error" : undefined
                }
              />
              {errors.name ? (
                <p
                  id="signup01-name-error"
                  className="text-xs text-destructive"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="grid gap-1.5">
              <Label
                htmlFor="signup01-email"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="signup01-email"
                type="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={
                  errors.email ? "signup01-email-error" : undefined
                }
              />
              {errors.email ? (
                <p
                  id="signup01-email-error"
                  className="text-xs text-destructive"
                >
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="grid gap-1.5">
              <Label
                htmlFor="signup01-password"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                Password
              </Label>
              <PasswordInput
                id="signup01-password"
                value={password}
                onValueChange={setPassword}
              >
                <PasswordInputField
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password) || undefined}
                  aria-describedby={
                    errors.password ? "signup01-password-error" : undefined
                  }
                />
                <PasswordInputStrength />
              </PasswordInput>
              {errors.password ? (
                <p
                  id="signup01-password-error"
                  className="text-xs text-destructive"
                >
                  {errors.password}
                </p>
              ) : null}
            </div>

            <div className="grid gap-1.5">
              <Label
                htmlFor="signup01-terms"
                className="inline-flex cursor-pointer select-none items-center gap-2 text-xs font-normal text-muted-foreground"
              >
                <Checkbox
                  id="signup01-terms"
                  checked={terms}
                  onCheckedChange={(v) => setTerms(v === true)}
                  aria-invalid={Boolean(errors.terms) || undefined}
                  aria-describedby={
                    errors.terms ? "signup01-terms-error" : undefined
                  }
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    terms of service
                  </a>
                  .
                </span>
              </Label>
              {errors.terms ? (
                <p
                  id="signup01-terms-error"
                  className="text-xs text-destructive"
                >
                  {errors.terms}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={pending}
              className="group"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </>
              )}
            </Button>

            <FieldSeparator>or continue with</FieldSeparator>

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
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Free forever tier · No credit card required
        </p>
      </div>
    </section>
  );
}
