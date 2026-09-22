'use client';

import * as React from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

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
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const jitter = (i: number) => {
  const value = Math.sin(i + 1) * 10_000;
  return value - Math.floor(value);
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
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full text-primary" fill="none" viewBox="0 0 696 316">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            initial={{ pathLength: 0.3 }}
            animate={reduceMotion ? undefined : { pathLength: 1, pathOffset: [0, 1, 0] }}
            stroke="currentColor"
            className="opacity-60"
            strokeOpacity={0.1 + path.id * 0.03}
            strokeWidth={path.width}
            transition={{
              duration: 20 + jitter(path.id) * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const Login03 = () => {
  const [redirecting, setRedirecting] = React.useState(false);

  const onContinue = async () => {
    setRedirecting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setRedirecting(false);
  };

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

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>

        <div className={cn(ENTER, 'relative z-10 flex items-center gap-2')}>
          <BrandMark className="size-6 text-foreground" />
          <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
        </div>

        <figure style={stagger(4)} className={cn(ENTER, 'relative z-10 mt-auto flex flex-col gap-3')}>
          <blockquote className="font-serif text-2xl leading-[1.25] tracking-tight md:text-3xl">
            We wired up auth in an afternoon and <span className="italic text-foreground">never looked back</span>. The
            source lives in our repo, so it bends to us.
          </blockquote>
          <figcaption className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
            <span>Platform team</span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span>Northwind</span>
          </figcaption>
        </figure>
      </aside>

      <div data-slot="login-main" className="relative flex min-h-svh flex-col justify-center px-8 lg:min-h-0">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-60">
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

        <Button
          render={<a href="#" />}
          nativeButton={false}
          variant="ghost"
          className={cn(ENTER, 'absolute start-5 top-7 z-10')}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          Home
        </Button>

        <div data-slot="login-panel" className="relative z-10 mx-auto w-full space-y-6 sm:max-w-sm">
          <div className={cn(ENTER, 'flex items-center gap-2 lg:hidden')}>
            <BrandMark className="size-6 text-foreground" />
            <span className="text-base font-semibold tracking-[-0.025em]">Hirael</span>
          </div>

          <div data-slot="login-header" className="flex flex-col gap-2">
            <h1 style={stagger(1)} className={cn(ENTER, 'font-serif text-4xl font-medium tracking-tight sm:text-5xl')}>
              Sign in or join.
            </h1>
            <p style={stagger(2)} className={cn(ENTER, 'text-sm text-muted-foreground')}>
              One click with GitHub. No password to remember, no form to fill.
            </p>
          </div>

          <div style={stagger(3)} className={ENTER}>
            <Button
              type="button"
              variant="default"
              size="lg"
              disabled={redirecting}
              onClick={onContinue}
              className="w-full"
            >
              {redirecting ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <GithubIcon className="size-4" />
              )}
              {redirecting ? 'Redirecting to GitHub…' : 'Continue with GitHub'}
            </Button>
            <span role="status" className="sr-only">
              {redirecting ? 'Redirecting to GitHub' : ''}
            </span>
          </div>

          <p style={stagger(4)} className={cn(ENTER, 'text-xs text-muted-foreground')}>
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
