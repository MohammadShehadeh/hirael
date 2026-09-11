import { ArrowRight, GitBranch, Layers, Rocket, ShieldCheck, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const LAYERS = [
  {
    icon: Rocket,
    eyebrow: 'Shipping',
    title: 'Push to main and be live before CI turns green',
    body: 'Every commit builds in parallel across edge regions with immutable artifacts and one-click rollback. Preview URLs spin up per pull request, so reviewers test real behavior instead of local mocks.',
  },
  {
    icon: GitBranch,
    eyebrow: 'Collaboration',
    title: 'A branch is a full environment, not just a diff',
    body: 'Feature branches inherit a copy-on-write database, queue workers and edge caches cloned from production. Merge the pull request and the environment tears itself down, leaving no stale snapshots behind.',
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

const MediaPlaceholder = () => {
  return <div data-slot="feature-media" className="aspect-4/3 w-full rounded-xl bg-muted" />;
};

const Feature01 = () => {
  return (
    <section data-slot="feature" className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border">
        <div data-slot="feature-header" className="bg-card px-6 py-14 text-center sm:px-10 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">The platform</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Three layers of infrastructure, read top to bottom
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Each stripe below is a separate layer of the platform. Skim the headlines or settle in and read: the rhythm
            rewards both.
          </p>
        </div>

        {LAYERS.map((layer, index) => {
          const mediaFirst = index % 2 === 1;
          const stripe = mediaFirst ? 'bg-card' : 'bg-muted/30';
          return (
            <div
              key={layer.title}
              data-slot="feature-row"
              className={cn('relative px-6 py-14 sm:px-10 lg:ps-32 lg:pe-14', stripe)}
            >
              <span aria-hidden className="absolute inset-y-0 start-16 hidden w-px bg-border lg:block" />
              <span
                aria-hidden
                className={cn(
                  'absolute start-16 top-14 hidden size-12 items-center justify-center rounded-xl border border-border lg:flex',
                  'ltr:-translate-x-1/2 rtl:translate-x-1/2',
                  stripe === 'bg-card' ? 'bg-card' : 'bg-background',
                )}
              >
                <layer.icon className="size-5" />
              </span>

              <div
                className={cn(
                  'grid gap-10 lg:items-center lg:gap-14',
                  mediaFirst ? 'lg:grid-cols-[5fr_6fr]' : 'lg:grid-cols-[6fr_5fr]',
                )}
              >
                <div className={cn('flex items-start gap-5', mediaFirst && 'lg:order-last')}>
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-xl border border-border lg:hidden',
                      mediaFirst ? 'bg-muted/50' : 'bg-card',
                    )}
                  >
                    <layer.icon className="size-5" />
                  </span>
                  <div>
                    <p className="flex items-baseline gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      <span className="font-mono tabular-nums text-foreground">{`0${index + 1}`}</span>
                      {layer.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{layer.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {layer.body}
                    </p>
                  </div>
                </div>
                <MediaPlaceholder />
              </div>
            </div>
          );
        })}

        <div className="bg-muted/30 px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Under the hood</p>
            <h3 className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              Primitives that stay out of your way
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              A small set of low-level capabilities you can compose or ignore. Each one is versioned on its own, fully
              typed, and safe to adopt a piece at a time.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
            {PRIMITIVES.map((primitive) => (
              <div
                key={primitive.title}
                data-slot="feature-card"
                className="rounded-xl border border-border bg-card p-5"
              >
                <span aria-hidden className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <primitive.icon className="size-5" />
                </span>
                <h4 className="mt-4 text-base font-semibold">{primitive.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{primitive.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button size="lg" className="group h-12 rounded-xl px-6 text-base font-semibold sm:w-[180px]">
              Get started
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Button>
            <Button variant="ghost" size="lg" className="h-12 rounded-xl px-6 text-base font-semibold sm:w-[200px]">
              Read the docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature01;
