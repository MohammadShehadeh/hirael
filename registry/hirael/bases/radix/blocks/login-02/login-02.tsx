'use client';

import * as React from 'react';
import { ArrowRight, Quote } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import {
  PasswordInput,
  PasswordInputField,
  PasswordInputStrength,
} from '@/registry/hirael/bases/radix/components/password-input';

const BrandMark = ({ className }: { className?: string }) => {
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
};

const Login02 = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <section className="grid min-h-svh grid-cols-1 bg-background md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 md:px-10 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-card text-foreground">
              <BrandMark className="size-5" />
            </span>
            <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
          </div>

          <div className="mb-8 flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">sign in</span>
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Welcome back.</h1>
            <p className="text-sm text-muted-foreground">
              Use the email you signed up with. We&apos;ll fetch your workspace from there.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup className="gap-4">
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="login02-email"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Work email
                </FieldLabel>
                <Input
                  id="login02-email"
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <Field className="gap-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="login02-password"
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Reset
                  </a>
                </div>
                <PasswordInput id="login02-password" value={password} onValueChange={setPassword}>
                  <PasswordInputField placeholder="••••••••" />
                  <PasswordInputStrength />
                </PasswordInput>
              </Field>

              <Button type="submit" variant="default" size="lg" className="group mt-2">
                Continue
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                No account yet?{' '}
                <a
                  href="#"
                  className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Start a workspace
                </a>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>

      <div className="relative isolate hidden overflow-hidden border-s border-border bg-card md:flex md:items-center md:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -end-24 -z-10 size-[420px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: 'var(--primary)' }}
        />

        <div className="flex w-full max-w-md flex-col gap-8 px-8 py-12 md:gap-10 md:px-10 lg:px-12 lg:py-16">
          <Quote className="size-7 text-foreground md:size-8" strokeWidth={1.5} />

          <blockquote className="font-serif text-2xl leading-[1.3] tracking-tight md:text-3xl lg:text-4xl">
            The parts compose just like the primitives we <span className="italic text-foreground">already use</span>,
            so we shipped the new dashboard without learning anything new.
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
              ['12', 'components'],
              ['0', 'runtime deps'],
            ].map(([n, label]) => (
              <div key={label} className="bg-card px-4 py-3">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 font-mono text-xl font-medium tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Login02;
