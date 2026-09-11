import type * as React from 'react';

import { cn } from '@/lib/utils';

export type PillProps = React.ComponentProps<'span'>;

export const Pill = ({ className, children, ...props }: PillProps) => {
  return (
    <span
      data-slot="pill"
      className={cn(
        'glass-panel glass-panel-lit inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs uppercase text-muted-foreground',
        className,
      )}
      {...props}
    >
      <span className="state-dot [:not([data-live])>&]:hidden" />
      {children}
    </span>
  );
};

export interface PageHeaderProps {
  kicker: string;
  title: React.ReactNode;
  blurb?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ kicker, title, blurb, children }: PageHeaderProps) => {
  return (
    <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
      <Pill>{kicker}</Pill>
      <h1 className="text-display text-4xl italic leading-[0.92] tracking-[-0.02em] sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {blurb && <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{blurb}</p>}
      {children}
    </header>
  );
};

export interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel = ({ children, className }: SectionLabelProps) => {
  return <h2 className={cn('text-xs uppercase text-muted-foreground', className)}>{children}</h2>;
};

export interface SectionHeadingProps {
  kicker: string;
  title: React.ReactNode;
  blurb?: string;
}

export const SectionHeading = ({ kicker, title, blurb }: SectionHeadingProps) => {
  return (
    <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-5 text-center sm:mb-16">
      <Pill>{kicker}</Pill>
      <h2 className="text-display text-balance text-3xl italic leading-[0.95] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {blurb && <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{blurb}</p>}
    </div>
  );
};
