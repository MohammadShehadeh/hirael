import type * as React from 'react';
import { ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const DEPLOYS = [
  { commit: 'Fix invoice rounding', hash: '8f3c21a', region: '14 regions', state: 'Live', live: true },
  { commit: 'Add SAML metadata upload', hash: 'b19e04d', region: '14 regions', state: 'Ready', live: false },
  { commit: 'Bump image cache TTL', hash: '2ad77f0', region: '14 regions', state: 'Rolled back', live: false },
];

const ShippingMedia = () => {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {DEPLOYS.map((deploy) => (
        <li key={deploy.hash} className="flex items-center gap-3 px-4 py-3">
          <span
            aria-hidden
            className={cn('size-1.5 shrink-0 rounded-full', deploy.live ? 'bg-primary' : 'bg-muted-foreground/40')}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{deploy.commit}</p>
            <p className="flex gap-2 text-xs text-muted-foreground">
              <span dir="ltr">{deploy.hash}</span>
              <span className="text-border">|</span>
              <span>{deploy.region}</span>
            </p>
          </div>
          <span className={cn('shrink-0 text-xs', deploy.live ? 'text-primary' : 'text-muted-foreground')}>
            {deploy.state}
          </span>
        </li>
      ))}
    </ul>
  );
};

const BRANCHES = [
  { branch: 'checkout-redesign', url: 'checkout-redesign.preview.hirael.com', database: 'Copied 2 min ago' },
  { branch: 'team-invites', url: 'team-invites.preview.hirael.com', database: 'Copied yesterday' },
];

const CollaborationMedia = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {BRANCHES.map((item) => (
        <div key={item.branch} className="flex flex-col gap-2 rounded-md border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-medium">{item.branch}</span>
            <span className="shrink-0 text-xs text-muted-foreground">Preview</span>
          </div>
          <span dir="ltr" className="truncate text-start text-xs text-muted-foreground">
            {item.url}
          </span>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
            <span>Database</span>
            <span>{item.database}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const GUARDS = [
  { label: 'Roll back when errors pass', value: '2% for 5 min', on: true },
  { label: 'Page the on-call engineer', value: 'After rollback', on: true },
  { label: 'Pause deploys on Fridays', value: 'From 15:00', on: false },
];

const OperationsMedia = () => {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {GUARDS.map((guard) => (
        <li key={guard.label} className="flex items-center gap-4 px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{guard.label}</p>
            <p className="text-xs text-muted-foreground">{guard.value}</p>
          </div>
          <span
            aria-hidden
            className={cn(
              'flex h-5 w-9 shrink-0 items-center rounded-full p-0.5',
              guard.on ? 'justify-end bg-foreground' : 'justify-start bg-muted',
            )}
          >
            <span className="size-4 rounded-full bg-background shadow-sm" />
          </span>
        </li>
      ))}
    </ul>
  );
};

const LAYERS = [
  {
    eyebrow: 'Shipping',
    title: 'Push to main and be live before CI turns green',
    body: 'Every commit builds in parallel across edge regions with immutable artifacts and one-click rollback. Preview URLs spin up per pull request, so reviewers test real behavior instead of local mocks.',
    label: 'Recent deploys',
    media: ShippingMedia,
  },
  {
    eyebrow: 'Collaboration',
    title: 'A branch is a full environment, not just a diff',
    body: 'Feature branches inherit a copy-on-write database, queue workers and edge caches cloned from production. Merge the pull request and the environment tears itself down, leaving no stale snapshots behind.',
    label: 'Open previews',
    media: CollaborationMedia,
  },
  {
    eyebrow: 'Operations',
    title: 'Guardrails you set once and stop thinking about',
    body: 'Decide when a release should undo itself, who hears about it, and when nobody should ship at all. The rules run on every deploy, including the ones pushed at midnight.',
    label: 'Release rules',
    media: OperationsMedia,
  },
] as const;

const PRIMITIVES = [
  {
    icon: Zap,
    title: 'Instant cold starts',
    body: 'A runtime sliced for fast boot in every region, with warm pools ready for burst traffic.',
  },
  {
    icon: Layers,
    title: 'Composable layers',
    body: 'Take one primitive or all of them. Middleware, cache, queues and CDN each ship standalone.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise controls',
    body: 'SOC 2 Type II, SAML, SCIM and audit logs are included on every paid plan.',
  },
] as const;

const Feature01 = () => {
  return (
    <section data-slot="feature" className="bg-background px-4 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border">
        <div data-slot="feature-header" className="bg-card px-6 py-14 text-center sm:px-10 sm:py-16">
          <p className={cn(ENTER, 'text-xs font-medium tracking-widest text-muted-foreground uppercase')}>
            The platform
          </p>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl')}
          >
            Three layers of infrastructure, read top to bottom
          </h2>
          <p
            style={stagger(2)}
            className={cn(ENTER, 'mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground')}
          >
            Ship code, give every branch its own environment, and set the rules that keep releases safe. Each layer
            works alone and all three work together.
          </p>
        </div>

        {LAYERS.map((layer, index) => {
          const mediaFirst = index % 2 === 1;
          const Media = layer.media;

          return (
            <div
              key={layer.title}
              data-slot="feature-row"
              className={cn(
                'border-t border-border px-6 py-14 sm:px-10 lg:px-14',
                mediaFirst ? 'bg-card' : 'bg-muted/30',
              )}
            >
              <div
                className={cn(
                  'grid gap-10 lg:items-center lg:gap-14',
                  mediaFirst ? 'lg:grid-cols-[5fr_6fr]' : 'lg:grid-cols-[6fr_5fr]',
                )}
              >
                <div style={stagger(index, 60, 180)} className={cn(ENTER, mediaFirst && 'lg:order-last')}>
                  <p className="flex items-center gap-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    <span dir="ltr" className="tabular-nums">
                      <span className="text-foreground">{formatIndex(index)}</span>
                      <span className="mx-1.5 text-border">|</span>
                      {formatIndex(LAYERS.length - 1)}
                    </span>
                    <span>{layer.eyebrow}</span>
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{layer.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {layer.body}
                  </p>
                </div>
                <div
                  data-slot="feature-media"
                  style={stagger(index, 60, 240)}
                  className={cn(
                    ENTER,
                    'w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm',
                  )}
                >
                  <div className="border-b border-border px-4 py-2.5 text-xs text-muted-foreground uppercase">
                    {layer.label}
                  </div>
                  <Media />
                </div>
              </div>
            </div>
          );
        })}

        <div className="border-t border-border bg-muted/30 px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
          <div className={cn(ENTER, 'text-center')}>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Under the hood</p>
            <h3 className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              Primitives that stay out of your way
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              A small set of low-level capabilities you can compose or ignore. Each one is versioned on its own, fully
              typed, and safe to adopt a piece at a time.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border rtl:sm:divide-x-reverse">
            {PRIMITIVES.map((primitive, index) => (
              <div
                key={primitive.title}
                data-slot="feature-card"
                style={stagger(index, 60, 120)}
                className={cn(ENTER, 'sm:px-6 sm:first:ps-0 sm:last:pe-0')}
              >
                <h4 className="flex items-center gap-2 text-base font-semibold">
                  <primitive.icon aria-hidden className="size-4 shrink-0 text-primary" />
                  {primitive.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{primitive.body}</p>
              </div>
            ))}
          </div>

          <div
            style={stagger(3, 60, 120)}
            className={cn(
              ENTER,
              'mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center',
            )}
          >
            <Button size="lg" className="group sm:w-45" asChild>
              <a href="#">
                Get started
                <ArrowRight
                  aria-hidden
                  className="size-5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="sm:w-50" asChild>
              <a href="#">Read the docs</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature01;
