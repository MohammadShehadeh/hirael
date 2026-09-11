import { cn } from '@/lib/utils';

export const Wordmark = ({ className }: { className?: string }) => {
  return (
    <span className={cn('tracking-tight text-foreground [font-family:var(--font-velorah-serif)]', className)}>
      Velorah
      <sup className="text-[0.4em]">&reg;</sup>
    </span>
  );
};
