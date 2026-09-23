import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
}

export const Wordmark = ({ className }: WordmarkProps) => {
  return (
    <span className={cn('[font-family:var(--font-velorah-serif)] tracking-tight text-foreground', className)}>
      Velorah
      <sup className="text-[0.4em]">&reg;</sup>
    </span>
  );
};

type PillButtonTone = 'glass' | 'outline';

interface PillButtonProps extends ComponentProps<'button'> {
  /** `glass` is the frosted primary pill, `outline` the quiet bordered one. */
  tone?: PillButtonTone;
}

export const PillButton = ({ tone = 'glass', className, ...props }: PillButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-normal whitespace-nowrap outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        tone === 'glass'
          ? 'liquid-glass text-foreground transition-transform hover:scale-[1.03]'
          : 'border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
};
