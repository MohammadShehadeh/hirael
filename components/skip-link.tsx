import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  className?: string;
}

export const SkipLink = ({ className }: SkipLinkProps) => {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only',
        'focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-100',
        'focus:inline-flex focus:items-center focus:rounded-md focus:border focus:border-border',
        'focus:bg-popover focus:px-4 focus:py-2 focus:text-sm focus:font-medium',
        'focus:text-popover-foreground focus:shadow-elevated focus:outline-none',
        className,
      )}
    >
      Skip to content
    </a>
  );
};
