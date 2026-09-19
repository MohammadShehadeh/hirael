import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

interface WordmarkProps {
  className?: string;
}

export const Wordmark = ({ className }: WordmarkProps) => {
  return <span className={cn('text-xl font-semibold tracking-tight text-foreground', className)}>AKOR</span>;
};

interface SectionLabelProps {
  children: React.ReactNode;
}

export const SectionLabel = ({ children }: SectionLabelProps) => {
  return (
    <div>
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-muted-foreground/60">{children}</p>
      <div aria-hidden className="mb-16 h-px w-full bg-muted-foreground/20" />
    </div>
  );
};

type CtaButtonProps = React.ComponentProps<typeof Button>;

export const CtaButton = ({ className, ...props }: CtaButtonProps) => {
  return (
    <Button
      type="button"
      className={cn(
        'h-11 rounded-lg px-8 text-xs font-semibold uppercase tracking-widest active:scale-[0.97]',
        className,
      )}
      {...props}
    />
  );
};

type TextLinkProps = React.ComponentProps<'a'>;

export const TextLink = ({ className, ...props }: TextLinkProps) => {
  return (
    <a
      className={cn(
        'border-b border-primary pb-1 text-xs uppercase tracking-widest text-foreground transition-colors hover:text-primary active:scale-[0.97]',
        className,
      )}
      {...props}
    />
  );
};
