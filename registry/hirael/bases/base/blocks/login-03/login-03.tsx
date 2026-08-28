'use client';

import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

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

const FloatingPaths = ({ position }: { position: number }) => {
  const reduceMotion = useReducedMotion();
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    duration: 22 + (i % 6) * 2,
  }));

  return (
    <div data-slot="login-paths" className="pointer-events-none absolute inset-0 text-foreground dark:text-primary">
      <svg className="size-full" fill="none" viewBox="0 0 696 316" aria-hidden>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeOpacity={0.18 + path.id * 0.02}
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={
              reduceMotion
                ? { pathLength: 1, opacity: 0.4 }
                : {
                    // Every keyframe loops back to its start — a one-way
                    // value here snaps visibly on each repeat.
                    pathLength: [0.3, 1, 0.3],
                    opacity: [0.2, 0.5, 0.2],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: path.duration,
                    // Negative delay starts each path mid-cycle; in unison
                    // the whole fan drifts offscreen and blanks the panel.
                    delay: (-path.id / 36) * path.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
};

const Login03 = () => {
  return (
    <section data-slot="login" className="relative min-h-svh overflow-hidden bg-background lg:grid lg:grid-cols-2">
      <aside
        data-slot="login-aside"
        className="relative hidden h-full flex-col overflow-hidden border-e border-border bg-card p-10 lg:flex"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent, transparent, var(--background))',
          }}
        />

        <div className="absolute inset-0 opacity-70">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-background text-foreground">
            <BrandMark className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="flex flex-col gap-3">
            <p className="font-serif text-2xl leading-[1.25] tracking-tight md:text-3xl">
              We wired up auth in an afternoon and <span className="italic text-foreground">never looked back</span>.
              The source lives in our repo, so it bends to us.
            </p>
            <footer className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Platform team · Northwind
            </footer>
          </blockquote>
        </div>
      </aside>

      <div data-slot="login-main" className="relative flex min-h-svh flex-col justify-center px-8 lg:min-h-0">
        <div aria-hidden className="pointer-events-none absolute inset-0 isolate -z-10 opacity-60 contain-strict">
          <div
            className="absolute end-0 top-0 h-320 w-140 -translate-y-88 rounded-full"
            style={{
              background:
                'radial-gradient(68.54% 68.72% at 55.02% 31.46%, color-mix(in oklch, var(--foreground) 6%, transparent) 0, color-mix(in oklch, var(--foreground) 2%, transparent) 50%, color-mix(in oklch, var(--foreground) 1%, transparent) 80%)',
            }}
          />
          <div
            className="absolute end-0 top-0 h-320 w-60 translate-x-[5%] -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--foreground) 4%, transparent) 0, color-mix(in oklch, var(--foreground) 1%, transparent) 80%, transparent 100%)',
            }}
          />
        </div>

        <Button render={<a href="#" />} variant="ghost" className="absolute start-5 top-7 gap-1.5">
          <ChevronLeft className="size-4 rtl:rotate-180" />
          Home
        </Button>

        <div className="mx-auto w-full space-y-6 sm:max-w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-card text-foreground">
              <BrandMark className="size-5" />
            </span>
            <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">sign in</span>
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Sign in or join.</h1>
            <p className="text-sm text-muted-foreground">
              One click with GitHub. No password to remember, no form to fill.
            </p>
          </div>

          <Button type="button" variant="default" size="lg" className="w-full gap-2">
            <GithubIcon className="size-4" />
            Continue with GitHub
          </Button>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to the{' '}
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login03;
