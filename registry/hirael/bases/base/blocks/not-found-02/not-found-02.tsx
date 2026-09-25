import * as React from 'react';
import Image from 'next/image';
import { House } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

const POPULAR_LINKS = [
  { href: '#', label: 'Projects' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Docs' },
  { href: '#', label: 'Tools' },
] as const;

const Crosshair = ({ className }: { className?: string }) => {
  return (
    <span
      aria-hidden
      data-slot="not-found-crosshair"
      className={cn(
        'pointer-events-none absolute hidden size-3 sm:block',
        'before:absolute before:inset-0 before:my-auto before:h-px before:bg-muted-foreground/60',
        'after:absolute after:inset-0 after:mx-auto after:w-px after:bg-muted-foreground/60',
        className,
      )}
    />
  );
};

type NotFoundRailProps = React.ComponentProps<'div'>;

const NotFoundRail = ({ className, children, ...props }: NotFoundRailProps) => {
  return (
    <div
      data-slot="not-found-rail"
      className={cn('relative mx-auto w-full max-w-3xl border-y border-border sm:border-x', className)}
      {...props}
    >
      {children}
      <Crosshair className="-start-1.5 -bottom-1.5" />
      <Crosshair className="-end-1.5 -bottom-1.5" />
    </div>
  );
};

type NotFoundBandProps = React.ComponentProps<'div'>;

const NotFoundBand = ({ className, children, ...props }: NotFoundBandProps) => {
  return (
    <div
      data-slot="not-found-band"
      className={cn('relative border-t border-border px-6 py-10 first:border-t-0 md:px-10 md:py-12', className)}
      {...props}
    >
      <Crosshair className="-start-1.5 -top-1.5" />
      <Crosshair className="-end-1.5 -top-1.5" />
      {children}
    </div>
  );
};

type NotFoundMediaProps = React.ComponentProps<'div'>;

const NotFoundMedia = ({ className, ...props }: NotFoundMediaProps) => {
  return (
    <div
      data-slot="not-found-media"
      className={cn('relative size-16 shrink-0 overflow-hidden rounded-full border border-border', className)}
      {...props}
    />
  );
};

type NotFoundCodeProps = React.ComponentProps<'p'>;

const NotFoundCode = ({ className, ...props }: NotFoundCodeProps) => {
  return (
    <p
      data-slot="not-found-code"
      className={cn('text-xs font-medium tracking-wider text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

type NotFoundTitleProps = React.ComponentProps<'h1'>;

const NotFoundTitle = ({ className, ...props }: NotFoundTitleProps) => {
  return (
    <h1
      data-slot="not-found-title"
      className={cn('text-4xl font-semibold tracking-tight text-balance sm:text-5xl', className)}
      {...props}
    />
  );
};

type NotFoundDescriptionProps = React.ComponentProps<'p'>;

const NotFoundDescription = ({ className, ...props }: NotFoundDescriptionProps) => {
  return (
    <p
      data-slot="not-found-description"
      className={cn('max-w-2xl text-base text-pretty text-muted-foreground', className)}
      {...props}
    />
  );
};

type NotFoundActionsProps = React.ComponentProps<'div'>;

const NotFoundActions = ({ className, ...props }: NotFoundActionsProps) => {
  return (
    <div data-slot="not-found-actions" className={cn('flex flex-wrap items-center gap-3', className)} {...props} />
  );
};

export { NotFoundRail, NotFoundBand, NotFoundMedia, NotFoundCode, NotFoundTitle, NotFoundDescription, NotFoundActions };

// Placeholder photo served from hirael.com. Swap it for your own asset, or
// add the host to `images.remotePatterns` in next.config to keep it.
const DOG_PHOTO = '/media/blocks/not-found-02/side-eye-dog.jpeg';

const NotFound02 = () => {
  return (
    <section data-slot="not-found" className="flex min-h-[80vh] items-center bg-background py-16 md:py-24">
      <NotFoundRail>
        <NotFoundBand>
          <div className="flex flex-col items-start">
            <NotFoundMedia className={ENTER}>
              <Image
                src={DOG_PHOTO}
                alt="Suspicious dog giving side-eye"
                fill
                sizes="64px"
                priority
                className="object-cover"
              />
            </NotFoundMedia>
            <NotFoundCode style={stagger(1)} className={cn(ENTER, 'mt-6')}>
              Error 404
            </NotFoundCode>
            <NotFoundTitle style={stagger(2)} className={cn(ENTER, 'mt-2')}>
              Hmm, suspicious
            </NotFoundTitle>
            <NotFoundDescription style={stagger(3)} className={cn(ENTER, 'mt-2')}>
              We couldn&apos;t find this page. The link may be broken, or the page has moved.
            </NotFoundDescription>
            <NotFoundActions style={stagger(4)} className={cn(ENTER, 'mt-8')}>
              <Button render={<a href="#" />} nativeButton={false}>
                <House aria-hidden />
                Go back home
              </Button>
            </NotFoundActions>
          </div>
        </NotFoundBand>

        <NotFoundBand>
          <h2 style={stagger(5)} className={cn(ENTER, 'mb-6 text-xl font-semibold tracking-tight')}>
            Or try one of these
          </h2>
          <nav aria-label="Popular pages" style={stagger(6)} className={ENTER}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {POPULAR_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </NotFoundBand>
      </NotFoundRail>
    </section>
  );
};

export default NotFound02;
